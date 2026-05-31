import { assertEquals } from "@std/assert";
import { TestUnitType, TestUnit } from "./models/test-unit.ts";
import { TestUnits } from "./models/test-units.ts";
import { parse, validate } from "./main_test.ts";
import { responseValidation } from "./tests_def.ts";

Deno.test("API Parser - freewebnovel.com - chapter - /dual-cultivator-with-a-cultivation-system/chapter-1 - page 1", async () => {
  const parsedResponse = await parse("freewebnovel.com", new TestUnit(TestUnitType.chapter, "/dual-cultivator-with-a-cultivation-system/chapter-1", null, 1, null, null));
  assertEquals(Array.isArray(parsedResponse.results), true, "Parsed response should be an array");
  assertEquals((parsedResponse.results as []).length > 0, true, "Parsed response array should not be empty");
  const resultTypeValidations = responseValidation.filter((resp) => resp.unit === 0);
  for (const validation of resultTypeValidations) {
    validate(validation, parsedResponse, new TestUnits("freewebnovel.com", [new TestUnit(TestUnitType.chapter, "/dual-cultivator-with-a-cultivation-system/chapter-1", null, 1, null, null), new TestUnit(TestUnitType.chapters, "/novel/dual-cultivator-with-a-cultivation-system", null, 1, null, null), new TestUnit(TestUnitType.details, "/novel/dual-cultivator-with-a-cultivation-system", null, 1, null, null), new TestUnit(TestUnitType.latest, null, null, 1, null, null), new TestUnit(TestUnitType.search, null, {"searchkey":"test"}, 1, null, null)]));
  }
});

Deno.test("API Parser - freewebnovel.com - chapters - /novel/dual-cultivator-with-a-cultivation-system - page 1", async () => {
  const parsedResponse = await parse("freewebnovel.com", new TestUnit(TestUnitType.chapters, "/novel/dual-cultivator-with-a-cultivation-system", null, 1, null, null));
  assertEquals(Array.isArray(parsedResponse.results), true, "Parsed response should be an array");
  assertEquals((parsedResponse.results as []).length > 0, true, "Parsed response array should not be empty");
  const resultTypeValidations = responseValidation.filter((resp) => resp.unit === 1);
  for (const validation of resultTypeValidations) {
    validate(validation, parsedResponse, new TestUnits("freewebnovel.com", [new TestUnit(TestUnitType.chapter, "/dual-cultivator-with-a-cultivation-system/chapter-1", null, 1, null, null), new TestUnit(TestUnitType.chapters, "/novel/dual-cultivator-with-a-cultivation-system", null, 1, null, null), new TestUnit(TestUnitType.details, "/novel/dual-cultivator-with-a-cultivation-system", null, 1, null, null), new TestUnit(TestUnitType.latest, null, null, 1, null, null), new TestUnit(TestUnitType.search, null, {"searchkey":"test"}, 1, null, null)]));
  }
});

Deno.test("API Parser - freewebnovel.com - details - /novel/dual-cultivator-with-a-cultivation-system - page 1", async () => {
  const parsedResponse = await parse("freewebnovel.com", new TestUnit(TestUnitType.details, "/novel/dual-cultivator-with-a-cultivation-system", null, 1, null, null));
  assertEquals(Array.isArray(parsedResponse.results), true, "Parsed response should be an array");
  assertEquals((parsedResponse.results as []).length > 0, true, "Parsed response array should not be empty");
  const resultTypeValidations = responseValidation.filter((resp) => resp.unit === 2);
  for (const validation of resultTypeValidations) {
    validate(validation, parsedResponse, new TestUnits("freewebnovel.com", [new TestUnit(TestUnitType.chapter, "/dual-cultivator-with-a-cultivation-system/chapter-1", null, 1, null, null), new TestUnit(TestUnitType.chapters, "/novel/dual-cultivator-with-a-cultivation-system", null, 1, null, null), new TestUnit(TestUnitType.details, "/novel/dual-cultivator-with-a-cultivation-system", null, 1, null, null), new TestUnit(TestUnitType.latest, null, null, 1, null, null), new TestUnit(TestUnitType.search, null, {"searchkey":"test"}, 1, null, null)]));
  }
});

