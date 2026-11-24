import type { APIRoute } from 'astro';
import { chapters } from '../lib/guide';
import { homeText, plain } from '../lib/agents';

export const GET: APIRoute = async ({ site }) => plain(homeText(await chapters(), site));
