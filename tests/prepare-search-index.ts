import chai from "chai";
import { jestSnapshotPlugin } from "mocha-chai-jest-snapshot";
import path from "path";
import { fileURLToPath } from "url";
import type { App, Page } from "../src/prepare-search-index";
import { prepareSearchIndex } from "../src/prepare-search-index";
import type { Fixture } from "./utils";
import { listupFixtures } from "./utils";
import MarkdownIt from "markdown-it";
import anchorPlugin from "markdown-it-anchor";
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

chai.use(jestSnapshotPlugin());

const FIXTURES_ROOT = path.resolve(dirname, "./fixtures");
describe("prepareSearchIndex", () => {
  for (const fixture of listupFixtures(FIXTURES_ROOT)) {
    if (fixture.filename.endsWith(".md"))
      describe(fixture.filename, function () {
        it("create search index", async () => {
          const mock = createApp(fixture);
          await prepareSearchIndex(mock);
          chai.expect(mock.temp).toMatchSnapshot();
        });
      });
  }
});

function createApp(fixture: Fixture): {
  app: App;
  temp: Record<string, string>;
} {
  const temp: Record<string, string> = {};
  return {
    app: {
      env: {
        isDev: true,
        isBuild: false,
        isDebug: true,
      },
      writeTemp(f, c) {
        temp[f] = c;
        return Promise.resolve("");
      },
      pages: [parseMd(fixture)],
    },
    temp,
  };
}

function parseMd(fixture: Fixture): Page {
  const markdownIt = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
  });
  markdownIt.linkify.set({ fuzzyLink: false });
  markdownIt.use(anchorPlugin, {
    permalink: true,
    permalinkBefore: true,
    permalinkSymbol: "#",
  });
  const contentRendered = markdownIt.render(fixture.content);

  return {
    contentRendered,
    headers: [],
    path: fixture.filename,
    pathLocale: "",
    title: "Mock",
  };
}
