import { TestUnit } from "./test-unit.ts";

class TestUnits {
  source: string;
  tests: TestUnit[];

  constructor(source: string, tests: TestUnit[]) {
    this.source = source;
    this.tests = tests;
  }

  toJson(): Record<string, unknown> {
    return {
      source: this.source,
      tests: this.tests.map((t) => t.toJson()),
    };
  }

  toGenString(): string {
    const parts: string[] = [];
    parts.push(`${JSON.stringify(this.source)}`);
    parts.push(`[new TestUnit(${this.tests.map((t) => t.toGenString()).join("), new TestUnit(")})]`);
    return `${parts.join(", ")}`;
  }

  static fromJson(json: Record<string, unknown>): TestUnits {
    return new TestUnits(
      json.source as string,
      (json.tests as Record<string, unknown>[]).map((t) => TestUnit.fromJson(t)),
    );
  }
}

export { TestUnits };
