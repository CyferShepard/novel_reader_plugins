import { ScraperQuery, ScraperPayload } from "../../classes/api-parser.ts";

const chapters: ScraperPayload = new ScraperPayload({
  url: "https://freewebnovel.com${0}",
  query: [
    new ScraperQuery({
      label: "chapters",
      element: "#idData>li",
      subQuery: [
        new ScraperQuery({ label: "url", element: "a", withHref: true }),
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
