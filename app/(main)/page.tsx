// import Image from "next/image";
import { getTasks } from "@/lib/tasks";
import { Suspense } from "react";
import classes from "./page.module.css";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { addTask } from "@/lib/actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

import TasksList from "@/components/TasksList";

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



export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const tasks = await getTasks();

  return (
    <div className="w-full px-4 py-4">
      <div className="max-w-3xl mx-auto">
        <main>

          <h1 className="text-2xl font-bold mb-4">Tasks</h1>
          <AddTaskForm />

          <Suspense fallback={<p className={classes.loading}>Loading...</p>}>
            <TasksList tasks={tasks} />
          </Suspense>
        </main>
      </div>
    </div>
  );
}







