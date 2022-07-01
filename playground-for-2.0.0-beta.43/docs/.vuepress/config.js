/* eslint node/no-missing-require: 0 -- ignore */
/* global module, require -- global */
"use strict";

module.exports = {
  base: "/",

  head: [],

  // eslint-disable-next-line node/no-unpublished-require -- ignore
  plugins: [[require("vuepress2-plugin-full-text-search").default]],
};
