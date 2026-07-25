import { DOMParser } from "https://deno.land/x/web_scraper_api@v1.0.13/deps.ts";
import { Chapter, ChapterUrlPagination } from "../../models/Chapter.ts";
import { ChapterListItem, Chapters } from "../../models/Chapters.ts";
import { Details } from "../../models/Details.ts";
import { ParserBase } from "../../models/iParser.ts";
import { SearchResult } from "../../models/SearchResult.ts";
import { SearchResults } from "../../models/SearchResults.ts";
import { FilterType, SourceFilterField } from "../../models/source_filter.ts";
export class Main extends ParserBase {
  source: string = "freewebnovel.com";

  filters: SourceFilterField[] = [
    new SourceFilterField({ type: FilterType.Main(), fieldName: "Keyword", fieldVar: "searchkey", isParameter: true }),
  ];

  async search(query: string, page?: number): Promise<SearchResults> {
    const res = await fetch(`https://freewebnovel.com/search?keyword=${query}&page=${page || 1}`);

    if (!res.ok) {
      throw new Error(`Failed to search novels: ${res.statusText}`);
    }

    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const novelResults = doc.querySelectorAll(".con");

    const searchResults: SearchResult[] = [];

    for (const novel of novelResults) {
      const titleElement = novel.querySelector(".tit a");
      const coverElement = novel.querySelector(".pic>a>picture>img");
      const genresElements = novel.querySelectorAll(".txt>.desc>.item>.right>a");
      const chapterCountElement = novel.querySelector(".s1");
      let coverUrl = coverElement?.getAttribute("src") || "";
      if (coverUrl.startsWith("/files")) {
        coverUrl = "https://freewebnovel.com" + coverUrl;
      }

      let chapterCount = null;
      const chRegex = "^(\\d+)";
      if (chapterCountElement) {
        const match = chapterCountElement.textContent?.trim().match(chRegex);
        if (match && match[1]) {
          chapterCount = this.parseInteger(match[1]);
        }
      }

      const genres = [];

      for (const genreElement of genresElements) {
        if (genres.length > 1) {
          continue;
        }
        genres.push(genreElement.textContent?.trim() || "");
      }

      const title = titleElement?.textContent?.trim();
      const url = titleElement?.getAttribute("href");

      if (!title || !url) {
        continue;
      }

      const searchResult = new SearchResult(url, title, "", coverUrl, genres, chapterCount, this.source);
      searchResults.push(searchResult);
    }

    const currentPageElement = doc.querySelector(".pages>ul>li>strong");
    let currentPage = 1;
    if (currentPageElement) {
      currentPage = this.parseInteger(currentPageElement.textContent?.trim(), 1);
    }

    const lastPageElement = doc.querySelector(".pages>ul>li>a");
    let lastPage = 1;
    if (lastPageElement) {
      lastPage = this.parseInteger(lastPageElement.textContent?.trim(), 1);
    }

    return new SearchResults(searchResults, currentPage, lastPage);
  }

  async getLatest(page?: number): Promise<SearchResults> {
    const res = await fetch(`https://freewebnovel.com/sort/latest-release/${page}`);

    if (!res.ok) {
      throw new Error(`Failed to search novels: ${res.statusText}`);
    }

    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const novelResults = doc.querySelectorAll(".con");

    const searchResults: SearchResult[] = [];

    for (const novel of novelResults) {
      const titleElement = novel.querySelector(".tit a");
      const coverElement = novel.querySelector(".pic>a>picture>img");
      const genresElements = novel.querySelectorAll(".txt>.desc>.item>.right>a");
      const chapterCountElement = novel.querySelector(".s1");
      let coverUrl = coverElement?.getAttribute("src") || "";
      if (coverUrl.startsWith("/files")) {
        coverUrl = "https://freewebnovel.com" + coverUrl;
      }

      let chapterCount = null;
      const chRegex = "^(\\d+)";
      if (chapterCountElement) {
        const match = chapterCountElement.textContent?.trim().match(chRegex);
        if (match && match[1]) {
          chapterCount = this.parseInteger(match[1]);
        }
      }

      const genres = [];

      for (const genreElement of genresElements) {
        if (genres.length > 1) {
          continue;
        }
        genres.push(genreElement.textContent?.trim() || "");
      }

      const title = titleElement?.textContent?.trim();
      const url = titleElement?.getAttribute("href");

      if (!title || !url) {
        continue;
      }

      const searchResult = new SearchResult(url, title, "", coverUrl, genres, chapterCount, this.source);
      searchResults.push(searchResult);
    }

    const currentPageElement = doc.querySelector(".pages>ul>li>strong");
    let currentPage = 1;
    if (currentPageElement) {
      currentPage = this.parseInteger(currentPageElement.textContent?.trim(), 1);
    }

    const lastPageElement = doc.querySelector(".pages>ul>li>a");
    let lastPage = 1;
    if (lastPageElement) {
      lastPage = this.parseInteger(lastPageElement.textContent?.trim(), 1);
    }

    return new SearchResults(searchResults, currentPage, lastPage);
  }

