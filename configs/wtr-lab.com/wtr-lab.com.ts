import { DOMParser } from "https://deno.land/x/web_scraper_api@v1.0.13/deps.ts";
import { Chapter, ChapterUrlPagination } from "../../models/Chapter.ts";
import { ChapterListItem, Chapters } from "../../models/Chapters.ts";
import { Details } from "../../models/Details.ts";
import { ParserBase } from "../../models/iParser.ts";
import { SearchResult } from "../../models/SearchResult.ts";
import { SearchResults } from "../../models/SearchResults.ts";
import { FilterType, SourceFilterField } from "../../models/source_filter.ts";

export class Main extends ParserBase {
  source: string = "wtr-lab.com";

  filters: SourceFilterField[] = [
    new SourceFilterField({ type: FilterType.Main(), fieldName: "Keyword", fieldVar: "keyword", isParameter: true }),
  ];

  async search(query: string, page?: number): Promise<SearchResults> {
    const res = await fetch(`https://wtr-lab.com/en/novel-finder?page=${page || 1}&text=${encodeURIComponent(query)}`);

    if (!res.ok) {
      throw new Error(`Failed to search novels: ${res.statusText}`);
    }
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    ///////////////////////
    const json = doc.querySelector("script#__NEXT_DATA__")?.textContent;
    try {
      const data = JSON.parse(json);
      const searchResultsData = data.props.pageProps.series;

      let searchResults: SearchResult[] = [];
      let currentPage = 1;
      let lastPage = 1;

      const tagsLookup = data.props.pageProps?.tags?.ungrouped || [];

      if (searchResultsData && Array.isArray(searchResultsData)) {
        searchResults = searchResultsData.map((item: any) => {
          const id = item.raw_id || "";
          const slug = item.slug || "";
          const title = item.data.title || "";
          const url = `/en/novel/${id}/${slug}`;
          const summary = item.data.description || "";
          const coverUrl = item.data.image || "";

          const tagIds = item.tags || [];
          const tags = tagIds
            .map((tagId: string) => {
              const tag = tagsLookup.find((tag: any) => tag.value === tagId);
              return tag ? tag.label : "";
            })
            .filter((g: string) => g !== "");

          const chapterCount = item.chapter_count || 0;

          const additionalProps: Record<string, string> = { id: id, chapters: chapterCount };

          return new SearchResult(
            url,
            title,
            this.cleanText(summary),
            coverUrl,
            tags,
            chapterCount,
            this.source,
            additionalProps,
          );
        });

        const currentPageHref = doc.querySelector('a[aria-current="page"]')?.getAttribute("href") || "";
        const currentPageMatch = currentPageHref.match(/[?&]page=(\d+)/);
        if (currentPageMatch && currentPageMatch[1]) {
          currentPage = this.parseInteger(currentPageMatch[1], 1);
        }

        const pageLinks = Array.from(doc.querySelectorAll('nav[aria-label="Pagination Navigation"] a[href*="page="]'));
        const pageNumbers = pageLinks
          .map((a: any) => {
            const href = a.getAttribute("href") || "";
            const match = href.match(/[?&]page=(\d+)/);
            return match && match[1] ? this.parseInteger(match[1], 0) : 0;
          })
          .filter((n) => n > 0);

        if (pageNumbers.length > 0) {
          lastPage = Math.max(...pageNumbers);
        }

        return new SearchResults(searchResults, currentPage, lastPage);
      }
      return new SearchResults(searchResults, currentPage, lastPage);
    } catch (err) {
      console.error("[Main] Error parsing JSON from __NEXT_DATA__:", err);
      return new SearchResults([], 1, 1);
    }
  }

