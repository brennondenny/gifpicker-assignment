"use client";

import React, { useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SearchBar from "../components/SearchBar";
import GifGrid from "../components/GifGrid";
import Toast from "../components/Toast";
import { useGifSearch } from "../hooks/useGifSearch";
import { useToast } from "../hooks/useToast";
import styles from "./page.module.css";

function HomePageContent() {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") || "";

  const {
    gifs,
    loading,
    error,
    hasMore,
    searchGifs,
    loadMore,
    loadInitialGifs,
  } = useGifSearch();

  const { message, isVisible, show: showToast } = useToast();

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      // only load initial GIFs if there's no URL query parameter
      if (!urlQuery.trim()) {
        loadInitialGifs();
      }
    }
  }, [loadInitialGifs, urlQuery]);

  const handleSearch = useCallback(
    (query: string) => {
      if (query.trim()) {
        searchGifs(query.trim());
      } else {
        loadInitialGifs();
      }
    },
    [searchGifs, loadInitialGifs],
  );

  const handleCopy = useCallback(() => {
    showToast("URL Copied to Clipboard");
  }, [showToast]);

  const handleLoadMore = useCallback(() => {
    loadMore();
  }, [loadMore]);

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>GIF Picker</h1>
        <p className="subtitle">Search and share GIFs from GIPHY</p>
        <SearchBar onSearch={handleSearch} />
      </header>

      {error && (
        <div className="empty" role="alert">
          {(error.toLowerCase().includes("rate limit") ||
            error.toLowerCase().includes("429")) && (
            <video
              className={styles.errorImage}
              src="/mad-cat.mp4"
              width={200}
              height={200}
              autoPlay
              loop
              muted
              playsInline
            />
          )}
          <h3>
            {error.toLowerCase().includes("rate limit") ||
            error.toLowerCase().includes("429")
              ? "Please try again later"
              : "Error"}
          </h3>
          <p>{error}</p>
        </div>
      )}

      {loading && gifs.length === 0 && (
        <div className={styles.loading}>
          <div className="spinner" />
          <p>Loading GIFs...</p>
        </div>
      )}

      {!loading && gifs.length === 0 && !error && (
        <div className="empty" role="status">
          <video
            className={styles.errorImage}
            src="/sad-cat.mp4"
            width={200}
            height={200}
            autoPlay
            loop
            muted
            playsInline
          />
          <h3>No GIFs found</h3>
          <p>Try a different search</p>
        </div>
      )}

      {gifs.length > 0 && (
        <>
          <GifGrid gifs={gifs} onCopy={handleCopy} />

          {hasMore && (
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="loadMore"
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          )}

          {loading && gifs.length > 0 && (
            <div className={styles.loadingMore}>
              <div className="spinner" />
              <span>Loading GIFs...</span>
            </div>
          )}
        </>
      )}

      <Toast message={message} isVisible={isVisible} />
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <main className={styles.main}>
          <header className={styles.header}>
            <h1>GIF Picker</h1>
            <p className="subtitle">Search and share GIFs from GIPHY</p>
          </header>
          <div className={styles.loading}>
            <div className="spinner" />
            <p>Loading...</p>
          </div>
        </main>
      }
    >
      <HomePageContent />
    </Suspense>
  );
}
