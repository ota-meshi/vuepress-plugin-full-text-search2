# vuepress2-plugin-full-text-search

[VuePress v2] plugin that adds full-text search box.

[VuePress v2]: https://v2.vuepress.vuejs.org/

:warning: WARNING: this project is considered to be in BETA until [VuePress v2] is available for general use and the API is stable!

## Install

```shell
npm i -D vuepress2-plugin-full-text-search
```

## Config

:warning: Text-based plugin definitions will not work because this plugin does not yet follow the naming convention.

### For CJS

e.g. `.vuepress/config.js`

```js
module.exports = {
  plugins: [
    [require('vuepress2-plugin-full-text-search').default],
  ],
}
```

### For ESM

e.g. `.vuepress/config.js`

```js
import pluginFullTextSearch from 'vuepress2-plugin-full-text-search'
module.exports = {
  plugins: [
    [pluginFullTextSearch],
  ],
}
```
