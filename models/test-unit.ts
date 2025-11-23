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
    searchParams: URLSearchParams | null = null
  ) {
    this.type = type;
    this.testUrl = testUrl;
    this.testBody = testBody;
    this.page = page;
    this.additionalProps = additionalProps;
    this.searchParams = searchParams;
  }
}
export { TestUnit, TestUnitType };
