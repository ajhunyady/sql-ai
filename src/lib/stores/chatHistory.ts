import { writable } from 'svelte/store';
import type { ChatHistoryItem, ChatHistoryFormData } from '$lib/models/conversation';
import { chatHistoryApi } from '$lib/services/api';

// Create writable stores for chat history data and loading state
export const chatHistory = writable<ChatHistoryItem[]>([]);
export const chatHistoryLoading = writable<boolean>(false);
export const chatHistoryError = writable<string | null>(null);

// Load all chat history from the service worker
export async function loadChatHistory(): Promise<void> {
	chatHistoryLoading.set(true);
	chatHistoryError.set(null);

	try {
		const data = await chatHistoryApi.getAll();
		chatHistory.set(data);
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Failed to load chat history';
		chatHistoryError.set(message);
		console.error('Error loading chat history:', error);
	} finally {
		chatHistoryLoading.set(false);
	}
}

// Create a new chat history item
export async function createChatHistoryItem(data: ChatHistoryFormData): Promise<ChatHistoryItem | null> {
	chatHistoryError.set(null);

	try {
		const newChatItem = await chatHistoryApi.create(data);

		// Update the local store
		chatHistory.update((currentHistory) => [...currentHistory, newChatItem]);

		return newChatItem;
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Failed to create chat history item';
		chatHistoryError.set(message);
		console.error('Error creating chat history item:', error);
		return null;
	}
}

// Set the active chat history item
export async function setActiveChatHistoryItem(activeId: string): Promise<boolean> {
	chatHistoryError.set(null);

	try {
		const updatedHistory = await chatHistoryApi.setActive(activeId);

		// Update the local store
		chatHistory.set(updatedHistory);

		return true;
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Failed to set active chat history item';
		chatHistoryError.set(message);
		console.error('Error setting active chat history item:', error);
		return false;
	}
}

// Get the currently active chat history item
export function getActiveChatHistoryItem(): ChatHistoryItem | null {
	let activeItem: ChatHistoryItem | null = null;

	chatHistory.subscribe((history) => {
		activeItem = history.find(item => item.active) || null;
	})();

	return activeItem;
}

// Initialize the store by loading chat history
if (typeof window !== 'undefined') {
	loadChatHistory();
}
