export function formatDate(date: Date): string {
	return new Intl.DateTimeFormat('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	}).format(date);
}

export function formatDateShort(date: Date): string {
	return new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	}).format(date);
}

export function formatDateForInput(date: Date): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

export function formatRelativeTime(date: Date): string {
	const now = new Date();
	const diffMs = date.getTime() - now.getTime();
	const diffSeconds = Math.floor(Math.abs(diffMs) / 1000);
	const isPast = diffMs < 0;

	if (diffSeconds < 60) {
		return isPast ? 'just now' : 'in a moment';
	}

	const diffMinutes = Math.floor(diffSeconds / 60);
	if (diffMinutes < 60) {
		const unit = diffMinutes === 1 ? 'minute' : 'minutes';
		return isPast ? `${diffMinutes} ${unit} ago` : `in ${diffMinutes} ${unit}`;
	}

	const diffHours = Math.floor(diffMinutes / 60);
	if (diffHours < 24) {
		const unit = diffHours === 1 ? 'hour' : 'hours';
		return isPast ? `${diffHours} ${unit} ago` : `in ${diffHours} ${unit}`;
	}

	const diffDays = Math.floor(diffHours / 24);
	if (diffDays < 30) {
		const unit = diffDays === 1 ? 'day' : 'days';
		return isPast ? `${diffDays} ${unit} ago` : `in ${diffDays} ${unit}`;
	}

	const diffMonths = Math.floor(diffDays / 30);
	const unit = diffMonths === 1 ? 'month' : 'months';
	return isPast ? `${diffMonths} ${unit} ago` : `in ${diffMonths} ${unit}`;
}

export function isDateUrgent(date: Date): boolean {
	const now = new Date();
	const diffMs = date.getTime() - now.getTime();
	const diffHours = diffMs / (1000 * 60 * 60);
	return diffHours <= 48 && diffHours >= 0;
}

export function isDateOverdue(date: Date): boolean {
	return date.getTime() < new Date().getTime();
}

export function getDaysUntil(date: Date): number {
	const now = new Date();
	const diffMs = date.getTime() - now.getTime();
	return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function parseDate(dateInput: string | Date): Date {
	if (dateInput instanceof Date) {
		return dateInput;
	}
	return new Date(dateInput);
}

export function isSameDay(date1: Date, date2: Date): boolean {
	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate()
	);
}

export function getStartOfDay(date: Date): Date {
	const newDate = new Date(date);
	newDate.setHours(0, 0, 0, 0);
	return newDate;
}

export function getEndOfDay(date: Date): Date {
	const newDate = new Date(date);
	newDate.setHours(23, 59, 59, 999);
	return newDate;
}
