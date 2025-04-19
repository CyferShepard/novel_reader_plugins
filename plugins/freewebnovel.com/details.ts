import { ScraperQuery, ScraperPayload, ScraperRegex } from "../../classes/api-parser.ts";

const details: ScraperPayload = new ScraperPayload({
  url: "https://freewebnovel.com${0}",
  query: [
    new ScraperQuery({ label: "url", element: ".cur.cur-1>.wp>a", selectItemsAtIndex: [2], withHref: true }),
    new ScraperQuery({ label: "title", element: ".cur.cur-1>.wp>a", selectItemsAtIndex: [2] }),
    new ScraperQuery({ label: "summary", element: ".m-desc>.txt>.inner" }),
    new ScraperQuery({
      label: "tags",
    }),
    new ScraperQuery({
      label: "Author",
      element: ".m-imgtxt>.txt>.item>.right",
      selectItemsAtIndex: [1],
    }),
    new ScraperQuery({
      label: "Status",
      element: ".m-imgtxt>.txt>.item>.right>.s1.s2",
    }),
    new ScraperQuery({
      label: "Genres",
      element: ".m-imgtxt>.txt>.item>.right",
      selectItemsAtIndex: [2],
      transformProcess: (value) => value.split(","),
    }),
    new ScraperQuery({
      label: "Chapters",
    }),
    new ScraperQuery({
      label: "LastUpdate",
    }),
  ],
});

export default details;
