/**
 * Eisenhower Matrix utility functions
 */

import type { Task, TaskWithQuadrant } from '$lib/types/task';
import { TaskPriority, MatrixQuadrant } from '$lib/types/task';
import { isDateUrgent, isDateOverdue } from './dateUtils';

/**
 * Determine if a task is important based on priority
 */
export function isTaskImportant(task: Task): boolean {
	return task.priority === TaskPriority.High || task.priority === TaskPriority.Medium;
}

/**
 * Determine if a task is urgent based on due date
 * Urgent = due within 48 hours OR overdue
 */
export function isTaskUrgent(task: Task): boolean {
	return isDateUrgent(task.dueDate) || isDateOverdue(task.dueDate);
}

/**
 * Classify a task into an Eisenhower Matrix quadrant
 */
export function classifyTaskQuadrant(task: Task): MatrixQuadrant {
	const isUrgent = isTaskUrgent(task);
	const isImportant = isTaskImportant(task);

	if (isUrgent && isImportant) {
		return MatrixQuadrant.UrgentImportant; // Q1: Do First
	} else if (!isUrgent && isImportant) {
		return MatrixQuadrant.NotUrgentImportant; // Q2: Schedule
	} else if (isUrgent && !isImportant) {
		return MatrixQuadrant.UrgentNotImportant; // Q3: Delegate
	} else {
		return MatrixQuadrant.NotUrgentNotImportant; // Q4: Eliminate
	}
}

/**
 * Enhance a task with quadrant classification
 */
export function enhanceTaskWithQuadrant(task: Task): TaskWithQuadrant {
	const isUrgent = isTaskUrgent(task);
	const isImportant = isTaskImportant(task);
	const quadrant = classifyTaskQuadrant(task);

	return {
		...task,
		quadrant,
		isUrgent,
		isImportant
	};
}

/**
 * Group tasks by quadrant
 */
export function groupTasksByQuadrant(tasks: Task[]): Record<MatrixQuadrant, TaskWithQuadrant[]> {
	const grouped: Record<MatrixQuadrant, TaskWithQuadrant[]> = {
		[MatrixQuadrant.UrgentImportant]: [],
		[MatrixQuadrant.NotUrgentImportant]: [],
		[MatrixQuadrant.UrgentNotImportant]: [],
		[MatrixQuadrant.NotUrgentNotImportant]: []
	};

	tasks.forEach((task) => {
		const enhancedTask = enhanceTaskWithQuadrant(task);
		grouped[enhancedTask.quadrant].push(enhancedTask);
	});

	return grouped;
}

/**
 * Get quadrant display name
 */
export function getQuadrantDisplayName(quadrant: MatrixQuadrant): string {
	const names: Record<MatrixQuadrant, string> = {
		[MatrixQuadrant.UrgentImportant]: 'Do First',
		[MatrixQuadrant.NotUrgentImportant]: 'Schedule',
		[MatrixQuadrant.UrgentNotImportant]: 'Delegate',
		[MatrixQuadrant.NotUrgentNotImportant]: 'Eliminate'
	};
	return names[quadrant];
}

/**
 * Get quadrant description
 */
export function getQuadrantDescription(quadrant: MatrixQuadrant): string {
	const descriptions: Record<MatrixQuadrant, string> = {
		[MatrixQuadrant.UrgentImportant]: 'Critical tasks that require immediate attention',
		[MatrixQuadrant.NotUrgentImportant]: 'Important tasks to plan and schedule for later',
		[MatrixQuadrant.UrgentNotImportant]: 'Tasks that are time-sensitive but less critical',
		[MatrixQuadrant.NotUrgentNotImportant]: 'Low priority tasks to consider eliminating'
	};
	return descriptions[quadrant];
}

/**
 * Get quadrant color theme
 */
export function getQuadrantColor(quadrant: MatrixQuadrant): string {
	const colors: Record<MatrixQuadrant, string> = {
		[MatrixQuadrant.UrgentImportant]: 'red',
		[MatrixQuadrant.NotUrgentImportant]: 'green',
		[MatrixQuadrant.UrgentNotImportant]: 'yellow',
		[MatrixQuadrant.NotUrgentNotImportant]: 'gray'
	};
	return colors[quadrant];
}

/**
 * Sort tasks within a quadrant by priority and due date
 */
export function sortTasksInQuadrant(tasks: TaskWithQuadrant[]): TaskWithQuadrant[] {
	return tasks.sort((a, b) => {
		// First sort by priority
		const priorityOrder = { High: 0, Medium: 1, Low: 2 };
		const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
		if (priorityDiff !== 0) return priorityDiff;

		// Then by due date (earlier first)
		return a.dueDate.getTime() - b.dueDate.getTime();
	});
}
