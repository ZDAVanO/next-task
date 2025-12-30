"use client"
import { useState, useEffect, useMemo } from "react";
import TaskItem from "@/components/TaskItem";
import { Task } from "@/types/task";
import { reorderTasksAction, deleteTask } from "@/lib/actions";
import { useAppStore } from "@/lib/store";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { startTransition } from "react";

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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, ListFilter, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";


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
    const { searchQuery, setSearchQuery, taskFilter, setTaskFilter, sortBy, setSortBy } = useAppStore();

    // to prevent ssr error
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Keep local state in sync with incoming props (e.g., when adding/deleting tasks)
    useEffect(() => {
        setItems(tasks);
    }, [tasks]);

    const filteredItems = useMemo(() => {
        let result = items;

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(task => task.title.toLowerCase().includes(query));
        }

        // Apply status filter
        if (taskFilter === 'active') {
            result = result.filter(task => !task.isCompleted);
        } else if (taskFilter === 'completed') {
            result = result.filter(task => task.isCompleted);
        }

        // Apply sorting
        if (sortBy === 'title') {
            result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortBy === 'date') {
            result = [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        // If sorting by position (default), we rely on the order of the 'items' array
        // which matches the drag-and-drop order.

        return result;
    }, [items, searchQuery, taskFilter, sortBy]);

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id || sortBy !== 'position') {
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

    const handleDeleteTask = (taskToDelete: Task) => {
        const previousItems = [...items];
        const index = items.findIndex(item => item.id === taskToDelete.id);

        // Optimistic update
        setItems(items.filter(item => item.id !== taskToDelete.id));

        let undoOccurred = false;

        toast.success(`Task "${taskToDelete.title}" deleted`, {
            duration: 5000,
            action: {
                label: "Undo",
                onClick: () => {
                    undoOccurred = true;
                    setItems(previousItems);
                    toast.info("Deletion cancelled");
                },
            },
            onAutoClose: () => {
                if (!undoOccurred) {
                    startTransition(() => {
                        deleteTask(taskToDelete.id);
                    });
                }
            },
            onDismiss: () => {
                if (!undoOccurred) {
                    startTransition(() => {
                        deleteTask(taskToDelete.id).catch(() => {
                            // If it fails (e.g. already deleted by onAutoClose), we don't care much
                        });
                    });
                }
            }
        });
    };

    if (!isMounted) {
        return (
            <ul className="space-y-3">
                {items.map((task) => (
                    <TaskItem task={task} key={task.id} onDelete={() => handleDeleteTask(task)} />
                ))}
            </ul>
        );
    }

    return (
        <div className="space-y-6">
            {filteredItems.length === 0 && items.length > 0 ? (
                <div className="text-center py-12 bg-muted/20 rounded-2xl border-2 border-dashed border-muted">
                    <div className="inline-flex items-center justify-center p-4 rounded-full bg-muted/30 mb-4">
                        <Search className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground font-medium">No tasks found matching your search.</p>
                    <button
                        onClick={() => {
                            setTaskFilter('all');
                            setSearchQuery("");
                        }}
                        className="mt-2 text-primary hover:underline font-medium"
                    >
                        Clear filters
                    </button>
                </div>
            ) : (
                <DndContext
                    id="tasks-dnd"
                    sensors={sensors}
                    onDragEnd={handleDragEnd}
                    collisionDetection={closestCorners}
                    modifiers={[softRestrictToVerticalAxis]}
                >
                    <SortableContext items={filteredItems} strategy={verticalListSortingStrategy}>
                        <ul className="space-y-3">
                            {filteredItems.map((task) => (
                                <TaskItem task={task} key={task.id} onDelete={() => handleDeleteTask(task)} />
                            ))}
                        </ul>
                    </SortableContext>
                </DndContext>
            )}
        </div>
    );
}