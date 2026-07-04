import { DOMParser } from "https://deno.land/x/web_scraper_api@v1.0.13/deps.ts";
import { Chapter, ChapterUrlPagination } from "../../models/Chapter.ts";
import { ChapterListItem, Chapters } from "../../models/Chapters.ts";
import { Details } from "../../models/Details.ts";
import { ParserBase } from "../../models/iParser.ts";
import { SearchResult } from "../../models/SearchResult.ts";
import { SearchResults } from "../../models/SearchResults.ts";
import { FilterType, SourceFilterField } from "../../models/source_filter.ts";

export class Main extends ParserBase {
  source: string = "novelbuddy.io";

  filters: SourceFilterField[] = [
    new SourceFilterField({ type: FilterType.Main(), fieldName: "Keyword", fieldVar: "q", isParameter: true }),
  ];

  async search(query: string, page?: number): Promise<SearchResults> {
    const res = await fetch(`https://api.novelbuddy.io/titles/search?q=${encodeURIComponent(query)}&page=${page || 1}`);

    if (!res.ok) {
      throw new Error(`Failed to search novels: ${res.statusText}`);
    }

    const json = await res.json();
    const novelResults = json.data.items;
    const currentPage = json.data.pagination.page;
    const lastPage = json.data.pagination.total_pages;

    const searchResults: SearchResult[] = [];

    for (const novel of novelResults) {
      let title = novel.name;
      const url = novel.url;
      const coverUrl = novel.cover;
      const chapterCount = novel.stats?.chapters_count || null;

      if (!title || !url) {
        continue;
      }

      title = this.cleanUnicode(title);

      const bookId = novel.id || "";
      const searchResult = new SearchResult(url, title, "", coverUrl, [], chapterCount, this.source, {
        BookId: bookId.toString(),
      });
      searchResults.push(searchResult);
    }

    return new SearchResults(searchResults, currentPage, lastPage);
  }

  async getLatest(page?: number): Promise<SearchResults> {
    const res = await fetch(`https://api.novelbuddy.io/titles/search?sort=latest&page=${page || 1}`);

    if (!res.ok) {
      throw new Error(`Failed to search novels: ${res.statusText}`);
    }

    const json = await res.json();
    const novelResults = json.data.items;
    const currentPage = json.data.pagination.page;
    const lastPage = json.data.pagination.total_pages;

    const searchResults: SearchResult[] = [];

    for (const novel of novelResults) {
      let title = novel.name;
      const url = novel.url;
      const coverUrl = novel.cover;
      const chapterCount = novel.stats?.chapters_count || null;

      if (!title || !url) {
        continue;
      }

      title = this.cleanUnicode(title);

      const bookId = novel.id || "";
      const searchResult = new SearchResult(url, title, "", coverUrl, [], chapterCount, this.source, {
        BookId: bookId.toString(),
      });
      searchResults.push(searchResult);
    }

    return new SearchResults(searchResults, currentPage, lastPage);
  }

  async getNovel(url: string, additionalProps?: Record<string, string>): Promise<Details | null> {
    const res = await fetch(`https://api.novelbuddy.io/titles/${additionalProps?.BookId}`).catch((err) => {
      console.error(`Failed to fetch novel details for ${url}:`, err);
      return null;
    });

    if (!res?.ok) {
      return null;
    }

    const json = await res.json();
    const novelResult = json.data.title;

    const pageUrl = novelResult.url;

    const coverUrl = novelResult.cover;

    let title = novelResult.name;

    if (!title || !pageUrl) {
      return null;
    }

    title = this.cleanUnicode(title);

    const summary = novelResult.summary || "";

    const authors = novelResult.authors || [];
    const author = authors.map((a: { name: string; slug: string }) => a.name).join(", ");

    const status = novelResult.status || "";
    const genres = (novelResult.genres || []).map((g: { name: string; slug: string }) => g.name);
    const lastUpdated = novelResult.updated_at || "";

    const tags = (novelResult.tags || []).map((t: { name: string; slug: string }) => t.name);

    const chapterCount = novelResult.stats?.chapters_count || "";
    const BookId = novelResult.id || "";

    const detail: Details = new Details(
      this.source,
      title,
      summary,
      tags,
      author,
      status,
      genres,
      chapterCount.toString(),
      lastUpdated,
      {
        BookId: BookId.toString(),
      },
      [],
      coverUrl,
      pageUrl,
      `https://novelbuddy.io${pageUrl}`,
    );

    return detail;
  }

