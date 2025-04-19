import { parseQuery, ScraperPayload } from "./classes/api-parser.ts";

import chapters from "./plugins/novgo.net/chapters.ts";

export function add(a: number, b: number): number {
  return a + b;
}

function substitute(template: string, ...values: string[]): string {
  return template.replace(/\$\{(\d+)\}/g, (_, index) => values[Number(index)] || "");
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const specificConfig: ScraperPayload | undefined = chapters;
  if (specificConfig !== undefined) {
    specificConfig.url = substitute(specificConfig.url, "/the-great-mage-returns-after-4000-years.html", "1");
    parseQuery(specificConfig).then((response) => {
      if (response) {
        console.log(response.toJson());
      } else {
        console.error("Failed to parse response");
      }
    });
  }
}
