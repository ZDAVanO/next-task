import "dotenv/config";
import { prisma } from "@/lib/prisma";

const taskData = [
  {
    title: "Test task 1",
    isCompleted: false,
  },
  {
    title: "Test task 2",
    isCompleted: true,
  },
  {
    title: "Test task 3",
    isCompleted: false,
  },
];

export async function main() {
  // Створюємо користувача
  const user = await prisma.user.create({
    data: {
      email: "testuser@example.com",
      name: "Test User",
      password: "testpassword",
    },
  });

  // Створюємо таски для цього користувача
  for (const t of taskData) {
    await prisma.task.create({
      data: {
        ...t,
        userId: user.id,
      },
    });
  }
}

main();