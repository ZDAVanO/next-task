"use server";

import { prisma } from "@/lib/prisma";
import { hashUserPassword } from "@/lib/hash";
import { z } from "zod";

const SignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function signupUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validatedFields = SignupSchema.safeParse({
    name,
    email,
    password,
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "User already exists" };
    }

    const hashedPassword = hashUserPassword(password);

    await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    });

    return { success: "User created successfully" };
  } catch (error) {
    console.error("Signup error:", error);
    return { error: "Something went wrong" };
  }
}
