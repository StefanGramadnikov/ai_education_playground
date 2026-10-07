import { TasksView } from "@/components/TasksView";
import { getDb } from "@/lib/db/client";
import { listTasks } from "@/lib/tasks/repository";

type Params = { q?: string | string[]; page?: string | string[] };
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

/** Tasks page: reads search/page from the URL, loads data, delegates rendering to TasksView. */
export default async function TasksPage({ searchParams }: { searchParams: Promise<Params> }) {
  const sp = await searchParams;
  const query = first(sp.q).trim();
  const result = listTasks(getDb(), { query, page: Number(first(sp.page)) || 1 });
  return <TasksView result={result} query={query} />;
}
