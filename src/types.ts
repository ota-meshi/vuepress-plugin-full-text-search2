import type { Page } from "@vuepress/core";
export type PageIndex = {
  title: Page["title"];
  path: Page["path"];
  pathLocale: Page["pathLocale"];
  contents: PageContent[];
};
export type PageContent = {
  header: string;
  slug: string;
  content: string;
};
