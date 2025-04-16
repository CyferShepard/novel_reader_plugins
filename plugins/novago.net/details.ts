import ScraperPayload from "../../models/ScraperPayload.ts";
import ScraperQuery from "../../models/ScraperQuery.ts";

const details: ScraperPayload = new ScraperPayload({
  url: "https://novgo.net${0}",
  query: [
    new ScraperQuery({ label: "title", element: ".title" }),
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
      subQuery: [
        new ScraperQuery({
          label: "Status",
          element: "a",
        }),
      ],
    }),
    new ScraperQuery({
      label: "Genres",
      element: ".info>div",
      selectItemsAtIndex: [1],
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