Deno.test("API Parser - freewebnovel.com - latest - page 1", async () => {
  const parsedResponse = await parse("freewebnovel.com", new TestUnit(TestUnitType.latest, null, null, 1, null, null));
  assertEquals(Array.isArray(parsedResponse.results), true, "Parsed response should be an array");
  assertEquals((parsedResponse.results as []).length > 0, true, "Parsed response array should not be empty");
  const resultTypeValidations = responseValidation.filter((resp) => resp.unit === 3);
  for (const validation of resultTypeValidations) {
    validate(validation, parsedResponse, new TestUnits("freewebnovel.com", [new TestUnit(TestUnitType.chapter, "/dual-cultivator-with-a-cultivation-system/chapter-1", null, 1, null, null), new TestUnit(TestUnitType.chapters, "/novel/dual-cultivator-with-a-cultivation-system", null, 1, null, null), new TestUnit(TestUnitType.details, "/novel/dual-cultivator-with-a-cultivation-system", null, 1, null, null), new TestUnit(TestUnitType.latest, null, null, 1, null, null), new TestUnit(TestUnitType.search, null, {"searchkey":"test"}, 1, null, null)]));
  }
});

Deno.test("API Parser - freewebnovel.com - search - page 1", async () => {
  const parsedResponse = await parse("freewebnovel.com", new TestUnit(TestUnitType.search, null, {
  "searchkey": "test"
}, 1, null, null));
  assertEquals(Array.isArray(parsedResponse.results), true, "Parsed response should be an array");
  assertEquals((parsedResponse.results as []).length > 0, true, "Parsed response array should not be empty");
  const resultTypeValidations = responseValidation.filter((resp) => resp.unit === 4);
  for (const validation of resultTypeValidations) {
    validate(validation, parsedResponse, new TestUnits("freewebnovel.com", [new TestUnit(TestUnitType.chapter, "/dual-cultivator-with-a-cultivation-system/chapter-1", null, 1, null, null), new TestUnit(TestUnitType.chapters, "/novel/dual-cultivator-with-a-cultivation-system", null, 1, null, null), new TestUnit(TestUnitType.details, "/novel/dual-cultivator-with-a-cultivation-system", null, 1, null, null), new TestUnit(TestUnitType.latest, null, null, 1, null, null), new TestUnit(TestUnitType.search, null, {"searchkey":"test"}, 1, null, null)]));
  }
});

Deno.test("API Parser - novelbin.me - chapter - https://novelbin.com/b/beyond-chaos-a-dicerpg/0-alive-again - page 1", async () => {
  const parsedResponse = await parse("novelbin.me", new TestUnit(TestUnitType.chapter, "https://novelbin.com/b/beyond-chaos-a-dicerpg/0-alive-again", null, 1, null, null));
  assertEquals(Array.isArray(parsedResponse.results), true, "Parsed response should be an array");
  assertEquals((parsedResponse.results as []).length > 0, true, "Parsed response array should not be empty");
  const resultTypeValidations = responseValidation.filter((resp) => resp.unit === 0);
  for (const validation of resultTypeValidations) {
    validate(validation, parsedResponse, new TestUnits("novelbin.me", [new TestUnit(TestUnitType.chapter, "https://novelbin.com/b/beyond-chaos-a-dicerpg/0-alive-again", null, 1, null, null), new TestUnit(TestUnitType.chapters, null, null, 1, {"NovelId":"beyond-chaos-a-dicerpg"}, null), new TestUnit(TestUnitType.details, "https://novelbin.me/novel-book/beyond-chaos-a-dicerpg#tab-chapters-title", null, 1, null, null), new TestUnit(TestUnitType.latest, null, null, 1, null, null), new TestUnit(TestUnitType.search, null, null, 1, null, new URLSearchParams("keyword=test"))]));
  }
});

