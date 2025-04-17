import { ScraperQuery, ScraperPayload } from "../../classes/api-parser.ts";

const search: ScraperPayload = new ScraperPayload({
  url: "https://novgo.net/search?keyword=${0}",
  query: [
    new ScraperQuery({
      label: "results",
      element: ".row",
      subQuery: [
        new ScraperQuery({ label: "url", element: ".truyen-title>a", withHref: true }),
        new ScraperQuery({ label: "title", element: ".truyen-title>a" }),
        new ScraperQuery({ label: "summary", element: "" }),
        new ScraperQuery({ label: "cover", element: "img", withHref: true }),
        new ScraperQuery({ label: "genres", element: "" }),
      ],
    }),
  ],
});

export default search;
