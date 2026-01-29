import React from "react";
import { GiphyGif } from "../types/giphy";
import GifCard from "./GifCard";
import styles from "./GifGrid.module.css";

interface GifGridProps {
  gifs: GiphyGif[];
  onCopy: (url: string) => void;
}

export default React.memo(function GifGrid({ gifs, onCopy }: GifGridProps) {
  if (gifs.length === 0) {
    return null;
  }

  const isSmallSet = gifs.length <= 3;

  return (
    <div
      className={`${styles.grid} ${isSmallSet ? styles.centered : ""}`}
      role="grid"
    >
      {gifs.map((gif) => (
        <GifCard key={gif.id} gif={gif} onCopy={onCopy} />
      ))}
    </div>
  );
});
