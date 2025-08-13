export type DatastoreType = 'surrealdb' | 'postgres' | 'custom';

export interface Datastore {
	id: string;
	name: string;
	type: DatastoreType;
	connectionString: string;
	createdAt: string;
	updatedAt: string;
	isActive: boolean;
}

export interface DatastoreFormData {
	name: string;
	type: DatastoreType;
	connectionString: string;
}
