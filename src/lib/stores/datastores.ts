import type { Datastore, DatastoreFormData, DatastoreType } from '$lib/models/datastore';

// In a real app, this would be replaced with actual API calls
let datastores: Datastore[] = [
  {
    id: 'postgres-1',
    name: 'Production PostgreSQL',
    type: 'postgres',
    connectionString: 'postgresql://user:password@host:5432/database',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    isActive: true
  },
  {
    id: 'surrealdb-1',
    name: 'Analytics SurrealDB',
    type: 'surrealdb',
    connectionString: 'ws://localhost:8000/rpc',
    createdAt: new Date('2023-01-10'),
    updatedAt: new Date('2023-01-10'),
    isActive: true
  }
];

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function getDatastores(): Datastore[] {
  return datastores;
}

export function getDatastoreById(id: string): Datastore | undefined {
  return datastores.find(datastore => datastore.id === id);
}

export function createDatastore(data: DatastoreFormData): Datastore {
  const newDatastore: Datastore = {
    id: generateId(),
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true
  };
  
  datastores = [...datastores, newDatastore];
  return newDatastore;
}

export function updateDatastore(id: string, data: DatastoreFormData): Datastore | undefined {
  const index = datastores.findIndex(datastore => datastore.id === id);
  if (index === -1) return undefined;
  
  const updatedDatastore: Datastore = {
    ...datastores[index],
    ...data,
    id: datastores[index].id, // Preserve the original ID
    updatedAt: new Date()
  };
  
  datastores = [...datastores.slice(0, index), updatedDatastore, ...datastores.slice(index + 1)];
  return updatedDatastore;
}

export function deleteDatastore(id: string): boolean {
  const initialLength = datastores.length;
  datastores = datastores.filter(datastore => datastore.id !== id);
  return datastores.length !== initialLength;
}

export function validateDatastore(datastore: Datastore): Promise<boolean> {
  // In a real app, this would make an API call to test the connection
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate validation (always succeeds in this example)
      resolve(true);
    }, 1000);
  });
}