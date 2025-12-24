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