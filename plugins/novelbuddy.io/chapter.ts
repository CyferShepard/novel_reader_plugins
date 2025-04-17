import { ScraperQuery, ScraperPayload } from "../../classes/api-parser.ts";

const chapter: ScraperPayload = new ScraperPayload({
  url: "https://novelbuddy.io${0}",
  query: [
    new ScraperQuery({ label: "novel_title", element: ".chapter-info>h2>a" }),
    new ScraperQuery({ label: "novel_url", element: ".chapter-info>h2>a", withHref: true }),
    new ScraperQuery({ label: "chapter_title", element: "#chapter__content>h1" }),
    new ScraperQuery({ label: "chapter", element: ".content-inner>p" }),
    new ScraperQuery({ label: "PreviousPage", element: "#btn-prev", withHref: true }),
    new ScraperQuery({ label: "NextPage", element: "#btn-next", withHref: true }),
  ],
});

export default chapter;
