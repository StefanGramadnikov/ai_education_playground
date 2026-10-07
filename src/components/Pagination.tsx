import Link from "next/link";
import ui from "./ui.module.css";
import styles from "./Pagination.module.css";

/** Prev/next links that preserve the search query. Renders nothing for a single page. */
export function Pagination({ page, totalPages, query }: { page: number; totalPages: number; query: string }) {
  if (totalPages <= 1) return null;
  const href = (p: number) => {
    const qs = new URLSearchParams();
    if (query) qs.set("q", query);
    if (p > 1) qs.set("page", String(p));
    const s = qs.toString();
    return s ? `/?${s}` : "/";
  };
  return (
    <nav className={styles.nav} aria-label="Pagination">
      {page > 1 ? <Link className={ui.btn} href={href(page - 1)} rel="prev">← Newer</Link> : <span />}
      <span className={styles.info}>Page {page} of {totalPages}</span>
      {page < totalPages ? <Link className={ui.btn} href={href(page + 1)} rel="next">Older →</Link> : <span />}
    </nav>
  );
}
