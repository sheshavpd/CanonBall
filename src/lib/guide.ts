import { getCollection, type CollectionEntry } from 'astro:content';
import { parts, type PartId } from '../data/site';

export type Chapter = CollectionEntry<'guide'>;

/** All chapters in reading order: by part, then by order within the part. */
export async function chapters(): Promise<Chapter[]> {
  const rank = new Map(parts.map((p, i) => [p.id as PartId, i]));
  const all = await getCollection('guide');
  return all.sort(
    (a, b) => rank.get(a.data.part)! - rank.get(b.data.part)! || a.data.order - b.data.order,
  );
}

export async function byPart() {
  const all = await chapters();
  return parts.map((p) => ({ ...p, chapters: all.filter((c) => c.data.part === p.id) }));
}
