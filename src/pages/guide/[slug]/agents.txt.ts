import type { APIRoute, GetStaticPaths } from 'astro';
import { chapters, type Chapter } from '../../../lib/guide';
import { chapterText, plain } from '../../../lib/agents';

export const getStaticPaths: GetStaticPaths = async () =>
  (await chapters()).map((chapter) => ({ params: { slug: chapter.id }, props: { chapter } }));

export const GET: APIRoute = async ({ props, site }) =>
  plain(chapterText(props.chapter as Chapter, await chapters(), site));
