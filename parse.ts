import { ScraperParser } from "./classes/api-parser.ts";
import ScraperPayload from "./models/ScraperPayload.ts";
import details from "./plugins/novelbuddy.io/details.ts";

export function add(a: number, b: number): number {
  return a + b;
}

function substitute(template: string, ...values: string[]): string {
  return template.replace(/\$\{(\d+)\}/g, (_, index) => values[Number(index)] || "");
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const specificConfig: ScraperPayload | undefined = details;
  if (specificConfig !== undefined) {
    specificConfig.url = substitute(specificConfig.url, "/novel/mtl-returning-to-90s-she-became-famous-in-major-surgical-fields");
    const scraperParser = new ScraperParser();

    scraperParser.parseQuery(specificConfig).then((response) => {
      if (response) {
        console.log(response.toJson());
      } else {
        console.error("Failed to parse response");
      }
    });
  }
}
