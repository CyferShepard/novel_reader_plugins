import { ScraperQuery, ScraperPayload, ScraperRegex } from "../../classes/api-parser.ts";

const details: ScraperPayload = new ScraperPayload({
  url: "https://novgo.net${0}",
  query: [
    new ScraperQuery({ label: "title", element: ".title", selectItemsAtIndex: [0] }),
    new ScraperQuery({ label: "summary", element: ".desc-text>p" }),
    // new ScraperQuery({ label: "tags", element: "" }),
    new ScraperQuery({
      label: "Author",
      element: ".info>div>a",
      selectItemsAtIndex: [0],
    }),
    new ScraperQuery({
      label: "Status",
      element: ".info>div",
      selectItemsAtIndex: [3],
      regex: new ScraperRegex({
        regex: /Status:\s*([^<]+)/,
        process: (match) => (match ? match[match.length - 1] : null),
      }),
    }),
    new ScraperQuery({
      label: "Genres",
      element: ".info>div",
      selectItemsAtIndex: [1],
      regex: new ScraperRegex({
        regex: /^Genre:\s*/, // Match "Genre:" and any following spaces
        process: (match) => match?.input?.replace(match[0], "") ?? "", // Replace the matched part with an empty string
      }),
    }),
    // new ScraperQuery({
    //   label: "Chapters",
    //   element: "",
    // }),
    // new ScraperQuery({
    //   label: "LastUpdate",
    //   element: "",
    // }),
  ],
});

export default details;
