import { ScraperQuery, ScraperPayload, HTTPMethod, BodyType } from "../../classes/api-parser.ts";

const formData = new FormData();
formData.append("searchkey", "searchterm");

const search: ScraperPayload = new ScraperPayload({
  type: HTTPMethod.POST,
  url: "https://freewebnovel.com/search",
  body: formData,
  bodyType: BodyType.FORM_DATA,
  query: [
    new ScraperQuery({
      label: "results",
      element: ".con",
      subQuery: [
        new ScraperQuery({ label: "url", element: ".tit>a", withHref: true }),
        new ScraperQuery({ label: "title", element: ".tit>a", dataProp: "title" }),
        new ScraperQuery({ label: "summary" }),
        new ScraperQuery({
          label: "cover",
          element: ".pic>a>img",
          withHref: true,
          transformProcess: (value) => {
            if (value.startsWith("/files")) {
              return "https://freewebnovel.com" + value;
            } else {
              return value;
            }
          },
        }),
        new ScraperQuery({ label: "genres", element: ".txt>.desc>.item>.right>a", selectItemsAtIndex: [0, 1] }),
      ],
    }),
  ],
});

export default search;
