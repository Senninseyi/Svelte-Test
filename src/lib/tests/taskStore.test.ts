/**
 * Unit tests for taskStore
 * Testing CRUD operations, derived stores, and matrix categorization logic
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { taskStore, matrixTasks, taskStats } from '../stores/taskStore';
import { TaskPriority, TaskCategory, MatrixQuadrant } from '../types/task';

describe('TaskStore - CRUD Operations', () => {
	beforeEach(() => {
		taskStore.clear();
	});

	it('should add a new task with all required fields', () => {
		const taskData = {
			title: 'Test Task',
			description: 'Test Description',
			dueDate: new Date('2025-11-01'),
			priority: TaskPriority.High,
			category: TaskCategory.Work,
			isComplete: false
		};

		const newTask = taskStore.add(taskData);

		expect(newTask).toBeDefined();
		expect(newTask.id).toBeDefined();
		expect(newTask.title).toBe('Test Task');
		expect(newTask.description).toBe('Test Description');
		expect(newTask.priority).toBe(TaskPriority.High);
		expect(newTask.category).toBe(TaskCategory.Work);
		expect(newTask.isComplete).toBe(false);
		expect(newTask.createdAt).toBeInstanceOf(Date);
		expect(newTask.updatedAt).toBeInstanceOf(Date);
	});

	it('should update an existing task', async () => {
		const task = taskStore.add({
			title: 'Original Title',
			description: 'Original Description',
			dueDate: new Date('2025-11-01'),
			priority: TaskPriority.Low,
			category: TaskCategory.Personal,
			isComplete: false
		});

		// Small delay to ensure timestamp difference
		await new Promise((resolve) => setTimeout(resolve, 10));

		const updatedTask = taskStore.update(task.id, {
			title: 'Updated Title',
			priority: TaskPriority.High
		});

		expect(updatedTask).toBeDefined();
		expect(updatedTask?.title).toBe('Updated Title');
		expect(updatedTask?.priority).toBe(TaskPriority.High);
		expect(updatedTask?.description).toBe('Original Description'); // Should keep original
		expect(updatedTask?.updatedAt.getTime()).toBeGreaterThanOrEqual(task.createdAt.getTime());
	});

	it('should delete a task', () => {
		const task = taskStore.add({
			title: 'Task to Delete',
			description: 'Will be deleted',
			dueDate: new Date('2025-11-01'),
			priority: TaskPriority.Medium,
			category: TaskCategory.Work,
			isComplete: false
		});

		const deleted = taskStore.delete(task.id);
		expect(deleted).toBe(true);

		const tasks = get(taskStore);
		expect(tasks.length).toBe(0);
	});

	it('should toggle task completion status', () => {
		const task = taskStore.add({
			title: 'Toggle Task',
			description: 'Test toggle',
			dueDate: new Date('2025-11-01'),
			priority: TaskPriority.Medium,
			category: TaskCategory.Personal,
			isComplete: false
		});

		taskStore.toggleComplete(task.id);
		const tasks = get(taskStore);
		expect(tasks[0].isComplete).toBe(true);

		taskStore.toggleComplete(task.id);
		const tasks2 = get(taskStore);
		expect(tasks2[0].isComplete).toBe(false);
	});

	it('should get a task by ID', () => {
		const task = taskStore.add({
			title: 'Find Me',
			description: 'Test getById',
			dueDate: new Date('2025-11-01'),
			priority: TaskPriority.High,
			category: TaskCategory.Finance,
			isComplete: false
		});

		const foundTask = taskStore.getById(task.id);
		expect(foundTask).toBeDefined();
		expect(foundTask?.id).toBe(task.id);
		expect(foundTask?.title).toBe('Find Me');
	});
});

describe('TaskStore - Matrix Categorization Logic', () => {
	beforeEach(() => {
		taskStore.clear();
	});

	it('should correctly categorize tasks into Urgent & Important quadrant', () => {
		// High priority + due within 48 hours = Urgent & Important
		const now = new Date();
		const urgentDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

		taskStore.add({
			title: 'Urgent Important Task',
			description: 'Should be in Q1',
			dueDate: urgentDate,
			priority: TaskPriority.High,
			category: TaskCategory.Work,
			isComplete: false
		});

		const matrix = get(matrixTasks);
		expect(matrix[MatrixQuadrant.UrgentImportant].length).toBe(1);
		expect(matrix[MatrixQuadrant.UrgentImportant][0].title).toBe('Urgent Important Task');
	});

	it('should correctly categorize tasks into Not Urgent & Important quadrant', () => {
		// High priority + due after 48 hours = Not Urgent & Important
		const now = new Date();
		const futureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

		taskStore.add({
			title: 'Not Urgent Important Task',
			description: 'Should be in Q2',
			dueDate: futureDate,
			priority: TaskPriority.High,
			category: TaskCategory.Work,
			isComplete: false
		});

		const matrix = get(matrixTasks);
		expect(matrix[MatrixQuadrant.NotUrgentImportant].length).toBe(1);
		expect(matrix[MatrixQuadrant.NotUrgentImportant][0].title).toBe('Not Urgent Important Task');
	});

	it('should correctly categorize tasks into Urgent & Not Important quadrant', () => {
		// Low priority + due within 48 hours = Urgent & Not Important
		const now = new Date();
		const urgentDate = new Date(now.getTime() + 12 * 60 * 60 * 1000); // 12 hours from now

		taskStore.add({
			title: 'Urgent Not Important Task',
			description: 'Should be in Q3',
			dueDate: urgentDate,
			priority: TaskPriority.Low,
			category: TaskCategory.Other,
			isComplete: false
		});

		const matrix = get(matrixTasks);
		expect(matrix[MatrixQuadrant.UrgentNotImportant].length).toBe(1);
		expect(matrix[MatrixQuadrant.UrgentNotImportant][0].title).toBe('Urgent Not Important Task');
	});

	it('should correctly categorize tasks into Not Urgent & Not Important quadrant', () => {
		// Low priority + due after 48 hours = Not Urgent & Not Important
		const now = new Date();
		const futureDate = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000); // 10 days from now

		taskStore.add({
			title: 'Not Urgent Not Important Task',
			description: 'Should be in Q4',
			dueDate: futureDate,
			priority: TaskPriority.Low,
			category: TaskCategory.Other,
			isComplete: false
		});

		const matrix = get(matrixTasks);
		expect(matrix[MatrixQuadrant.NotUrgentNotImportant].length).toBe(1);
		expect(matrix[MatrixQuadrant.NotUrgentNotImportant][0].title).toBe(
			'Not Urgent Not Important Task'
		);
	});

	it('should only include incomplete tasks in matrix', () => {
		const now = new Date();
		const urgentDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);

		const task = taskStore.add({
			title: 'Completed Task',
			description: 'Should not appear in matrix',
			dueDate: urgentDate,
			priority: TaskPriority.High,
			category: TaskCategory.Work,
			isComplete: false
		});

		let matrix = get(matrixTasks);
		expect(matrix[MatrixQuadrant.UrgentImportant].length).toBe(1);

		// Complete the task
		taskStore.toggleComplete(task.id);

		matrix = get(matrixTasks);
		expect(matrix[MatrixQuadrant.UrgentImportant].length).toBe(0);
	});
});

describe('TaskStore - Derived Statistics', () => {
	beforeEach(() => {
		taskStore.clear();
	});

	it('should calculate completion percentage correctly', () => {
		const now = new Date();
		const futureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

		// Add 4 tasks, complete 2 of them
		const task1 = taskStore.add({
			title: 'Task 1',
			description: 'Test',
			dueDate: futureDate,
			priority: TaskPriority.High,
			category: TaskCategory.Work,
			isComplete: false
		});

		const task2 = taskStore.add({
			title: 'Task 2',
			description: 'Test',
			dueDate: futureDate,
			priority: TaskPriority.Medium,
			category: TaskCategory.Personal,
			isComplete: false
		});

		taskStore.add({
			title: 'Task 3',
			description: 'Test',
			dueDate: futureDate,
			priority: TaskPriority.Low,
			category: TaskCategory.Finance,
			isComplete: false
		});

		taskStore.add({
			title: 'Task 4',
			description: 'Test',
			dueDate: futureDate,
			priority: TaskPriority.High,
			category: TaskCategory.Health,
			isComplete: false
		});

		const stats = get(taskStats);
		expect(stats.total).toBe(4);
		expect(stats.completed).toBe(0);
		expect(stats.completionPercentage).toBe(0);

		// Complete 2 tasks
		taskStore.toggleComplete(task1.id);
		taskStore.toggleComplete(task2.id);

		const updatedStats = get(taskStats);
		expect(updatedStats.total).toBe(4);
		expect(updatedStats.completed).toBe(2);
		expect(updatedStats.completionPercentage).toBe(50);
	});

	it('should group tasks by category correctly', () => {
		const now = new Date();
		const futureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

		taskStore.add({
			title: 'Work Task 1',
			description: 'Test',
			dueDate: futureDate,
			priority: TaskPriority.High,
			category: TaskCategory.Work,
			isComplete: false
		});

		taskStore.add({
			title: 'Work Task 2',
			description: 'Test',
			dueDate: futureDate,
			priority: TaskPriority.Medium,
			category: TaskCategory.Work,
			isComplete: false
		});

		taskStore.add({
			title: 'Personal Task',
			description: 'Test',
			dueDate: futureDate,
			priority: TaskPriority.Low,
			category: TaskCategory.Personal,
			isComplete: false
		});

		const stats = get(taskStats);
		expect(stats.byCategory[TaskCategory.Work]).toBe(2);
		expect(stats.byCategory[TaskCategory.Personal]).toBe(1);
	});

	it('should group tasks by priority correctly', () => {
		const now = new Date();
		const futureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

		taskStore.add({
			title: 'High Priority 1',
			description: 'Test',
			dueDate: futureDate,
			priority: TaskPriority.High,
			category: TaskCategory.Work,
			isComplete: false
		});

		taskStore.add({
			title: 'High Priority 2',
			description: 'Test',
			dueDate: futureDate,
			priority: TaskPriority.High,
			category: TaskCategory.Work,
			isComplete: false
		});

		taskStore.add({
			title: 'Medium Priority',
			description: 'Test',
			dueDate: futureDate,
			priority: TaskPriority.Medium,
			category: TaskCategory.Personal,
			isComplete: false
		});

		taskStore.add({
			title: 'Low Priority',
			description: 'Test',
			dueDate: futureDate,
			priority: TaskPriority.Low,
			category: TaskCategory.Finance,
			isComplete: false
		});

		const stats = get(taskStats);
		expect(stats.byPriority[TaskPriority.High]).toBe(2);
		expect(stats.byPriority[TaskPriority.Medium]).toBe(1);
		expect(stats.byPriority[TaskPriority.Low]).toBe(1);
	});
});
