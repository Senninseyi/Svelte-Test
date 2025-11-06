export function generateId(): string {
	return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function deepClone<T>(obj: T): T {
	return JSON.parse(JSON.stringify(obj));
}

export function isDefined<T>(value: T | null | undefined): value is T {
	return value !== null && value !== undefined;
}

export function safeArrayAccess<T>(arr: T[], index: number): T | undefined {
	return arr[index];
}

export function groupBy<T, K extends keyof T>(arr: T[], key: K): Record<string, T[]> {
	return arr.reduce(
		(acc, item) => {
			const groupKey = String(item[key]);
			if (!acc[groupKey]) {
				acc[groupKey] = [];
			}
			acc[groupKey].push(item);
			return acc;
		},
		{} as Record<string, T[]>
	);
}

export function multiSort<T>(
	arr: T[],
	compareFns: Array<(a: T, b: T) => number>
): T[] {
	return arr.sort((a, b) => {
		for (const compareFn of compareFns) {
			const result = compareFn(a, b);
			if (result !== 0) return result;
		}
		return 0;
	});
}

export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

export function calculatePercentage(part: number, total: number): number {
	if (total === 0) return 0;
	return Math.round((part / total) * 100);
}

export function truncate(str: string, maxLength: number): string {
	if (str.length <= maxLength) return str;
	return str.slice(0, maxLength - 3) + '...';
}

export function capitalize(str: string): string {
	if (!str) return '';
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatNumber(num: number): string {
	return num.toLocaleString();
}