Deno.test("API Parser - novelbin.me - chapters - page 1", async () => {
  const parsedResponse = await parse("novelbin.me", new TestUnit(TestUnitType.chapters, "", null, 1, {
  "NovelId": "beyond-chaos-a-dicerpg"
}, null));
  assertEquals(Array.isArray(parsedResponse.results), true, "Parsed response should be an array");
  assertEquals((parsedResponse.results as []).length > 0, true, "Parsed response array should not be empty");
  const resultTypeValidations = responseValidation.filter((resp) => resp.unit === 1);
  for (const validation of resultTypeValidations) {
    validate(validation, parsedResponse, new TestUnits("novelbin.me", [new TestUnit(TestUnitType.chapter, "https://novelbin.com/b/beyond-chaos-a-dicerpg/0-alive-again", null, 1, null, null), new TestUnit(TestUnitType.chapters, null, null, 1, {"NovelId":"beyond-chaos-a-dicerpg"}, null), new TestUnit(TestUnitType.details, "https://novelbin.me/novel-book/beyond-chaos-a-dicerpg#tab-chapters-title", null, 1, null, null), new TestUnit(TestUnitType.latest, null, null, 1, null, null), new TestUnit(TestUnitType.search, null, null, 1, null, new URLSearchParams("keyword=test"))]));
  }
});

Deno.test("API Parser - novelbin.me - details - https://novelbin.me/novel-book/beyond-chaos-a-dicerpg#tab-chapters-title - page 1", async () => {
  const parsedResponse = await parse("novelbin.me", new TestUnit(TestUnitType.details, "https://novelbin.me/novel-book/beyond-chaos-a-dicerpg#tab-chapters-title", null, 1, null, null));
  assertEquals(Array.isArray(parsedResponse.results), true, "Parsed response should be an array");
  assertEquals((parsedResponse.results as []).length > 0, true, "Parsed response array should not be empty");
  const resultTypeValidations = responseValidation.filter((resp) => resp.unit === 2);
  for (const validation of resultTypeValidations) {
    validate(validation, parsedResponse, new TestUnits("novelbin.me", [new TestUnit(TestUnitType.chapter, "https://novelbin.com/b/beyond-chaos-a-dicerpg/0-alive-again", null, 1, null, null), new TestUnit(TestUnitType.chapters, null, null, 1, {"NovelId":"beyond-chaos-a-dicerpg"}, null), new TestUnit(TestUnitType.details, "https://novelbin.me/novel-book/beyond-chaos-a-dicerpg#tab-chapters-title", null, 1, null, null), new TestUnit(TestUnitType.latest, null, null, 1, null, null), new TestUnit(TestUnitType.search, null, null, 1, null, new URLSearchParams("keyword=test"))]));
  }
});

Deno.test("API Parser - novelbin.me - latest - page 1", async () => {
  const parsedResponse = await parse("novelbin.me", new TestUnit(TestUnitType.latest, null, null, 1, null, null));
  assertEquals(Array.isArray(parsedResponse.results), true, "Parsed response should be an array");
  assertEquals((parsedResponse.results as []).length > 0, true, "Parsed response array should not be empty");
  const resultTypeValidations = responseValidation.filter((resp) => resp.unit === 3);
  for (const validation of resultTypeValidations) {
    validate(validation, parsedResponse, new TestUnits("novelbin.me", [new TestUnit(TestUnitType.chapter, "https://novelbin.com/b/beyond-chaos-a-dicerpg/0-alive-again", null, 1, null, null), new TestUnit(TestUnitType.chapters, null, null, 1, {"NovelId":"beyond-chaos-a-dicerpg"}, null), new TestUnit(TestUnitType.details, "https://novelbin.me/novel-book/beyond-chaos-a-dicerpg#tab-chapters-title", null, 1, null, null), new TestUnit(TestUnitType.latest, null, null, 1, null, null), new TestUnit(TestUnitType.search, null, null, 1, null, new URLSearchParams("keyword=test"))]));
  }
});

