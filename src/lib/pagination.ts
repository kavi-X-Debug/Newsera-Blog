export const POSTS_PER_PAGE = 9;

export function paginate<T>(items: T[], rawPage: string | undefined, perPage = POSTS_PER_PAGE) {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const parsed = Number.parseInt(rawPage ?? '1', 10);
  const page = Math.min(Math.max(Number.isNaN(parsed) ? 1 : parsed, 1), totalPages);
  const start = (page - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    page,
    totalPages,
    total: items.length,
    from: items.length === 0 ? 0 : start + 1,
    to: Math.min(start + perPage, items.length),
  };
}

export function pageWindow(page: number, totalPages: number): (number | 'gap')[] {
  const wanted = new Set([1, totalPages, page - 2, page - 1, page, page + 1, page + 2]);
  const nums = [...wanted].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);
  const out: (number | 'gap')[] = [];
  nums.forEach((n, i) => {
    if (i > 0 && n - nums[i - 1] > 1) out.push('gap');
    out.push(n);
  });
  return out;
}
