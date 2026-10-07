import { connection } from "next/server";
import { TodayView } from "@/components/TodayView";
import { getDb } from "@/lib/db/client";
import { listTasks } from "@/lib/tasks/repository";

/** Home ("Today"): loads the latest tasks and delegates rendering. Always rendered per request. */
export default async function TodayPage() {
  await connection(); // reads the DB, so never prerender at build time
  const { tasks, total } = listTasks(getDb(), { pageSize: 5 });
  const dateLabel = new Date().toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" });
  return <TodayView tasks={tasks} total={total} dateLabel={dateLabel} />;
}
