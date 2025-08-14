import { expect, test } from '@playwright/test';

/**
 * Comprehensive Playwright tests for the Analyst Section
 *
 * This test suite covers:
 * - Page layout and structure (sidebar + main content)
 * - Sidebar functionality (search, chat history, new conversation button)
 * - Main content elements (welcome section, query input, conversation area)
 * - Query input functionality and interactions
 * - Visual styling and CSS classes
 * - Accessibility features (ARIA labels, screen reader support)
 * - Responsive design elements
 * - Loading states and error handling
 * - Keyboard navigation
 * - Button interactivity
 *
 * The tests handle network error states gracefully since the backend APIs
 * (/api/chat-history, /api/conversations) are not available in the test environment.
 */
test.describe('Analyst Section', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/analyst');
	});

	test('should display the analyst page layout correctly', async ({ page }) => {
		// Check that the main layout is present
		await expect(page.locator('div.flex').first()).toBeVisible();

		// Check that sidebar is visible and positioned correctly
		await expect(page.locator('[aria-label="Chat navigation"]')).toBeVisible();
		await expect(page.locator('[aria-label="Chat navigation"]')).toHaveClass(/fixed top-20 left-0/);

		// Check that main content area is present
		await expect(page.locator('main')).toBeVisible();
		await expect(page.locator('main')).toHaveClass(/ml-72/);
	});

	test('sidebar should contain all expected elements', async ({ page }) => {
		// Check search box is present and functional
		const searchInput = page.locator('input[placeholder="Search conversations..."]');
		await expect(searchInput).toBeVisible();
		await expect(searchInput).toBeEnabled();

		// Check new conversation button
		const newChatButton = page.locator('[aria-label="Start a new conversation"]');
		await expect(newChatButton).toBeVisible();
		await expect(newChatButton).toContainText('New Conversation');

		// Check recent chats section
		await expect(page.locator('text=Recent Chats')).toBeVisible();

		// Check chat history list
		await expect(page.locator('[aria-label="Recent conversations"]')).toBeVisible();
	});

	test('search functionality should work in sidebar', async ({ page }) => {
		const searchInput = page.locator('input[placeholder="Search conversations..."]');

		// Type in search box
		await searchInput.fill('test search');
		await expect(searchInput).toHaveValue('test search');

		// Clear search
		await searchInput.clear();
		await expect(searchInput).toHaveValue('');
	});

	test('main content should display welcome section and query input', async ({ page }) => {
		// Check query input section is present
		const querySection = page.locator('section').filter({ hasText: 'Connected to:' });
		await expect(querySection).toBeVisible();

		// Check connection status indicator
		await expect(page.locator('text=Connected to:')).toBeVisible();
		await expect(page.locator('text=All agents')).toBeVisible();

		// Check data source selector button
		const selectSourceButton = page.locator('[aria-label="Select data source"]');
		await expect(selectSourceButton).toBeVisible();
		await expect(selectSourceButton).toContainText('Select Source');

		// Check query textarea
		const queryTextarea = page.locator('#query-input');
		await expect(queryTextarea).toBeVisible();
		await expect(queryTextarea).toHaveAttribute('placeholder', /Ask a question about your data/);

		// Check upload button
		const uploadButton = page.locator('[aria-label="Upload file"]');
		await expect(uploadButton).toBeVisible();

		// Check submit button
		const submitButton = page.locator('[aria-label="Submit query"]');
		await expect(submitButton).toBeVisible();
		await expect(submitButton).toContainText('Ask');
	});

	test('query input should be functional', async ({ page }) => {
		const queryTextarea = page.locator('#query-input');

		// Type in query
		const testQuery = 'Show me total sales by region for the last quarter';
		await queryTextarea.fill(testQuery);
		await expect(queryTextarea).toHaveValue(testQuery);

		// Clear query
		await queryTextarea.clear();
		await expect(queryTextarea).toHaveValue('');
	});

	test('conversation area should display appropriate state', async ({ page }) => {
		// Check conversation section exists
		const conversationSection = page.locator('section').last();
		await expect(conversationSection).toBeVisible();

		// Should show "No Conversation Selected" state initially
		// Check for either "No Conversation Selected" or error state
		const noConversationText = page.locator('text=No Conversation Selected');
		const errorText = page.locator('main').locator('text=Network error').first();
		const loadingText = page.locator('text=Loading conversation...');

		// Wait for one of these states to appear
		await expect(noConversationText.or(errorText).or(loadingText)).toBeVisible();
		// Only check for the select conversation message if "No Conversation Selected" is visible
		if (await noConversationText.isVisible()) {
			await expect(
				page.locator('text=Select a conversation from the sidebar to view the messages.')
			).toBeVisible();
		}
	});

	test('visual elements and styling should be applied correctly', async ({ page }) => {
		// Check that the sidebar has the correct backdrop blur styling
		const sidebar = page.locator('[aria-label="Chat navigation"]');
		await expect(sidebar).toHaveClass(/bg-slate-950\/80 backdrop-blur-xl/);

		// Check that the query input has glass panel styling
		const queryPanel = page.locator('.glass-panel-lg');
		await expect(queryPanel).toBeVisible();

		// Check that connection indicator has pulse animation
		const connectionIndicator = page.locator('.pulse-animation');
		await expect(connectionIndicator).toBeVisible();
		await expect(connectionIndicator).toHaveClass(/bg-green-500 rounded-full/);
	});

	test('accessibility features should be present', async ({ page }) => {
		// Check aria labels
		await expect(page.locator('[aria-label="Chat navigation"]')).toBeVisible();
		await expect(page.locator('[aria-label="Start a new conversation"]')).toBeVisible();
		await expect(page.locator('[aria-label="Recent conversations"]')).toBeVisible();
		await expect(page.locator('[aria-label="Select data source"]')).toBeVisible();
		await expect(page.locator('[aria-label="Upload file"]')).toBeVisible();
		await expect(page.locator('[aria-label="Submit query"]')).toBeVisible();

		// Check screen reader text
		await expect(page.locator('.sr-only', { hasText: 'Query Input' })).toBeAttached();
		await expect(page.locator('#query-help')).toBeAttached();

		// Check role attributes
		await expect(page.locator('[role="list"]')).toBeVisible();
	});

	test('responsive design elements should be present', async ({ page }) => {
		// Check that main content has responsive classes
		const mainContent = page.locator('main');
		await expect(mainContent).toHaveClass(/px-6 py-8/);

		// Check query panel has responsive padding
		const queryPanel = page.locator('.glass-panel-lg');
		await expect(queryPanel).toHaveClass(/p-6 md:p-8/);
	});

	test('chat history loading states should be handled', async ({ page }) => {
		// Initially, the chat history area should be present
		const chatHistoryArea = page.locator('[aria-label="Recent conversations"]');
		await expect(chatHistoryArea).toBeVisible();

		// Should show appropriate message when no conversations exist
		// This could be loading state, empty state, or error state
		const loadingState = page.locator('text=Loading conversations...');
		const emptyState = page.locator('text=No conversations yet');
		const searchEmptyState = page.locator('text=No conversations match your search');
		const errorState = page
			.locator('[aria-label="Chat navigation"]')
			.locator('text=Network error')
			.first();

		// Wait for one of these states to appear
		await expect(loadingState.or(emptyState).or(searchEmptyState).or(errorState)).toBeVisible();
	});

	test('keyboard navigation should work', async ({ page }) => {
		// Tab through focusable elements
		await page.keyboard.press('Tab');

		// Should be able to focus on search input
		const searchInput = page.locator('input[placeholder="Search conversations..."]');
		await searchInput.focus();
		await expect(searchInput).toBeFocused();

		// Should be able to navigate to query textarea
		const queryTextarea = page.locator('#query-input');
		await queryTextarea.focus();
		await expect(queryTextarea).toBeFocused();

		// Should be able to focus on buttons
		const newChatButton = page.locator('[aria-label="Start a new conversation"]');
		await newChatButton.focus();
		await expect(newChatButton).toBeFocused();
	});

	test('buttons should be interactive', async ({ page }) => {
		// New conversation button should be clickable
		const newChatButton = page.locator('[aria-label="Start a new conversation"]');
		await expect(newChatButton).toBeEnabled();

		// Select source button should be clickable
		const selectSourceButton = page.locator('[aria-label="Select data source"]');
		await expect(selectSourceButton).toBeEnabled();

		// Upload button should be clickable
		const uploadButton = page.locator('[aria-label="Upload file"]');
		await expect(uploadButton).toBeEnabled();

		// Submit button should be clickable
		const submitButton = page.locator('[aria-label="Submit query"]');
		await expect(submitButton).toBeEnabled();
	});
});