Deno.test("API Parser - novelbin.me - search - page 1", async () => {
  const parsedResponse = await parse("novelbin.me", new TestUnit(TestUnitType.search, null, null, 1, null, new URLSearchParams("keyword=test")));
  assertEquals(Array.isArray(parsedResponse.results), true, "Parsed response should be an array");
  assertEquals((parsedResponse.results as []).length > 0, true, "Parsed response array should not be empty");
  const resultTypeValidations = responseValidation.filter((resp) => resp.unit === 4);
  for (const validation of resultTypeValidations) {
    validate(validation, parsedResponse, new TestUnits("novelbin.me", [new TestUnit(TestUnitType.chapter, "https://novelbin.com/b/beyond-chaos-a-dicerpg/0-alive-again", null, 1, null, null), new TestUnit(TestUnitType.chapters, null, null, 1, {"NovelId":"beyond-chaos-a-dicerpg"}, null), new TestUnit(TestUnitType.details, "https://novelbin.me/novel-book/beyond-chaos-a-dicerpg#tab-chapters-title", null, 1, null, null), new TestUnit(TestUnitType.latest, null, null, 1, null, null), new TestUnit(TestUnitType.search, null, null, 1, null, new URLSearchParams("keyword=test"))]));
  }
});

Deno.test("API Parser - novelbuddy.io - chapter - /void-evolution-system/chapter-1-earth - page 1", async () => {
  const parsedResponse = await parse("novelbuddy.io", new TestUnit(TestUnitType.chapter, "/void-evolution-system/chapter-1-earth", null, 1, null, null));
  assertEquals(Array.isArray(parsedResponse.results), true, "Parsed response should be an array");
  assertEquals((parsedResponse.results as []).length > 0, true, "Parsed response array should not be empty");
  const resultTypeValidations = responseValidation.filter((resp) => resp.unit === 0);
  for (const validation of resultTypeValidations) {
    validate(validation, parsedResponse, new TestUnits("novelbuddy.io", [new TestUnit(TestUnitType.chapter, "/void-evolution-system/chapter-1-earth", null, 1, null, null), new TestUnit(TestUnitType.chapters, null, null, 1, {"BookId":"M2z33G8A"}, null), new TestUnit(TestUnitType.details, "M2z33G8A", null, 1, null, null), new TestUnit(TestUnitType.latest, null, null, 1, null, null), new TestUnit(TestUnitType.search, null, null, 1, null, new URLSearchParams("q=test"))]));
  }
});

Deno.test("API Parser - novelbuddy.io - chapters - page 1", async () => {
  const parsedResponse = await parse("novelbuddy.io", new TestUnit(TestUnitType.chapters, "", null, 1, {
  "BookId": "M2z33G8A"
}, null));
  assertEquals(Array.isArray(parsedResponse.results), true, "Parsed response should be an array");
  assertEquals((parsedResponse.results as []).length > 0, true, "Parsed response array should not be empty");
  const resultTypeValidations = responseValidation.filter((resp) => resp.unit === 1);
  for (const validation of resultTypeValidations) {
    validate(validation, parsedResponse, new TestUnits("novelbuddy.io", [new TestUnit(TestUnitType.chapter, "/void-evolution-system/chapter-1-earth", null, 1, null, null), new TestUnit(TestUnitType.chapters, null, null, 1, {"BookId":"M2z33G8A"}, null), new TestUnit(TestUnitType.details, "M2z33G8A", null, 1, null, null), new TestUnit(TestUnitType.latest, null, null, 1, null, null), new TestUnit(TestUnitType.search, null, null, 1, null, new URLSearchParams("q=test"))]));
  }
});

