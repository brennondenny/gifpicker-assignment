export interface GiphyImage {
  url: string;
  width: string;
  height: string;
  mp4?: string;
}

export interface GiphyImages {
  fixed_height: GiphyImage;
  original: GiphyImage;
}

export interface GiphyGif {
  id: string;
  url: string;
  title: string;
  images: GiphyImages;
}

export interface GiphyApiResponse {
  data: GiphyGif[];
  pagination: {
    total_count: number;
    offset: number;
  };
}

export interface GiphyRandomApiResponse {
  data: GiphyGif;
}

export interface SearchResult {
  gifs: GiphyGif[];
  totalCount: number;
  offset: number;
}

export class RateLimitError extends Error {
  constructor(message: string = "Rate limit exceeded") {
    super(message);
    this.name = "RateLimitError";
  }
}
