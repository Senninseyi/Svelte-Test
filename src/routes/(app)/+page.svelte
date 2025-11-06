<script lang="ts">
	import { matrixTasks } from '$lib/stores/taskStore';
	import { MatrixQuadrant as MatrixQuadrantEnum } from '$lib/types/task';
	import type { TaskWithQuadrant } from '$lib/types/task';
	import MatrixQuadrant from '$lib/components/MatrixQuadrant.svelte';
	import TaskForm from '$lib/components/TaskForm.svelte';
	import TaskStats from '$lib/components/TaskStats.svelte';
	import { taskStore } from '$lib/stores/taskStore';

	let showTaskForm = $state(false);
	let editingTask = $state<TaskWithQuadrant | undefined>(undefined);

	const matrix = $derived($matrixTasks);

	function handleAddTask() {
		editingTask = undefined;
		showTaskForm = true;
	}

	function handleEditTask(task: TaskWithQuadrant) {
		editingTask = task;
		showTaskForm = true;
	}

	function handleDeleteTask(id: string) {
		if (confirm('Are you sure you want to delete this task?')) {
			taskStore.delete(id);
		}
	}

	function handleCloseForm() {
		showTaskForm = false;
		editingTask = undefined;
	}
</script>

<svelte:head>
	<title>Task Matrix - Dashboard</title>
</svelte:head>

<div class="space-y-4 sm:space-y-6">
	<!-- Header with Add Button -->
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
		<div>
			<h2 class="text-2xl sm:text-3xl font-bold text-gray-900">Eisenhower Matrix</h2>
			<p class="text-sm sm:text-base text-gray-600 mt-1">
				Organize your tasks by urgency and importance
			</p>
		</div>
		<button
			onclick={handleAddTask}
			class="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 shadow-sm"
			aria-label="Add new task"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 4v16m8-8H4"
				/>
			</svg>
			<span>Add Task</span>
		</button>
	</div>

	<!-- Matrix Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
		<!-- Quadrant 1: Urgent & Important -->
		<MatrixQuadrant
			quadrant={MatrixQuadrantEnum.UrgentImportant}
			tasks={matrix[MatrixQuadrantEnum.UrgentImportant]}
			onEditTask={handleEditTask}
			onDeleteTask={handleDeleteTask}
		/>

		<!-- Quadrant 2: Not Urgent & Important -->
		<MatrixQuadrant
			quadrant={MatrixQuadrantEnum.NotUrgentImportant}
			tasks={matrix[MatrixQuadrantEnum.NotUrgentImportant]}
			onEditTask={handleEditTask}
			onDeleteTask={handleDeleteTask}
		/>

		<!-- Quadrant 3: Urgent & Not Important -->
		<MatrixQuadrant
			quadrant={MatrixQuadrantEnum.UrgentNotImportant}
			tasks={matrix[MatrixQuadrantEnum.UrgentNotImportant]}
			onEditTask={handleEditTask}
			onDeleteTask={handleDeleteTask}
		/>

		<!-- Quadrant 4: Not Urgent & Not Important -->
		<MatrixQuadrant
			quadrant={MatrixQuadrantEnum.NotUrgentNotImportant}
			tasks={matrix[MatrixQuadrantEnum.NotUrgentNotImportant]}
			onEditTask={handleEditTask}
			onDeleteTask={handleDeleteTask}
		/>
	</div>

	<!-- Statistics Section -->
	<div class="mt-4 sm:mt-6">
		<TaskStats />
	</div>
</div>

<!-- Task Form Modal -->
{#if showTaskForm}
	<TaskForm task={editingTask} onClose={handleCloseForm} />
{/if}
