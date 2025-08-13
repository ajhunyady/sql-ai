export interface Agent {
	id: string;
	name: string;
	description: string;
	createdAt: string;
	updatedAt: string;
	llmProviderId?: string;
	datastoreIds: string[];
	guidance: Guidance;
	isActive: boolean;
}

export interface Guidance {
	generalInstructions: string;
	tableSemantics: Record<string, string>; // tableName -> semantics
	customPrompts: string[];
}

export interface AgentFormData {
	name: string;
	description: string;
	llmProviderId?: string;
	datastoreIds: string[];
	guidance: Guidance;
}