Deno.test("API Parser - novelbuddy.io - details - M2z33G8A - page 1", async () => {
  const parsedResponse = await parse("novelbuddy.io", new TestUnit(TestUnitType.details, "M2z33G8A", null, 1, null, null));
  assertEquals(Array.isArray(parsedResponse.results), true, "Parsed response should be an array");
  assertEquals((parsedResponse.results as []).length > 0, true, "Parsed response array should not be empty");
  const resultTypeValidations = responseValidation.filter((resp) => resp.unit === 2);
  for (const validation of resultTypeValidations) {
    validate(validation, parsedResponse, new TestUnits("novelbuddy.io", [new TestUnit(TestUnitType.chapter, "/void-evolution-system/chapter-1-earth", null, 1, null, null), new TestUnit(TestUnitType.chapters, null, null, 1, {"BookId":"M2z33G8A"}, null), new TestUnit(TestUnitType.details, "M2z33G8A", null, 1, null, null), new TestUnit(TestUnitType.latest, null, null, 1, null, null), new TestUnit(TestUnitType.search, null, null, 1, null, new URLSearchParams("q=test"))]));
  }
});

Deno.test("API Parser - novelbuddy.io - latest - page 1", async () => {
  const parsedResponse = await parse("novelbuddy.io", new TestUnit(TestUnitType.latest, null, null, 1, null, null));
  assertEquals(Array.isArray(parsedResponse.results), true, "Parsed response should be an array");
  assertEquals((parsedResponse.results as []).length > 0, true, "Parsed response array should not be empty");
  const resultTypeValidations = responseValidation.filter((resp) => resp.unit === 3);
  for (const validation of resultTypeValidations) {
    validate(validation, parsedResponse, new TestUnits("novelbuddy.io", [new TestUnit(TestUnitType.chapter, "/void-evolution-system/chapter-1-earth", null, 1, null, null), new TestUnit(TestUnitType.chapters, null, null, 1, {"BookId":"M2z33G8A"}, null), new TestUnit(TestUnitType.details, "M2z33G8A", null, 1, null, null), new TestUnit(TestUnitType.latest, null, null, 1, null, null), new TestUnit(TestUnitType.search, null, null, 1, null, new URLSearchParams("q=test"))]));
  }
});

Deno.test("API Parser - novelbuddy.io - search - page 1", async () => {
  const parsedResponse = await parse("novelbuddy.io", new TestUnit(TestUnitType.search, null, null, 1, null, new URLSearchParams("q=test")));
  assertEquals(Array.isArray(parsedResponse.results), true, "Parsed response should be an array");
  assertEquals((parsedResponse.results as []).length > 0, true, "Parsed response array should not be empty");
  const resultTypeValidations = responseValidation.filter((resp) => resp.unit === 4);
  for (const validation of resultTypeValidations) {
    validate(validation, parsedResponse, new TestUnits("novelbuddy.io", [new TestUnit(TestUnitType.chapter, "/void-evolution-system/chapter-1-earth", null, 1, null, null), new TestUnit(TestUnitType.chapters, null, null, 1, {"BookId":"M2z33G8A"}, null), new TestUnit(TestUnitType.details, "M2z33G8A", null, 1, null, null), new TestUnit(TestUnitType.latest, null, null, 1, null, null), new TestUnit(TestUnitType.search, null, null, 1, null, new URLSearchParams("q=test"))]));
  }
});

