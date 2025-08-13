import { getAgentById } from '$lib/stores/agents';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ params }) => {
	const agentId = params.id;
	const isNewAgent = agentId === 'new';

	let agent;
	if (isNewAgent) {
		// Initialize new agent
		agent = {
			id: '',
			name: '',
			description: '',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			datastoreIds: [],
			guidance: {
				generalInstructions: '',
				tableSemantics: {},
				customPrompts: []
			},
			isActive: true
		};
	} else {
		agent = await getAgentById(agentId);
		if (!agent) {
			throw new Error('Agent not found');
		}
	}

	return {
		agent
	};
};
