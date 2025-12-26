import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


async function requireUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }
  return session.user.id;
}

export async function getTasks() {
  const userId = await requireUserId();
  return prisma.task.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
}

export async function getTask(id: string) {
  const userId = await requireUserId();
  return prisma.task.findFirst({ where: { id, userId } });
}

export async function createTask(title: string) {
  const userId = await requireUserId();
  return prisma.task.create({
    data: {
      title,
      userId,
    },
  });
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