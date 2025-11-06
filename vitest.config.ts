import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { fileURLToPath } from 'url';

export default defineConfig({
	plugins: [svelte({ hot: !process.env.VITEST })],
	resolve: {
		alias: {
			$lib: fileURLToPath(new URL('./src/lib', import.meta.url)),
			$app: fileURLToPath(new URL('./.svelte-kit/runtime/app', import.meta.url))
		}
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./src/lib/tests/setup.ts'],
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
