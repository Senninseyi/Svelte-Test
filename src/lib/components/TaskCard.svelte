<script lang="ts">
	import type { TaskWithQuadrant } from '$lib/types/task';
	import { TaskPriority, TaskCategory } from '$lib/types/task';
	import { formatDateShort, formatRelativeTime, isDateOverdue } from '$lib/utils/dateUtils';
	import { taskStore } from '$lib/stores/taskStore';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	interface Props {
		task: TaskWithQuadrant;
		onEdit?: (task: TaskWithQuadrant) => void;
		onDelete?: (id: string) => void;
	}

	let { task, onEdit, onDelete }: Props = $props();

	const priorityColors: Record<TaskPriority, string> = {
		[TaskPriority.High]: 'border-red-500 bg-red-50',
		[TaskPriority.Medium]: 'border-yellow-500 bg-yellow-50',
		[TaskPriority.Low]: 'border-green-500 bg-green-50'
	};

	const categoryColors: Record<TaskCategory, string> = {
		[TaskCategory.Work]: 'bg-blue-100 text-blue-800',
		[TaskCategory.Personal]: 'bg-purple-100 text-purple-800',
		[TaskCategory.Finance]: 'bg-green-100 text-green-800',
		[TaskCategory.Health]: 'bg-pink-100 text-pink-800',
		[TaskCategory.Other]: 'bg-gray-100 text-gray-800'
	};

	function handleToggleComplete() {
		taskStore.toggleComplete(task.id);
	}

	function handleEdit() {
		onEdit?.(task);
	}

	function handleDelete() {
		onDelete?.(task.id);
	}

	const isOverdue = $derived(isDateOverdue(task.dueDate) && !task.isComplete);
</script>

<div
	class="task-card border-l-4 rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 sm:p-4 bg-white {priorityColors[
		task.priority
	]}"
	in:fly={{ y: 20, duration: 300, easing: quintOut }}
	out:fly={{ y: -20, duration: 200 }}
	role="article"
	aria-label="Task: {task.title}"
>
	<div class="flex items-start gap-2 sm:gap-3">
		<!-- Checkbox -->
		<button
			type="button"
			class="mt-0.5 sm:mt-1 shrink-0 w-5 h-5 rounded border-2 border-gray-400 hover:border-gray-600 transition-colors flex items-center justify-center {task.isComplete
				? 'bg-green-500 border-green-500'
				: 'bg-white'}"
			onclick={handleToggleComplete}
			aria-label={task.isComplete ? 'Mark as incomplete' : 'Mark as complete'}
			aria-pressed={task.isComplete}
		>
			{#if task.isComplete}
				<svg
					class="w-3 h-3 sm:w-4 sm:h-4 text-white"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
				</svg>
			{/if}
		</button>

		<!-- Content -->
		<div class="flex-1 min-w-0">
			<div class="flex items-start justify-between gap-1 sm:gap-2 mb-2">
				<h3
					class="text-sm sm:text-base font-semibold text-gray-900 break-words {task.isComplete
						? 'line-through text-gray-500'
						: ''}"
				>
					{task.title}
				</h3>
				<div class="flex gap-0.5 sm:gap-1 shrink-0">
					<button
						type="button"
						class="p-0.5 sm:p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
						onclick={handleEdit}
						aria-label="Edit task"
					>
						<svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
							/>
						</svg>
					</button>
					<button
						type="button"
						class="p-0.5 sm:p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
						onclick={handleDelete}
						aria-label="Delete task"
					>
						<svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
							/>
						</svg>
					</button>
				</div>
			</div>

			{#if task.description}
				<p class="text-xs sm:text-sm text-gray-600 mb-2 {task.isComplete ? 'line-through' : ''}">
					{task.description}
				</p>
			{/if}

			<div class="flex flex-wrap gap-1.5 sm:gap-2 items-center text-xs">
				<!-- Category Badge -->
				<span class="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium {categoryColors[task.category]}">
					{task.category}
				</span>

				<!-- Priority Badge -->
				<span
					class="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium"
					class:bg-red-100={task.priority === TaskPriority.High}
					class:text-red-800={task.priority === TaskPriority.High}
					class:bg-yellow-100={task.priority === TaskPriority.Medium}
					class:text-yellow-800={task.priority === TaskPriority.Medium}
					class:bg-green-100={task.priority === TaskPriority.Low}
					class:text-green-800={task.priority === TaskPriority.Low}
				>
					{task.priority}
				</span>

				<!-- Due Date -->
				<span
					class="flex items-center gap-0.5 sm:gap-1 {isOverdue
						? 'text-red-600 font-semibold'
						: 'text-gray-600'}"
				>
					<svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
						/>
					</svg>
					<span title={formatDateShort(task.dueDate)} class="truncate">
						{formatRelativeTime(task.dueDate)}
					</span>
				</span>

				<!-- Urgent/Important Indicators -->
				{#if task.isUrgent && !task.isComplete}
					<span class="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-orange-100 text-orange-800 rounded-full font-semibold">
						⚡ <span class="hidden sm:inline">Urgent</span>
					</span>
				{/if}
				{#if task.isImportant && !task.isComplete}
					<span class="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-indigo-100 text-indigo-800 rounded-full font-semibold">
						⭐ <span class="hidden sm:inline">Important</span>
					</span>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.task-card {
		transition: all 0.2s ease-in-out;
	}
</style>
