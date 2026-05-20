import { assertEquals } from "@std/assert";
import { TestUnits } from "./models/test-units.ts";
import { TestUnit, TestUnitType } from "./models/test-unit.ts";
import { BodyType, parseQuery, ScraperPayload } from "../api-parser/mod.ts";
import { responseTypes } from "./models/response-types.ts";
import { ScraperResponse } from "./classes/api-parser.ts";

// `tests` moved to tests_def.ts so a generator can create static tests for VS Code discovery.

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

export async function parse(source: string, testUnit: TestUnit) {
  const payload = await getPayload(source, TestUnitType[testUnit.type]);
  if (testUnit.testUrl && testUnit.type !== TestUnitType.search) {
    payload.url = payload.url.replace("${0}", testUnit.testUrl);
  }
  if (testUnit.type == TestUnitType.latest) {
    payload.url = payload.url.replace("${0}", testUnit.page!.toString());
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
      assertEquals(
        false,
        true,
        `Response is null for source: ${source}, test type: ${TestUnitType[testUnit.type]} - payload.url: ${payload.url}`,
      );
    }
    if (response instanceof ScraperResponse === false) {
      assertEquals(
        false,
        true,
        `Response is not an instance of ScraperResponse for source: ${source}, test type: ${TestUnitType[testUnit.type]}`,
      );
    }
    const responseBody = (response as ScraperResponse).toJson();
    return responseBody;
  });
}

export function validate(validation: responseTypes, result: Record<string, unknown>, test: TestUnits) {
  const value = validation.key == "" ? result : (result as Record<string, unknown>)[validation.key];
  if (validation.children && validation.children.length > 0 && Array.isArray(value)) {
    // Validate children types
    for (const v of value) {
      for (const childValidation of validation.children) {
        validate(childValidation, v, test);
      }
    }
  }

  const validTypes = validation.type;
  if (validation.allowNull) {
    validTypes.push("undefined");
  }
  if (validation.children && validation.children.length > 0 && !Array.isArray(value)) {
    validTypes.push(...validation.children[0].type);
  }

  const isValidType = validTypes.includes(typeof value) || (validation.allowNull && value === null);

  assertEquals(
    isValidType,
    true,
    `${test.source} - ${TestUnitType[validation.unit]} - Validation failed for key: ${validation.key}, expected type: ${
      validation.type
    }, got: ${typeof value}, value: ${JSON.stringify(value)}`,
  );
}

// Tests are generated into `generated_tests.ts` for static discovery by VS Code.
