import Link from "next/link";
import page from "@/components/page.module.css";

export default function NotFound() {
  return (
    <div className={page.empty}>
      <h2>Not found</h2>
      <p>
        That task doesn’t exist. <Link href="/tasks">Back to tasks</Link>
      </p>
    </div>
  );
}
