import { getTask } from "@/lib/tasks";
import { notFound } from "next/navigation";


export default async function TaskDetailsPage({ params }) {
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





