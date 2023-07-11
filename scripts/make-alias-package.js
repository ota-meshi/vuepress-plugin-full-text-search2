import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { formatAndSave } from "./lib/utils.js";

const dirname = path.dirname(
  fileURLToPath(
    // @ts-expect-error -- Cannot change `module` option
    import.meta.url,
  ),
);
const packageJson = JSON.parse(
  fs.readFileSync(path.resolve(dirname, "../package.json"), "utf-8"),
);

const ALIAS = "vuepress2-plugin-full-text-search";

const ROOT_PATH = path.resolve(dirname, "..");
const ALIAS_ROOT_PATH = path.resolve(ROOT_PATH, "./alias-package");
const PACKAGE_FILE_PATH = path.resolve(ALIAS_ROOT_PATH, "./package.json");

const srcName = packageJson.name;

// Copy package
const mainContent = `"use strict"

module.exports = require('${srcName}')
`;
const mainPath = path.resolve(ALIAS_ROOT_PATH, packageJson.main);
formatAndSave(mainPath, mainContent);
const moduleContent = `export * from '${srcName}'
`;
const modulePath = path.resolve(ALIAS_ROOT_PATH, packageJson.module);
formatAndSave(modulePath, moduleContent);

delete packageJson.devDependencies;
delete packageJson.scripts;
packageJson.dependencies = {
  [srcName]: `^${packageJson.version}`,
};
packageJson.name = ALIAS;

formatAndSave(PACKAGE_FILE_PATH, JSON.stringify(packageJson));

// Copy README
for (const target of ["./README.md", "./LICENSE"]) {
  const srcPath = path.resolve(ROOT_PATH, target);
  const aliasPath = path.resolve(ALIAS_ROOT_PATH, target);

  let content = fs.readFileSync(srcPath, "utf8");
  content = content.replace(new RegExp(srcName, "gu"), ALIAS);
  content = content.replace(/\(\.\/screenshot.png\)/g, "(../screenshot.png)");

  if (target === "./README.md") {
    content = `<h1 align="center">⚠This package will be DEPRECATED⚠</h1>
<p align="center">⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠</p>
<p align="center">${ALIAS} has been renamed to <a href="https://www.npmjs.com/package/${srcName}">${srcName}</a>.<br>
${ALIAS} is an alias for <a href="https://www.npmjs.com/package/${srcName}">${srcName}</a>.<br>
We recommend using <a href="https://www.npmjs.com/package/${srcName}">${srcName}</a> directly.</p>
<p align="center">⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠</p>

${content}`;
  }

  content = content.replace(
    /<!--\s*CONFIG_START\s*-->[\s\S]*<!--\s*CONFIG_END\s*-->/u,
    `:warning: Text-based plugin definitions will not work because this plugin does not yet follow the naming convention.

### For CJS

e.g. \`.vuepress/config.js\`

\`\`\`js
module.exports = {
  plugins: [[require("vuepress2-plugin-full-text-search").default]],
};
\`\`\`

### For ESM

e.g. \`.vuepress/config.js\`

\`\`\`js
import pluginFullTextSearch from "vuepress2-plugin-full-text-search";
module.exports = {
  plugins: [[pluginFullTextSearch]],
};
\`\`\``,
  );

  formatAndSave(aliasPath, content);
}
