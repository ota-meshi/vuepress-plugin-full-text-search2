# Contents

[VuePress v2] plugin that adds full-text search box.

[vuepress v2]: https://v2.vuepress.vuejs.org/

:warning: WARNING: this project is considered to be in BETA until [VuePress v2] is available for general use and the API is stable!

## Install

```shell
npm i -D vuepress-plugin-full-text-search2
```

## Config

:warning: Text-based plugin definitions will not work because this plugin does not yet follow the naming convention.

### For CJS

e.g. `.vuepress/config.js`

```js
module.exports = {
  plugins: [[require("vuepress-plugin-full-text-search2").default]],
};
```

### For ESM

e.g. `.vuepress/config.js`

```js
import pluginFullTextSearch from "vuepress-plugin-full-text-search2";
module.exports = {
  plugins: [[pluginFullTextSearch]],
};
```
