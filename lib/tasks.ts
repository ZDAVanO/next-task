import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";


async function requireUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    // throw new Error("Not authenticated");
    redirect("/login");
  }
  return session.user.id;
}

export async function getTasks() {
  const userId = await requireUserId();
  return prisma.task.findMany({ 
    where: { userId }, 
    orderBy: { position: "asc" } 
  });
}

export async function getTask(id: string) {
  const userId = await requireUserId();
  return prisma.task.findFirst({ where: { id, userId } });
}

export async function createTask(title: string) {
  const userId = await requireUserId();
  
  // Get the current max position to put the new task at the end
  const lastTask = await prisma.task.findFirst({
    where: { userId },
    orderBy: { position: "desc" },
    select: { position: true }
  });

  const nextPosition = (lastTask?.position ?? -1) + 1;

  return prisma.task.create({
    data: {
      title,
      userId,
      position: nextPosition,
    },
  });
}

export async function reorderTasks(taskIds: string[]) {
  const userId = await requireUserId();
  
  // Update positions in a transaction for efficiency and atomicity
  return prisma.$transaction(
    taskIds.map((id, index) => 
      prisma.task.update({
        where: { id, userId },
        data: { position: index }
      })
    )
  );
}

export async function updateTask(id: string, data: Partial<{ title: string; isCompleted: boolean }>) {
  const userId = await requireUserId();
  const task = await prisma.task.findFirst({ where: { id, userId } });
  if (!task) throw new Error("Task not found or not authorized");
  return prisma.task.update({ where: { id }, data });
}

export async function toggleTaskCompleted(id: string, isCompleted: boolean) {
  const userId = await requireUserId();
  const task = await prisma.task.findFirst({ where: { id, userId } });
  if (!task) throw new Error("Task not found or not authorized");
  return prisma.task.update({
    where: { id },
    data: { isCompleted },
  });
}

export async function deleteTask(id: string) {
  const userId = await requireUserId();
  const task = await prisma.task.findFirst({ where: { id, userId } });
  if (!task) throw new Error("Task not found or not authorized");
  return prisma.task.delete({
    where: { id },
  });
}