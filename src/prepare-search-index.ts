import type { App as VuepressApp, Page as VuepressPage } from "@vuepress/core";
import type { PageContent, PageIndex } from "./types";
import { Parser } from "htmlparser2";

const HMR_CODE = `
if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__[UPD_NAME]) {
    __VUE_HMR_RUNTIME__[UPD_NAME](searchIndex)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ searchIndex }) => {
    if (__VUE_HMR_RUNTIME__[UPD_NAME]) {
      __VUE_HMR_RUNTIME__[UPD_NAME](searchIndex)
    }
  })
}
`;
export type App = Pick<VuepressApp, "env" | "writeTemp"> & {
  pages: Page[];
};
export type Page = Pick<
  VuepressPage,
  "pathLocale" | "title" | "path" | "headers" | "contentRendered"
>;
/** Prepare index resource script for search */
export async function prepareSearchIndex({
  app,
}: {
  app: App;
}): Promise<string> {
  // generate search index
  const searchIndex: PageIndex[] = [];

  for (const page of app.pages) {
    searchIndex.push({
      path: page.path,
      title: page.title,
      pathLocale: page.pathLocale,
      contents: extractPageContents(page),
    });
  }

  // search index file content
  let content = `
export const searchIndex = ${JSON.stringify(searchIndex, null, 2)}
export const UPD_NAME = 'update-vuepress-plugin-full-text-search2-search-index'
`;

  // inject HMR code
  if (app.env.isDev) {
    content += HMR_CODE;
  }

  return app.writeTemp(
    "internal/vuepress-plugin-full-text-search2-search-index.js",
    content,
  );
}

/**
 * Extract contents
 */
function extractPageContents(page: Page): PageContent[] {
  const results: PageContent[] = [];

  const slugs = new Map<string, string>();
  const headers = [...page.headers];
  while (headers.length) {
    const h = headers.shift()!;
    slugs.set(h.slug, h.title);

    headers.push(...h.children);
  }

  let ignoreElement = 0;
  let withinHeader = 0;

  let scope: PageContent = {
    header: "",
    slug: "",
    content: "",
  };
  results.push(scope);

  const parser = new Parser({
    ontext(text) {
      if (ignoreElement) {
        return;
      }
      const prop = withinHeader ? "header" : "content";
      scope[prop] += text;
    },
    onopentag(name, attribute) {
      if (
        ignoreElement ||
        name === "script" ||
        name === "style" ||
        (name === "div" && attribute.class === "line-numbers")
      ) {
        ignoreElement++;
        return;
      }
      if (withinHeader) {
        withinHeader++;
        return;
      }

      if (!/^h\d$/u.test(name)) {
        return;
      }
      const id = attribute.id;
      const title = slugs.get(id);
      if (title) {
        scope = {
          header: title,
          slug: id,
          content: "",
        };
        results.push(scope);
        ignoreElement++;
      } else {
        scope = {
          header: "",
          slug: id,
          content: "",
        };
        results.push(scope);
        withinHeader++;
      }
    },
    onclosetag() {
      if (ignoreElement) {
        ignoreElement--;
        return;
      }
      if (withinHeader) {
        withinHeader--;
      }
    },
  });
  parser.parseComplete(page.contentRendered);

  return results
    .map((p) => {
      p.header = p.header
        .replace(/\s{2,}/g, " ")
        .replace(/^#/g, "")
        .trim();
      p.content = p.content.replace(/\s{2,}/g, " ").trim();
      return p;
    })
    .filter((p) => p.content || p.header);
}
