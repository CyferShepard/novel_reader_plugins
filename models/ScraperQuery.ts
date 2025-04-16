class ScraperQuery {
  label: string;
  element: string;
  getContent: boolean;
  withHref: boolean;
  subQuery?: ScraperQuery[];
  selectItemsAtIndex: number[];

  constructor({
    label,
    element,
    getContent = true,
    withHref = false,
    subQuery,
    selectItemsAtIndex,
  }: {
    label: string;
    element: string;
    getContent?: boolean;
    withHref?: boolean;
    subQuery?: ScraperQuery[];
    selectItemsAtIndex?: number[];
  }) {
    this.label = label;
    this.element = element;
    this.getContent = getContent;
    this.withHref = withHref;
    this.subQuery = subQuery;
    this.selectItemsAtIndex = selectItemsAtIndex ?? [];
  }

  static fromJson(json: Record<string, unknown>): ScraperQuery {
    return new ScraperQuery({
      label: json["label"] as string,
      element: json["element"] as string,
      getContent: json["getContent"] as boolean,
      withHref: json["withHref"] as boolean,
      subQuery: (json["subQuery"] as Array<Record<string, unknown>>)?.map((e) => ScraperQuery.fromJson(e)) ?? [],
      selectItemsAtIndex: (json["selectItemsAtIndex"] as Array<number>) ?? [],
    });
  }

  toJson(): Record<string, unknown> {
    return {
      label: this.label,
      element: this.element,
      getContent: this.getContent,
      withHref: this.withHref,
      subQuery: this.subQuery?.map((e) => e.toJson()),
      selectItemsAtIndex: this.selectItemsAtIndex ?? [],
    };
  }
}

export default ScraperQuery;
