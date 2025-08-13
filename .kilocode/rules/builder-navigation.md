# Builder Navigation Structure

This document outlines the new navigation structure for the Builder section of the application.

## Overview

The Builder section has been restructured to use a clean navigation sidebar with three main sections:
- **Agents**: Manage AI agents and their configurations
- **LLM Providers**: Configure language model providers
- **Datastores**: Manage database connections

## Route Structure

### Main Routes

- `/builder` - Redirects to `/builder/agents`
- `/builder/agents` - Agent list page (default landing page)
- `/builder/llm-providers` - LLM providers list page
- `/builder/datastores` - Datastores list page

### CRUD Routes

#### Agents
- `/builder/agents` - List all agents
- `/builder/agents/new` - Create new agent
- `/builder/agents/[id]` - Edit existing agent

#### LLM Providers
- `/builder/llm-providers` - List all LLM providers
- `/builder/llm-providers/new` - Create new LLM provider
- `/builder/llm-providers/[id]` - Edit existing LLM provider

#### Datastores
- `/builder/datastores` - List all datastores
- `/builder/datastores/new` - Create new datastore
- `/builder/datastores/[id]` - Edit existing datastore

## Navigation Behavior

1. **Default Landing**: When users navigate to `/builder`, they are automatically redirected to `/builder/agents`
2. **Active State**: The sidebar shows the active section with visual highlighting
3. **Consistent Layout**: All pages use the same sidebar and main content area layout

## Page Components

### Sidebar Component
- `BuilderSidebar.svelte` - Contains navigation links for all three sections
- Shows active state based on current route
- Uses Flowbite icons and consistent styling

### List Pages
Each section has a list page with:
- Header with section title and description
- "New [Item]" button in the top right
- Table view of existing items
- Edit and delete actions for each item
- Empty state messaging when no items exist

### Form Pages
Each section has form pages for creating/editing with:
- Back navigation to list page
- Form validation
- Success/error messaging
- Reset and cancel functionality
- Loading states during submission

## Data Management

### Stores
- `agents.ts` - Agent data and operations
- `llm-providers.ts` - LLM provider data and operations
- `datastores.ts` - Datastore data and operations

### CRUD Operations
Each store provides:
- `get[Items]()` - Retrieve all items
- `get[Item]ById(id)` - Retrieve single item
- `create[Item](data)` - Create new item
- `update[Item](id, data)` - Update existing item
- `delete[Item](id)` - Delete item

## Styling Guidelines

### Consistent Visual Design
- Dark theme with slate colors
- Blue accent colors for primary actions
- Consistent spacing and typography
- Backdrop blur effects for glass morphism
- Hover states and transitions

### Icon Usage
- `FolderSolid` - Agents (blue)
- `CogSolid` - LLM Providers (green)
- `DatabaseSolid` - Datastores (purple)
- `PlusOutline` - Add/Create actions
- `EditOutline` - Edit actions
- `TrashBinOutline` - Delete actions

## Form Validation

### LLM Providers
- Provider name is required
- API key required for most provider types (except Ollama)
- Base URL required for Ollama and custom providers
- Model name is required

### Datastores
- Datastore name is required
- Connection string is required
- Basic format validation for connection strings

### Agents
- Agent name is required
- Description is optional
- LLM provider and datastore selections are optional but affect configuration status

## Error Handling

### Form Errors
- Client-side validation with immediate feedback
- Server-side error display in alert components
- Field-level validation messages

### Icon Compatibility
- Uses available Flowbite Svelte icons
- Fallback to `ExclamationCircleSolid` for error states
- Consistent icon sizing and positioning

## Accessibility

### Keyboard Navigation
- Tab navigation through all interactive elements
- Enter and Space key support for custom buttons
- Proper focus management

### ARIA Labels
- Descriptive labels for all interactive elements
- Role attributes for custom components
- Screen reader friendly content

## Performance Considerations

### State Management
- Reactive stores with efficient updates
- Minimal re-renders with proper state isolation
- Client-side routing for fast navigation

### Build Optimization
- Component code splitting
- Icon tree shaking
- CSS optimization with Tailwind

This structure provides a scalable foundation for managing all builder resources with consistent UX patterns and maintainable code organization.