<script lang="ts">
	import type { TaskWithQuadrant } from '$lib/types/task';
	import { MatrixQuadrant } from '$lib/types/task';
	import { getQuadrantDisplayName, getQuadrantDescription } from '$lib/utils/matrixUtils';
	import TaskCard from './TaskCard.svelte';
	import { slide } from 'svelte/transition';

	interface Props {
		quadrant: MatrixQuadrant;
		tasks: TaskWithQuadrant[];
		onEditTask?: (task: TaskWithQuadrant) => void;
		onDeleteTask?: (id: string) => void;
	}

	let { quadrant, tasks, onEditTask, onDeleteTask }: Props = $props();

	const quadrantColors: Record<MatrixQuadrant, { bg: string; border: string; text: string }> = {
		[MatrixQuadrant.UrgentImportant]: {
			bg: 'bg-red-50',
			border: 'border-red-300',
			text: 'text-red-800'
		},
		[MatrixQuadrant.NotUrgentImportant]: {
			bg: 'bg-green-50',
			border: 'border-green-300',
			text: 'text-green-800'
		},
		[MatrixQuadrant.UrgentNotImportant]: {
			bg: 'bg-yellow-50',
			border: 'border-yellow-300',
			text: 'text-yellow-800'
		},
		[MatrixQuadrant.NotUrgentNotImportant]: {
			bg: 'bg-gray-50',
			border: 'border-gray-300',
			text: 'text-gray-800'
		}
	};

	const colors = $derived(quadrantColors[quadrant]);
	const displayName = $derived(getQuadrantDisplayName(quadrant));
	const description = $derived(getQuadrantDescription(quadrant));
	const taskCount = $derived(tasks.length);
</script>

<div
	class="quadrant-container border-2 rounded-lg p-4 {colors.bg} {colors.border} h-full flex flex-col"
	role="region"
	aria-label="{displayName} quadrant with {taskCount} tasks"
>
	<!-- Header -->
	<div class="mb-4">
		<div class="flex items-center justify-between mb-2">
			<h2 class="text-xl font-bold {colors.text}">
				{displayName}
			</h2>
			<span class="px-3 py-1 rounded-full bg-white {colors.text} font-semibold text-sm shadow-sm">
				{taskCount}
			</span>
		</div>
		<p class="text-sm {colors.text} opacity-80">
			{description}
		</p>
	</div>

	<!-- Tasks List -->
	<div class="flex-1 space-y-3 overflow-auto">
		{#if tasks.length === 0}
			<div class="text-center py-8 text-gray-500">
				<svg
					class="w-12 h-12 mx-auto mb-2 opacity-50"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<p class="text-sm">No tasks in this quadrant</p>
			</div>
		{:else}
			{#each tasks as task (task.id)}
				<div transition:slide={{ duration: 300 }}>
					<TaskCard {task} onEdit={onEditTask} onDelete={onDeleteTask} />
				</div>
			{/each}
		{/if}
	</div>
</div>

<style>
	.quadrant-container {
		min-height: 300px;
	}
</style>
