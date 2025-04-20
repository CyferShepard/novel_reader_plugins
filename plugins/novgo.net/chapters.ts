import { ScraperQuery, ScraperPayload, ScraperRegex } from "../../classes/api-parser.ts";

const chapters: ScraperPayload = new ScraperPayload({
  url: "https://novgo.net${0}?page=${1}",
  query: [
    new ScraperQuery({
      label: "chapters",
      element: "ul.list-chapter>li",
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
        new ScraperQuery({
          label: "title",
          element: "a",
          dataProp: "title",
        }),
        new ScraperQuery({ label: "date" }),
      ],
    }),
    new ScraperQuery({
      label: "CurentPage",
      element: ".pagination>li.active>a",
      dataProp: "data-page",
      transformProcess: (value) => parseInt(value) + 1,
    }),
    new ScraperQuery({
      label: "LastPage",
      element: ".last>a",
      dataProp: "data-page",
      transformProcess: (value) => parseInt(value) + 1,
    }),
  ],
});

export default chapters;
