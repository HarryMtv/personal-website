const formatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

/** "12 Jul 2026" in en-GB style; undated content shows as a Draft label. */
export function formatDate(iso?: string): string {
  if (!iso) return 'Draft';
  return formatter.format(new Date(iso));
}
