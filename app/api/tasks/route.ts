import { NextRequest, NextResponse } from "next/server";
import { getTasks, createTask, updateTask } from "@/lib/tasks";

export async function GET() {
  const tasks = await getTasks();
  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  try {
    const { title } = await req.json();
    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    const task = await createTask(title);
    return NextResponse.json(task, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}


// PATCH /api/tasks?id=taskId
export async function PATCH(req: NextRequest) {
  const { searchParams } = new URL(req.url!);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Task id is required" }, { status: 400 });
  }
  try {
    const data = await req.json();
    const updated = await updateTask(id, data);
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
