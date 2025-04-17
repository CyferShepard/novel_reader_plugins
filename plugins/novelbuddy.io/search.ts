import { ScraperQuery, ScraperPayload } from "../../classes/api-parser.ts";

const search: ScraperPayload = new ScraperPayload({
  url: "https://novelbuddy.io/search?q=${0}",
  query: [
    new ScraperQuery({
      label: "results",
      element: ".book-item",
      subQuery: [
        new ScraperQuery({ label: "url", element: ".meta>.title>h3>a", withHref: true }),
        new ScraperQuery({ label: "title", element: ".meta>.title>h3>a" }),
        new ScraperQuery({ label: "summary", element: ".meta>.summary>p" }),
        new ScraperQuery({ label: "cover", element: ".book-detailed-item>.thumb>a>img", withHref: true }),
        new ScraperQuery({ label: "genres", element: ".meta>.genres>span" }),
      ],
    }),
  ],
});

export default search;
