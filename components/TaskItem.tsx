
"use client";

import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { useOptimistic, startTransition, useState, useRef, useEffect } from "react";
import { toggleTask, deleteTask, changeTaskTitle } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type Task = {
  id: string;
  title: string;
  isCompleted: boolean;
  createdAt: string | Date;
};

type OptimisticAction =
  | { type: "TOGGLE_COMPLETION"; isCompleted: boolean }
  | { type: "UPDATE_TITLE"; title: string };

export default function TaskItem({ task }: { task: Task }) {
  const [isEditing, setIsEditing] = useState(false);
  const [optimisticTask, setOptimisticTask] = useOptimistic(
    task,
    (state, action: OptimisticAction) => {
      switch (action.type) {
        case "TOGGLE_COMPLETION":
          return { ...state, isCompleted: action.isCompleted };
        case "UPDATE_TITLE":
          return { ...state, title: action.title };
        default:
          return state;
      }
    }
  );

  const [title, setTitle] = useState(optimisticTask.title);
  const [prevOptimisticTitle, setPrevOptimisticTitle] = useState(optimisticTask.title);

  if (optimisticTask.title !== prevOptimisticTitle) {
    setPrevOptimisticTitle(optimisticTask.title);
    setTitle(optimisticTask.title);
  }

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSaveTitle = () => {
    setIsEditing(false);
    const newTitle = title.trim();
    if (newTitle.length < 2 || newTitle === optimisticTask.title) {
      setTitle(optimisticTask.title); // Reset if invalid or unchanged
      return;
    }

    startTransition(() => {
      setOptimisticTask({ type: "UPDATE_TITLE", title: newTitle });
      changeTaskTitle(task.id, newTitle);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    } else if (e.key === "Escape") {
      setTitle(optimisticTask.title);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex-1 flex items-center gap-3 p-3 relative">
      <Checkbox
        checked={optimisticTask.isCompleted}
        onCheckedChange={(checked) => {
          startTransition(() => { // startTransition to avoid blocking UI
            setOptimisticTask({ type: "TOGGLE_COMPLETION", isCompleted: checked as boolean });
            toggleTask(task.id, checked as boolean);
          });
        }}
        aria-label={optimisticTask.isCompleted ? "Mark as incomplete" : "Mark as complete"}
        className="w-5 h-5 cursor-pointer z-10"
      />

      <div className="flex-1">
        {isEditing ? (
          <input
            ref={inputRef}
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSaveTitle}
            onKeyDown={handleKeyDown}
            className={`font-medium bg-transparent border-none outline-none w-full p-0 focus:ring-0 ${
              optimisticTask.isCompleted ? " " : ""
            }`}
          />
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            className={`font-medium cursor-text ${
              optimisticTask.isCompleted ? "line-through text-muted-foreground" : ""
            }`}
          >
            {optimisticTask.title}
          </div>
        )}
        <div className="text-sm text-muted-foreground" suppressHydrationWarning>
          {new Date(optimisticTask.createdAt).toLocaleString("uk-UA")}
        </div>
      </div>

      <Link
        href={`/tasks/${task.id}`}
        className="z-10"
        aria-label="Go to task details"
      >
        <Button
          variant="ghost"
          size="icon"
          className="text-blue-500 hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/20 cursor-pointer"
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </Button>
      </Link>

      <Button
        variant="ghost"
        size="icon"
        className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20 cursor-pointer z-10"
        onClick={() => {
          startTransition(() => {
            deleteTask(task.id);
          });
        }}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
