// generic pagination utilities

/**
 * Divide an array into pages and return the items for the requested page.
 * @param items - the complete array of items
 * @param page - 1-based page index
 * @param perPage - number of items per page
 */
export function paginate<T>(items: T[], page: number, perPage: number): T[] {
  if (perPage <= 0 || page <= 0) return [];
  const start = (page - 1) * perPage;
  return items.slice(start, start + perPage);
}

/**
 * Calculate how many pages are needed to contain all items.
 * Always returns at least 1.
 */
export function totalPages(itemsLength: number, perPage: number): number {
  if (perPage <= 0) return 1;
  return Math.max(1, Math.ceil(itemsLength / perPage));
}

/**
 * Generate an array of page numbers to show in a pagination control.
 * The algorithm centres the current page and limits the number of buttons.
 * @param total - total number of pages
 * @param current - current page index
 * @param maxButtons - maximum buttons to display (includes current)
 */
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
