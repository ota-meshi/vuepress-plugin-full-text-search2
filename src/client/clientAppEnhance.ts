import { defineClientConfig } from "@vuepress/client"
import { defineAsyncComponent } from "vue"

export default defineClientConfig({
    // eslint-disable-next-line @typescript-eslint/naming-convention -- component
    enhance({ app }) {
        const SearchBox = defineAsyncComponent(() => import("./SearchBox.vue"))
        app.component("SearchBox", SearchBox)
    }
})
