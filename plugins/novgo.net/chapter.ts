import { ScraperQuery, ScraperPayload } from "../../classes/api-parser.ts";

const chapter: ScraperPayload = new ScraperPayload({
  url: "https://novgo.net${0}",
  query: [
    new ScraperQuery({ label: "novel_title", element: ".truyen-title", dataProp: "title" }),
    new ScraperQuery({ label: "novel_url", element: ".truyen-title", withHref: true }),
    new ScraperQuery({ label: "chapter_title", element: ".chapter-title", dataProp: "title" }),
    new ScraperQuery({ label: "chapter", element: "#chapter-content" }),
    new ScraperQuery({ label: "PreviousPage", element: "#prev_chap", withHref: true }),
    new ScraperQuery({ label: "NextPage", element: "#next_chap", withHref: true }),
  ],
});

export default chapter;