  async getLatest(page?: number): Promise<SearchResults> {
    const res = await fetch(`https://wtr-lab.com/en/novel-list?page=${page || 1}`);

    if (!res.ok) {
      throw new Error(`Failed to search novels: ${res.statusText}`);
    }
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    ///////////////////////
    const json = doc.querySelector("script#__NEXT_DATA__")?.textContent;
    try {
      const data = JSON.parse(json);
      const searchResultsData = data.props?.pageProps?.series;

      let searchResults: SearchResult[] = [];
      let currentPage = 1;
      let lastPage = 1;

      const tagsLookup = data.props?.pageProps?.tags?.ungrouped || [];

      if (searchResultsData && Array.isArray(searchResultsData)) {
        searchResults = searchResultsData.map((item: any) => {
          const id = item.raw_id || "";
          const slug = item.slug || "";
          const title = item.data.title || "";
          const url = `/en/novel/${id}/${slug}`;
          const summary = item.data.description || "";
          const coverUrl = item.data.image || "";

          const tagIds = item.tags || [];
          const tags = tagIds
            .map((tagId: string) => {
              const tag = tagsLookup.find((tag: any) => tag.value === tagId);
              return tag ? tag.label : "";
            })
            .filter((g: string) => g !== "");

          const chapterCount = item.chapter_count || 0;

          const additionalProps: Record<string, string> = { id: id, chapters: chapterCount };

          return new SearchResult(
            url,
            title,
            this.cleanText(summary),
            coverUrl,
            tags,
            chapterCount,
            this.source,
            additionalProps,
          );
        });

        const currentPageHref = doc.querySelector('a[aria-current="page"]')?.getAttribute("href") || "";
        const currentPageMatch = currentPageHref.match(/[?&]page=(\d+)/);
        if (currentPageMatch && currentPageMatch[1]) {
          currentPage = this.parseInteger(currentPageMatch[1], 1);
        }

        const pageLinks = Array.from(doc.querySelectorAll('nav[aria-label="Pagination Navigation"] a[href*="page="]'));
        const pageNumbers = pageLinks
          .map((a: any) => {
            const href = a.getAttribute("href") || "";
            const match = href.match(/[?&]page=(\d+)/);
            return match && match[1] ? this.parseInteger(match[1], 0) : 0;
          })
          .filter((n) => n > 0);

        if (pageNumbers.length > 0) {
          lastPage = Math.max(...pageNumbers);
        }

        return new SearchResults(searchResults, currentPage, lastPage);
      }
      return new SearchResults(searchResults, currentPage, lastPage);
    } catch (err) {
      console.error("[Main] Error parsing JSON from __NEXT_DATA__:", err);
      return new SearchResults([], 1, 1);
    }
  }

  async getNovel(url: string, additionalProps?: Record<string, string>): Promise<Details | null> {
    const res = await fetch(`https://wtr-lab.com${url}`).catch((err) => {
      console.error(`Failed to fetch novel details for ${url}:`, err);
      return null;
    });

    if (!res?.ok) {
      return null;
    }

    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    ///////////Details stuff
    const json = doc.querySelector("script#__NEXT_DATA__")?.textContent;

    try {
      const data = JSON.parse(json);
      const novelData = data.props.pageProps.serie.serie_data;
      const tagLookup = data.props.pageProps.tags || [];
      const statusLookup = [
        { id: 1, title: "Completed" },
        { id: 0, title: "Ongoing" },
        { id: 2, title: "Hiatus" },
        { id: 3, title: "Cancelled" },
        { id: 4, title: "Unknown" },
      ];

      const title = novelData.data.title || "";
      const pageUrl = url;
      const summary = novelData.data.description || "";
      const coverUrl = novelData.data.image || "";
      const author = novelData.data.author || "";
      const tagIds = novelData.tags || [];
      const tags = tagIds
        .map((tagId: string) => {
          const tag = tagLookup.find((tag: any) => tag.id === tagId);
          return tag ? tag.title : "";
        })
        .filter((g: string) => g !== "");

      const statusId = novelData.status || 4; // Default to Unknown if not found
      const statusObj = statusLookup.find((s) => s.id === statusId);
      const status = statusObj ? statusObj.title : "Unknown";

      const chapters = novelData.chapter_count || 0;

      const raw_id = novelData.raw_id || "";
      const chapter_count = novelData.chapter_count || 0;
      const additionalProps: Record<string, string> = { id: raw_id, chapters: chapter_count };

      const detail: Details = new Details(
        this.source,
        title,
        this.cleanText(summary),
        tags,
        author,
        status,
        [],
        chapters.toString(),
        "",
        additionalProps,
        [],
        coverUrl,
        pageUrl,
        `https://wtr-lab.com${url}`,
      );

      return detail;
    } catch (err) {
      console.error("[Main] Error parsing JSON from __NEXT_DATA__:", err);
      return null;
    }

    /////////////////////////
  }

