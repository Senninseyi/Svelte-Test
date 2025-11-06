<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { taskStore } from '$lib/stores/taskStore';
	import { enhanceTaskWithQuadrant } from '$lib/utils/matrixUtils';
	import {
		formatDate,
		formatRelativeTime,
		isDateOverdue
	} from '$lib/utils/dateUtils';
	import { TaskPriority, TaskCategory, MatrixQuadrant } from '$lib/types/task';
	import TaskForm from '$lib/components/TaskForm.svelte';
	import { fly } from 'svelte/transition';

	const taskId = $derived($page.params.id || '');
	const rawTask = $derived(taskStore.getById(taskId));
	const task = $derived(rawTask ? enhanceTaskWithQuadrant(rawTask) : undefined);

	let showEditForm = $state(false);

	const priorityColors: Record<TaskPriority, string> = {
		[TaskPriority.High]: 'bg-red-100 text-red-800',
		[TaskPriority.Medium]: 'bg-yellow-100 text-yellow-800',
		[TaskPriority.Low]: 'bg-green-100 text-green-800'
	};

	const categoryColors: Record<TaskCategory, string> = {
		[TaskCategory.Work]: 'bg-blue-100 text-blue-800',
		[TaskCategory.Personal]: 'bg-purple-100 text-purple-800',
		[TaskCategory.Finance]: 'bg-green-100 text-green-800',
		[TaskCategory.Health]: 'bg-pink-100 text-pink-800',
		[TaskCategory.Other]: 'bg-gray-100 text-gray-800'
	};

	const quadrantInfo = $derived.by(() => {
		if (!task) return null;
		
		const info: Record<MatrixQuadrant, { name: string; color: string; description: string }> = {
			[MatrixQuadrant.UrgentImportant]: {
				name: 'Do First',
				color: 'bg-red-100 text-red-800 border-red-300',
				description: 'Critical and time-sensitive'
			},
			[MatrixQuadrant.NotUrgentImportant]: {
				name: 'Schedule',
				color: 'bg-green-100 text-green-800 border-green-300',
				description: 'Important but not urgent'
			},
			[MatrixQuadrant.UrgentNotImportant]: {
				name: 'Delegate',
				color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
				description: 'Urgent but less important'
			},
			[MatrixQuadrant.NotUrgentNotImportant]: {
				name: 'Eliminate',
				color: 'bg-gray-100 text-gray-800 border-gray-300',
				description: 'Low priority'
			}
		};
		
		return info[task.quadrant];
	});

	function handleToggleComplete() {
		if (task) {
			taskStore.toggleComplete(task.id);
		}
	}

	function handleEdit() {
		showEditForm = true;
	}

	function handleDelete() {
		if (confirm('Are you sure you want to delete this task?')) {
			taskStore.delete(taskId);
			goto('/');
		}
	}

	function handleBack() {
		goto('/');
	}

	function handleCloseForm() {
		showEditForm = false;
	}
</script>

<svelte:head>
	<title>{task?.title || 'Task Details'} - Task Matrix</title>
</svelte:head>

{#if !task}
	<div class="flex flex-col items-center justify-center py-12" transition:fly={{ y: 20, duration: 300 }}>
		<svg class="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
			/>
		</svg>
		<h2 class="text-2xl font-bold text-gray-900 mb-2">Task Not Found</h2>
		<p class="text-gray-600 mb-6">The task you're looking for doesn't exist.</p>
		<button
			onclick={handleBack}
			class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
		>
			Back to Dashboard
		</button>
	</div>
{:else}
	<div class="space-y-6" transition:fly={{ y: 20, duration: 300 }}>
		<!-- Back Button -->
		<button
			onclick={handleBack}
			class="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 19l-7-7m0 0l7-7m-7 7h18"
				/>
			</svg>
			<span>Back to Dashboard</span>
		</button>

		<!-- Task Details Card -->
		<div class="bg-white rounded-lg shadow-md p-8">
			<!-- Header -->
			<div class="flex items-start justify-between mb-6">
				<div class="flex items-start gap-4 flex-1">
					<button
						type="button"
						class="mt-1 flex-shrink-0 w-8 h-8 rounded border-2 border-gray-400 hover:border-gray-600 transition-colors flex items-center justify-center {task.isComplete
							? 'bg-green-500 border-green-500'
							: 'bg-white'}"
						onclick={handleToggleComplete}
						aria-label={task.isComplete ? 'Mark as incomplete' : 'Mark as complete'}
					>
						{#if task.isComplete}
							<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="3"
									d="M5 13l4 4L19 7"
								/>
							</svg>
						{/if}
					</button>
					<div>
						<h1
							class="text-3xl font-bold text-gray-900 {task.isComplete
								? 'line-through text-gray-500'
								: ''}"
						>
							{task.title}
						</h1>
						{#if task.isComplete}
							<p class="text-sm text-green-600 mt-1 font-medium">✓ Completed</p>
						{/if}
					</div>
				</div>
				<div class="flex gap-2">
					<button
						onclick={handleEdit}
						class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
							/>
						</svg>
						Edit
					</button>
					<button
						onclick={handleDelete}
						class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
							/>
						</svg>
						Delete
					</button>
				</div>
			</div>

			<!-- Description -->
			{#if task.description}
				<div class="mb-6">
					<h2 class="text-lg font-semibold text-gray-900 mb-2">Description</h2>
					<p class="text-gray-700 whitespace-pre-wrap {task.isComplete ? 'line-through' : ''}">
						{task.description}
					</p>
				</div>
			{/if}

			<!-- Details Grid -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
				<!-- Category -->
				<div>
					<h3 class="text-sm font-semibold text-gray-500 mb-2">Category</h3>
					<span class="inline-flex px-3 py-1 rounded-full text-sm font-medium {categoryColors[task.category]}">
						{task.category}
					</span>
				</div>

				<!-- Priority -->
				<div>
					<h3 class="text-sm font-semibold text-gray-500 mb-2">Priority</h3>
					<span class="inline-flex px-3 py-1 rounded-full text-sm font-medium {priorityColors[task.priority]}">
						{task.priority}
					</span>
				</div>

				<!-- Due Date -->
				<div>
					<h3 class="text-sm font-semibold text-gray-500 mb-2">Due Date</h3>
					<div class="flex flex-col gap-1">
						<p class="text-gray-900 font-medium">{formatDate(task.dueDate)}</p>
						<p
							class="text-sm {isDateOverdue(task.dueDate) && !task.isComplete
								? 'text-red-600 font-semibold'
								: 'text-gray-600'}"
						>
							{formatRelativeTime(task.dueDate)}
						</p>
					</div>
				</div>

				<!-- Matrix Quadrant -->
				{#if quadrantInfo}
					<div>
						<h3 class="text-sm font-semibold text-gray-500 mb-2">Matrix Quadrant</h3>
						<div class="border-2 rounded-lg p-3 {quadrantInfo.color}">
							<p class="font-semibold">{quadrantInfo.name}</p>
							<p class="text-xs mt-1">{quadrantInfo.description}</p>
						</div>
					</div>
				{/if}
			</div>

			<!-- Metadata -->
			<div class="border-t pt-4">
				<div class="flex gap-6 text-sm text-gray-500">
					<div>
						<span class="font-medium">Created:</span>
						{formatDate(task.createdAt)}
					</div>
					<div>
						<span class="font-medium">Last Updated:</span>
						{formatDate(task.updatedAt)}
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Edit Form Modal -->
{#if showEditForm && task}
	<TaskForm task={task} onClose={handleCloseForm} />
{/if}
