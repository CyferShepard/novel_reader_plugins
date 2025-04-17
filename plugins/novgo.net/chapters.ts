import { ScraperQuery, ScraperPayload } from "../../classes/api-parser.ts";

const chapters: ScraperPayload = new ScraperPayload({
  url: "https://novgo.net${0}?page=${1}",
  query: [
    new ScraperQuery({
      label: "chapters",
      element: "ul.list-chapter>li",
      subQuery: [
        new ScraperQuery({ label: "url", element: "a", withHref: true }),
        new ScraperQuery({ label: "title", element: "a", dataProp: "title" }),
        // new ScraperQuery({ label: "date", element: ".chapter-update" }),
      ],
    }),
    new ScraperQuery({ label: "CurentPage", element: ".pagination>li.active>a", dataProp: "data-page" }),
    new ScraperQuery({ label: "LastPage", element: ".last>a", dataProp: "data-page" }),
  ],
});

export default chapters;
