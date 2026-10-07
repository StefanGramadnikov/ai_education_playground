import { getDb } from "@/lib/db/client";
import { listTasks } from "@/lib/tasks/repository";
import { Pagination } from "@/components/Pagination";
import { TaskItem } from "@/components/TaskItem";
import page from "@/components/page.module.css";
import ui from "@/components/ui.module.css";

type Params = { q?: string | string[]; page?: string | string[] };
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

/** Tasks page: Fully server-rendered; search is a GET form and paging is plain links. */
export default async function TasksPage({ searchParams }: { searchParams: Promise<Params> }) {
  const sp = await searchParams;
  const query = first(sp.q).trim();
  const result = listTasks(getDb(), { query, page: Number(first(sp.page)) || 1 });

  return (
    <>
      <form className={page.search} role="search" action="/tasks">
        <input className={ui.field} type="search" name="q" placeholder="Search tasks…" aria-label="Search tasks" defaultValue={query} />
        <button className={ui.btn}>Search</button>
      </form>
      <p className={page.meta}>
        {result.total} {result.total === 1 ? "task" : "tasks"}
        {query && ` matching “${query}”`}
      </p>

      {result.tasks.length === 0 ? (
        <div className={page.empty}>
          <h2>{query ? "No matching tasks" : "Nothing here yet"}</h2>
          <p>{query ? "Try a different search." : "Create your first task to get started."}</p>
        </div>
      ) : (
        <ul className={page.list}>
          {result.tasks.map((t) => (
            <TaskItem key={t.id} task={t} />
          ))}
        </ul>
      )}
      <Pagination page={result.page} totalPages={result.totalPages} query={query} />
    </>
  );
}
