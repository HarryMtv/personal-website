/** A table-of-contents entry exported by rehype-extract-toc. */
export interface TocItem {
  depth: number;
  value?: string;
  id?: string;
  children?: TocItem[];
}

/** Flattens a TOC tree to the h2 level (depth 2). */
export function flattenToc(items: TocItem[]): { id: string; value: string }[] {
  return items
    .filter((item) => item.depth === 2 && item.id)
    .map((item) => ({ id: item.id!, value: item.value ?? '' }));
}
