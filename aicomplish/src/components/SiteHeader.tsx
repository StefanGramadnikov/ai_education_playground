import Link from "next/link";
import { MainNav } from "./MainNav";
import page from "./page.module.css";
import ui from "./ui.module.css";

/** Global header: logo (home link), primary navigation and the "New task" call to action. */
export function SiteHeader() {
  return (
    <header className={page.header}>
      <h1 className={page.logo}>
        <Link href="/">
          AI<span>complish</span>
        </Link>
      </h1>
      <MainNav />
      <Link href="/tasks/new" className={`${ui.btn} ${ui.primary}`}>
        + New task
      </Link>
    </header>
  );
}
