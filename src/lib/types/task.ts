/**
 * Core Task Model with comprehensive fields
 */
export interface Task {
	id: string;
	title: string;
	description: string;
	isComplete: boolean;
	dueDate: Date;
	priority: TaskPriority;
	category: TaskCategory;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Priority levels for tasks
 */
export enum TaskPriority {
	High = 'High',
	Medium = 'Medium',
	Low = 'Low'
}

/**
 * Task categories
 */
export enum TaskCategory {
	Work = 'Work',
	Personal = 'Personal',
	Finance = 'Finance',
	Health = 'Health',
	Other = 'Other'
}

/**
 * Serializable version of Task for localStorage
 */
export interface SerializableTask {
	id: string;
	title: string;
	description: string;
	isComplete: boolean;
	dueDate: string; // ISO string
	priority: TaskPriority;
	category: TaskCategory;
	createdAt: string; // ISO string
	updatedAt: string; // ISO string
}

/**
 * Eisenhower Matrix quadrant classification
 */
export enum MatrixQuadrant {
	UrgentImportant = 'UrgentImportant', // Do First
	NotUrgentImportant = 'NotUrgentImportant', // Schedule
	UrgentNotImportant = 'UrgentNotImportant', // Delegate
	NotUrgentNotImportant = 'NotUrgentNotImportant' // Eliminate
}

/**
 * Matrix classification result
 */
export interface TaskWithQuadrant extends Task {
	quadrant: MatrixQuadrant;
	isUrgent: boolean;
	isImportant: boolean;
}

/**
 * Filter options for tasks
 */
export interface TaskFilter {
	category?: TaskCategory;
	priority?: TaskPriority;
	isComplete?: boolean;
	quadrant?: MatrixQuadrant;
}

/**
 * Sort options for tasks
 */
export enum TaskSortBy {
	DueDate = 'dueDate',
	Priority = 'priority',
	CreatedAt = 'createdAt',
	Title = 'title'
}

/**
 * Task statistics
 */
export interface TaskStats {
	total: number;
	completed: number;
	completionPercentage: number;
	byCategory: Record<TaskCategory, number>;
	byPriority: Record<TaskPriority, number>;
	byQuadrant: Record<MatrixQuadrant, number>;
}
