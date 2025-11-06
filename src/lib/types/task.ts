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

export enum TaskPriority {
	High = 'High',
	Medium = 'Medium',
	Low = 'Low'
}

export enum TaskCategory {
	Work = 'Work',
	Personal = 'Personal',
	Finance = 'Finance',
	Health = 'Health',
	Other = 'Other'
}

export interface SerializableTask {
	id: string;
	title: string;
	description: string;
	isComplete: boolean;
	dueDate: string;
	priority: TaskPriority;
	category: TaskCategory;
	createdAt: string;
	updatedAt: string;
}

export enum MatrixQuadrant {
	UrgentImportant = 'UrgentImportant',
	NotUrgentImportant = 'NotUrgentImportant',
	UrgentNotImportant = 'UrgentNotImportant',
	NotUrgentNotImportant = 'NotUrgentNotImportant'
}

export interface TaskWithQuadrant extends Task {
	quadrant: MatrixQuadrant;
	isUrgent: boolean;
	isImportant: boolean;
}

export interface TaskFilter {
	category?: TaskCategory;
	priority?: TaskPriority;
	isComplete?: boolean;
	quadrant?: MatrixQuadrant;
}

export enum TaskSortBy {
	DueDate = 'dueDate',
	Priority = 'priority',
	CreatedAt = 'createdAt',
	Title = 'title'
}

export interface TaskStats {
	total: number;
	completed: number;
	completionPercentage: number;
	byCategory: Record<TaskCategory, number>;
	byPriority: Record<TaskPriority, number>;
	byQuadrant: Record<MatrixQuadrant, number>;
}
