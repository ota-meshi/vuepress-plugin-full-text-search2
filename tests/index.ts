import chai from "chai";
import { jestSnapshotPlugin } from "mocha-chai-jest-snapshot";

chai.use(jestSnapshotPlugin());

describe("test", () => {
  it("test", () => {
    // chai.expect({}).toMatchSnapshot()
  });
});
