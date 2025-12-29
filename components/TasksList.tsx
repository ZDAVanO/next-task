"use client"
import { useState, useEffect } from "react";
import TaskItem from "@/components/TaskItem";
import { Task } from "@/types/task";
import { reorderTasksAction } from "@/lib/actions";

import {
    DndContext,
    closestCorners,
    DragEndEvent,
    Modifier,
    MouseSensor,
    TouchSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
    sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";


const softRestrictToVerticalAxis: Modifier = ({ transform }) => {
    return {
        ...transform,
        x: transform.x * 0.15, // Дозволяємо лише 15% руху вбік (ефект опору)
    };
};




export default function TasksList({ tasks }: { tasks: Task[] }) {
    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Local state to manage the order optimistically
    const [items, setItems] = useState(tasks);

    // to prevent ssr error
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Keep local state in sync with incoming props (e.g., when adding/deleting tasks)
    useEffect(() => {
        setItems(tasks);
    }, [tasks]);

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        // Optimistic update
        setItems(newItems);

        try {
            const taskIds = newItems.map(item => item.id);
            await reorderTasksAction(taskIds);
        } catch (error) {
            console.error("Failed to reorder tasks:", error);
            // Revert on error
            setItems(tasks);
        }
    };

    // prevent ssr error
    if (!isMounted) {
        return (
            <ul className="space-y-2">
                {items.map((task) => (
                    <TaskItem task={task} key={task.id} />
                ))}
            </ul>
        );
    }

    return <>
        <DndContext
            id="tasks-dnd"
            sensors={sensors}
            onDragEnd={handleDragEnd}
            collisionDetection={closestCorners}
            modifiers={[softRestrictToVerticalAxis]}
        >
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
                <ul className="space-y-2">
                    {items.map((task) => (
                        <TaskItem task={task} key={task.id} />
                    ))}
                </ul>
            </SortableContext>
        </DndContext>

    </>
}