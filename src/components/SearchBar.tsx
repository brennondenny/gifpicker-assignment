"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

function SearchBarContent({ onSearch }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") || "";

  const [inputValue, setInputValue] = React.useState(urlQuery);
  const debouncedQuery = useDebouncedValue(inputValue, 250);

  const lastProcessedQuery = React.useRef(urlQuery);
  const hasTriggeredInitialSearch = React.useRef(false);

  React.useEffect(() => {
    if (!hasTriggeredInitialSearch.current && urlQuery) {
      hasTriggeredInitialSearch.current = true;
      lastProcessedQuery.current = urlQuery;
      onSearch(urlQuery);
    }
  }, [urlQuery, onSearch]);

  React.useEffect(() => {
    if (debouncedQuery === lastProcessedQuery.current) {
      return;
    }

    lastProcessedQuery.current = debouncedQuery;

    const params = new URLSearchParams();
    if (debouncedQuery.trim()) {
      params.set("q", debouncedQuery.trim());
    }
    const newUrl = params.toString() ? `?${params.toString()}` : "/";

    router.replace(newUrl, { scroll: false });

    onSearch(debouncedQuery.trim());
  }, [debouncedQuery, router, onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleClear = () => {
    setInputValue("");
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Search for GIFs..."
          className={styles.input}
          autoComplete="off"
          spellCheck="false"
        />
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className={styles.clearButton}
          >
            ✖︎
          </button>
        )}
      </div>
    </form>
  );
}

export default React.memo(function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <Suspense
      fallback={
        <div className={styles.searchBarFallback}>Loading search...</div>
      }
    >
      <SearchBarContent onSearch={onSearch} />
    </Suspense>
  );
});
