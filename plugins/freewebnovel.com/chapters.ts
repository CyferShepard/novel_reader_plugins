import { ScraperQuery, ScraperPayload, ScraperRegex } from "../../classes/api-parser.ts";

const chapters: ScraperPayload = new ScraperPayload({
  url: "https://freewebnovel.com${0}",
  query: [
    new ScraperQuery({
      label: "chapters",
      element: "#idData>li",
      subQuery: [
        new ScraperQuery({ label: "url", element: "a", withHref: true }),
        new ScraperQuery({
          label: "index",
          element: "a",
          dataProp: "title",
          regex: new ScraperRegex({
            regex: /Chapter\s+(\d+)/i,
            process: (match) => (match && match.length >= 2 ? parseInt(match[1]) : null),
          }),
        }),
        new ScraperQuery({ label: "title", element: "a", dataProp: "title" }),
        new ScraperQuery({ label: "date" }),
      ],
    }),
    new ScraperQuery({
      label: "CurentPage",
    }),
    new ScraperQuery({
      label: "LastPage",
    }),
  ],
});

export default chapters;
