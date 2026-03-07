import { defineDocs, defineConfig } from 'fumadocs-mdx/config';

export const docs = defineDocs({
  // This points to your content folder
  dir: 'content', 
});

export default defineConfig();