Deno.test("API Parser - novgo.net - chapter - /i-became-the-villains-lost-daughter/chapter-1.html - page 1", async () => {
  const parsedResponse = await parse("novgo.net", new TestUnit(TestUnitType.chapter, "/i-became-the-villains-lost-daughter/chapter-1.html", null, 1, null, null));
  assertEquals(Array.isArray(parsedResponse.results), true, "Parsed response should be an array");
  assertEquals((parsedResponse.results as []).length > 0, true, "Parsed response array should not be empty");
  const resultTypeValidations = responseValidation.filter((resp) => resp.unit === 0);
  for (const validation of resultTypeValidations) {
    validate(validation, parsedResponse, new TestUnits("novgo.net", [new TestUnit(TestUnitType.chapter, "/i-became-the-villains-lost-daughter/chapter-1.html", null, 1, null, null), new TestUnit(TestUnitType.chapters, "/i-became-the-villains-lost-daughter.html", null, 1, null, null), new TestUnit(TestUnitType.details, "/i-became-the-villains-lost-daughter.html", null, 1, null, null), new TestUnit(TestUnitType.latest, null, null, 2, null, null), new TestUnit(TestUnitType.search, null, null, 1, null, new URLSearchParams("keyword=test"))]));
  }
});

Deno.test("API Parser - novgo.net - chapters - /i-became-the-villains-lost-daughter.html - page 1", async () => {
  const parsedResponse = await parse("novgo.net", new TestUnit(TestUnitType.chapters, "/i-became-the-villains-lost-daughter.html", null, 1, null, null));
  assertEquals(Array.isArray(parsedResponse.results), true, "Parsed response should be an array");
  assertEquals((parsedResponse.results as []).length > 0, true, "Parsed response array should not be empty");
  const resultTypeValidations = responseValidation.filter((resp) => resp.unit === 1);
  for (const validation of resultTypeValidations) {
    validate(validation, parsedResponse, new TestUnits("novgo.net", [new TestUnit(TestUnitType.chapter, "/i-became-the-villains-lost-daughter/chapter-1.html", null, 1, null, null), new TestUnit(TestUnitType.chapters, "/i-became-the-villains-lost-daughter.html", null, 1, null, null), new TestUnit(TestUnitType.details, "/i-became-the-villains-lost-daughter.html", null, 1, null, null), new TestUnit(TestUnitType.latest, null, null, 2, null, null), new TestUnit(TestUnitType.search, null, null, 1, null, new URLSearchParams("keyword=test"))]));
  }
});

Deno.test("API Parser - novgo.net - details - /i-became-the-villains-lost-daughter.html - page 1", async () => {
  const parsedResponse = await parse("novgo.net", new TestUnit(TestUnitType.details, "/i-became-the-villains-lost-daughter.html", null, 1, null, null));
  assertEquals(Array.isArray(parsedResponse.results), true, "Parsed response should be an array");
  assertEquals((parsedResponse.results as []).length > 0, true, "Parsed response array should not be empty");
  const resultTypeValidations = responseValidation.filter((resp) => resp.unit === 2);
  for (const validation of resultTypeValidations) {
    validate(validation, parsedResponse, new TestUnits("novgo.net", [new TestUnit(TestUnitType.chapter, "/i-became-the-villains-lost-daughter/chapter-1.html", null, 1, null, null), new TestUnit(TestUnitType.chapters, "/i-became-the-villains-lost-daughter.html", null, 1, null, null), new TestUnit(TestUnitType.details, "/i-became-the-villains-lost-daughter.html", null, 1, null, null), new TestUnit(TestUnitType.latest, null, null, 2, null, null), new TestUnit(TestUnitType.search, null, null, 1, null, new URLSearchParams("keyword=test"))]));
  }
});

Deno.test("API Parser - novgo.net - latest - page 2", async () => {
  const parsedResponse = await parse("novgo.net", new TestUnit(TestUnitType.latest, null, null, 2, null, null));
  assertEquals(Array.isArray(parsedResponse.results), true, "Parsed response should be an array");
  assertEquals((parsedResponse.results as []).length > 0, true, "Parsed response array should not be empty");
  const resultTypeValidations = responseValidation.filter((resp) => resp.unit === 3);
  for (const validation of resultTypeValidations) {
    validate(validation, parsedResponse, new TestUnits("novgo.net", [new TestUnit(TestUnitType.chapter, "/i-became-the-villains-lost-daughter/chapter-1.html", null, 1, null, null), new TestUnit(TestUnitType.chapters, "/i-became-the-villains-lost-daughter.html", null, 1, null, null), new TestUnit(TestUnitType.details, "/i-became-the-villains-lost-daughter.html", null, 1, null, null), new TestUnit(TestUnitType.latest, null, null, 2, null, null), new TestUnit(TestUnitType.search, null, null, 1, null, new URLSearchParams("keyword=test"))]));
  }
});

