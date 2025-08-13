export type DatastoreType = 'surrealdb' | 'postgres' | 'custom';

export interface Datastore {
  id: string;
  name: string;
  type: DatastoreType;
  connectionString: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface DatastoreFormData {
  name: string;
  type: DatastoreType;
  connectionString: string;
}