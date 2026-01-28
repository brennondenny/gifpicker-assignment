import styles from "./page.module.css";

export default function HomePage() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>GIF Picker</h1>
        <p className="subtitle">Search and share GIFs from GIPHY</p>
      </header>

      <div className="empty">
        <h3>Search for GIFs</h3>
        <p></p>
      </div>
    </main>
  );
}
