"use client";

import { useMemo } from "react";
import { Task } from "@/types/task";
import { useAppStore } from "@/lib/store";
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
import { Filter } from "lucide-react";

export default function TaskFilters({ tasks }: { tasks: Task[] }) {
    const { searchQuery, setSearchQuery, taskFilter, setTaskFilter, sortBy, setSortBy } = useAppStore();

    const filteredCount = useMemo(() => {
        let result = tasks;

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

        return result.length;
    }, [tasks, searchQuery, taskFilter]);

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-9 gap-2">
                            <Filter className="h-4 w-4" />
                            <span className="hidden xs:inline">Filter</span>
                            {taskFilter !== 'all' && (
                                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary text-[10px] text-primary-foreground font-bold uppercase transition-all">
                                    {taskFilter}
                                </span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-2" align="start">
                        <div className="space-y-1">
                            <p className="text-xs font-semibold text-muted-foreground px-2 py-1.5 uppercase tracking-wider">Status</p>
                            <Button
                                variant={taskFilter === 'all' ? 'secondary' : 'ghost'}
                                size="sm"
                                className="w-full justify-start font-normal h-8"
                                onClick={() => setTaskFilter('all')}
                            >
                                All Tasks
                            </Button>
                            <Button
                                variant={taskFilter === 'active' ? 'secondary' : 'ghost'}
                                size="sm"
                                className="w-full justify-start font-normal h-8"
                                onClick={() => setTaskFilter('active')}
                            >
                                Active
                            </Button>
                            <Button
                                variant={taskFilter === 'completed' ? 'secondary' : 'ghost'}
                                size="sm"
                                className="w-full justify-start font-normal h-8"
                                onClick={() => setTaskFilter('completed')}
                            >
                                Completed
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>

                <div className="h-4 w-px bg-border/60 mx-1 hidden xs:block" />

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="hidden lg:inline">Sort by:</span>
                    <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                        <SelectTrigger className="w-[150px] sm:w-[150px] h-9 border-none bg-transparent hover:bg-muted/50 focus:ring-0 transition-colors">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent align="start">
                            <SelectItem value="position" className="text-xs sm:text-sm">Default (Drag)</SelectItem>
                            <SelectItem value="title" className="text-xs sm:text-sm">Title</SelectItem>
                            <SelectItem value="date" className="text-xs sm:text-sm">Newest</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 px-1">
                <span className="text-[11px] sm:text-xs text-muted-foreground font-medium bg-muted/30 px-2 py-1 rounded-md">
                    {filteredCount} {filteredCount === 1 ? 'task' : 'tasks'}
                </span>
                {(taskFilter !== 'all' || searchQuery !== '') && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-[11px] font-semibold text-primary hover:text-primary hover:bg-primary/5 px-2"
                        onClick={() => {
                            setTaskFilter('all');
                            setSearchQuery("");
                        }}
                    >
                        Reset
                    </Button>
                )}
            </div>
        </div>
    );
}
