import fs from "fs";
import path from "path";
import { ESLint } from "eslint";
const eslint = new ESLint({ fix: true });

/** Run eslint fix */
export async function formatAndSave(filename, text) {
  const lintResults = await eslint.lintText(text, { filePath: filename });
  const output = lintResults[0].output || text;
  makeDirs(path.dirname(filename));
  fs.writeFileSync(filename, output);
  return output;
}

/** Make dirs */
function makeDirs(dir) {
  if (fs.existsSync(dir)) {
    return;
  }
  const parent = path.dirname(dir);
  makeDirs(parent);
  fs.mkdirSync(dir);
}
