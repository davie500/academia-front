


export function paginate<T>(items: T[], page: number, perPage: number): T[] {
  if (perPage <= 0 || page <= 0) return [];
  const start = (page - 1) * perPage;
  return items.slice(start, start + perPage);
}


export function totalPages(itemsLength: number, perPage: number): number {
  if (perPage <= 0) return 1;
  return Math.max(1, Math.ceil(itemsLength / perPage));
}

export function pagesToShow(
  total: number,
  current: number,
  maxButtons = 7
): number[] {
  if (total <= maxButtons) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  let start = Math.max(1, current - Math.floor(maxButtons / 2));
  let end = Math.min(total, start + maxButtons - 1);
  if (end - start < maxButtons - 1) {
    start = Math.max(1, end - (maxButtons - 1));
  }

  const pages: number[] = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
}