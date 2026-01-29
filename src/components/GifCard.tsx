import React from "react";
import Image from "next/image";
import { GiphyGif } from "../types/giphy";
import styles from "./GifCard.module.css";

interface GifCardProps {
  gif: GiphyGif;
  onCopy: (url: string) => void;
}

export default React.memo(function GifCard({ gif, onCopy }: GifCardProps) {
  const handleClick = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(gif.url);
      onCopy(gif.url);
    } catch {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = gif.url;
      textArea.style.position = "fixed";
      textArea.style.left = "-999px";
      textArea.style.top = "-999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        onCopy(gif.url);
      } catch {
        // Fallback copy failed silently
      }
      document.body.removeChild(textArea);
    }
  }, [gif.url, onCopy]);

  const videoSrc = gif.images.fixed_height.mp4 || gif.images.original.mp4;
  const posterSrc = gif.images.fixed_height.url;
  const gifTitle = gif.title || "Animated GIF";
  const videoWidth = parseInt(gif.images.fixed_height.width) || 480;
  const videoHeight = parseInt(gif.images.fixed_height.height) || 270;

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick],
  );

  return (
    <div
      className={styles.card}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className={styles.overlay}>
        <span className={styles.overlayText}>Copy GIF</span>
      </div>
      {videoSrc ? (
        <video
          className={styles.media}
          src={videoSrc}
          poster={posterSrc}
          width={videoWidth}
          height={videoHeight}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          title={gifTitle}
        />
      ) : (
        <Image
          className={styles.media}
          src={posterSrc}
          alt={gifTitle}
          width={videoWidth}
          height={videoHeight}
          sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          style={{ objectFit: "cover" }}
          priority={false}
        />
      )}
    </div>
  );
});
