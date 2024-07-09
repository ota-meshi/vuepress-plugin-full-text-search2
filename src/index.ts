// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair -- ignore
/* eslint-disable @typescript-eslint/no-floating-promises -- ignore */
import type { App, LocaleConfig, PluginObject } from "@vuepress/core";
import { path } from "@vuepress/utils";
import { fileURLToPath } from "url";
import { prepareSearchIndex } from "./prepare-search-index";
import * as chokidar from "chokidar";
const filename =
  typeof __filename !== "undefined"
    ? __filename
    : fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export interface FullTextSearchPluginOptions {
  /**
   * Locales config for search box
   */
  locales?: LocaleConfig<{
    placeholder: string;
  }>;
}

export const fullTextSearchPlugin = fullTextSearchPluginFunction;

export default fullTextSearchPlugin;

/** init plugin */
function fullTextSearchPluginFunction(
  options: FullTextSearchPluginOptions | App = {},
): PluginObject {
  return {
    name: "vuepress-plugin-full-text-search2",

    define: {
      __SEARCH_LOCALES__: ("locales" in options ? options?.locales : {}) ?? {},
    },

    clientConfigFile: path.resolve(dirname, "./client/clientConfig.js"),

    // @ts-expect-error -- Backward compatibility for vuepress@<=2.0.0-beta.43
    clientAppEnhanceFiles: path.resolve(
      dirname,
      "./client/clientAppEnhance.js",
    ),

    onPrepared(app) {
      prepareSearchIndex({ app });
    },

    onWatched: (app, watchers) => {
      const searchIndexWatcher = chokidar.watch("internal/pageData/*", {
        cwd: app.dir.temp(),
        ignoreInitial: true,
      });
      searchIndexWatcher.on("add", () => {
        prepareSearchIndex({ app });
      });
      searchIndexWatcher.on("change", () => {
        prepareSearchIndex({ app });
      });
      searchIndexWatcher.on("unlink", () => {
        prepareSearchIndex({ app });
      });
      watchers.push(searchIndexWatcher);
    },
  };
}
