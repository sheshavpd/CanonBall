import type { APIRoute } from 'astro';
import { appendix } from '../data/appendix';

/** The appendix as a file, for copying into a repository's AGENTS.md. */
export const GET: APIRoute = () => new Response(appendix, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
