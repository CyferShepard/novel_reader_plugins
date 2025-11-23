import { TestUnit } from "./test-unit.ts";

class TestUnits {
  source: string;
  tests: TestUnit[];

  constructor(source: string, tests: TestUnit[]) {
    this.source = source;
    this.tests = tests;
  }
}

export { TestUnits };
