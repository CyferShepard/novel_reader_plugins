import { ScraperQuery, ScraperPayload } from "../../classes/api-parser.ts";

const chapter: ScraperPayload = new ScraperPayload({
  url: "https://freewebnovel.com${0}",
  query: [
    new ScraperQuery({ label: "novel_title", element: ".tit>a", dataProp: "title" }),
    new ScraperQuery({ label: "novel_url", element: ".tit>a", withHref: true }),
    new ScraperQuery({ label: "chapter_title", element: ".chapter" }),
    new ScraperQuery({ label: "chapter", element: "#article" }),
    new ScraperQuery({
      label: "PreviousPage",
      element: "#prev_url",
      withHref: true,
      transformProcess: (value) => (value.split("/").length - 1 > 2 ? value : ""),
    }),
    new ScraperQuery({
      label: "NextPage",
      element: "#next_url",
      withHref: true,
      transformProcess: (value) => (value.split("/").length - 1 > 2 ? value : ""),
    }),
  ],
});

export default chapter;
