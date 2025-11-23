import { assertEquals } from "@std/assert";
import { TestUnits } from "./models/test-units.ts";
import { TestUnit, TestUnitType } from "./models/test-unit.ts";
import { BodyType, parseQuery, ScraperPayload } from "../api-parser/mod.ts";
import { responseTypes } from "./models/response-types.ts";

const tests: TestUnits[] = [
  // new TestUnits("freewebnovel.com", [
  //   new TestUnit(TestUnitType.chapter, "/dual-cultivator-with-a-cultivation-system/chapter-1", null, 1, null),
  //   new TestUnit(TestUnitType.chapters, "/novel/dual-cultivator-with-a-cultivation-system", null, 1, null),
  //   new TestUnit(TestUnitType.details, "/novel/dual-cultivator-with-a-cultivation-system", null, 1, null),
  //   new TestUnit(TestUnitType.latest, null, null, 1, null),
  //   new TestUnit(TestUnitType.search, null, { searchkey: "test" }, 1, null),
  // ]),

  // new TestUnits("novelbin.me", [
  //   new TestUnit(TestUnitType.chapter, "https://novelbin.com/b/beyond-chaos-a-dicerpg/0-alive-again", null, 1, null),
  //   new TestUnit(TestUnitType.chapters, "", null, 1, { NovelId: "beyond-chaos-a-dicerpg" }),
  //   new TestUnit(TestUnitType.details, "https://novelbin.me/novel-book/beyond-chaos-a-dicerpg#tab-chapters-title", null, 1, null),
  //   new TestUnit(TestUnitType.latest, null, null, 1, null),
  //   new TestUnit(TestUnitType.search, null, null, 1, null, new URLSearchParams("keyword=test")),
  // ]),
  new TestUnits("novelbuddy.io", [
    new TestUnit(TestUnitType.chapter, "/novel/void-evolution-system/chapter-1", null, 1, null),
    new TestUnit(TestUnitType.chapters, "", null, 1, { BookId: "3988" }),
    new TestUnit(TestUnitType.details, "/novel/void-evolution-system", null, 1, null),
    new TestUnit(TestUnitType.latest, null, null, 1, null),
    new TestUnit(TestUnitType.search, null, null, 1, null, new URLSearchParams("keyword=test")),
  ]),
];

const responseValidation: responseTypes[] = [
  new responseTypes("novelTitle", "string", TestUnitType.chapter),
  new responseTypes("novelUrl", "string", TestUnitType.chapter),
  new responseTypes("title", "string", TestUnitType.chapter),
  new responseTypes("content", "object", TestUnitType.chapter, [new responseTypes("", "string", TestUnitType.chapter)]),
  new responseTypes("previousPage", "string", TestUnitType.chapter, [], true),
  new responseTypes("nextPage", "string", TestUnitType.chapter),
  new responseTypes("url", "string", TestUnitType.chapter),
  ////////////////////
  new responseTypes("chapters", "object", TestUnitType.chapters, [
    new responseTypes("url", "string", TestUnitType.chapters),
    new responseTypes("index", "number", TestUnitType.chapters),
    new responseTypes("title", "string", TestUnitType.chapters),
    new responseTypes("date", "string", TestUnitType.chapters, [], true),
  ]),
  new responseTypes("curentPage", "number", TestUnitType.chapters, [], true),
  new responseTypes("lastPage", "string", TestUnitType.chapters, [], true),
  ///////////////////
  new responseTypes("url", "string", TestUnitType.details, [], true),
  new responseTypes("cover", "string", TestUnitType.details),
  new responseTypes("title", "string", TestUnitType.details),
  new responseTypes("summary", "object", TestUnitType.details, [new responseTypes("", "string", TestUnitType.details)]),
  new responseTypes("tags", "object", TestUnitType.details, [new responseTypes("", "string", TestUnitType.details)], true),
  new responseTypes("author", "string", TestUnitType.details),
  new responseTypes("status", "string", TestUnitType.details),
  new responseTypes("genres", "object", TestUnitType.details, [new responseTypes("", "string", TestUnitType.details)], true),
  new responseTypes("chapters", "number", TestUnitType.details, [new responseTypes("", "string", TestUnitType.details)], true), // to fix, this needs to be a number
  new responseTypes("lastUpdate", "string", TestUnitType.details),
  //////////////////
  new responseTypes("results", "object", TestUnitType.latest, [
    new responseTypes("url", "string", TestUnitType.latest),
    new responseTypes("title", "string", TestUnitType.latest),
    new responseTypes("summary", "object", TestUnitType.latest, [new responseTypes("", "string", TestUnitType.latest)], true),
    new responseTypes("cover", "string", TestUnitType.latest),
    new responseTypes("genres", "object", TestUnitType.latest, [new responseTypes("", "string", TestUnitType.latest)], true),
  ]),
  new responseTypes("curentPage", "number", TestUnitType.latest, [], true),
  new responseTypes("lastPage", "number", TestUnitType.latest, [], true),
  //////////////////
  new responseTypes("results", "object", TestUnitType.search, [
    new responseTypes("url", "string", TestUnitType.search),
    new responseTypes("title", "string", TestUnitType.search),
    new responseTypes("summary", "object", TestUnitType.search, [new responseTypes("", "string", TestUnitType.search)], true),
    new responseTypes("cover", "string", TestUnitType.search),
    new responseTypes("genres", "object", TestUnitType.search, [new responseTypes("", "string", TestUnitType.search)]),
    new responseTypes("chapterCount", "number", TestUnitType.search),
  ]),
  new responseTypes("curentPage", "number", TestUnitType.search, [], true),
  new responseTypes("lastPage", "number", TestUnitType.search, [], true),
];

