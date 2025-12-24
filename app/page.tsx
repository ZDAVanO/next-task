// import Image from "next/image";
import { getTasks } from "@/lib/tasks";
import { Suspense } from "react";
import classes from "./page.module.css";
import Link from "next/link";

async function Tasks() {
  const tasks = await getTasks();

  return (
    <>  
    <ul className="space-y-2">
      {tasks.map((t) => (
        <Link
          key={t.id}
          href={`/tasks/${t.id}`}
          className="no-underline text-inherit block"
        >
          <li className="p-3 border rounded flex justify-between items-center hover:bg-gray-100 transition hover:text-black cursor-pointer list-none">
            <div>
              <div className="font-medium">{t.title}</div>
              <div className="text-sm text-muted-foreground">{new Date(t.createdAt).toLocaleString()}</div>
            </div>
            <div className={t.isCompleted ? "text-green-600" : "text-yellow-600"}>
              {t.isCompleted ? "Completed" : "Open"}
            </div>
          </li>
        </Link>
      ))}
    </ul>
    <pre>{JSON.stringify(tasks, null, 2)}</pre>
</>
  )
}


export default function Home() {


  return (
    <div className="container mx-auto p-4">
      <main>
        <h1 className="text-2xl font-bold mb-4">Tasks</h1>
        <Suspense fallback={<p className={classes.loading}>Loading...</p>}>
          <Tasks />
        </Suspense>

      </main>
    </div>
  );
}







