/* eslint node/no-missing-require: 0 -- ignore */
/* global module, require -- global */

module.exports = {
  base: "/",

  head: [],

  // eslint-disable-next-line node/no-unpublished-require -- ignore
  plugins: [[require("vuepress-plugin-full-text-search2").default]],
};
