import { responseTypes } from "./models/response-types.ts";
import { TestUnit, TestUnitType } from "./models/test-unit.ts";
import { TestUnits } from "./models/test-units.ts";

export const tests: TestUnits[] = [
  new TestUnits("freewebnovel.com", [
    new TestUnit(TestUnitType.chapter, "/dual-cultivator-with-a-cultivation-system/chapter-1", null, 1, null),
    new TestUnit(TestUnitType.chapters, "/novel/dual-cultivator-with-a-cultivation-system", null, 1, null),
    new TestUnit(TestUnitType.details, "/novel/dual-cultivator-with-a-cultivation-system", null, 1, null),
    new TestUnit(TestUnitType.latest, null, null, 1, null),
    new TestUnit(TestUnitType.search, null, { searchkey: "test" }, 1, null),
  ]),

  new TestUnits("novelbin.me", [
    new TestUnit(TestUnitType.chapter, "https://novelbin.com/b/beyond-chaos-a-dicerpg/0-alive-again", null, 1, null),
    new TestUnit(TestUnitType.chapters, "", null, 1, { NovelId: "beyond-chaos-a-dicerpg" }),
    new TestUnit(TestUnitType.details, "https://novelbin.me/novel-book/beyond-chaos-a-dicerpg#tab-chapters-title", null, 1, null),
    new TestUnit(TestUnitType.latest, null, null, 1, null),
    new TestUnit(TestUnitType.search, null, null, 1, null, new URLSearchParams("keyword=test")),
  ]),
  new TestUnits("novelbuddy.io", [
    new TestUnit(TestUnitType.chapter, "/novel/void-evolution-system/chapter-1", null, 1, null),
    new TestUnit(TestUnitType.chapters, "", null, 1, { BookId: "3988" }),
    new TestUnit(TestUnitType.details, "/novel/void-evolution-system", null, 1, null),
    new TestUnit(TestUnitType.latest, null, null, 1, null),
    new TestUnit(TestUnitType.search, null, null, 1, null, new URLSearchParams("q=test")),
  ]),
  new TestUnits("novgo.net", [
    new TestUnit(TestUnitType.chapter, "/i-became-the-villains-lost-daughter/chapter-1.html", null, 1, null),
    new TestUnit(TestUnitType.chapters, "/i-became-the-villains-lost-daughter.html", null, 1, null),
    new TestUnit(TestUnitType.details, "/i-became-the-villains-lost-daughter.html", null, 1, null),
    new TestUnit(TestUnitType.latest, null, null, 2, null),
    new TestUnit(TestUnitType.search, null, null, 1, null, new URLSearchParams("keyword=test")),
  ]),
  new TestUnits("royalroad.com", [
    new TestUnit(TestUnitType.chapter, "/fiction/141420/aberration-earth/chapter/2792874/chapter-1-mereque-11", null, 1, null),
    new TestUnit(TestUnitType.chapters, "/fiction/141420/aberration-earth", null, 1, null),
    new TestUnit(TestUnitType.details, "/fiction/141420/aberration-earth", null, 1, null),
    new TestUnit(TestUnitType.latest, null, null, 1, null),
    new TestUnit(TestUnitType.search, null, null, 1, null, new URLSearchParams("keyword=test")),
  ]),
];

