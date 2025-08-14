export interface Message {
	id: string;
	type: 'user' | 'ai';
	content: string;
	timestamp: string;
	tableData?: TableRow[];
	sqlQuery?: string;
}

export interface TableRow {
	[key: string]: string | number;
}

export interface Conversation {
	id: string;
	title: string;
	messages: Message[];
	createdAt: string;
	updatedAt: string;
	isActive: boolean;
}

export interface ConversationFormData {
	title: string;
	messages: Message[];
}
