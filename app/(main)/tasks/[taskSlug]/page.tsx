
import { getTask } from "@/lib/tasks";
import { notFound } from "next/navigation";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, CheckCircle2, Circle } from "lucide-react";

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
        notFound();
    }

    const formattedDate = new Intl.DateTimeFormat("en-US", {
        dateStyle: "full",
        timeStyle: "short",
    }).format(task.createdAt);

    return (
        <div className="container mx-auto py-10 px-4 max-w-3xl">
            <Link href="/" passHref>
                <Button variant="ghost" className="mb-6 pl-0 hover:pl-0 hover:bg-transparent">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Tasks
                </Button>
            </Link>

            <Card className="w-full shadow-lg">
                <CardHeader className="space-y-4">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-3xl font-bold text-primary">
                                {task.title}
                            </CardTitle>
                            <CardDescription className="text-muted-foreground flex items-center mt-2">
                                <span className="font-mono text-xs opacity-50">ID: {task.id}</span>
                            </CardDescription>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 border ${task.isCompleted
                            ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900"
                            : "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-900"
                            }`}>
                            {task.isCompleted ? (
                                <>
                                    <CheckCircle2 className="h-4 w-4" />
                                    Completed
                                </>
                            ) : (
                                <>
                                    <Circle className="h-4 w-4" />
                                    Active
                                </>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center text-muted-foreground">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Created on {formattedDate}</span>
                    </div>
                </CardContent>

                {/* <CardFooter className="bg-muted/50 p-4 rounded-b-lg">
                </CardFooter> */}
            </Card>
        </div>
    );
}





