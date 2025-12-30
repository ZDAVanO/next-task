
"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Calendar, CheckCircle2, Circle } from "lucide-react";

export default function TaskModal({ task, resolvedParams }: { task: any; resolvedParams: any }) {
    const router = useRouter();
    const [open, setOpen] = useState(true);

    // triggered when dialog is closed
    const handleClose = (isOpen: boolean) => {
        if (!isOpen) {
            setOpen(false);
            router.back();
        }
    };

    if (!task) return null;

    const formattedDate = new Intl.DateTimeFormat("en-US", {
        dateStyle: "full",
        timeStyle: "short",
    }).format(new Date(task.createdAt));

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader className="space-y-4">
                    <div className="flex flex-col gap-2 pr-8">
                        <DialogTitle className="text-2xl font-bold leading-none tracking-tight text-primary">
                            {task.title}
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground flex items-center gap-2">
                            <span className="font-mono text-xs opacity-50">ID: {task.id}</span>
                        </DialogDescription>
                    </div>
                </DialogHeader>
                <div className="py-4 space-y-6">
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-muted-foreground">Status</span>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 border ${task.isCompleted
                                ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900"
                                : "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-900"
                                }`}>
                                {task.isCompleted ? (
                                    <>
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        Completed
                                    </>
                                ) : (
                                    <>
                                        <Circle className="h-3.5 w-3.5" />
                                        Active
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Created on <span className="text-foreground">{formattedDate}</span></span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}