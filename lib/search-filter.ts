/**
 * Pure utility functions for multi-field filtering and safe match highlighting.
 */

/**
 * Escapes special characters for use in a regular expression.
 */
export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Filters an array of items where any searchable string field matches the query.
 * Case-insensitive, whitespace-trimmed.
 */
export function filterItems<T>(
  items: T[],
  query: string,
  getSearchableFields: (item: T) => string[]
): T[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return items;
  }

  return items.filter((item) => {
    const fields = getSearchableFields(item);
    return fields.some((field) => field.toLowerCase().includes(trimmed));
  });
}

export interface HighlightSegment {
  text: string;
  isMatch: boolean;
}

/**
 * Splits text into segments indicating which parts match the search query.
 * Safely handles regular expression special characters and prevents XSS.
 */
export function highlightMatches(text: string, query: string): HighlightSegment[] {
  if (!text) {
    return [];
  }

  const trimmed = query.trim();
  if (!trimmed) {
    return [{ text, isMatch: false }];
  }

  const escaped = escapeRegExp(trimmed);
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  const segments: HighlightSegment[] = [];

  for (const part of parts) {
    if (!part) continue;
    const isMatch = part.toLowerCase() === trimmed.toLowerCase();
    segments.push({
      text: part,
      isMatch,
    });
  }

  return segments.length > 0 ? segments : [{ text, isMatch: false }];
}
