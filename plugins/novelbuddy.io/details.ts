import ScraperPayload from "../../models/ScraperPayload.ts";
import ScraperQuery from "../../models/ScraperQuery.ts";

const details: ScraperPayload = new ScraperPayload({
  url: "https://novelbuddy.io/novel/${0}",
  query: [
    new ScraperQuery({ label: "title", element: ".detail>.name.box>h1" }),
    new ScraperQuery({ label: "summary", element: ".summary>p" }),
    new ScraperQuery({ label: "tags", element: ".tags>a" }),
    new ScraperQuery({
      label: "details",
      element: ".detail>.meta.box>p",
      subQuery: [new ScraperQuery({ label: "field", element: "strong" }), new ScraperQuery({ label: "value", element: "span" })],
    }),
    new ScraperQuery({
      label: "Authors",
      element: ".detail>.meta.box>p>span",
      selectItemsAtIndex: [0],
    }),
    new ScraperQuery({
      label: "Status",
      element: ".detail>.meta.box>p>span",
      selectItemsAtIndex: [1],
    }),
    new ScraperQuery({
      label: "Genres",
      element: ".detail>.meta.box>p>span",
      selectItemsAtIndex: [2],
    }),
    new ScraperQuery({
      label: "Chapters",
      element: ".detail>.meta.box>p>span",
      selectItemsAtIndex: [3],
    }),
    new ScraperQuery({
      label: "LastUpdate",
      element: ".detail>.meta.box>p>span",
      selectItemsAtIndex: [4],
    }),
  ],
});

export default details;