async function getPayload(source: string, payload: string) {
  try {
    const filePath = `./configs/${source}/${payload}.json`;
    const fileContent = await Deno.readTextFile(filePath);
    return ScraperPayload.fromJson(JSON.parse(fileContent));
  } catch (e) {
    console.error(`Error reading file for source: ${source}, payload: ${payload}`, e);
    throw e;
  }
}

async function parse(source: string, testUnit: TestUnit) {
  const payload = await getPayload(source, TestUnitType[testUnit.type]);
  if (testUnit.testUrl && testUnit.type !== TestUnitType.search) {
    payload.url = payload.url.replace("${0}", testUnit.testUrl);
  }

  if (testUnit.type == TestUnitType.search) {
    console.log("Search Test Body:", testUnit.testBody);
    console.log("payload before:", payload.type);
    if (payload.type === "POST") {
      if (payload.bodyType === BodyType.FORM_DATA) {
        if (!payload.body || !(payload.body instanceof FormData)) {
          payload.body = new FormData();
        }
        for (const [key, value] of Object.entries(testUnit.testBody!)) {
          payload.body.set(key, value);
        }
        console.log("Form Data Payload:", Array.from(payload.body.entries()));
      } else if (payload.bodyType === BodyType.JSON) {
        payload.body = testUnit.testBody!;
      }
    }
    payload.url = payload.url.replace("${1}", testUnit.page!.toString());
  }

  if (testUnit.additionalProps) {
    for (const [key, value] of Object.entries(testUnit.additionalProps)) {
      payload.url = payload.url.replace(`\${${key}}`, value);
    }
  }

  if (testUnit.searchParams) {
    payload.url += (payload.url.includes("?") ? "&" : "?") + `${testUnit.searchParams.toString()}`;
  }

  return await parseQuery(payload).then((response) => {
    if (response == null) {
      throw new Error("Response is null");
    }
    const responseBody = response.toJson();
    if (
      responseBody.results &&
      Array.isArray(responseBody.results) &&
      responseBody.results.length === 1 &&
      Object.keys(responseBody.results[0]).length === 1 &&
      Object.keys(responseBody.results[0])[0] === "results"
    ) {
      // Replace the "results" field with the value of the single JSON object
      const singleResult = responseBody.results[0];
      const firstKey = Object.keys(singleResult)[0];
      responseBody.results = singleResult[firstKey];
    }
    return responseBody;
  });
}

Deno.test("API Parser Test Suite", async () => {
  for (const testUnit of tests) {
    for (const test of testUnit.tests) {
      console.log(`Running test for source: ${testUnit.source}, type: ${TestUnitType[test.type]}`);
      const parsedResponse = await parse(testUnit.source, test);
      assertEquals(Array.isArray(parsedResponse.results), true, "Parsed response should be an array");
      assertEquals((parsedResponse.results as []).length > 0, true, "Parsed response array should not be empty");

      const resultTypeValidations = responseValidation.filter((resp) => resp.unit === test.type);
      for (const validation of resultTypeValidations) {
        const result: Record<string, any> =
          validation.unit == TestUnitType.search ? parsedResponse : (parsedResponse as Record<string, any>).results[0];
        console.log(`Parsed Response: ${JSON.stringify(result, null, 2)}`);
        const value = result[validation.key];
        if (validation.children && validation.children.length > 0 && Array.isArray(value)) {
          console.log(`Validating children for key: ${validation.key}`);
          // Validate children types
          for (const v of value) {
            for (const childValidation of validation.children) {
              const validTypes = [childValidation.type];
              if (childValidation.allowNull) {
                validTypes.push("undefined");
              }
              const childValue = childValidation.key == "" ? v : v[childValidation.key];
              const isValidType = validTypes.includes(typeof childValue) || (childValidation.allowNull && childValue === null);

              assertEquals(
                isValidType,
                true,
                `${validation.unit.toString()} - Validation failed for key: ${childValidation.key}, expected type: ${
                  childValidation.type
                }, got: ${typeof childValue}, parent key: ${validation.key}, value: ${JSON.stringify(v)}`
              );
            }
          }
        }
        const validTypes = [validation.type];
        if (validation.allowNull) {
          validTypes.push("undefined");
        }
        if (validation.children && validation.children.length > 0 && !Array.isArray(value)) {
          validTypes.push(validation.children[0].type);
        }

        const isValidType = validTypes.includes(typeof value) || (validation.allowNull && value === null);

        assertEquals(
          isValidType,
          true,
          `${validation.unit.toString()} - Validation failed for key: ${validation.key}, expected type: ${
            validation.type
          }, got: ${typeof value}, value: ${JSON.stringify(value)}`
        );
      }
    }
  }
});
