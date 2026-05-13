/**
 * CMS adapter — minimal filesystem implementation.
 *
 * Routes read content from this adapter rather than hardcoding it. The read
 * interface is stable across backing stores: in dev it eager-loads JSON under
 * `content/{type}/*.json` via Vite's glob-import, in production it would be
 * swapped to whatever CMS the team chooses — only this file changes.
 *
 * Define your content types below as you discover them in the saydi target.
 * Pattern: declare a type, declare an `import.meta.glob` for the matching
 * directory under `content/`, expose a `list*()` function.
 */

// Example shape — replace/extend with the real schemas as captures land.
// export type Item = {
//   slug: string;
//   title: string;
//   // ...
// };

// const items = import.meta.glob<{ default: Item }>(
//   '../../../content/items/*.json',
//   { eager: true }
// );

const sortBySlug = <T extends { slug: string }>(arr: T[]): T[] =>
  arr.slice().sort((a, b) => a.slug.localeCompare(b.slug));

// export function listItems(): Item[] {
//   const arr = Object.values(items).map((m: any) => (m.default ?? m) as Item);
//   return sortBySlug(arr);
// }

export { sortBySlug };
