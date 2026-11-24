import type { APIRoute } from 'astro';
import { chapters } from '../../lib/guide';
import { guideIndexText, plain } from '../../lib/agents';

export const GET: APIRoute = async ({ site }) => plain(guideIndexText(await chapters(), site));
