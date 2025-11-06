/**
 * localStorage utility with throttle/debounce mechanism
 */

/**
 * Throttle function - ensures function is called at most once per specified interval
 */
export function throttle<T extends (...args: any[]) => void>(
	func: T,
	wait: number
): (...args: Parameters<T>) => void {
	let timeout: ReturnType<typeof setTimeout> | null = null;
	let lastRan: number | null = null;

	return function (this: any, ...args: Parameters<T>) {
		if (!lastRan) {
			func.apply(this, args);
			lastRan = Date.now();
		} else {
			if (timeout) clearTimeout(timeout);

			timeout = setTimeout(() => {
				if (Date.now() - (lastRan as number) >= wait) {
					func.apply(this, args);
					lastRan = Date.now();
				}
			}, wait - (Date.now() - lastRan));
		}
	};
}

/**
 * Debounce function - delays function execution until after wait time has elapsed since last call
 */
export function debounce<T extends (...args: any[]) => void>(
	func: T,
	wait: number
): (...args: Parameters<T>) => void {
	let timeout: ReturnType<typeof setTimeout> | null = null;

	return function (this: any, ...args: Parameters<T>) {
		if (timeout) clearTimeout(timeout);

		timeout = setTimeout(() => {
			func.apply(this, args);
		}, wait);
	};
}

/**
 * Safe localStorage wrapper with error handling
 */
export const storage = {
	/**
	 * Get item from localStorage
	 */
	get<T>(key: string, defaultValue: T): T {
		if (typeof window === 'undefined') {
			return defaultValue;
		}

		try {
			const item = window.localStorage.getItem(key);
			return item ? JSON.parse(item) : defaultValue;
		} catch (error) {
			console.error(`Error reading from localStorage (key: ${key}):`, error);
			return defaultValue;
		}
	},

	/**
	 * Set item in localStorage
	 */
	set<T>(key: string, value: T): void {
		if (typeof window === 'undefined') {
			return;
		}

		try {
			window.localStorage.setItem(key, JSON.stringify(value));
		} catch (error) {
			console.error(`Error writing to localStorage (key: ${key}):`, error);
		}
	},

	/**
	 * Remove item from localStorage
	 */
	remove(key: string): void {
		if (typeof window === 'undefined') {
			return;
		}

		try {
			window.localStorage.removeItem(key);
		} catch (error) {
			console.error(`Error removing from localStorage (key: ${key}):`, error);
		}
	},

	/**
	 * Clear all items from localStorage
	 */
	clear(): void {
		if (typeof window === 'undefined') {
			return;
		}

		try {
			window.localStorage.clear();
		} catch (error) {
			console.error('Error clearing localStorage:', error);
		}
	}
};

/**
 * Create a throttled localStorage setter
 */
export function createThrottledStorage<T>(key: string, wait: number = 500) {
	const throttledSet = throttle((value: T) => {
		storage.set(key, value);
	}, wait);

	return {
		get: () => storage.get<T>(key, null as T),
		set: throttledSet,
		setImmediate: (value: T) => storage.set(key, value),
		remove: () => storage.remove(key)
	};
}

/**
 * Create a debounced localStorage setter
 */
export function createDebouncedStorage<T>(key: string, wait: number = 500) {
	const debouncedSet = debounce((value: T) => {
		storage.set(key, value);
	}, wait);

	return {
		get: () => storage.get<T>(key, null as T),
		set: debouncedSet,
		setImmediate: (value: T) => storage.set(key, value),
		remove: () => storage.remove(key)
	};
}
