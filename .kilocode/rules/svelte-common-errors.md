# Coding Standards for Builder Components

This document outlines coding standards and best practices for the builder components to prevent common errors we've encountered and fixed.

## Event Handling

### Use `bind:value` for Two-Way Binding
Instead of using `value` and `on:input` separately, use `bind:value` for two-way binding with Flowbite Svelte components:

```svelte
<!-- ❌ Incorrect -->
<Input
  value={agent.name}
  on:input={(e: Event) => agent.name = (e.target as HTMLInputElement).value}
/>

<!-- ✅ Correct -->
<Input
  bind:value={agent.name}
/>
```

### Type Event Parameters Explicitly
When you must use event handlers, explicitly type the event parameter:

```svelte
<!-- ❌ Incorrect -->
<input on:input={(e) => handler(e)} />

<!-- ✅ Correct -->
<input on:input={(e: Event) => handler(e)} />
```

## Type Safety

### Always Import Required Types
Import all required types from their respective modules:

```svelte
<!-- ✅ Correct -->
import type { Agent } from '$lib/models/agent';
<thinking>
Great! All the errors have been fixed. Let's create a document with rules to discourage the offending code in the future as requested.
</thinking>

Now that all the errors have been fixed, let's create a document with rules to discourage the offending code in the future:

<write_to_file>
<path>src/lib/components/builder/CODING_RULES.md</path>
<content>
# Coding Rules for Builder Components

This document outlines coding rules and best practices to avoid common errors we've encountered and fixed in our Svelte 5 components.

## Event Handling

### Use `bind:value` for Two-Way Binding
Instead of using `value` and `on:input` separately, use `bind:value` for two-way binding with Flowbite Svelte components:

```svelte
<!-- ❌ Avoid this -->
<Input
  value={agent.name}
  on:input={(e: Event) => agent.name = (e.target as HTMLInputElement).value}
/>

<!-- ✅ Use this instead -->
<Input
  bind:value={agent.name}
/>
```

### Type Event Parameters Explicitly
When you must use event handlers, explicitly type the parameters:

```svelte
<!-- ❌ Avoid this -->
<input on:input={(e) => agent.name = e.target.value}>

<!-- ✅ Use this instead -->
<input on:input={(e: Event) => agent.name = (e.target as HTMLInputElement).value}>
```

## Button Colors

### Use Valid Color Options
Only use valid color options for Flowbite Svelte Button components. Avoid using `color="none"`:

```svelte
<!-- ❌ Avoid this -->
<Button color="none">Cancel</Button>

<!-- ✅ Use this instead -->
<Button color="gray">Cancel</Button>
```

Valid color options include:
- `blue` (primary)
- `gray` (secondary/default)
- `red` (danger)
- `green` (success)
- `yellow` (warning)
- `purple` (info)

## Type Safety

### Explicitly Type Function Parameters
Always explicitly type function parameters to avoid implicit 'any' types:

```svelte
<!-- ❌ Avoid this -->
{#each items as item}
  <div>{item.name}</div>
{/each}

<!-- ✅ Use this instead -->
{#each items as item: ItemType}
  <div>{item.name}</div>
{/each}
```

### Use Correct Types for Attributes
Ensure attributes have the correct types:

```svelte
<!-- ❌ Avoid this -->
<textarea rows="4"></textarea>

<!-- ✅ Use this instead -->
<textarea rows={4}></textarea>
```

## Undefined Values

### Check for Undefined Values
Always check for undefined values before accessing properties:

```svelte
<!-- ❌ Avoid this -->
{agent.name}

<!-- ✅ Use this instead -->
{agent?.name || 'Unnamed Agent'}
```

### Conditional Rendering for Optional Content
Use conditional rendering when dealing with potentially undefined objects:

```svelte
<!-- ✅ Good approach -->
{#if agent}
  <div>{agent.name}</div>
{:else}
  <div>No agent selected</div>
{/if}
```

## Component Imports

### Import Types Explicitly
When importing types, be explicit about what you're importing:

```typescript
<!-- ❌ Avoid this -->
import { Agent } from '$lib/models/agent';

<!-- ✅ Use this instead -->
import type { Agent } from '$lib/models/agent';
```

## General Best Practices

### Use Svelte 5 Runes Correctly
Use Svelte 5 runes as intended:

```typescript
<!-- State -->
let count = $state(0);

<!-- Derived values -->
const doubled = $derived(count * 2);

<!-- Effects -->
$effect(() => {
  console.log('Count changed:', count);
});
```

### Avoid Direct DOM Manipulation
Prefer Svelte's reactive bindings over direct DOM manipulation:

```svelte
<!-- ❌ Avoid this -->
<script>
  let inputRef = null;
</script>

<input bind:this={inputRef}>
<button onclick={() => inputRef.value = ''}>Clear</button>

<!-- ✅ Use this instead -->
<script>
  let inputValue = $state('');
</script>

<input bind:value={inputValue}>
<button onclick={() => inputValue = ''}>Clear</button>
```

## Error Prevention Checklist

Before committing code, verify that you've addressed:

- [ ] All event handlers have explicitly typed parameters
- [ ] Button components use valid color options
- [ ] All attributes have correct types (e.g., numbers for numeric attributes)
- [ ] Function parameters are explicitly typed
- [ ] Potentially undefined values are checked before use
- [ ] Types are imported with `import type` when appropriate
- [ ] Svelte 5 runes are used correctly
- [ ] No direct DOM manipulation when Svelte bindings can be used instead

Following these rules will help prevent the TypeScript errors we've encountered and ensure a more maintainable codebase.