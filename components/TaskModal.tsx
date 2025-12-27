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

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{task?.title || "Task Details"}</DialogTitle>
                    <DialogDescription>
                        ID: {resolvedParams.taskSlug}
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <pre className="text-xs bg-muted p-2 rounded">
                        {JSON.stringify(task, null, 2)}
                    </pre>
                </div>
            </DialogContent>
        </Dialog>
    );
}