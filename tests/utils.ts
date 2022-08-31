import fs from "fs";
import path from "path";

export type Fixture = {
  filename: string;
  filepath: string;
  content: string;
};
/** Listup */
export function* listupFixtures(rootDir: string): Iterable<Fixture> {
  for (const filename of fs.readdirSync(rootDir)) {
    const filepath = path.join(rootDir, filename);
    if (fs.statSync(filepath).isDirectory()) {
      for (const fixture of listupFixtures(filepath)) {
        yield {
          filename: fixture.filepath.slice(rootDir.length),
          filepath: fixture.filepath,
          get content() {
            return fixture.content;
          },
        };
      }
    } else {
      yield {
        filename,
        filepath,
        get content() {
          return fs.readFileSync(filepath, "utf-8");
        },
      };
    }
  }
}
