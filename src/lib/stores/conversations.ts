import { writable } from 'svelte/store';
import type { Conversation, ConversationFormData } from '$lib/models/conversation';
import { conversationApi } from '$lib/services/api';

// Create writable stores for conversations data and loading state
export const conversations = writable<Conversation[]>([]);
export const conversationsLoading = writable<boolean>(false);
export const conversationsError = writable<string | null>(null);
export const activeConversation = writable<Conversation | null>(null);

// Load all conversations from the service worker
export async function loadConversations(): Promise<void> {
	conversationsLoading.set(true);
	conversationsError.set(null);

	try {
		const data = await conversationApi.getAll();
		conversations.set(data);
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Failed to load conversations';
		conversationsError.set(message);
		console.error('Error loading conversations:', error);
	} finally {
		conversationsLoading.set(false);
	}
}

// Get a single conversation by ID
export async function getConversationById(id: string): Promise<Conversation | null> {
	try {
		const conversation = await conversationApi.getById(id);
		activeConversation.set(conversation);
		return conversation;
	} catch (error) {
		console.error('Error getting conversation:', error);
		return null;
	}
}

// Create a new conversation
export async function createConversation(data: ConversationFormData): Promise<Conversation | null> {
	conversationsError.set(null);

	try {
		const newConversation = await conversationApi.create(data);

		// Update the local store
		conversations.update((currentConversations) => [...currentConversations, newConversation]);

		return newConversation;
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Failed to create conversation';
		conversationsError.set(message);
		console.error('Error creating conversation:', error);
		return null;
	}
}

// Update an existing conversation
export async function updateConversation(id: string, data: ConversationFormData): Promise<Conversation | null> {
	conversationsError.set(null);

	try {
		const updatedConversation = await conversationApi.update(id, data);

		// Update the local store
		conversations.update((currentConversations) =>
			currentConversations.map((conversation) => (conversation.id === id ? updatedConversation : conversation))
		);

		// Update active conversation if it's the one being updated
		activeConversation.update((current) =>
			current && current.id === id ? updatedConversation : current
		);

		return updatedConversation;
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Failed to update conversation';
		conversationsError.set(message);
		console.error('Error updating conversation:', error);
		return null;
	}
}

// Delete a conversation
export async function deleteConversation(id: string): Promise<boolean> {
	conversationsError.set(null);

	try {
		await conversationApi.delete(id);

		// Update the local store
		conversations.update((currentConversations) =>
			currentConversations.filter((conversation) => conversation.id !== id)
		);

		// Clear active conversation if it's the one being deleted
		activeConversation.update((current) =>
			current && current.id === id ? null : current
		);

		return true;
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Failed to delete conversation';
		conversationsError.set(message);
		console.error('Error deleting conversation:', error);
		return false;
	}
}

// Set the active conversation
export function setActiveConversation(conversation: Conversation | null): void {
	activeConversation.set(conversation);
}

// Initialize the store by loading conversations
if (typeof window !== 'undefined') {
	loadConversations();
}
