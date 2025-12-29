
import TaskItem from "@/components/TaskItem";
import { Task } from "@/types/task";

export default async function TasksList({ tasks }: { tasks: Task[] }) {

    return (
        <>

            <ul className="space-y-2">
                {tasks.map((t) => (
                    <li
                        key={t.id}
                        className="border rounded flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition hover:text-black dark:hover:text-white list-none"
                    >
                        <TaskItem task={t} />
                    </li>
                ))}
            </ul>

            <pre>{JSON.stringify(tasks, null, 2)}</pre>

        </>
    );
}