<script lang="ts">
	import { TaskCategory } from '$lib/types/task';
	import { taskStats, categoryCompletionPercentage } from '$lib/stores/taskStore';

	// use the auto-subscription to the top-level store value (default to empty byCategory to avoid runtime errors)
	$: stats = $taskStats ?? { byCategory: {} };

	// create completion stores at the top level for each category
	const completionWork = categoryCompletionPercentage(TaskCategory.Work);
	const completionPersonal = categoryCompletionPercentage(TaskCategory.Personal);
	const completionFinance = categoryCompletionPercentage(TaskCategory.Finance);
	const completionHealth = categoryCompletionPercentage(TaskCategory.Health);
	const completionOther = categoryCompletionPercentage(TaskCategory.Other);

	// expose reactive numeric percentages (top-level identifiers, so $ can be used)
	$: percentageWork = $completionWork;
	$: percentagePersonal = $completionPersonal;
	$: percentageFinance = $completionFinance;
	$: percentageHealth = $completionHealth;
	$: percentageOther = $completionOther;

	const categories = [
		TaskCategory.Work,
		TaskCategory.Personal,
		TaskCategory.Finance,
		TaskCategory.Health,
		TaskCategory.Other
	];

	const categoryDescriptions: Record<TaskCategory, string> = {
		[TaskCategory.Work]: 'Professional and work-related tasks',
		[TaskCategory.Personal]: 'Personal goals and lifestyle tasks',
		[TaskCategory.Finance]: 'Financial planning and budget tasks',
		[TaskCategory.Health]: 'Health, fitness, and wellness tasks',
		[TaskCategory.Other]: 'Miscellaneous tasks'
	};

	const categoryIcons: Record<TaskCategory, string> = {
		[TaskCategory.Work]: '💼',
		[TaskCategory.Personal]: '👤',
		[TaskCategory.Finance]: '💰',
		[TaskCategory.Health]: '❤️',
		[TaskCategory.Other]: '📌'
	};
</script>

<svelte:head>
	<title>Settings - Task Matrix</title>
</svelte:head>
<div>
	<!-- Category Management -->
	<div class="bg-white rounded-lg shadow-md p-6">
		<h3 class="text-xl font-bold text-gray-900 mb-4">Task Categories</h3>
		<p class="text-gray-600 mb-6">View statistics and information about your task categories.</p>

		<div class="space-y-4">
			{#each categories as category}
				{@const count = stats.byCategory[category] || 0}
				{@const completionStore = categoryCompletionPercentage(category)}
				{@const percentage = completionStore}
				<div class="border rounded-lg p-4 hover:shadow-sm transition-shadow">
					<div class="flex items-start justify-between mb-3">
						<div class="flex items-center gap-3">
							<span class="text-3xl">{categoryIcons[category]}</span>
							<div>
								<h4 class="font-semibold text-gray-900">{category}</h4>
								<p class="text-sm text-gray-600">{categoryDescriptions[category]}</p>
							</div>
						</div>
						<div class="text-right">
							<p class="text-2xl font-bold text-gray-900">{count}</p>
							<p class="text-xs text-gray-500">tasks</p>
						</div>
					</div>

					<!-- Progress Bar -->
					{#if count > 0}
						<div>
							<div class="flex items-center justify-between mb-1">
								<span class="text-xs text-gray-600">Completion</span>
								<span class="text-xs font-semibold text-blue-600">{percentage}%</span>
							</div>
							<div class="w-full bg-gray-200 rounded-full h-2">
								<div
									class="bg-blue-600 h-2 rounded-full transition-all duration-300"
									style="width: {percentage}%"
									role="progressbar"
									aria-valuenow={Number(percentage)}
									aria-valuemin="0"
									aria-valuemax="100"
									aria-label="Category completion progress"
								></div>
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>

	<!-- Matrix Information -->
	<div class="bg-white rounded-lg shadow-md p-6">
		<h3 class="text-xl font-bold text-gray-900 mb-4">Eisenhower Matrix Guide</h3>
		<p class="text-gray-600 mb-6">Understanding how tasks are categorized in the matrix.</p>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<!-- Quadrant 1 -->
			<div class="border-2 border-red-300 rounded-lg p-4 bg-red-50">
				<div class="flex items-center gap-2 mb-2">
					<span class="text-2xl">🔥</span>
					<h4 class="font-bold text-red-800">Do First</h4>
				</div>
				<p class="text-sm text-red-700 mb-2">Urgent & Important</p>
				<ul class="text-sm text-gray-700 space-y-1">
					<li>• High priority tasks</li>
					<li>• Due within 48 hours</li>
					<li>• Requires immediate attention</li>
				</ul>
			</div>

			<!-- Quadrant 2 -->
			<div class="border-2 border-green-300 rounded-lg p-4 bg-green-50">
				<div class="flex items-center gap-2 mb-2">
					<span class="text-2xl">📅</span>
					<h4 class="font-bold text-green-800">Schedule</h4>
				</div>
				<p class="text-sm text-green-700 mb-2">Not Urgent & Important</p>
				<ul class="text-sm text-gray-700 space-y-1">
					<li>• High/Medium priority tasks</li>
					<li>• Due after 48 hours</li>
					<li>• Plan and allocate time</li>
				</ul>
			</div>

			<!-- Quadrant 3 -->
			<div class="border-2 border-yellow-300 rounded-lg p-4 bg-yellow-50">
				<div class="flex items-center gap-2 mb-2">
					<span class="text-2xl">👥</span>
					<h4 class="font-bold text-yellow-800">Delegate</h4>
				</div>
				<p class="text-sm text-yellow-700 mb-2">Urgent & Not Important</p>
				<ul class="text-sm text-gray-700 space-y-1">
					<li>• Low priority tasks</li>
					<li>• Due within 48 hours</li>
					<li>• Consider delegating</li>
				</ul>
			</div>

			<!-- Quadrant 4 -->
			<div class="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
				<div class="flex items-center gap-2 mb-2">
					<span class="text-2xl">🗑️</span>
					<h4 class="font-bold text-gray-800">Eliminate</h4>
				</div>
				<p class="text-sm text-gray-700 mb-2">Not Urgent & Not Important</p>
				<ul class="text-sm text-gray-700 space-y-1">
					<li>• Low priority tasks</li>
					<li>• Due after 48 hours</li>
					<li>• Consider removing</li>
				</ul>
			</div>
		</div>
	</div>

	<!-- About -->
	<div class="bg-white rounded-lg shadow-md p-6">
		<h3 class="text-xl font-bold text-gray-900 mb-4">About Task Matrix</h3>
		<p class="text-gray-700 mb-4">
			Task Matrix is a professional-grade task management application built with SvelteKit,
			implementing the Eisenhower Matrix methodology for prioritizing tasks based on urgency and
			importance.
		</p>
		<div class="flex flex-wrap gap-2">
			<span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
				SvelteKit 5
			</span>
			<span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
				TypeScript
			</span>
			<span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
				Svelte Stores
			</span>
			<span class="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm font-medium">
				LocalStorage
			</span>
			<span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
				Animations
			</span>
		</div>
	</div>
</div>
