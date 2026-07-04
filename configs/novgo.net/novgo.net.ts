import { DOMParser } from "https://deno.land/x/web_scraper_api@v1.0.13/deps.ts";
import { Chapter, ChapterUrlPagination } from "../../models/Chapter.ts";
import { ChapterListItem, Chapters } from "../../models/Chapters.ts";
import { Details } from "../../models/Details.ts";
import { ParserBase } from "../../models/iParser.ts";
import { SearchResult } from "../../models/SearchResult.ts";
import { SearchResults } from "../../models/SearchResults.ts";
import { FilterType, SourceFilterField } from "../../models/source_filter.ts";

export class Main extends ParserBase {
  source: string = "novgo.net";

  filters: SourceFilterField[] = [
    new SourceFilterField({ type: FilterType.Main(), fieldName: "Keyword", fieldVar: "keyword", isParameter: true }),
  ];

  async search(query: string, page?: number): Promise<SearchResults> {
    const res = await fetch(`https://novgo.net/search?page=${page || 1}&keyword=${encodeURIComponent(query)}`);

    if (!res.ok) {
      throw new Error(`Failed to search novels: ${res.statusText}`);
    }
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const novelResults = doc.querySelectorAll(".row");

    const searchResults: SearchResult[] = [];

    for (const novel of novelResults) {
      const titleElement = novel.querySelector(".truyen-title>a");
      const coverElement = novel.querySelector("img");

      let coverUrl = coverElement?.getAttribute("src") || "";
      if (coverUrl.startsWith("/")) {
        coverUrl = "https://novgo.net" + coverUrl;
      }

      const genres: string[] = [];

      const title = titleElement?.textContent?.trim();
      const url = titleElement?.getAttribute("href");

      if (!title || !url) {
        continue;
      }

      const searchResult = new SearchResult(url, title, "", coverUrl, genres, 0, this.source);
      searchResults.push(searchResult);
    }

    const currentPageElement = doc.querySelector(".pagination.pagination-sm>.active>a");
    let currentPage = 1;
    if (currentPageElement) {
      currentPage = this.parseInteger(currentPageElement.getAttribute("data-page"), 0) + 1;
    }

    const lastPageElement = doc.querySelector(".pagination.pagination-sm>.last>a");
    let lastPage = 1;
    if (lastPageElement) {
      lastPage = this.parseInteger(lastPageElement.getAttribute("data-page"), 0) + 1;
    }

    return new SearchResults(searchResults, currentPage, lastPage);
  }

  async getLatest(page?: number): Promise<SearchResults> {
    const res = await fetch(`https://novgo.net/latest-release-novel?page=${page || 1}`);

    if (!res.ok) {
      throw new Error(`Failed to search novels: ${res.statusText}`);
    }
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const novelResults = doc.querySelectorAll(".row");

    const searchResults: SearchResult[] = [];

    for (const novel of novelResults) {
      const titleElement = novel.querySelector(".truyen-title>a");
      const coverElement = novel.querySelector("img");

      let coverUrl = coverElement?.getAttribute("src") || "";
      if (coverUrl.startsWith("/")) {
        coverUrl = "https://novgo.net" + coverUrl;
      }

      const genres: string[] = [];

      const title = titleElement?.textContent?.trim();
      const url = titleElement?.getAttribute("href");

      if (!title || !url) {
        continue;
      }

      const searchResult = new SearchResult(url, title, "", coverUrl, genres, 0, this.source);
      searchResults.push(searchResult);
    }

    const currentPageElement = doc.querySelector(".pagination.pagination-sm>.active>a");
    let currentPage = 1;
    if (currentPageElement) {
      currentPage = this.parseInteger(currentPageElement.getAttribute("data-page"), 0) + 1;
    }

    const lastPageElement = doc.querySelector(".pagination.pagination-sm>.last>a");
    let lastPage = 1;
    if (lastPageElement) {
      lastPage = this.parseInteger(lastPageElement.getAttribute("data-page"), 0) + 1;
    }

    return new SearchResults(searchResults, currentPage, lastPage);
  }

