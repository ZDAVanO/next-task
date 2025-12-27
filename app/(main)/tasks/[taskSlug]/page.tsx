
import { getTask } from "@/lib/tasks";
import { notFound } from "next/navigation";

interface TaskPageProps {
  params: Promise<{
    taskSlug: string;
  }>;
}

// Generate dynamic metadata for the task page with the task title
export async function generateMetadata({ params }: TaskPageProps) {
    const resolvedParams = await params;
    const task = await getTask(resolvedParams.taskSlug);
    if (!task) return { title: "Task not found" };
    return { title: task.title || "Task details" };
}

export default async function TaskDetailsPage({ params }: TaskPageProps) {
    const resolvedParams = await params;
    const task = await getTask(resolvedParams.taskSlug);


    if (!task) {
        notFound(); // show closesdt 404 page
    }


    return (
        <article>
            <h1>blog post page</h1>
            <pre>{JSON.stringify(resolvedParams, null, 2)}</pre>
            <pre>{JSON.stringify(task, null, 2)}</pre>
        </article>
    );
}





