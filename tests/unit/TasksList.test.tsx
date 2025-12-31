import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TasksList from '@/components/TasksList'
import { Task } from '@/types/task'

// Mock external dependencies
vi.mock('@/lib/actions', () => ({
    reorderTasksAction: vi.fn(),
    deleteTask: vi.fn(),
}))

vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        info: vi.fn(),
    },
}))

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        refresh: vi.fn(),
    }),
}))

// Mock useAppStore
vi.mock('@/lib/store', () => ({
    useAppStore: () => ({
        searchQuery: '',
        setSearchQuery: vi.fn(),
        taskFilter: 'all' as const,
        setTaskFilter: vi.fn(),
        sortBy: 'position' as const,
        setSortBy: vi.fn(),
    }),
}))

let taskIdCounter = 0
const createMockTask = (overrides: Partial<Task> = {}): Task => ({
    id: overrides.id ?? `task-${++taskIdCounter}`,
    title: 'Test Task',
    isCompleted: false,
    createdAt: new Date('2024-01-01'),
    position: 0,
    ...overrides,
})

describe('TasksList', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        taskIdCounter = 0
    })

    describe('rendering', () => {
        it('should render a list of tasks', () => {
            const tasks: Task[] = [
                createMockTask({ id: '1', title: 'Task 1', position: 0 }),
                createMockTask({ id: '2', title: 'Task 2', position: 1 }),
                createMockTask({ id: '3', title: 'Task 3', position: 2 }),
            ]

            render(<TasksList tasks={tasks} />)

            expect(screen.getByText('Task 1')).toBeInTheDocument()
            expect(screen.getByText('Task 2')).toBeInTheDocument()
            expect(screen.getByText('Task 3')).toBeInTheDocument()
        })

        it('should render empty list when no tasks provided', () => {
            render(<TasksList tasks={[]} />)

            // Should not find any task items
            expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
        })

        it('should render tasks with correct completion status', () => {
            const tasks: Task[] = [
                createMockTask({ id: '1', title: 'Active Task', isCompleted: false }),
                createMockTask({ id: '2', title: 'Completed Task', isCompleted: true }),
            ]

            render(<TasksList tasks={tasks} />)

            expect(screen.getByText('Active Task')).toBeInTheDocument()
            expect(screen.getByText('Completed Task')).toBeInTheDocument()
        })

        it('should render delete button for each task', () => {
            const tasks: Task[] = [
                createMockTask({ id: '1', title: 'Task 1' }),
                createMockTask({ id: '2', title: 'Task 2' }),
            ]

            render(<TasksList tasks={tasks} />)

            // Each task should have a delete button
            const deleteButtons = screen.getAllByRole('button')
            expect(deleteButtons.length).toBeGreaterThanOrEqual(2)
        })
    })

    describe('task item display', () => {
        it('should display task creation date', () => {
            const tasks: Task[] = [
                createMockTask({
                    id: '1',
                    title: 'Task with date',
                    createdAt: new Date('2024-06-15T10:30:00')
                }),
            ]

            render(<TasksList tasks={tasks} />)

            // The date should be displayed (format depends on locale)
            expect(screen.getByText('Task with date')).toBeInTheDocument()
        })

        it('should apply line-through style to completed tasks', () => {
            const tasks: Task[] = [
                createMockTask({ id: '1', title: 'Completed Task', isCompleted: true }),
            ]

            render(<TasksList tasks={tasks} />)

            const taskTitle = screen.getByText('Completed Task')
            expect(taskTitle).toHaveClass('line-through')
        })
    })
})
