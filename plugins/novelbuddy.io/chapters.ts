import ScraperPayload from "../../models/ScraperPayload.ts";
import ScraperQuery from "../../models/ScraperQuery.ts";

const chapters: ScraperPayload = new ScraperPayload({
  url: "https://novelbuddy.io/api/manga/${0}/chapters?source=detail",
  query: [
    new ScraperQuery({
      label: "chapters",
      element: "li",
      subQuery: [
        new ScraperQuery({ label: "url", element: "a", withHref: true }),
        new ScraperQuery({ label: "title", element: ".chapter-title" }),
        new ScraperQuery({ label: "date", element: ".chapter-update" }),
      ],
    }),
  ],
});

export default chapters;
