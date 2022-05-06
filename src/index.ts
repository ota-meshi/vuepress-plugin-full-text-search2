// eslint-disable-next-line eslint-comments/disable-enable-pair -- ignore
/* eslint-disable @typescript-eslint/no-floating-promises -- ignore */
import type { Plugin, PluginObject } from "@vuepress/core"
import { path } from "@vuepress/utils"
import { fileURLToPath } from "url"
import { prepareSearchIndex } from "./prepare-search-index"
import * as chokidar from "chokidar"
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// eslint-disable-next-line @typescript-eslint/no-empty-interface -- ignore
export interface FullTextSearchPluginOptions {
    //
}

export const fullTextSearchPlugin: Plugin = fullTextSearchPluginFunction

export default fullTextSearchPlugin

/** init plugin */
function fullTextSearchPluginFunction(
    _options: FullTextSearchPluginOptions,
): PluginObject {
    return {
        name: "vuepress2-plugin-full-text-search",

        clientAppEnhanceFiles: path.resolve(
            dirname,
            "./client/clientAppEnhance.js",
        ),

        onPrepared(app) {
            prepareSearchIndex({ app })
        },

        onWatched: (app, watchers) => {
            const searchIndexWatcher = chokidar.watch("internal/pageData/*", {
                cwd: app.dir.temp(),
                ignoreInitial: true,
            })
            searchIndexWatcher.on("add", () => {
                prepareSearchIndex({ app })
            })
            searchIndexWatcher.on("change", () => {
                prepareSearchIndex({ app })
            })
            searchIndexWatcher.on("unlink", () => {
                prepareSearchIndex({ app })
            })
            watchers.push(searchIndexWatcher)
        },
    }
}
