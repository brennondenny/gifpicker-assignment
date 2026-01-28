export interface GiphyImage {
  url: string;
  width: string;
  height: string;
  size?: string;
  mp4?: string;
  mp4_size?: string;
  webp?: string;
  webp_size?: string;
}

export interface GiphyImages {
  original: GiphyImage;
  downsized: GiphyImage;
  downsized_large: GiphyImage;
  downsized_medium: GiphyImage;
  downsized_small: GiphyImage;
  downsized_still: GiphyImage;
  fixed_height: GiphyImage;
  fixed_height_downsampled: GiphyImage;
  fixed_height_small: GiphyImage;
  fixed_height_small_still: GiphyImage;
  fixed_height_still: GiphyImage;
  fixed_width: GiphyImage;
  fixed_width_downsampled: GiphyImage;
  fixed_width_small: GiphyImage;
  fixed_width_small_still: GiphyImage;
  fixed_width_still: GiphyImage;
  looping: GiphyImage;
  original_still: GiphyImage;
  original_mp4: GiphyImage;
  preview: GiphyImage;
  preview_gif: GiphyImage;
  preview_webp: GiphyImage;
  "480w_still": GiphyImage;
}

export interface GiphyUser {
  avatar_url: string;
  banner_image: string;
  banner_url: string;
  profile_url: string;
  username: string;
  display_name: string;
  description: string;
  instagram_url: string;
  website_url: string;
  is_verified: boolean;
}

export interface GiphyGif {
  type: string;
  id: string;
  url: string;
  slug: string;
  bitly_gif_url: string;
  bitly_url: string;
  embed_url: string;
  username: string;
  source: string;
  title: string;
  rating: string;
  content_url: string;
  source_tld: string;
  source_post_url: string;
  is_sticker: number;
  import_datetime: string;
  trending_datetime: string;
  images: GiphyImages;
  user?: GiphyUser;
  analytics_response_payload: string;
  analytics: {
    onload: {
      url: string;
    };
    onclick: {
      url: string;
    };
    onsent: {
      url: string;
    };
  };
}

export interface GiphyApiResponse {
  data: GiphyGif[];
  pagination: {
    total_count: number;
    count: number;
    offset: number;
  };
  meta: {
    status: number;
    msg: string;
    response_id: string;
  };
}

export interface GiphyRandomApiResponse {
  data: GiphyGif;
  meta: {
    status: number;
    msg: string;
    response_id: string;
  };
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
