enum TestUnitType {
  chapter,
  chapters,
  details,
  latest,
  search,
}
class TestUnit {
  type: TestUnitType;
  testUrl: string | null;
  testBody: Record<string, any> | null;
  page: number;
  additionalProps: Record<string, any> | null;
  searchParams: URLSearchParams | null;
  constructor(
    type: TestUnitType,
    testUrl: string | null = null,
    testBody: Record<string, any> | null = null,
    page: number = 1,
    additionalProps: Record<string, any> | null = null,
    searchParams: URLSearchParams | null = null,
  ) {
    this.type = type;
    this.testUrl = testUrl;
    this.testBody = testBody;
    this.page = page;
    this.additionalProps = additionalProps;
    this.searchParams = searchParams;
  }

  toJson(): Record<string, any> {
    return {
      type: this.type,
      testUrl: this.testUrl,
      testBody: this.testBody,
      page: this.page,
      additionalProps: this.additionalProps,
      searchParams: this.searchParams,
    };
  }

  toGenString(): string {
    const parts: string[] = [];
    parts.push(`TestUnitType.${TestUnitType[this.type]}`);
    parts.push(`${this.testUrl ? JSON.stringify(this.testUrl) : "null"}`);
    parts.push(`${this.testBody ? JSON.stringify(this.testBody) : "null"}`);
    parts.push(`${this.page}`);
    parts.push(`${this.additionalProps ? JSON.stringify(this.additionalProps) : "null"}`);
    parts.push(`${this.searchParams ? `new URLSearchParams(${JSON.stringify(this.searchParams.toString())})` : "null"}`);
    return `${parts.join(", ")}`;
  }

  static fromJson(json: Record<string, any>): TestUnit {
    return new TestUnit(json.type, json.testUrl, json.testBody, json.page, json.additionalProps, json.searchParams);
  }
}
export { TestUnit, TestUnitType };