Deno.test("API Parser - novgo.net - search - page 1", async () => {
  const parsedResponse = await parse("novgo.net", new TestUnit(TestUnitType.search, null, null, 1, null, new URLSearchParams("keyword=test")));
  assertEquals(Array.isArray(parsedResponse.results), true, "Parsed response should be an array");
  assertEquals((parsedResponse.results as []).length > 0, true, "Parsed response array should not be empty");
  const resultTypeValidations = responseValidation.filter((resp) => resp.unit === 4);
  for (const validation of resultTypeValidations) {
    validate(validation, parsedResponse, new TestUnits("novgo.net", [new TestUnit(TestUnitType.chapter, "/i-became-the-villains-lost-daughter/chapter-1.html", null, 1, null, null), new TestUnit(TestUnitType.chapters, "/i-became-the-villains-lost-daughter.html", null, 1, null, null), new TestUnit(TestUnitType.details, "/i-became-the-villains-lost-daughter.html", null, 1, null, null), new TestUnit(TestUnitType.latest, null, null, 2, null, null), new TestUnit(TestUnitType.search, null, null, 1, null, new URLSearchParams("keyword=test"))]));
  }
});

Deno.test("API Parser - royalroad.com - chapter - /fiction/141420/aberration-earth/chapter/2792874/chapter-1-mereque-11 - page 1", async () => {
  const parsedResponse = await parse("royalroad.com", new TestUnit(TestUnitType.chapter, "/fiction/141420/aberration-earth/chapter/2792874/chapter-1-mereque-11", null, 1, null, null));
  assertEquals(Array.isArray(parsedResponse.results), true, "Parsed response should be an array");
  assertEquals((parsedResponse.results as []).length > 0, true, "Parsed response array should not be empty");
  const resultTypeValidations = responseValidation.filter((resp) => resp.unit === 0);
  for (const validation of resultTypeValidations) {
    validate(validation, parsedResponse, new TestUnits("royalroad.com", [new TestUnit(TestUnitType.chapter, "/fiction/141420/aberration-earth/chapter/2792874/chapter-1-mereque-11", null, 1, null, null), new TestUnit(TestUnitType.chapters, "/fiction/141420/aberration-earth", null, 1, null, null), new TestUnit(TestUnitType.details, "/fiction/141420/aberration-earth", null, 1, null, null), new TestUnit(TestUnitType.latest, null, null, 1, null, null), new TestUnit(TestUnitType.search, null, null, 1, null, new URLSearchParams("keyword=test"))]));
  }
});

Deno.test("API Parser - royalroad.com - chapters - /fiction/141420/aberration-earth - page 1", async () => {
  const parsedResponse = await parse("royalroad.com", new TestUnit(TestUnitType.chapters, "/fiction/141420/aberration-earth", null, 1, null, null));
  assertEquals(Array.isArray(parsedResponse.results), true, "Parsed response should be an array");
  assertEquals((parsedResponse.results as []).length > 0, true, "Parsed response array should not be empty");
  const resultTypeValidations = responseValidation.filter((resp) => resp.unit === 1);
  for (const validation of resultTypeValidations) {
    validate(validation, parsedResponse, new TestUnits("royalroad.com", [new TestUnit(TestUnitType.chapter, "/fiction/141420/aberration-earth/chapter/2792874/chapter-1-mereque-11", null, 1, null, null), new TestUnit(TestUnitType.chapters, "/fiction/141420/aberration-earth", null, 1, null, null), new TestUnit(TestUnitType.details, "/fiction/141420/aberration-earth", null, 1, null, null), new TestUnit(TestUnitType.latest, null, null, 1, null, null), new TestUnit(TestUnitType.search, null, null, 1, null, new URLSearchParams("keyword=test"))]));
  }
});