  async getNovel(url: string, additionalProps?: Record<string, string>): Promise<Details | null> {
    const res = await fetch(`https://novgo.net${url}`).catch((err) => {
      console.error(`Failed to fetch novel details for ${url}:`, err);
      return null;
    });

    if (!res?.ok) {
      return null;
    }

    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const urlElement = doc.querySelector(".pagination>li.active>a");
    const pageUrl = urlElement ? urlElement.getAttribute("href") || "" : "";

    const coverElement = doc.querySelector(".books>.book>img");
    let coverUrl = coverElement?.getAttribute("src") || "";
    if (coverUrl.startsWith("/uploads")) {
      coverUrl = "https://novgo.net" + coverUrl;
    }

    const titleElement = doc.querySelectorAll(".title");

    const title = titleElement && titleElement.length > 0 ? titleElement[0]?.textContent?.trim() : undefined;

    if (!title || !pageUrl) {
      return null;
    }

    const summaryElement = doc.querySelectorAll(".desc-text>p");

    const summaryArr = [];

    for (const p of summaryElement) {
      const text = p.textContent?.trim() || "";
      if (text != "") {
        summaryArr.push(this.cleanText(text));
      }
    }

    const summary = summaryArr.join("\n");

    const authorElements = doc.querySelectorAll(".info>div>a");
    const author = authorElements && authorElements.length > 0 ? authorElements[0]?.textContent?.trim() : "";

    const statusElements = doc.querySelectorAll(".info>div");
    const statusText = statusElements && statusElements.length >= 4 ? statusElements[3]?.textContent?.trim() : undefined;

    const statusRegex = "Status:\\s*([^<]+)";

    let status = "";
    if (statusText) {
      const match = statusText.match(statusRegex);
      if (match && match[match.length - 1]) {
        status = match[match.length - 1].trim();
      }
    }

    const genresElements = doc.querySelectorAll(".info>div");
    const genreElement = genresElements && genresElements.length >= 2 ? genresElements[1] : undefined;
    const genres = [];

    const genreText = genreElement?.textContent?.trim() || "";
    const genreRegex = /Genres:\s*(.*)/;
    const genreMatch = genreText.match(genreRegex);
    if (genreMatch && genreMatch[1]) {
      genres.push(...genreMatch[1].split(",").map((g) => g.trim()));
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
      "",
      {},
      [],
      coverUrl,
      pageUrl,
      `https://novgo.net${url}`,
    );

    return detail;
  }

  async getChapters(url: string, page?: number, additionalProps?: Record<string, string>): Promise<Chapters> {
    const res = await fetch(`https://novgo.net${url}?page=${page}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch chapter list: ${res.statusText}`);
    }

    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const chapters = doc.querySelectorAll("ul.list-chapter>li");

    const chapterList: ChapterListItem[] = [];

    for (const chapter of chapters) {
      const titleElement = chapter.querySelector("a");

      const indexRegex = "(?:Chapter\\s+)?(\\d+)";

      const cUrl = titleElement?.getAttribute("href");
      const title = titleElement?.getAttribute("title");
      if (!cUrl || !title) {
        continue;
      }
      const indexMatch = title.match(indexRegex);
      let index = 0;
      if (indexMatch && indexMatch[1]) {
        index = this.parseInteger(indexMatch[1]);
      }

      const chapterMeta = new ChapterListItem(this.source, cUrl, index, title, "", url);
      chapterList.push(chapterMeta);
    }

    const currentPageElement = doc.querySelector(".pagination>li.active>a");
    const currentPage = currentPageElement ? this.parseInteger(currentPageElement.getAttribute("data-page"), 0) + 1 : 1;
    const lastPageElement = doc.querySelector(".last>a");
    const lastPage = lastPageElement ? this.parseInteger(lastPageElement.getAttribute("data-page"), 0) + 1 : 1;

    return new Chapters(chapterList, currentPage, lastPage);
  }

  async getChapter(url: string, additionalProps?: Record<string, string>): Promise<Chapter> {
    const res = await fetch(`https://novgo.net${url}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch chapter: ${res.statusText}`);
    }

    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const novelTitleElement = doc.querySelector(".truyen-title");
    const novelTitle = novelTitleElement?.getAttribute("title") || "";
    const novelUrl = novelTitleElement?.getAttribute("href") || "";

    const titleElement = doc.querySelector(".chapter-title");
    const title = titleElement?.getAttribute("title") || "";

    const contentElements = doc.querySelectorAll("#chapter-content>p");

    const contentArr = [];

    for (const contentElement of contentElements) {
      const content = contentElement.textContent?.trim() || "";
      if (content != "") {
        contentArr.push(content);
      }
    }

    const content = contentArr.join("\n\n");

    const previousPageElement = doc.querySelector("#prev_chap");
    const prevUrl = previousPageElement?.getAttribute("href") || undefined;

    const nextPageElement = doc.querySelector("#next_chap");
    const nextUrl = nextPageElement?.getAttribute("href") || undefined;

    const chapterUrl = titleElement?.getAttribute("href") || "";

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
      chapterUrl,
      `https://novgo.net${chapterUrl}`,
    );
  }
}
