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
