<script lang="ts">
	import { page } from '$app/stores';
	import { taskStats } from '$lib/stores/taskStore';
	import { fly } from 'svelte/transition';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	const stats = $derived($taskStats);

	let mobileMenuOpen = $state(false);

	const navItems = [
		{ path: '/', label: 'Dashboard', icon: 'grid' },
		{ path: '/settings', label: 'Settings', icon: 'cog' }
	];

	function isActive(path: string): boolean {
		return $page.url.pathname === path;
	}

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}
</script>

<div class="min-h-screen bg-gray-50">
	<header class="bg-white shadow-sm border-b border-gray-200">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-xl sm:text-2xl font-bold text-gray-900">Task Matrix</h1>
					<p class="text-xs sm:text-sm text-gray-600 hidden sm:block">
						Eisenhower Matrix Task Management
					</p>
				</div>

				<!-- Desktop Stats -->
				<div class="hidden md:flex items-center gap-4">
					<div class="text-right">
						<p class="text-sm text-gray-600">Total Tasks</p>
						<p class="text-xl font-bold text-gray-900">{stats.total}</p>
					</div>
					<div class="text-right">
						<p class="text-sm text-gray-600">Completed</p>
						<p class="text-xl font-bold text-green-600">{stats.completed}</p>
					</div>
					<div class="text-right">
						<p class="text-sm text-gray-600">Progress</p>
						<p class="text-xl font-bold text-blue-600">{stats.completionPercentage}%</p>
					</div>
				</div>

				<!-- Mobile Menu Button -->
				<button
					onclick={toggleMobileMenu}
					class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
					aria-label="Toggle navigation menu"
					aria-expanded={mobileMenuOpen}
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
				</button>
			</div>

			<!-- Mobile Stats (below header) -->
			<div class="md:hidden mt-4 grid grid-cols-3 gap-2">
				<div class="text-center p-2 bg-gray-50 rounded">
					<p class="text-xs text-gray-600">Total</p>
					<p class="text-lg font-bold text-gray-900">{stats.total}</p>
				</div>
				<div class="text-center p-2 bg-gray-50 rounded">
					<p class="text-xs text-gray-600">Done</p>
					<p class="text-lg font-bold text-green-600">{stats.completed}</p>
				</div>
				<div class="text-center p-2 bg-gray-50 rounded">
					<p class="text-xs text-gray-600">Progress</p>
					<p class="text-lg font-bold text-blue-600">{stats.completionPercentage}%</p>
				</div>
			</div>
		</div>
	</header>

	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
		<div class="flex gap-6">
			<!-- Desktop Sidebar Navigation -->
			<aside class="hidden md:block w-64 shrink-0">
				<nav class="bg-white rounded-lg shadow-sm p-4" aria-label="Main navigation">
					<ul class="space-y-2">
						{#each navItems as item}
							<li>
								<a
									href={item.path}
									class="flex items-center gap-3 px-4 py-2 rounded-lg transition-colors {isActive(
										item.path
									)
										? 'bg-blue-50 text-blue-700 font-medium'
										: 'text-gray-700 hover:bg-gray-50'}"
									aria-current={isActive(item.path) ? 'page' : undefined}
								>
									{#if item.icon === 'grid'}
										<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
											/>
										</svg>
									{:else}
										<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
											/>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
											/>
										</svg>
									{/if}
									<span>{item.label}</span>
								</a>
							</li>
						{/each}
					</ul>
				</nav>
			</aside>

			<!-- Mobile Navigation Overlay -->
			{#if mobileMenuOpen}
				<div
					class="md:hidden fixed inset-0 z-50 bg-black/50 bg-opacity-50"
					onclick={closeMobileMenu}
					transition:fly={{ x: -300, duration: 300 }}
				>
					<nav
						class="absolute top-0 left-0 bottom-0 w-64 bg-white shadow-xl p-4"
						onclick={(e) => e.stopPropagation()}
						aria-label="Mobile navigation"
					>
						<div class="flex items-center justify-between mb-6">
							<h2 class="text-lg font-bold text-gray-900">Menu</h2>
							<button
								onclick={closeMobileMenu}
								class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
								aria-label="Close menu"
							>
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>
						<ul class="space-y-2">
							{#each navItems as item}
								<li>
									<a
										href={item.path}
										onclick={closeMobileMenu}
										class="flex items-center gap-3 px-4 py-2 rounded-lg transition-colors {isActive(
											item.path
										)
											? 'bg-blue-50 text-blue-700 font-medium'
											: 'text-gray-700 hover:bg-gray-50'}"
										aria-current={isActive(item.path) ? 'page' : undefined}
									>
										{#if item.icon === 'grid'}
											<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
												/>
											</svg>
										{:else}
											<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
												/>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
												/>
											</svg>
										{/if}
										<span>{item.label}</span>
									</a>
								</li>
							{/each}
						</ul>
					</nav>
				</div>
			{/if}

			<!-- Main Content -->
			<main class="flex-1 min-w-0 w-full" transition:fly={{ x: 20, duration: 300 }}>
				{@render children()}
			</main>
		</div>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		font-family:
			-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
	}
</style>