  async getNovel(url: string, additionalProps?: Record<string, string>): Promise<Details | null> {
    const res = await fetch(`https://freewebnovel.com${url}`).catch((err) => {
      console.error(`Failed to fetch novel details for ${url}:`, err);
      return null;
    });

    if (!res?.ok) {
      return null;
    }

    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const urlElements = doc.querySelectorAll(".cur.cur-1>.wp>a");
    const pageUrl = urlElements && urlElements.length > 0 ? urlElements[urlElements.length - 1]?.getAttribute("href") || "" : "";

    const coverElement = doc.querySelector(".m-imgtxt>.pic>picture>img");
    let coverUrl = coverElement?.getAttribute("src") || "";
    if (coverUrl.startsWith("/files")) {
      coverUrl = "https://freewebnovel.com" + coverUrl;
    }

    const title = urlElements && urlElements.length > 0 ? urlElements[urlElements.length - 1]?.textContent?.trim() : undefined;

    if (!title || !pageUrl) {
      return null;
    }

    const summaryElement = doc.querySelectorAll(".m-desc>.txt>.inner>p");

    const summaryArr = [];

    for (const p of summaryElement) {
      const text = p.textContent?.trim() || "";
      if (text != "") {
        summaryArr.push(text);
      }
    }

    const summary = summaryArr.join("\n");

    const authorElement = doc.querySelector('span[title="Author"] + div > a');
    const author = authorElement?.textContent?.trim() || "";

    const statusElement = doc.querySelector('span[title="Status"] + div > span> a');
    const status = statusElement?.textContent?.trim() || "";
    const genresElements = doc.querySelectorAll('span[title="Genre"] + div > a');
    const genres = [];

    for (const genreElement of genresElements) {
      const genre = genreElement.textContent?.trim() || "";
      if (genre != "") {
        genres.push(genre);
      }
    }

    const lastUpdateElement = doc.querySelector(".lastupdate");
    const regEx = "Updated\\s+([^\\]]+)";
    let lastUpdated = "";
    if (lastUpdateElement) {
      const match = lastUpdateElement.textContent?.trim().match(regEx);
      if (match && match[1]) {
        lastUpdated = match[1].trim();
      }
    }

    const detail: Details = new Details(
      this.source,
      title,
      summary,
      [],
      author,
      status,
      genres,
      "",
      lastUpdated,
      {},
      [],
      coverUrl,
      pageUrl,
      `https://freewebnovel.com${url}`,
    );

    return detail;
  }
  async getChapters(url: string, page?: number, additionalProps?: Record<string, string>): Promise<Chapters> {
    const res = await fetch(
      `https://freewebnovel.com${url}?ajax=chapters&page=${page || 1}&pageSize=100${this.parseAdditionalProps(additionalProps)}`,
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch chapter list: ${res.statusText}`);
    }

    const json = await res.json();
    const html = json.html || "";
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const chapters = doc.querySelectorAll("li");

    const chapterList: ChapterListItem[] = [];

    for (const chapter of chapters) {
      const titleElement = chapter.querySelector("a");
      const indexRegex = "chapter-(\\d+)";

      const cUrl = titleElement?.getAttribute("href");
      const title = titleElement?.getAttribute("title");
      if (!cUrl || !title) {
        continue;
      }
      const indexMatch = cUrl.match(indexRegex);
      let index = 0;
      if (indexMatch && indexMatch[1]) {
        index = this.parseInteger(indexMatch[1]);
      }

      const chapterMeta = new ChapterListItem(this.source, cUrl, index, title, "", url);
      chapterList.push(chapterMeta);
    }

    return new Chapters(chapterList, json.page || 1, json.totalPage || 1);
  }

  async getChapter(url: string, additionalProps?: Record<string, string>): Promise<Chapter> {
    const res = await fetch(`https://freewebnovel.com${url}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch chapter: ${res.statusText}`);
    }

    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const novelTitleElement = doc.querySelector(".tit>a");
    const novelTitle = novelTitleElement?.getAttribute("title") || "";
    const novelUrl = novelTitleElement?.getAttribute("href") || "";

    const titleElement = doc.querySelector(".chapter");
    const title = titleElement?.textContent?.trim() || "";

    const contentElements = doc.querySelectorAll("#article>p");

    const contentArr = [];

    for (const contentElement of contentElements) {
      const content = contentElement.textContent?.trim() || "";
      if (content != "") {
        contentArr.push(content);
      }
    }

    const content = contentArr.join("\n\n");

    const previousPageElement = doc.querySelector("#prev_url");
    let prevUrl = previousPageElement?.getAttribute("href") || undefined;
    if (prevUrl != undefined && prevUrl.split("/").length - 1 < 3) {
      prevUrl = undefined;
    }

    const nextPageElement = doc.querySelector("#next_url");
    let nextUrl = nextPageElement?.getAttribute("href") || undefined;
    if (nextUrl != undefined && nextUrl.split("/").length - 1 < 3) {
      nextUrl = undefined;
    }

    const nextPage = nextUrl ? new ChapterUrlPagination(nextUrl) : undefined;
    const prevPage = prevUrl ? new ChapterUrlPagination(prevUrl) : undefined;

    return new Chapter(
      this.source,
      novelTitle,
      novelUrl,
      title,
      content,
      prevPage,
      nextPage,
      url,
      `https://freewebnovel.com${url}`,
    );
  }
}
