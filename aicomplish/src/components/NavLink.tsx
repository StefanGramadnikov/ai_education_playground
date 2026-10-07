"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./NavLink.module.css";

/** Header navigation link; highlights itself when the current path is under `href`. */
export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link href={href} className={`${styles.link} ${active ? styles.active : ""}`} aria-current={active ? "page" : undefined}>
      {children}
    </Link>
  );
}
