LLM based natural language datastore querying system. Application has two main sections, "Analyst" and "Builder". These two are visually isolated and the user navigated between them if needed.

## Overview

### Analyst

Analyst section allows users to enter a natural language question about their data and receive an answer from an LLM which has access to data sets defined by the builder.

### Builder

The builder section allows creation and managment of agents. Agents are configured with access to specific datastores, LLM model, and querying guidance. A goal is to allow optimizing the agent by reviewing performance (evals) and tweaking the guidance and perhaps change the LLM model config.

We need CRUD operations on every entity.

The main entitiy here is Agent which is composed of reusable entities. Reusable entities are LLM provider, datastore integration.

Use sidebar for navigation.

#### Agent editing is complex and has tabs:

1. Metadata Tab
This tab allows users to define basic agent details, such as name and description. Serves as the default landing tab for new agents.

2. Data and Integrations Tab
Users add connections to integrations (data stores and tools. Should allow selecting existing integrations also creating one inline. Should reuse code.

3. LLM Configuration Tab
Tab for integrating external LLMs. Users create or reuse provider credentials (e.g., API keys) and select a model. Validation ensures completion before other tabs can fully function.

4. Querying Guidance Tab
Structured builder for defining LLM guidance. Users add text (general, table semantic info), which compile into a system prompt preview.

5. Testing Tab
Playground for iterating on the agent. Prompt input and output. Includes log viewer, performance analytics (e.g., charts, metrics).

6. Evaluations Tab
Define and run evaluation suites. Test cases with metrics; results integrate with analytics. side-by-side comparison with previous runs.

7. Monitoring Tab
Post-deployment view with logs, performance metrics, and alerts. Displays ongoing agent activity.

#### Integrations
Configure connections to data stores (SurrealDB, Postgres) and add custom mcp tools. Validate connections in real-time.

#### LLM Provider
Allow configuring OpenAI, Anthropic, xAI, Ollama, and custom. Should allow multiple instances of custom with user defined name.

## Routes