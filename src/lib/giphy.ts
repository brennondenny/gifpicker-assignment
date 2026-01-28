import {
  GiphyApiResponse,
  GiphyRandomApiResponse,
  SearchResult,
  RateLimitError,
  GiphyGif,
} from "../types/giphy";

const GIPHY_BASE_URL = "https://api.giphy.com/v1/gifs";
const API_KEY = process.env.NEXT_PUBLIC_GIPHY_API_KEY;

const DEFAULT_RESULTS_PER_PAGE = 20;

//GIFS for 3 before search
const MAX_RANDOM_GIFS = 3;

export async function searchGifs(
  query: string,
  offset: number = 0,
  limit: number = DEFAULT_RESULTS_PER_PAGE,
): Promise<SearchResult> {
  if (!API_KEY) {
    throw new Error("Missing API Key");
  }

  const url = new URL(`${GIPHY_BASE_URL}/search`);
  url.searchParams.append("api_key", API_KEY);
  url.searchParams.append("q", query);
  url.searchParams.append("limit", limit.toString());
  url.searchParams.append("offset", offset.toString());
  url.searchParams.append("lang", "en");

  try {
    const response = await fetch(url.toString());

    if (response.status === 429) {
      throw new RateLimitError("Rate limit exceeded");
    }

    if (!response.ok) {
      throw new Error(`error: ${response.status} ${response.statusText}`);
    }

    const data: GiphyApiResponse = await response.json();

    return {
      gifs: data.data,
      totalCount: data.pagination.total_count,
      offset: data.pagination.offset,
    };
  } catch (error) {
    if (error instanceof RateLimitError) {
      throw error;
    }

    throw new Error(
      `Failed searchGifs: ${error instanceof Error ? error.message : "Network error"}`,
    );
  }
}

export async function getTrendingGifs(
  limit: number = DEFAULT_RESULTS_PER_PAGE,
): Promise<SearchResult> {
  if (!API_KEY) {
    throw new Error("Missing GIPHY API key");
  }

  const url = new URL(`${GIPHY_BASE_URL}/trending`);
  url.searchParams.append("api_key", API_KEY);
  url.searchParams.append("limit", limit.toString());

  try {
    const response = await fetch(url.toString());

    if (response.status === 429) {
      throw new RateLimitError("Rate limit exceeded");
    }

    if (!response.ok) {
      throw new Error(`error: ${response.status} ${response.statusText}`);
    }

    const data: GiphyApiResponse = await response.json();

    return {
      gifs: data.data,
      totalCount: data.pagination.total_count,
      offset: data.pagination.offset,
    };
  } catch (error) {
    if (error instanceof RateLimitError) {
      throw error;
    }

    throw new Error(
      `Failed getTrendingGifs: ${error instanceof Error ? error.message : "Network error"}`,
    );
  }
}

export async function getRandomGifs(count: number = 3): Promise<GiphyGif[]> {
  if (!API_KEY) {
    throw new Error("Missing GIPHY API key");
  }

  try {
    const promises = Array.from({ length: count }, async () => {
      const url = new URL(`${GIPHY_BASE_URL}/random`);
      url.searchParams.append("api_key", API_KEY);

      const response = await fetch(url.toString());

      if (response.status === 429) {
        throw new RateLimitError("Rate limit exceeded");
      }

      if (!response.ok) {
        throw new Error(`error: ${response.status} ${response.statusText}`);
      }

      const data: GiphyRandomApiResponse = await response.json();
      return data.data;
    });

    const gifs = await Promise.all(promises);
    return gifs;
  } catch (error) {
    if (error instanceof RateLimitError) {
      throw error;
    }

    throw new Error(
      `Failed getRandomGifs: ${error instanceof Error ? error.message : "Network error"}`,
    );
  }
}
