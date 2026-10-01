import Link from 'next/link';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { pageWindow } from '@/lib/pagination';

type Props = {
  basePath: string;
  page: number;
  totalPages: number;
  total: number;
  from: number;
  to: number;
  params?: Record<string, string>;
};

function buildHref(basePath: string, n: number, params: Record<string, string> = {}) {
  const qs = new URLSearchParams(params);
  if (n > 1) qs.set('page', String(n));
  const str = qs.toString();
  return str ? `${basePath}?${str}` : basePath;
}

const base =
  'inline-flex h-10 min-w-10 items-center justify-center gap-1 rounded-md border px-3 text-sm font-medium shadow-sm transition-colors';

function EdgeButton({ to, label, disabled, children }: { to: string; label: string; disabled: boolean; children: React.ReactNode }) {
  return disabled ? (
    <span aria-disabled="true" aria-label={label} className={`${base} opacity-40 cursor-not-allowed`}>
      {children}
    </span>
  ) : (
    <Link href={to} aria-label={label} className={`${base} hover:bg-accent`}>
      {children}
    </Link>
  );
}

export default function Pagination({ basePath, page, totalPages, total, from, to, params }: Props) {
  if (totalPages <= 1) return null;
  const href = (_: string, n: number) => buildHref(basePath, n, params);

  return (
    <div className="flex flex-col items-center gap-3 pt-4">
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Showing {from}–{to} of {total} articles · Page {page} of {totalPages}
      </p>
      <nav aria-label="Pagination" className="flex flex-wrap items-center justify-center gap-2">
        <EdgeButton to={href(basePath, 1)} label="First page" disabled={page === 1}>
          <ChevronsLeft size={16} />
        </EdgeButton>
        {page > 1 ? (
          <Link href={href(basePath, page - 1)} rel="prev" className={`${base} hover:bg-accent`}>
            <ChevronLeft size={16} /> <span className="hidden sm:inline">Previous</span>
            <span className="sr-only sm:hidden">Previous page</span>
          </Link>
        ) : (
          <span aria-disabled="true" className={`${base} opacity-40 cursor-not-allowed`}>
            <ChevronLeft size={16} /> <span className="hidden sm:inline">Previous</span>
          </span>
        )}

        {pageWindow(page, totalPages).map((item, i) =>
          item === 'gap' ? (
            <span key={`gap-${i}`} aria-hidden="true" className="px-1 text-muted-foreground">
              …
            </span>
          ) : item === page ? (
            <span
              key={item}
              aria-current="page"
              className={`${base} border-primary bg-primary text-primary-foreground`}
            >
              {item}
            </span>
          ) : (
            <Link
              key={item}
              href={href(basePath, item)}
              aria-label={`Go to page ${item}`}
              className={`${base} hover:bg-accent`}
            >
              {item}
            </Link>
          ),
        )}

        {page < totalPages ? (
          <Link href={href(basePath, page + 1)} rel="next" className={`${base} hover:bg-accent`}>
            <span className="hidden sm:inline">Next</span> <ChevronRight size={16} />
            <span className="sr-only sm:hidden">Next page</span>
          </Link>
        ) : (
          <span aria-disabled="true" className={`${base} opacity-40 cursor-not-allowed`}>
            <span className="hidden sm:inline">Next</span> <ChevronRight size={16} />
          </span>
        )}
        <EdgeButton to={href(basePath, totalPages)} label="Last page" disabled={page === totalPages}>
          <ChevronsRight size={16} />
        </EdgeButton>
      </nav>
      <form action={basePath} method="get" className="flex items-center gap-2 text-sm">
        {Object.entries(params ?? {}).map(([k, v]) => (
          <input key={k} type="hidden" name={k} value={v} />
        ))}
        <label htmlFor="page-jump" className="text-muted-foreground">
          Go to page
        </label>
        <input
          id="page-jump"
          name="page"
          type="number"
          inputMode="numeric"
          min={1}
          max={totalPages}
          defaultValue={page}
          required
          className="h-10 w-20 rounded-md border bg-background px-3 text-center"
        />
        <button type="submit" className={`${base} bg-primary text-primary-foreground border-primary hover:opacity-90`}>
          Go
        </button>
      </form>
    </div>
  );
}
