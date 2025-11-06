import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import sveltePlugin from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import prettierConfig from 'eslint-config-prettier';

export default [
	js.configs.recommended,
	{
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaVersion: 2022,
				sourceType: 'module',
				project: './tsconfig.json'
			}
		},
		plugins: {
			'@typescript-eslint': tsPlugin
		},
		rules: {
			...tsPlugin.configs.recommended.rules,
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
			],
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-explicit-any': 'warn'
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: tsParser,
				extraFileExtensions: ['.svelte']
			}
		},
		plugins: {
			svelte: sveltePlugin
		},
		rules: {
			...sveltePlugin.configs.recommended.rules,
			'svelte/no-unused-svelte-ignore': 'warn',
			'svelte/valid-compile': 'error',
			'svelte/no-at-html-tags': 'warn'
		}
	},
	{
		ignores: [
			'.svelte-kit/**',
			'build/**',
			'dist/**',
			'node_modules/**',
			'*.config.js',
			'*.config.ts'
		]
	},
	prettierConfig
];
