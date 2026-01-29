import { useState, useRef, useCallback } from "react";
import { GiphyGif, SearchResult, RateLimitError } from "../types/giphy";
import { searchGifs, getTrendingGifs, getRandomGifs } from "../lib/giphy";

const GIFS_PER_PAGE = 20;
const MAX_DUPLICATE_RETRY_ATTEMPTS = 3;
const INITIAL_RANDOM_GIFS_COUNT = 3;

interface CacheEntry {
  gifs: GiphyGif[];
  totalCount: number;
  offset: number;
}

interface UseGifSearchState {
  gifs: GiphyGif[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  totalCount: number;
  offset: number;
}

interface UseGifSearchReturn extends UseGifSearchState {
  searchGifs: (query: string, reset?: boolean) => Promise<void>;
  loadMore: () => Promise<void>;
  loadInitialGifs: () => Promise<void>;
}

export function useGifSearch(): UseGifSearchReturn {
  const [state, setState] = useState<UseGifSearchState>({
    gifs: [],
    loading: false,
    error: null,
    hasMore: false,
    totalCount: 0,
    offset: 0,
  });

  // Cache by query string
  const cache = useRef<Map<string, CacheEntry>>(new Map());
  const currentQuery = useRef<string>("");

  const loadInitialGifs = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      let gifs: GiphyGif[];

      try {
        gifs = await getRandomGifs(INITIAL_RANDOM_GIFS_COUNT);
      } catch {
        const result = await getTrendingGifs(INITIAL_RANDOM_GIFS_COUNT);
        gifs = result.gifs;
      }

      setState((prev) => ({
        ...prev,
        gifs,
        loading: false,
        hasMore: false,
        totalCount: gifs.length,
        offset: 0,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "useGifSearch error ",
      }));
    }
  }, []);

  const performSearch = useCallback(
    async (query: string, reset: boolean = true) => {
      const cacheKey = query || "__trending__";
      const isNewSearch = reset;

      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        ...(isNewSearch && { gifs: [] }),
      }));

      try {
        let searchOffset = 0;
        let currentGifs: GiphyGif[] = [];

        setState((prev) => {
          searchOffset = isNewSearch ? 0 : prev.offset;
          currentGifs = prev.gifs;
          return prev;
        });

        let result: SearchResult;
        let uniqueGifs: GiphyGif[] = [];
        let attempts = 0;

        // duplicate fix
        while (
          attempts < MAX_DUPLICATE_RETRY_ATTEMPTS &&
          uniqueGifs.length === 0
        ) {
          if (!query) {
            result = await getTrendingGifs(GIFS_PER_PAGE);
          } else {
            result = await searchGifs(query, searchOffset, GIFS_PER_PAGE);
          }

          if (isNewSearch) {
            uniqueGifs = result.gifs;
          } else {
            const existingIds = new Set(currentGifs.map((gif) => gif.id));
            uniqueGifs = result.gifs.filter((gif) => !existingIds.has(gif.id));
          }

          if (
            !isNewSearch &&
            uniqueGifs.length === 0 &&
            result.gifs.length > 0
          ) {
            attempts++;
            searchOffset += GIFS_PER_PAGE;
          } else {
            break;
          }
        }

        const newGifs = isNewSearch
          ? uniqueGifs
          : [...currentGifs, ...uniqueGifs];

        const hasMore =
          result!.gifs.length === GIFS_PER_PAGE &&
          uniqueGifs.length > 0 &&
          newGifs.length < result!.totalCount;

        const newOffset = result!.offset + result!.gifs.length;

        if (isNewSearch) {
          cache.current.set(cacheKey, {
            gifs: newGifs,
            totalCount: result!.totalCount,
            offset: newOffset,
          });
        } else {
          cache.current.set(cacheKey, {
            gifs: newGifs,
            totalCount: result!.totalCount,
            offset: newOffset,
          });
        }

        setState((prev) => ({
          ...prev,
          gifs: newGifs,
          loading: false,
          hasMore,
          totalCount: result!.totalCount,
          offset: newOffset,
        }));

        currentQuery.current = query;
      } catch (error) {
        if (error instanceof RateLimitError) {
          const cachedResult = cache.current.get(cacheKey);

          if (cachedResult) {
            if (isNewSearch) {
              setState((prev) => ({
                ...prev,
                gifs: cachedResult.gifs,
                loading: false,
                hasMore: false,
                totalCount: cachedResult.totalCount,
                offset: cachedResult.offset,
                error: null,
              }));
            } else {
              setState((prev) => ({
                ...prev,
                loading: false,
                hasMore: false,
                error: null,
              }));
            }
            return;
          }

          // If no cache available thne show error
          setState((prev) => ({
            ...prev,
            loading: false,
            hasMore: false,
            error: "Rate limit exceeded. Please try again later.",
          }));
        } else {
          setState((prev) => ({
            ...prev,
            loading: false,
            hasMore: false,
            error:
              error instanceof Error
                ? `Search error: ${error.message}`
                : "An error occurred while searching",
          }));
        }
      }
    },
    [],
  );

  const searchGifsCallback = useCallback(
    async (query: string, reset: boolean = true) => {
      await performSearch(query, reset);
    },
    [performSearch],
  );

  const loadMore = useCallback(async () => {
    if (state.loading || !state.hasMore) return;
    await performSearch(currentQuery.current, false);
  }, [performSearch, state.loading, state.hasMore]);

  return {
    ...state,
    searchGifs: searchGifsCallback,
    loadMore,
    loadInitialGifs,
  };
}
