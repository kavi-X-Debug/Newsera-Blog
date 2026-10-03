// Shared by the image resizer route and its health check.
const ALLOWED_HOST_SUFFIXES = [
  'techcrunch.com',
  'theverge.com',
  'vox-cdn.com',
  'wired.com',
  'bleepstatic.com',
  'googleusercontent.com',
  'thehackernews.com',
  'darkreading.com',
  'contentstack.com',
];

// Local testing only: a comma-separated list of extra hosts that may also be served over http.
export const EXTRA_HOSTS = (process.env.IMAGE_PROXY_EXTRA_HOSTS || '').split(',').map((h) => h.trim()).filter(Boolean);

export const isAllowedHost = (host: string) =>
  EXTRA_HOSTS.includes(host) || ALLOWED_HOST_SUFFIXES.some((s) => host === s || host.endsWith(`.${s}`));

const RESIZABLE = /^image\/(jpeg|png|webp|avif)/i;
export const MAX_SOURCE_BYTES = 15 * 1024 * 1024;

export type SourceResult =
  | { ok: true; input: Buffer; contentType: string; ms: number }
  | { ok: false; reason: string; ms: number };

// Downloads the original image the way a visitor's browser would (same-site Referer), and says why when it cannot.
export async function fetchSource(target: URL): Promise<SourceResult> {
  const started = Date.now();
  const fail = (reason: string): SourceResult => ({ ok: false, reason, ms: Date.now() - started });
  try {
    const res = await fetch(target, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NewsEraImages/1.0; +https://newsera.blog)',
        Accept: 'image/avif,image/webp,image/*,*/*;q=0.8',
        Referer: `${target.origin}/`,
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return fail(`source answered HTTP ${res.status}`);
    if (!isAllowedHost(new URL(res.url).hostname)) return fail('redirected to a host that is not allowed');
    const contentType = res.headers.get('content-type') || '';
    if (!RESIZABLE.test(contentType)) return fail(`not a resizable image (${contentType || 'no content type'})`);
    if (Number(res.headers.get('content-length') || 0) > MAX_SOURCE_BYTES) return fail('image larger than 15 MB');
    const input = Buffer.from(await res.arrayBuffer());
    if (input.length > MAX_SOURCE_BYTES) return fail('image larger than 15 MB');
    return { ok: true, input, contentType, ms: Date.now() - started };
  } catch (err) {
    return fail(`could not download (${err instanceof Error ? err.name : 'error'})`);
  }
}
