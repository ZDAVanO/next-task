import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

export async function getTasks() {
  //   await new Promise((res) => setTimeout(res, 3000));
  // throw new Error("Database connection error");
  return prisma.task.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getTask(id: string) {
  return prisma.task.findUnique({ where: { id } });
}

export async function createTask(title: string) {
  // temporary userId
  const userId = "cmjk5k6l10000zkw0r4j4c8kc";
  return prisma.task.create({
    data: {
      title,
      userId,
    },
  });
}


export async function updateTask(id: string, data: Partial<{ title: string; isCompleted: boolean }>) {
  return prisma.task.update({
    where: { id },
    data,
  });
}

export async function toggleTaskCompleted(id: string, isCompleted: boolean) {
  return prisma.task.update({
    where: { id },
    data: { isCompleted },
  });
}

export async function deleteTask(id: string) {
  return prisma.task.delete({
    where: { id },
  });
}


