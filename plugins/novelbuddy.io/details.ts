import { ScraperQuery, ScraperPayload, ScraperRegex } from "../../classes/api-parser.ts";

const details: ScraperPayload = new ScraperPayload({
  url: "https://novelbuddy.io${0}",
  query: [
    new ScraperQuery({ label: "url" }),
    new ScraperQuery({ label: "title", element: ".detail>.name.box>h1" }),
    new ScraperQuery({ label: "summary", element: ".summary>p" }),
    new ScraperQuery({ label: "tags", element: ".tags>a" }),
    new ScraperQuery({
      label: "Author",
      element: ".detail>.meta.box>p>a>span",
      selectItemsAtIndex: [0],
    }),
    new ScraperQuery({
      label: "Status",
      element: ".detail>.meta.box>p>a>span",
      selectItemsAtIndex: [1],
    }),
    new ScraperQuery({
      label: "Genres",
      element: ".detail>.meta.box>p",
      selectItemsAtIndex: [2],
      regex: new ScraperRegex({
        regex: /^Genres :\s*/, // Match "Genre:" and any following spaces
        process: (match) => match?.input?.replace(match[0], "") ?? "", // Replace the matched part with an empty string
      }),
    }),
    new ScraperQuery({
      label: "Chapters",
      element: ".detail>.meta.box>p>span",
      selectItemsAtIndex: [0],
    }),
    new ScraperQuery({
      label: "LastUpdate",
      element: ".detail>.meta.box>p>span",
      selectItemsAtIndex: [1],
    }),
    new ScraperQuery({
      label: "AdditionalProps",
      element: ".layout",
      subQuery: [
        new ScraperQuery({
          label: "BookId",
          element: "script",
          selectItemsAtIndex: [0],
          regex: new ScraperRegex({ regex: /var bookId = (\d+);/, process: (match) => (match ? match[1] : null) }),
        }),
      ],
    }),
  ],
});

export default details;
