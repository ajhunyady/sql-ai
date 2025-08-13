import { writable } from 'svelte/store';
import type { Datastore, DatastoreFormData } from '$lib/models/datastore';
import { datastoreApi } from '$lib/services/api';

// Create writable stores for datastores data and loading state
export const datastores = writable<Datastore[]>([]);
export const datastoresLoading = writable<boolean>(false);
export const datastoresError = writable<string | null>(null);

// Load all datastores from the service worker
export async function loadDatastores(): Promise<void> {
	datastoresLoading.set(true);
	datastoresError.set(null);

	try {
		const data = await datastoreApi.getAll();
		datastores.set(data);
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Failed to load datastores';
		datastoresError.set(message);
		console.error('Error loading datastores:', error);
	} finally {
		datastoresLoading.set(false);
	}
}

// Get a single datastore by ID
export async function getDatastoreById(id: string): Promise<Datastore | null> {
	try {
		return await datastoreApi.getById(id);
	} catch (error) {
		console.error('Error getting datastore:', error);
		return null;
	}
}

// Create a new datastore
export async function createDatastore(data: DatastoreFormData): Promise<Datastore | null> {
	datastoresError.set(null);

	try {
		const newDatastore = await datastoreApi.create(data);

		// Update the local store
		datastores.update((currentDatastores) => [...currentDatastores, newDatastore]);

		return newDatastore;
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Failed to create datastore';
		datastoresError.set(message);
		console.error('Error creating datastore:', error);
		return null;
	}
}

// Update an existing datastore
export async function updateDatastore(
	id: string,
	data: DatastoreFormData
): Promise<Datastore | null> {
	datastoresError.set(null);

	try {
		const updatedDatastore = await datastoreApi.update(id, data);

		// Update the local store
		datastores.update((currentDatastores) =>
			currentDatastores.map((datastore) => (datastore.id === id ? updatedDatastore : datastore))
		);

		return updatedDatastore;
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Failed to update datastore';
		datastoresError.set(message);
		console.error('Error updating datastore:', error);
		return null;
	}
}

// Delete a datastore
export async function deleteDatastore(id: string): Promise<boolean> {
	datastoresError.set(null);

	try {
		await datastoreApi.delete(id);

		// Update the local store
		datastores.update((currentDatastores) =>
			currentDatastores.filter((datastore) => datastore.id !== id)
		);

		return true;
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Failed to delete datastore';
		datastoresError.set(message);
		console.error('Error deleting datastore:', error);
		return false;
	}
}

// Validate a datastore
export async function validateDatastore(
	datastore: Datastore
): Promise<{ valid: boolean; message: string }> {
	try {
		return await datastoreApi.validate(datastore);
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Failed to validate datastore';
		console.error('Error validating datastore:', error);
		return { valid: false, message };
	}
}

// Initialize the store by loading datastores
if (typeof window !== 'undefined') {
	loadDatastores();
}
