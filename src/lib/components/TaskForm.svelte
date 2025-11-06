<script lang="ts">
	import type { Task } from '$lib/types/task';
	import { TaskPriority, TaskCategory } from '$lib/types/task';
	import { formatDateForInput } from '$lib/utils/dateUtils';
	import { taskStore } from '$lib/stores/taskStore';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	interface Props {
		task?: Task;
		onClose: () => void;
		onSuccess?: (task: Task) => void;
	}

	let { task, onClose, onSuccess }: Props = $props();

	const isEditing = $derived(!!task);

	let formData = $state({
		title: task?.title || '',
		description: task?.description || '',
		dueDate: task ? formatDateForInput(task.dueDate) : '',
		priority: task?.priority || TaskPriority.Medium,
		category: task?.category || TaskCategory.Personal
	});

	let errors = $state<Record<string, string>>({});

	function validate(): boolean {
		errors = {};

		if (!formData.title.trim()) {
			errors.title = 'Title is required';
		}

		if (!formData.dueDate) {
			errors.dueDate = 'Due date is required';
		}

		return Object.keys(errors).length === 0;
	}

	function handleSubmit(e: Event) {
		e.preventDefault();

		if (!validate()) return;

		const taskData = {
			title: formData.title.trim(),
			description: formData.description.trim(),
			dueDate: new Date(formData.dueDate),
			priority: formData.priority,
			category: formData.category,
			isComplete: task?.isComplete || false
		};

		if (isEditing && task) {
			const updated = taskStore.update(task.id, taskData);
			if (updated) {
				onSuccess?.(updated);
			}
		} else {
			const newTask = taskStore.add(taskData);
			onSuccess?.(newTask);
		}

		onClose();
	}

	function handleCancel() {
		onClose();
	}
</script>

<div
	class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 bg-opacity-50"
	role="dialog"
	aria-modal="true"
	aria-labelledby="form-title"
	tabindex="-1"
	transition:fly={{ y: -50, duration: 300, easing: quintOut }}
	onclick={(e) => {
		if (e.target === e.currentTarget) onClose();
	}}
	onkeydown={(e) => {
		if (e.key === 'Escape') onClose();
	}}
>
	<div
		class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
		role="document"
		onclick={(e) => e.stopPropagation()}
		onkeydown={(e) => e.stopPropagation()}
	>
		<form onsubmit={handleSubmit} class="p-6">
			<!-- Header -->
			<div class="flex items-center justify-between mb-6">
				<h2 id="form-title" class="text-2xl font-bold text-gray-900">
					{isEditing ? 'Edit Task' : 'New Task'}
				</h2>
				<button
					type="button"
					class="text-gray-400 hover:text-gray-600 transition-colors"
					onclick={handleCancel}
					aria-label="Close form"
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			<!-- Title Field -->
			<div class="mb-4">
				<label for="title" class="block text-sm font-medium text-gray-700 mb-1">
					Title <span class="text-red-500">*</span>
				</label>
				<input
					type="text"
					id="title"
					bind:value={formData.title}
					class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 {errors.title
						? 'border-red-500'
						: 'border-gray-300'}"
					placeholder="Enter task title"
					aria-required="true"
					aria-invalid={!!errors.title}
					aria-describedby={errors.title ? 'title-error' : undefined}
				/>
				{#if errors.title}
					<p id="title-error" class="text-red-500 text-sm mt-1">{errors.title}</p>
				{/if}
			</div>

			<!-- Description Field -->
			<div class="mb-4">
				<label for="description" class="block text-sm font-medium text-gray-700 mb-1">
					Description
				</label>
				<textarea
					id="description"
					bind:value={formData.description}
					rows="3"
					class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					placeholder="Enter task description"
				></textarea>
			</div>

			<!-- Due Date Field -->
			<div class="mb-4">
				<label for="dueDate" class="block text-sm font-medium text-gray-700 mb-1">
					Due Date <span class="text-red-500">*</span>
				</label>
				<input
					type="date"
					id="dueDate"
					bind:value={formData.dueDate}
					class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 {errors.dueDate
						? 'border-red-500'
						: 'border-gray-300'}"
					aria-required="true"
					aria-invalid={!!errors.dueDate}
					aria-describedby={errors.dueDate ? 'dueDate-error' : undefined}
				/>
				{#if errors.dueDate}
					<p id="dueDate-error" class="text-red-500 text-sm mt-1">{errors.dueDate}</p>
				{/if}
			</div>

			<!-- Priority and Category Row -->
			<div class="grid grid-cols-2 gap-4 mb-6">
				<!-- Priority Field -->
				<div>
					<label for="priority" class="block text-sm font-medium text-gray-700 mb-1">
						Priority
					</label>
					<select
						id="priority"
						bind:value={formData.priority}
						class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						<option value={TaskPriority.High}>High</option>
						<option value={TaskPriority.Medium}>Medium</option>
						<option value={TaskPriority.Low}>Low</option>
					</select>
				</div>

				<!-- Category Field -->
				<div>
					<label for="category" class="block text-sm font-medium text-gray-700 mb-1">
						Category
					</label>
					<select
						id="category"
						bind:value={formData.category}
						class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						<option value={TaskCategory.Work}>Work</option>
						<option value={TaskCategory.Personal}>Personal</option>
						<option value={TaskCategory.Finance}>Finance</option>
						<option value={TaskCategory.Health}>Health</option>
						<option value={TaskCategory.Other}>Other</option>
					</select>
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="flex gap-3 justify-end">
				<button
					type="button"
					onclick={handleCancel}
					class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
				>
					Cancel
				</button>
				<button
					type="submit"
					class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
				>
					{isEditing ? 'Update Task' : 'Create Task'}
				</button>
			</div>
		</form>
	</div>
</div>
