// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"API.mdx": () => import("../content/API.mdx?collection=docs"), "Commands.mdx": () => import("../content/Commands.mdx?collection=docs"), "Guides.mdx": () => import("../content/Guides.mdx?collection=docs"), "PEQL.mdx": () => import("../content/PEQL.mdx?collection=docs"), "Types.mdx": () => import("../content/Types.mdx?collection=docs"), "Guides/Test.mdx": () => import("../content/Guides/Test.mdx?collection=docs"), }),
};
export default browserCollections;