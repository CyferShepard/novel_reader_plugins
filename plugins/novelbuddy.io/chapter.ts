import ScraperPayload from "../../models/ScraperPayload.ts";
import ScraperQuery from "../../models/ScraperQuery.ts";

const chapter: ScraperPayload = new ScraperPayload({
  url: "https://novelbuddy.io/novel${0}${1}",
  query: [
    new ScraperQuery({ label: "novel_title", element: ".chapter-info>h2>a" }),
    new ScraperQuery({ label: "novel_url", element: ".chapter-info>h2>a", withHref: true }),
    new ScraperQuery({ label: "chapter_title", element: "#chapter__content>h1" }),
    new ScraperQuery({ label: "chapter", element: ".content-inner>p" }),
  ],
});

export default chapter;
