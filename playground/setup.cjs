"use strict";

const cp = require("child_process");
const path = require("path");
const fs = require("fs");

const PROJECT_ROOT = path.resolve(__dirname, "..");
cp.execSync("npm run build", { stdio: "inherit", cwd: PROJECT_ROOT });
cp.execSync("npm pack", { stdio: "inherit", cwd: PROJECT_ROOT });
const orgTgzName = path.resolve(
  PROJECT_ROOT,
  `vuepress-plugin-full-text-search2-${require("../package.json").version}.tgz`
);

const tgzName = path.resolve(
  PROJECT_ROOT,
  `vuepress-plugin-full-text-search2-test.tgz`
);
if (fs.existsSync(tgzName)) {
  fs.unlinkSync(tgzName);
}
fs.renameSync(orgTgzName, tgzName);
