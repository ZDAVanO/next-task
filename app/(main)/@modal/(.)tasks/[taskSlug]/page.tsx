import { getTask } from "@/lib/tasks";
import { notFound } from "next/navigation";
import TaskModalClient from "@/components/TaskModal"; // client part


export default async function Page({ params }: { params: Promise<{ taskSlug: string }> }) {

    const resolvedParams = await params;
    const task = await getTask(resolvedParams.taskSlug);

    if (!task) {
        notFound();
    }

    return <TaskModalClient task={task} resolvedParams={resolvedParams} />;
}