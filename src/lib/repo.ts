import { site } from '../data/site';

/** Links into the GitHub repository that holds the starter (main) and the worked example. */
export const repoUrl = site.repo;
export const starterUrl = `${site.repo}/tree/main`;
export const exampleUrl = `${site.repo}/tree/${site.example}`;
export const fileUrl = (path: string, ref = 'main') => `${site.repo}/blob/${ref}/${path}`;
export const compareUrl = (from: string, to: string) => `${site.repo}/compare/${from}...${to}`;
export const treeAtUrl = (tag: string) => `${site.repo}/tree/${tag}`;
