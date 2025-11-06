<script lang="ts">
	import { taskStats } from '$lib/stores/taskStore';
	import { MatrixQuadrant } from '$lib/types/task';
	import { getQuadrantDisplayName } from '$lib/utils/matrixUtils';

	const stats = $derived($taskStats);

	const quadrantOrder = [
		MatrixQuadrant.UrgentImportant,
		MatrixQuadrant.NotUrgentImportant,
		MatrixQuadrant.UrgentNotImportant,
		MatrixQuadrant.NotUrgentNotImportant
	];
</script>

<div class="bg-white rounded-lg shadow-md p-4 sm:p-6">
	<h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-4">Task Statistics</h2>

	<!-- Overall Progress -->
	<div class="mb-4 sm:mb-6">
		<div class="flex items-center justify-between mb-2">
			<span class="text-sm font-medium text-gray-700">Overall Progress</span>
			<span class="text-sm font-semibold text-blue-600">
				{stats.completionPercentage}%
			</span>
		</div>
		<div class="w-full bg-gray-200 rounded-full h-3">
			<div
				class="bg-blue-600 h-3 rounded-full transition-all duration-300"
				style="width: {stats.completionPercentage}%"
				role="progressbar"
				aria-valuenow={stats.completionPercentage}
				aria-valuemin="0"
				aria-valuemax="100"
				aria-label="Task completion progress"
			></div>
		</div>
		<p class="text-xs text-gray-500 mt-1">
			{stats.completed} of {stats.total} tasks completed
		</p>
	</div>

	<!-- Statistics Grid (Responsive 2-column on mobile, 3-column on desktop) -->
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
		<!-- By Quadrant -->
		<div>
			<h3 class="text-sm font-semibold text-gray-700 mb-3">By Matrix Quadrant</h3>
			<div class="space-y-2">
				{#each quadrantOrder as quadrant}
					{@const count = stats.byQuadrant[quadrant] || 0}
					<div class="flex items-center justify-between text-sm">
						<span class="text-gray-600 truncate mr-2">{getQuadrantDisplayName(quadrant)}</span>
						<span class="font-medium text-gray-900 shrink-0">{count}</span>
					</div>
				{/each}
			</div>
		</div>

		<!-- By Category -->
		<div>
			<h3 class="text-sm font-semibold text-gray-700 mb-3">By Category</h3>
			<div class="space-y-2">
				{#each Object.entries(stats.byCategory) as [category, count]}
					<div class="flex items-center justify-between text-sm">
						<span class="text-gray-600 truncate mr-2">{category}</span>
						<span class="font-medium text-gray-900 shrink-0">{count}</span>
					</div>
				{/each}
			</div>
		</div>

		<!-- By Priority -->
		<div>
			<h3 class="text-sm font-semibold text-gray-700 mb-3">By Priority</h3>
			<div class="space-y-2">
				{#each Object.entries(stats.byPriority) as [priority, count]}
					<div class="flex items-center justify-between text-sm">
						<span class="text-gray-600 truncate mr-2">{priority}</span>
						<span class="font-medium text-gray-900 shrink-0">{count}</span>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
