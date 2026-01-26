import { tests } from "../tests_def.ts";
import { TestUnitType, TestUnit } from "../models/test-unit.ts";
import { TestUnits } from "../models/test-units.ts";
function serializeValue(v: unknown): string {
  if (v === null || v === undefined) return "null";
  if (v instanceof URLSearchParams) return `new URLSearchParams("${v.toString()}")`;
  if (typeof v === "string") return JSON.stringify(v);
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return JSON.stringify(v, null, 2);
}

let out = `import { assertEquals } from "@std/assert";
import { TestUnitType, TestUnit } from "./models/test-unit.ts";
import { TestUnits } from "./models/test-units.ts";
import { parse, validate, responseValidation } from "./main_test.ts";

`;

for (const testUnit of tests) {
  for (const test of testUnit.tests) {
    const nameParts = ["API Parser", testUnit.source, TestUnitType[test.type]];
    if (test.testUrl) nameParts.push(test.testUrl);
    if (test.page) nameParts.push(`page ${test.page}`);
    const testName = nameParts.join(" - ");

    const testObjParts: string[] = [];
    testObjParts.push(`TestUnitType.${TestUnitType[test.type]}`);
    testObjParts.push(`${serializeValue(test.testUrl)}`);
    testObjParts.push(`${serializeValue(test.testBody)}`);
    testObjParts.push(`${serializeValue(test.page)}`);
    testObjParts.push(`${serializeValue(test.additionalProps)}`);
    testObjParts.push(`${serializeValue(test.searchParams)}`);

    const testObjCode = `${testObjParts.join(", ")}`;

    out += `Deno.test(${JSON.stringify(testName)}, async () => {
  const parsedResponse = await parse(${JSON.stringify(testUnit.source)}, new TestUnit(${testObjCode}));
  assertEquals(Array.isArray(parsedResponse.results), true, "Parsed response should be an array");
  assertEquals((parsedResponse.results as []).length > 0, true, "Parsed response array should not be empty");
  const resultTypeValidations = responseValidation.filter((resp) => resp.unit === ${test.type});
  for (const validation of resultTypeValidations) {
    validate(validation, parsedResponse, new TestUnits(${testUnit.toGenString()}));
  }
});

`;
  }
}

await Deno.writeTextFile("./generated_tests.ts", out);
console.log("generated_tests.ts created, tests:", tests.flatMap((t) => t.tests).length);