Deno.test("API Parser - royalroad.com - details - /fiction/141420/aberration-earth - page 1", async () => {
  const parsedResponse = await parse("royalroad.com", new TestUnit(TestUnitType.details, "/fiction/141420/aberration-earth", null, 1, null, null));
  assertEquals(Array.isArray(parsedResponse.results), true, "Parsed response should be an array");
  assertEquals((parsedResponse.results as []).length > 0, true, "Parsed response array should not be empty");
  const resultTypeValidations = responseValidation.filter((resp) => resp.unit === 2);
  for (const validation of resultTypeValidations) {
    validate(validation, parsedResponse, new TestUnits("royalroad.com", [new TestUnit(TestUnitType.chapter, "/fiction/141420/aberration-earth/chapter/2792874/chapter-1-mereque-11", null, 1, null, null), new TestUnit(TestUnitType.chapters, "/fiction/141420/aberration-earth", null, 1, null, null), new TestUnit(TestUnitType.details, "/fiction/141420/aberration-earth", null, 1, null, null), new TestUnit(TestUnitType.latest, null, null, 1, null, null), new TestUnit(TestUnitType.search, null, null, 1, null, new URLSearchParams("keyword=test"))]));
  }
});

Deno.test("API Parser - royalroad.com - latest - page 1", async () => {
  const parsedResponse = await parse("royalroad.com", new TestUnit(TestUnitType.latest, null, null, 1, null, null));
  assertEquals(Array.isArray(parsedResponse.results), true, "Parsed response should be an array");
  assertEquals((parsedResponse.results as []).length > 0, true, "Parsed response array should not be empty");
  const resultTypeValidations = responseValidation.filter((resp) => resp.unit === 3);
  for (const validation of resultTypeValidations) {
    validate(validation, parsedResponse, new TestUnits("royalroad.com", [new TestUnit(TestUnitType.chapter, "/fiction/141420/aberration-earth/chapter/2792874/chapter-1-mereque-11", null, 1, null, null), new TestUnit(TestUnitType.chapters, "/fiction/141420/aberration-earth", null, 1, null, null), new TestUnit(TestUnitType.details, "/fiction/141420/aberration-earth", null, 1, null, null), new TestUnit(TestUnitType.latest, null, null, 1, null, null), new TestUnit(TestUnitType.search, null, null, 1, null, new URLSearchParams("keyword=test"))]));
  }
});

Deno.test("API Parser - royalroad.com - search - page 1", async () => {
  const parsedResponse = await parse("royalroad.com", new TestUnit(TestUnitType.search, null, null, 1, null, new URLSearchParams("keyword=test")));
  assertEquals(Array.isArray(parsedResponse.results), true, "Parsed response should be an array");
  assertEquals((parsedResponse.results as []).length > 0, true, "Parsed response array should not be empty");
  const resultTypeValidations = responseValidation.filter((resp) => resp.unit === 4);
  for (const validation of resultTypeValidations) {
    validate(validation, parsedResponse, new TestUnits("royalroad.com", [new TestUnit(TestUnitType.chapter, "/fiction/141420/aberration-earth/chapter/2792874/chapter-1-mereque-11", null, 1, null, null), new TestUnit(TestUnitType.chapters, "/fiction/141420/aberration-earth", null, 1, null, null), new TestUnit(TestUnitType.details, "/fiction/141420/aberration-earth", null, 1, null, null), new TestUnit(TestUnitType.latest, null, null, 1, null, null), new TestUnit(TestUnitType.search, null, null, 1, null, new URLSearchParams("keyword=test"))]));
  }
});