  async getChapters(url: string, page?: number, additionalProps?: Record<string, string>): Promise<Chapters> {
    console.log(`Fetching chapters for ${url} with additionalProps:`, additionalProps);
    const res = await fetch(`https://api.novelbuddy.io/titles/${additionalProps?.BookId}/chapters`);
    if (!res.ok) {
      throw new Error(`Failed to fetch chapter list: ${res.statusText}`);
    }

    const json = await res.json();

    const chapters = json.data?.chapters || [];

    const chapterList: ChapterListItem[] = [];

    for (const chapter of chapters) {
      let title = chapter.name;
      const cUrl = chapter.url;
      if (!cUrl || !title) {
        continue;
      }

      title = this.cleanUnicode(title);

      const slug = chapter.slug ?? "";

      const indexMatch = slug.match(/^chapter-(\d+)(?:-|$)/);
      let index = 0;
      if (indexMatch && indexMatch[1]) {
        index = parseInt(indexMatch[1], 10);
      }

      const updatedAt = chapter.updated_at || "";
      const chapterId = chapter.id;

      const chapterMeta = new ChapterListItem(this.source, cUrl, index, title, updatedAt.toString(), url, {
        BookId: additionalProps?.BookId,
        ChapterId: chapterId,
      });
      chapterList.push(chapterMeta);
    }

    return new Chapters(chapterList, json.page || 1, json.totalPage || 1);
  }

  async getChapter(url: string, additionalProps?: Record<string, string>): Promise<Chapter> {
    const res = await fetch(`https://api.novelbuddy.io/titles/${additionalProps?.BookId}/chapters/${additionalProps?.ChapterId}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch chapter: ${res.statusText}`);
    }

    const json = await res.json();
    const chapterData = json.data?.chapter;
    const novelTitle = json.data?.title?.name || "";
    const novelUrl = json.data?.title?.url || "";

    const title = chapterData?.name;
    const contentRaw = chapterData?.content;
    let content = contentRaw || "";

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(contentRaw, "text/html");
      const contentElements = doc?.querySelectorAll("p");
      const contentParts: string[] = [];

      contentElements?.forEach((p) => {
        const text = p.textContent?.trim();
        if (text) {
          contentParts.push(text);
        }
      });

      content = contentParts.join("\n\n");
    } catch (err) {
      console.error(`Error processing chapter content for ${url}:`, err);
    }

    const nextUrl = json.data?.next_chapter?.url || undefined;
    const nextCapterId = json.data?.next_chapter?.id || undefined;

    const prevUrl = json.data?.previous_chapter?.url || undefined;
    const prevCapterId = json.data?.previous_chapter?.id || undefined;

    const pageUrl = chapterData?.url || "";

    const nextPage = nextUrl
      ? new ChapterUrlPagination(nextUrl, { BookId: additionalProps?.BookId, ChapterId: nextCapterId })
      : undefined;
    const prevPage = prevUrl
      ? new ChapterUrlPagination(prevUrl, { BookId: additionalProps?.BookId, ChapterId: prevCapterId })
      : undefined;
    return new Chapter(
      this.source,
      novelTitle,
      novelUrl,
      title,
      content,
      prevPage,
      nextPage,
      url,
      `https://novelbuddy.io${pageUrl}`,
    );
  }
}
