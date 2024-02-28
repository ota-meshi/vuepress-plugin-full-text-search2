// Backward compatibility for vuepress@<=2.0.0-beta.43

// @ts-expect-error -- Backward compatibility for vuepress@<=2.0.0-beta.43
import { defineClientAppEnhance } from "@vuepress/client";
import { defineAsyncComponent } from "vue";

export default defineClientAppEnhance(({ app }) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention -- component
  const SearchBox = defineAsyncComponent(() => import("./SearchBox.vue"));
  app.component("SearchBox", SearchBox);
});
