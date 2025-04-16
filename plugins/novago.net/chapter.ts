import ScraperPayload from "../../models/ScraperPayload.ts";
import ScraperQuery from "../../models/ScraperQuery.ts";

const chapter: ScraperPayload = new ScraperPayload({
  url: "https://novgo.net${0}${1}",
  query: [
    new ScraperQuery({ label: "novel_title", element: ".truyen-title", dataProp: "title" }),
    new ScraperQuery({ label: "novel_url", element: ".truyen-title", withHref: true }),
    new ScraperQuery({ label: "chapter_title", element: ".chapter-title", dataProp: "title" }),
    new ScraperQuery({ label: "chapter", element: "#chapter-content" }),
  ],
});

export default chapter;
