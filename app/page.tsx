// import Image from "next/image";
import { getTasks } from "@/lib/tasks";
import { Suspense } from "react";
import classes from "./page.module.css";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"

import Counter from "@/components/Counter";
import TaskItem from "@/components/TaskItem";
import { addTask } from "@/lib/actions";


async function AddTaskForm() {
  return (
    <form action={addTask} className="flex gap-2 mb-4">
      <Input
        name="title"
        placeholder="New task title"
        className="flex-1"
        autoComplete="off"
        required
      />
      <Button type="submit" variant="default">Add</Button>
    </form>
  );
}

async function Tasks() {
  const tasks = await getTasks();

  return (
    <>

      <ul className="space-y-2">
        {tasks.map((t) => (
          <li
            key={t.id}
            className="border rounded flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition hover:text-black dark:hover:text-white list-none"
          >
            <TaskItem task={t} />
          </li>
        ))}
      </ul>

      <pre>{JSON.stringify(tasks, null, 2)}</pre>

    </>
  );
}


export default function Home() {
  return (
    <div className="w-full px-4 py-4">
      <div className="max-w-3xl mx-auto">
        <main>
          <Counter />

          <h1 className="text-2xl font-bold mb-4">Tasks</h1>
          <AddTaskForm />

          <Suspense fallback={<p className={classes.loading}>Loading...</p>}>
            <Tasks />
          </Suspense>
        </main>
      </div>
    </div>
  );
}







