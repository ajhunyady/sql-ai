// Database Reset Utility
// This utility provides functions to reset the IndexedDB database when schema issues occur

import { browser } from '$app/environment';

export interface DatabaseResetResult {
	success: boolean;
	message: string;
	error?: string;
}

/**
 * Reset the service worker database by calling the management API
 */
export async function resetServiceWorkerDatabase(): Promise<DatabaseResetResult> {
	if (!browser) {
		return {
			success: false,
			message: 'Database reset can only be performed in the browser'
		};
	}

	try {
		const response = await fetch('/api/management/reset-database', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
			throw new Error(errorData.error || `HTTP ${response.status}`);
		}

		const result = await response.json();
		return {
			success: true,
			message: result.message || 'Database reset successfully'
		};
	} catch (error) {
		console.error('Failed to reset service worker database:', error);
		return {
			success: false,
			message: 'Failed to reset database',
			error: error instanceof Error ? error.message : 'Unknown error'
		};
	}
}

/**
 * Reset the client-side IndexedDB database directly
 */
export async function resetClientDatabase(): Promise<DatabaseResetResult> {
	if (!browser) {
		return {
			success: false,
			message: 'Database reset can only be performed in the browser'
		};
	}

	try {
		// Delete the IndexedDB database
		await new Promise<void>((resolve, reject) => {
			const deleteRequest = indexedDB.deleteDatabase('CoAgentDB');

			deleteRequest.onsuccess = () => {
				console.log('Client database deleted successfully');
				resolve();
			};

			deleteRequest.onerror = () => {
				console.error('Failed to delete client database:', deleteRequest.error);
				reject(deleteRequest.error);
			};

			deleteRequest.onblocked = () => {
				console.warn('Database deletion blocked - please close other tabs');
				// Continue anyway, it might work
				setTimeout(() => resolve(), 1000);
			};
		});

		return {
			success: true,
			message: 'Client database deleted successfully'
		};
	} catch (error) {
		console.error('Failed to reset client database:', error);
		return {
			success: false,
			message: 'Failed to reset client database',
			error: error instanceof Error ? error.message : 'Unknown error'
		};
	}
}

/**
 * Comprehensive database reset - resets both client and service worker databases
 */
export async function resetAllDatabases(): Promise<DatabaseResetResult> {
	if (!browser) {
		return {
			success: false,
			message: 'Database reset can only be performed in the browser'
		};
	}

	try {
		// First reset the client database
		const clientResult = await resetClientDatabase();
		if (!clientResult.success) {
			return clientResult;
		}

		// Then reset the service worker database
		const swResult = await resetServiceWorkerDatabase();
		if (!swResult.success) {
			return swResult;
		}

		// Force page reload to ensure clean state
		setTimeout(() => {
			window.location.reload();
		}, 500);

		return {
			success: true,
			message: 'All databases reset successfully. Page will reload shortly.'
		};
	} catch (error) {
		console.error('Failed to reset databases:', error);
		return {
			success: false,
			message: 'Failed to reset databases',
			error: error instanceof Error ? error.message : 'Unknown error'
		};
	}
}

/**
 * Check if the database has schema issues by testing basic operations
 */
export async function checkDatabaseHealth(): Promise<boolean> {
	if (!browser) {
		return false;
	}

	try {
		// Test if we can perform basic API operations
		const response = await fetch('/api/conversations', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		return response.ok;
	} catch (error) {
		console.error('Database health check failed:', error);
		return false;
	}
}

/**
 * Auto-detect and fix database issues
 */
export async function autoFixDatabaseIssues(): Promise<DatabaseResetResult> {
	if (!browser) {
		return {
			success: false,
			message: 'Database fix can only be performed in the browser'
		};
	}

	try {
		console.log('Checking database health...');
		const isHealthy = await checkDatabaseHealth();

		if (isHealthy) {
			return {
				success: true,
				message: 'Database is healthy, no action needed'
			};
		}

		console.log('Database issues detected, attempting automatic fix...');
		return await resetAllDatabases();
	} catch (error) {
		console.error('Auto-fix failed:', error);
		return {
			success: false,
			message: 'Auto-fix failed',
			error: error instanceof Error ? error.message : 'Unknown error'
		};
	}
}

/**
 * Show a user-friendly database reset dialog
 */
export function showDatabaseResetDialog(): void {
	if (!browser) return;

	const message = `
It looks like there's an issue with the database. This can happen when the app is updated.

Would you like to reset the database? This will:
• Clear all stored data
• Reset to default demo data
• Reload the page

Click OK to proceed or Cancel to continue with potential issues.
	`.trim();

	if (confirm(message)) {
		resetAllDatabases().then((result) => {
			if (!result.success) {
				alert(`Database reset failed: ${result.error || result.message}`);
			}
		});
	}
}

/**
 * Initialize database error handling
 */
export function initializeDatabaseErrorHandling(): void {
	if (!browser) return;

	// Listen for database errors
	window.addEventListener('error', (event) => {
		if (event.error?.message?.includes('IndexedDB') ||
			event.error?.message?.includes('NotFoundError') ||
			event.error?.message?.includes('object store')) {
			console.warn('Database error detected:', event.error);

			// Show reset dialog after a short delay to avoid interrupting user flow
			setTimeout(() => {
				showDatabaseResetDialog();
			}, 1000);
		}
	});

	// Listen for unhandled promise rejections related to database
	window.addEventListener('unhandledrejection', (event) => {
		if (event.reason?.message?.includes('IndexedDB') ||
			event.reason?.message?.includes('NotFoundError') ||
			event.reason?.message?.includes('object store')) {
			console.warn('Database promise rejection detected:', event.reason);

			// Show reset dialog after a short delay
			setTimeout(() => {
				showDatabaseResetDialog();
			}, 1000);
		}
	});
}