  async getChapters(url: string, page?: number, additionalProps?: Record<string, string>): Promise<Chapters> {
    const maxChapters = additionalProps?.chapters ? this.parseInteger(additionalProps.chapters, 0) : 0;
    const bookId = additionalProps?.id || "";
    if (!bookId || bookId === "") {
      return new Chapters([], 1, 1);
    }

    const chaptersPerPage = 100; // Assuming 20 chapters per page
    const pages = [];
    if (maxChapters <= chaptersPerPage) {
      pages.push({ start: 1, end: maxChapters });
    } else {
      while (pages.length * chaptersPerPage < maxChapters) {
        const start: number = pages.length * chaptersPerPage + 1;
        const end = Math.min(start + chaptersPerPage - 1, maxChapters);
        pages.push({ start, end });
      }
    }

    const chapterList: ChapterListItem[] = [];

    for (const page of pages) {
      const res = await fetch(`https://wtr-lab.com/api/chapters/${bookId}?start=${page.start}&end=${page.end}`);
      if (!res.ok) {
        continue; // Skip this page if the request fails
      }

      const data = await res.json();

      const chaptersData = data.chapters || [];

      for (const chapter of chaptersData) {
        const title = chapter.title || "";
        const cUrl = url + `/chapter-${chapter.order || 0}?service=web`; // Construct chapter URL based on order
        const index = chapter.order || 0;
        const date = chapter.updated_at || "";
        const chapterMeta = new ChapterListItem(this.source, cUrl, index, title, date.toString(), url, additionalProps);
        chapterList.push(chapterMeta);
      }
    }

    return new Chapters(chapterList, 1, 1);
  }

