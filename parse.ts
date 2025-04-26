import { parseQuery, ScraperPayload } from "./classes/api-parser.ts";

import details from "./plugins/novelbuddy.io/search.ts";

function substitute(template: string, ...values: string[]): string {
  return template.replace(/\$\{(\d+)\}/g, (_, index) => values[Number(index)] || "");
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const specificConfig: ScraperPayload | undefined = details;
  if (specificConfig !== undefined) {
    specificConfig.url = substitute(specificConfig.url, "return");
    // if (specificConfig.body instanceof FormData) {
    //   let index = 0;
    //   specificConfig.body.forEach((value: string, key: string) => {
    //     if (index === 0) {
    //       console.log(key, value); // Log the key and value
    //       specificConfig.body.set(key, "return"); // Set the value for the matching key
    //     }
    //     index++;
    //   });
    // }
    // console.log(specificConfig);
    parseQuery(specificConfig).then((response) => {
      if (response) {
        console.log(response.toJson());
      } else {
        console.error("Failed to parse response");
      }
    });
  }
}
