"use client"


import TaskItem from "@/components/TaskItem";
import { Task } from "@/types/task";

import { DndContext, closestCorners } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

export default function TasksList({ tasks }: { tasks: Task[] }) {

    return (
        <>
            <DndContext collisionDetection={closestCorners}>
                <SortableContext items={tasks} strategy={verticalListSortingStrategy}>

                    <ul className="space-y-2">
                        {tasks.map((task) => (
                            <TaskItem task={task} key={task.id} />
                        ))}
                    </ul>
                </SortableContext>
            </DndContext>

            <pre>{JSON.stringify(tasks, null, 2)}</pre>

        </>
    );
}