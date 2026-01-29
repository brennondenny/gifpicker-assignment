"use client";

import React, { useEffect, useRef, useCallback, Suspense } from "react";
import Image from "next/image";
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
    clearError,
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

  const handleClearError = useCallback(() => {
    clearError();
  }, [clearError]);

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>GIF Picker</h1>
        <p className="subtitle">Search and share GIFs from GIPHY</p>
        <SearchBar onSearch={handleSearch} />
      </header>

      {error && (
        <div className="error" role="alert" aria-live="polite">
          {(error.toLowerCase().includes("rate limit") ||
            error.toLowerCase().includes("429")) && (
            <Image
              src="/mad-cat.gif"
              alt="Rate limit exceeded"
              width={200}
              height={200}
              className={styles.errorImage}
              unoptimized
            />
          )}
          <p>{error}</p>
          <button onClick={handleClearError} className={styles.dismissButton}>
            Dismiss
          </button>
        </div>
      )}

      {loading && gifs.length === 0 && (
        <div className={styles.loading} aria-live="polite">
          <div className="spinner" />
          <p>Loading GIFs...</p>
        </div>
      )}

      {!loading && gifs.length === 0 && !error && (
        <div className="empty" role="status">
          <Image
            src="/sad-cat.gif"
            alt="No results found"
            width={200}
            height={200}
            className={styles.errorImage}
            unoptimized
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
            <div className={styles.loadingMore} aria-live="polite">
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
          <div className={styles.loading} aria-live="polite">
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