export const responseValidation: responseTypes[] = [
  new responseTypes("url", ["string"], TestUnitType.chapter),
  new responseTypes("results", ["object"], TestUnitType.chapter, [
    new responseTypes("novelTitle", ["string"], TestUnitType.chapter),
    new responseTypes("novelUrl", ["string"], TestUnitType.chapter),
    new responseTypes("title", ["string"], TestUnitType.chapter),
    new responseTypes("content", ["object"], TestUnitType.chapter, [new responseTypes("", ["string"], TestUnitType.chapter)]),
    new responseTypes("previousPage", ["string"], TestUnitType.chapter, [], true),
    new responseTypes("nextPage", ["string"], TestUnitType.chapter, [], true),
    new responseTypes("url", ["string"], TestUnitType.chapter),
  ]),

  ////////////////////
  new responseTypes("url", ["string"], TestUnitType.chapters),
  new responseTypes("results", ["object"], TestUnitType.chapters, [
    new responseTypes("chapters", ["object"], TestUnitType.chapters, [
      new responseTypes("url", ["string"], TestUnitType.chapters),
      new responseTypes("index", ["number", "string"], TestUnitType.chapters), // to fix, this needs to be a number
      new responseTypes("title", ["string"], TestUnitType.chapters),
      new responseTypes("date", ["string"], TestUnitType.chapters, [], true),
    ]),
    new responseTypes("curentPage", ["number"], TestUnitType.chapters, [], true),
    new responseTypes("lastPage", ["string", "number"], TestUnitType.chapters, [], true), // to fix, this needs to be a number
  ]),

  ///////////////////
  new responseTypes("url", ["string"], TestUnitType.details),
  new responseTypes("results", ["object"], TestUnitType.details, [
    new responseTypes("url", ["string"], TestUnitType.details, [], true),
    new responseTypes("cover", ["string"], TestUnitType.details),
    new responseTypes("title", ["string"], TestUnitType.details),
    new responseTypes("summary", ["object"], TestUnitType.details, [new responseTypes("", ["string"], TestUnitType.details)]),
    new responseTypes("tags", ["object"], TestUnitType.details, [new responseTypes("", ["string"], TestUnitType.details)], true),
    new responseTypes("author", ["string"], TestUnitType.details),
    new responseTypes("status", ["string"], TestUnitType.details),
    new responseTypes(
      "genres",
      ["object"],
      TestUnitType.details,
      [new responseTypes("", ["string"], TestUnitType.details)],
      true,
    ),
    new responseTypes(
      "chapters",
      ["number"],
      TestUnitType.details,
      [new responseTypes("", ["string"], TestUnitType.details)],
      true,
    ),
    new responseTypes("lastUpdate", ["string"], TestUnitType.details, [], true),
  ]),

  //////////////////
  new responseTypes("url", ["string"], TestUnitType.latest),
  new responseTypes("results", ["object"], TestUnitType.latest, [
    new responseTypes("results", ["object"], TestUnitType.latest, [
      new responseTypes("url", ["string"], TestUnitType.latest),
      new responseTypes("title", ["string"], TestUnitType.latest),
      new responseTypes(
        "summary",
        ["object"],
        TestUnitType.latest,
        [new responseTypes("", ["string"], TestUnitType.latest)],
        true,
      ),
      new responseTypes("cover", ["string"], TestUnitType.latest),
      new responseTypes(
        "genres",
        ["object"],
        TestUnitType.latest,
        [new responseTypes("", ["string"], TestUnitType.latest)],
        true,
      ),
    ]),
    new responseTypes("curentPage", ["number"], TestUnitType.latest, [], true),
    new responseTypes("lastPage", ["number"], TestUnitType.latest, [], true),
  ]),

  //////////////////
  new responseTypes("url", ["string"], TestUnitType.search),
  new responseTypes("results", ["object"], TestUnitType.search, [
    new responseTypes("results", ["object"], TestUnitType.search, [
      new responseTypes("url", ["string"], TestUnitType.search),
      new responseTypes("title", ["string"], TestUnitType.search),
      new responseTypes(
        "summary",
        ["object"],
        TestUnitType.search,
        [new responseTypes("", ["string"], TestUnitType.search)],
        true,
      ),
      new responseTypes("cover", ["string"], TestUnitType.search),
      new responseTypes(
        "genres",
        ["object"],
        TestUnitType.search,
        [new responseTypes("", ["string"], TestUnitType.search)],
        true,
      ),
      new responseTypes("chapterCount", ["number"], TestUnitType.search, [], true),
    ]),
    new responseTypes("curentPage", ["number"], TestUnitType.latest, [], true),
    new responseTypes("lastPage", ["number"], TestUnitType.latest, [], true),
  ]),
];
