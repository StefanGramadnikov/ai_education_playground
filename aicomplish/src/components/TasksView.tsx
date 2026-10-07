import type { TaskPage } from "@/lib/tasks/types";
import { Pagination } from "./Pagination";
import { TaskItem } from "./TaskItem";
import page from "./page.module.css";
import ui from "./ui.module.css";

/**
 * Presentational body of the Tasks page: search form, summary, list, paging.
 * Data-free (props only) so it can be mounted in component tests.
 * Search is a plain GET form and paging is plain links.
 */
export function TasksView({ result, query }: { result: TaskPage; query: string }) {
  return (
    <>
      <form className={page.search} role="search" action="/tasks">
        <input className={ui.field} type="search" name="q" placeholder="Search tasks…" aria-label="Search tasks" defaultValue={query} />
        <button className={ui.btn}>Search</button>
      </form>
      <p className={page.meta} data-cy="summary">
        {result.total} {result.total === 1 ? "task" : "tasks"}
        {query && ` matching “${query}”`}
      </p>

      {result.tasks.length === 0 ? (
        <div className={page.empty} data-cy="empty-state">
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
