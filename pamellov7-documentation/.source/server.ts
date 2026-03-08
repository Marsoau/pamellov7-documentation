// @ts-nocheck
import * as __fd_glob_5 from "../content/Guides/Test.mdx?collection=docs"
import * as __fd_glob_4 from "../content/Types.mdx?collection=docs"
import * as __fd_glob_3 from "../content/PEQL.mdx?collection=docs"
import * as __fd_glob_2 from "../content/Guides.mdx?collection=docs"
import * as __fd_glob_1 from "../content/Commands.mdx?collection=docs"
import * as __fd_glob_0 from "../content/API.mdx?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.docs("docs", "content", {}, {"API.mdx": __fd_glob_0, "Commands.mdx": __fd_glob_1, "Guides.mdx": __fd_glob_2, "PEQL.mdx": __fd_glob_3, "Types.mdx": __fd_glob_4, "Guides/Test.mdx": __fd_glob_5, });