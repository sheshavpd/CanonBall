import type { APIRoute } from 'astro';
import { glossaryText, plain } from '../../lib/agents';

export const GET: APIRoute = ({ site }) => plain(glossaryText(site));
