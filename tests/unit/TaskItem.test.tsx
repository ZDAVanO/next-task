import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TaskItem from '@/components/TaskItem'
import { Task } from '@/types/task'

// Mock external dependencies
vi.mock('@/lib/actions', () => ({
    toggleTask: vi.fn(),
    deleteTask: vi.fn(),
    changeTaskTitle: vi.fn(),
}))

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        refresh: vi.fn(),
    }),
}))

// Mock dnd-kit
vi.mock('@dnd-kit/sortable', () => ({
    useSortable: () => ({
        attributes: {},
        listeners: {},
        setNodeRef: vi.fn(),
        transform: null,
        transition: null,
        isDragging: false,
    }),
}))

vi.mock('@dnd-kit/utilities', () => ({
    CSS: {
        Transform: {
            toString: () => null,
        },
    },
}))

const createMockTask = (overrides: Partial<Task> = {}): Task => ({
    id: 'task-1',
    title: 'Test Task',
    isCompleted: false,
    createdAt: new Date('2024-01-15T10:30:00'),
    position: 0,
    ...overrides,
})

describe('TaskItem', () => {
    const mockOnDelete = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('rendering', () => {
        it('should render task title', () => {
            const task = createMockTask({ title: 'My Important Task' })

            render(<TaskItem task={task} onDelete={mockOnDelete} />)

            expect(screen.getByText('My Important Task')).toBeInTheDocument()
        })

        it('should render checkbox for task completion', () => {
            const task = createMockTask()

            render(<TaskItem task={task} onDelete={mockOnDelete} />)

            const checkbox = screen.getByRole('checkbox')
            expect(checkbox).toBeInTheDocument()
        })

        it('should have checked checkbox for completed task', () => {
            const task = createMockTask({ isCompleted: true })

            render(<TaskItem task={task} onDelete={mockOnDelete} />)

            const checkbox = screen.getByRole('checkbox')
            expect(checkbox).toBeChecked()
        })

        it('should have unchecked checkbox for incomplete task', () => {
            const task = createMockTask({ isCompleted: false })

            render(<TaskItem task={task} onDelete={mockOnDelete} />)

            const checkbox = screen.getByRole('checkbox')
            expect(checkbox).not.toBeChecked()
        })

        it('should render delete button', () => {
            const task = createMockTask()

            render(<TaskItem task={task} onDelete={mockOnDelete} />)

            // Find button with trash icon
            const buttons = screen.getAllByRole('button')
            expect(buttons.length).toBeGreaterThanOrEqual(1)
        })

        it('should render link to task details', () => {
            const task = createMockTask({ id: 'task-123' })

            render(<TaskItem task={task} onDelete={mockOnDelete} />)

            const link = screen.getByRole('link', { name: /go to task details/i })
            expect(link).toHaveAttribute('href', '/tasks/task-123')
        })

        it('should apply line-through style for completed tasks', () => {
            const task = createMockTask({ title: 'Completed Task', isCompleted: true })

            render(<TaskItem task={task} onDelete={mockOnDelete} />)

            const taskTitle = screen.getByText('Completed Task')
            expect(taskTitle).toHaveClass('line-through')
        })

        it('should not apply line-through style for incomplete tasks', () => {
            const task = createMockTask({ title: 'Active Task', isCompleted: false })

            render(<TaskItem task={task} onDelete={mockOnDelete} />)

            const taskTitle = screen.getByText('Active Task')
            expect(taskTitle).not.toHaveClass('line-through')
        })
    })

    describe('interactions', () => {
        it('should call onDelete when delete button is clicked', async () => {
            const user = userEvent.setup()
            const task = createMockTask()

            render(<TaskItem task={task} onDelete={mockOnDelete} />)

            const deleteButton = screen.getByRole('button', { name: /delete task/i })
            await user.click(deleteButton)
            expect(mockOnDelete).toHaveBeenCalledTimes(1)
        })

        it('should toggle checkbox when clicked', async () => {
            const { toggleTask } = await import('@/lib/actions')
            const user = userEvent.setup()
            const task = createMockTask({ id: 'task-toggle', isCompleted: false })

            render(<TaskItem task={task} onDelete={mockOnDelete} />)

            const checkbox = screen.getByRole('checkbox')
            await user.click(checkbox)

            expect(toggleTask).toHaveBeenCalledWith('task-toggle', true)
        })

        it('should toggle completed task back to incomplete when clicked', async () => {
            const { toggleTask } = await import('@/lib/actions')
            const user = userEvent.setup()
            const task = createMockTask({ id: 'task-toggle-completed', isCompleted: true })

            render(<TaskItem task={task} onDelete={mockOnDelete} />)

            const checkbox = screen.getByRole('checkbox')
            await user.click(checkbox)

            expect(toggleTask).toHaveBeenCalledWith('task-toggle-completed', false)
        })

        it('should enter edit mode when clicking on title', async () => {
            const user = userEvent.setup()
            const task = createMockTask({ title: 'Editable Task' })

            render(<TaskItem task={task} onDelete={mockOnDelete} />)

            const taskTitle = screen.getByText('Editable Task')
            await user.click(taskTitle)

            // Should now show an input field
            const input = screen.getByRole('textbox')
            expect(input).toBeInTheDocument()
            expect(input).toHaveValue('Editable Task')
        })

        it('should save title on blur', async () => {
            const { changeTaskTitle } = await import('@/lib/actions')
            const user = userEvent.setup()
            const task = createMockTask({ id: 'task-edit', title: 'Original Title' })

            render(<TaskItem task={task} onDelete={mockOnDelete} />)

            // Enter edit mode
            const taskTitle = screen.getByText('Original Title')
            await user.click(taskTitle)

            // Change the title
            const input = screen.getByRole('textbox')
            await user.clear(input)
            await user.type(input, 'New Title')

            // Blur to save
            await user.tab()

            expect(changeTaskTitle).toHaveBeenCalledWith('task-edit', 'New Title')
        })

        it('should cancel edit on Escape key', async () => {
            const user = userEvent.setup()
            const task = createMockTask({ title: 'Original Title' })

            render(<TaskItem task={task} onDelete={mockOnDelete} />)

            // Enter edit mode
            const taskTitle = screen.getByText('Original Title')
            await user.click(taskTitle)

            // Change the title
            const input = screen.getByRole('textbox')
            await user.clear(input)
            await user.type(input, 'Changed Title')

            // Press Escape
            await user.keyboard('{Escape}')

            // Should show original title
            expect(screen.getByText('Original Title')).toBeInTheDocument()
        })

        it('should save on Enter key', async () => {
            const { changeTaskTitle } = await import('@/lib/actions')
            const user = userEvent.setup()
            const task = createMockTask({ id: 'task-enter', title: 'Original Title' })

            render(<TaskItem task={task} onDelete={mockOnDelete} />)

            // Enter edit mode
            const taskTitle = screen.getByText('Original Title')
            await user.click(taskTitle)

            // Change and press Enter
            const input = screen.getByRole('textbox')
            await user.clear(input)
            await user.type(input, 'Saved Title{Enter}')

            expect(changeTaskTitle).toHaveBeenCalledWith('task-enter', 'Saved Title')
        })
    })

    describe('accessibility', () => {
        it('should have accessible checkbox label', () => {
            const task = createMockTask({ isCompleted: false })

            render(<TaskItem task={task} onDelete={mockOnDelete} />)

            const checkbox = screen.getByRole('checkbox', { name: /mark as complete/i })
            expect(checkbox).toBeInTheDocument()
        })

        it('should have accessible link to task details', () => {
            const task = createMockTask()

            render(<TaskItem task={task} onDelete={mockOnDelete} />)

            const link = screen.getByRole('link', { name: /go to task details/i })
            expect(link).toBeInTheDocument()
        })
    })
})
