/**
 * Task Store - Centralized state management for tasks
 * Implements CRUD operations, filtering, derived stores, and persistent storage
 */

import { writable, derived, get } from 'svelte/store';
import type { Writable, Readable } from 'svelte/store';
import type {
	Task,
	SerializableTask,
	TaskFilter,
	TaskStats,
	TaskCategory,
	TaskPriority,
	MatrixQuadrant
} from '$lib/types/task';
import { storage, debounce } from '$lib/utils/storageUtils';
import { generateId, calculatePercentage, groupBy } from '$lib/utils/helpers';
import { groupTasksByQuadrant } from '$lib/utils/matrixUtils';

const STORAGE_KEY = 'tasks';
const STORAGE_DELAY = 500; // milliseconds

/**
 * Serialize task for storage (convert Date objects to strings)
 */
function serializeTask(task: Task): SerializableTask {
	return {
		...task,
		dueDate: task.dueDate.toISOString(),
		createdAt: task.createdAt.toISOString(),
		updatedAt: task.updatedAt.toISOString()
	};
}

/**
 * Deserialize task from storage (convert strings to Date objects)
 */
function deserializeTask(task: SerializableTask): Task {
	return {
		...task,
		dueDate: new Date(task.dueDate),
		createdAt: new Date(task.createdAt),
		updatedAt: new Date(task.updatedAt)
	};
}

/**
 * Load tasks from localStorage
 */
function loadTasksFromStorage(): Task[] {
	const serializedTasks = storage.get<SerializableTask[]>(STORAGE_KEY, []);
	return serializedTasks.map(deserializeTask);
}

/**
 * Save tasks to localStorage (debounced)
 */
const saveTasksToStorage = debounce((tasks: Task[]) => {
	const serializedTasks = tasks.map(serializeTask);
	storage.set(STORAGE_KEY, serializedTasks);
}, STORAGE_DELAY);

/**
 * Create the task store
 */
function createTaskStore() {
	const { subscribe, set, update }: Writable<Task[]> = writable<Task[]>(loadTasksFromStorage());

	// Subscribe to changes and persist to localStorage
	subscribe((tasks) => {
		saveTasksToStorage(tasks);
	});

	return {
		subscribe,

		/**
		 * Add a new task
		 */
		add: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task => {
			const newTask: Task = {
				...taskData,
				id: generateId(),
				createdAt: new Date(),
				updatedAt: new Date()
			};

			update((tasks) => [...tasks, newTask]);
			return newTask;
		},

		/**
		 * Update an existing task
		 */
		update: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Task | null => {
			let updatedTask: Task | null = null;

			update((tasks) =>
				tasks.map((task) => {
					if (task.id === id) {
						updatedTask = {
							...task,
							...updates,
							updatedAt: new Date()
						};
						return updatedTask;
					}
					return task;
				})
			);

			return updatedTask;
		},

		/**
		 * Delete a task
		 */
		delete: (id: string): boolean => {
			let deleted = false;

			update((tasks) => {
				const newTasks = tasks.filter((task) => task.id !== id);
				deleted = newTasks.length < tasks.length;
				return newTasks;
			});

			return deleted;
		},

		/**
		 * Toggle task completion (optimistic update)
		 */
		toggleComplete: (id: string): void => {
			update((tasks) =>
				tasks.map((task) => {
					if (task.id === id) {
						return {
							...task,
							isComplete: !task.isComplete,
							updatedAt: new Date()
						};
					}
					return task;
				})
			);
		},

		/**
		 * Get a single task by ID
		 */
		getById: (id: string): Task | undefined => {
			return get({ subscribe }).find((task) => task.id === id);
		},

		/**
		 * Get all tasks
		 */
		getAll: (): Task[] => {
			return get({ subscribe });
		},

		/**
		 * Clear all tasks
		 */
		clear: (): void => {
			set([]);
		},

		/**
		 * Bulk import tasks
		 */
		import: (tasks: Task[]): void => {
			set(tasks);
		},

		/**
		 * Reset to initial state
		 */
		reset: (): void => {
			set(loadTasksFromStorage());
		}
	};
}

/**
 * Main task store instance
 */
export const taskStore = createTaskStore();

/**
 * Derived store: Filtered tasks based on criteria
 */
export const filteredTasks = derived(
	taskStore,
	($tasks) => (filter: TaskFilter): Task[] => {
		return $tasks.filter((task) => {
			if (filter.category && task.category !== filter.category) return false;
			if (filter.priority && task.priority !== filter.priority) return false;
			if (filter.isComplete !== undefined && task.isComplete !== filter.isComplete) return false;
			return true;
		});
	}
);

/**
 * Derived store: Tasks grouped by Eisenhower Matrix quadrants
 */
export const matrixTasks = derived(taskStore, ($tasks) => {
	// Only show incomplete tasks in the matrix
	const incompleteTasks = $tasks.filter((task) => !task.isComplete);
	return groupTasksByQuadrant(incompleteTasks);
});

/**
 * Derived store: Task statistics
 */
export const taskStats: Readable<TaskStats> = derived(taskStore, ($tasks) => {
	const total = $tasks.length;
	const completed = $tasks.filter((task) => task.isComplete).length;
	const completionPercentage = calculatePercentage(completed, total);

	// Group by category
	const byCategory = $tasks.reduce(
		(acc, task) => {
			acc[task.category] = (acc[task.category] || 0) + 1;
			return acc;
		},
		{} as Record<TaskCategory, number>
	);

	// Group by priority
	const byPriority = $tasks.reduce(
		(acc, task) => {
			acc[task.priority] = (acc[task.priority] || 0) + 1;
			return acc;
		},
		{} as Record<TaskPriority, number>
	);

	// Group by quadrant
	const matrix = groupTasksByQuadrant($tasks.filter((task) => !task.isComplete));
	const byQuadrant = Object.entries(matrix).reduce(
		(acc, [quadrant, tasks]) => {
			acc[quadrant as MatrixQuadrant] = tasks.length;
			return acc;
		},
		{} as Record<MatrixQuadrant, number>
	);

	return {
		total,
		completed,
		completionPercentage,
		byCategory,
		byPriority,
		byQuadrant
	};
});

/**
 * Derived store: Completion percentage for a specific category
 */
export function categoryCompletionPercentage(category: TaskCategory): Readable<number> {
	return derived(taskStore, ($tasks) => {
		const categoryTasks = $tasks.filter((task) => task.category === category);
		const completedTasks = categoryTasks.filter((task) => task.isComplete);
		return calculatePercentage(completedTasks.length, categoryTasks.length);
	});
}

/**
 * Derived store: Upcoming tasks (not complete, due within 7 days)
 */
export const upcomingTasks = derived(taskStore, ($tasks) => {
	const now = new Date();
	const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

	return $tasks
		.filter(
			(task) =>
				!task.isComplete && task.dueDate >= now && task.dueDate <= sevenDaysFromNow
		)
		.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
});

/**
 * Derived store: Overdue tasks
 */
export const overdueTasks = derived(taskStore, ($tasks) => {
	const now = new Date();
	return $tasks
		.filter((task) => !task.isComplete && task.dueDate < now)
		.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
});
