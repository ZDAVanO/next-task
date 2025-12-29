"use server";

// Server actions for tasks
import { updateTask, deleteTask as deleteTaskLib, createTask, reorderTasks } from "@/lib/tasks";
import { revalidatePath } from "next/cache";

export async function addTask(formData: FormData) {
  const title = formData.get("title")?.toString().trim();
  // Server-side validation: title must be non-empty and reasonable length
  if (!title || typeof title !== "string" || title.length < 1 || title.length > 100) {
    return;
  }
  await createTask(title);
  revalidatePath("/"); // revalidate cache for the home page
}

export async function toggleTask(id: string, isCompleted: boolean) {
  await updateTask(id, { isCompleted });
  revalidatePath("/");
}

export async function deleteTask(id: string) {
  await deleteTaskLib(id);
  revalidatePath("/");
}

export async function changeTaskTitle(id: string, title: string) {
  // Server-side validation: id must be non-empty string, title must be valid
  if (!id || typeof id !== "string" || id.length < 5) {
    return;
  }
  const newTitle = title?.toString().trim();
  if (!newTitle || typeof newTitle !== "string" || newTitle.length < 1 || newTitle.length > 100) {
    return;
  }
  await updateTask(id, { title: newTitle });
  revalidatePath("/");
}

export async function reorderTasksAction(taskIds: string[]) {
  if (!Array.isArray(taskIds) || taskIds.some(id => typeof id !== "string")) {
    return;
  }
  await reorderTasks(taskIds);
  revalidatePath("/");
}