  async getChapter(url: string, additionalProps?: Record<string, string>): Promise<Chapter> {
    const bookId = additionalProps?.id || "";
    if (!bookId || bookId === "") {
      throw new Error("Book ID is required to fetch chapter details.");
    }

    const chapterIdMatch = url.match(/chapter-(\d+)/);
    if (!chapterIdMatch || chapterIdMatch.length < 2) {
      throw new Error("Invalid chapter URL format. Expected format: /chapter-<number>");
    }

    const chapterIndex = parseInt(chapterIdMatch[1], 10);

    const res = await fetch(`https://wtr-lab.com/api/reader/get`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        translate: "web",
        language: "en",
        raw_id: bookId,
        chapter_no: chapterIndex,
        retry: false,
        force_retry: false,
      }),
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch chapter: ${res.statusText}`);
    }

    const json = await res.json();

    const chapterDataEncrypted = json.data?.data?.body;

    if (!chapterDataEncrypted || chapterDataEncrypted === "") {
      throw new Error("Chapter body is empty or not found in the response.");
    }

    const decryptedBody = await this.decryptPayload(chapterDataEncrypted);

    if (decryptedBody === "") {
      throw new Error("Decrypted chapter body is empty.");
    }

    const parsedDecryptedBody = JSON.parse(decryptedBody);

    let translatedbody = [];

    const translationPayload = [[parsedDecryptedBody, "zh-CN", "en"], "te_lib"];

    const translations = await fetch(`https://translate-pa.googleapis.com/v1/translateHtml`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json+protobuf",
        "x-goog-api-key": "AIzaSyATBXajvzQLTDHEQbcpq0Ihe0vWDHmO520",
        Accept: "*/*",
      },
      body: JSON.stringify(translationPayload),
    });

    if (!translations.ok) {
      throw new Error(`Failed to fetch translation: ${translations.statusText} ${await translations.text()}`);
    }

    const translationJson = await translations.json();

    if (translationJson[0] && translationJson[0][0]) {
      translatedbody = translationJson[0];
    }

    for (let i = 0; i < translatedbody.length; i++) {
      translatedbody[i] = this.cleanText(translatedbody[i]);
    }

    ////////////////////////////page context
    const pageres = await fetch(`https://wtr-lab.com${url}`);

    const html = await pageres.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const data = doc.querySelector("script#__NEXT_DATA__")?.textContent;
    const novelData = data ? JSON.parse(data) : null;

    if (!novelData) {
      throw new Error("Failed to parse novel data from __NEXT_DATA__");
    }

    const seriesData = novelData.props.pageProps.serie.serie_data;
    const chapterData = novelData.props.pageProps.serie.chapter;

    const novelTitle = seriesData.data.title || "";
    const novelUrl = `/en/novel/${seriesData.raw_id}/${seriesData.slug}` || "";

    const chapters = seriesData.chapter_count || 0;
    const chapterTitle = chapterData.title || "";

    const nextPage =
      chapterIndex < chapters
        ? new ChapterUrlPagination(
            `/en/novel/${seriesData.raw_id}/${seriesData.slug}/chapter/${chapterIndex + 1}?service=web`,
            additionalProps,
          )
        : undefined;
    const prevPage =
      chapterIndex > 1
        ? new ChapterUrlPagination(
            `/en/novel/${seriesData.raw_id}/${seriesData.slug}/chapter/${chapterIndex - 1}?service=web`,
            additionalProps,
          )
        : undefined;
    return new Chapter(
      this.source,
      novelTitle,
      novelUrl,
      chapterTitle, //title,
      translatedbody.join("\n\n"), //content,
      prevPage, //prevPage,
      nextPage, //nextPage,
      `/en/novel/${seriesData.raw_id}/${seriesData.slug}/chapter/${chapterIndex}?service=web`,
      `https://wtr-lab.com/en/novel/${seriesData.raw_id}/${seriesData.slug}/chapter/${chapterIndex}?service=web`,
    );
  }

  async decryptPayload(payload: string): Promise<string> {
    // 1. Handle prefix and split the parts
    let cleanPayload = payload;
    if (cleanPayload.startsWith("arr:")) {
      cleanPayload = cleanPayload.substring(4);
    }

    const parts = cleanPayload.split(":");
    if (parts.length !== 3) {
      throw new Error("Invalid payload format. Expected: IV:Tag:Ciphertext");
    }

    const [ivBase64, tagBase64, cipherBase64] = parts;

    // Helper to convert Base64 string to Uint8Array
    const base64ToUint8 = (base64: string) => {
      const binString = atob(base64);
      return Uint8Array.from(binString, (m) => m.charCodeAt(0));
    };

    // 2. Decode Base64 parts to bytes
    const iv = base64ToUint8(ivBase64);
    const tag = base64ToUint8(tagBase64);
    const ciphertext = base64ToUint8(cipherBase64);

    // 3. Reconstruct the combined buffer (Ciphertext + Tag)
    // The JS code logic: d.set(c), d.set(o, c.length)
    const combined = new Uint8Array(ciphertext.length + tag.length);
    combined.set(ciphertext);
    combined.set(tag, ciphertext.length);

    // 4. Prepare the Key
    // The JS code uses the first 32 bytes of this string
    const keyString = "IJAFUUxjM25hyzL2AZrn0wl7cESED6Ru";
    const keyBytes = new TextEncoder().encode(keyString.slice(0, 32));

    // 5. Import the key for AES-GCM
    const cryptoKey = await crypto.subtle.importKey("raw", keyBytes, { name: "AES-GCM" }, false, ["decrypt"]);

    // 6. Decrypt
    try {
      const decryptedBuffer = await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        cryptoKey,
        combined,
      );

      return new TextDecoder().decode(decryptedBuffer);
    } catch (err) {
      throw new Error(`Decryption failed: ${err.message}. The key or tag might be invalid.`);
    }
  }
}
