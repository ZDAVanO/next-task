import { prisma } from "@/lib/prisma";
import { hashUserPassword } from "@/lib/hash";

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
  // Create a user
  const user = await prisma.user.create({
    data: {
      email: "testuser@example.com",
      name: "Test User",
      hashedPassword: hashUserPassword("testpassword"),
    },
  });

  // Create tasks for this user
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