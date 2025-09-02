# AI Prompts Directory

This directory contains all AI prompts used throughout the application for better organization and maintainability.

## Structure

- `conversation.prompts.ts` - Prompts for conversation analysis and insights
- `index.ts` - Central export file for all prompts

## Usage

Import prompts from the main services index:

```typescript
import { CONVERSATION_ANALYSIS_PROMPT } from "@/services";
```

## Benefits

1. **Centralized Management** - All AI prompts in one location
2. **Easy Maintenance** - Update prompts without touching business logic
3. **Reusability** - Prompts can be shared across different services
4. **Version Control** - Track prompt changes separately from code
5. **Testing** - Test prompts independently from service logic

## Adding New Prompts

1. Create a new file in the appropriate category (e.g., `user.prompts.ts`)
2. Export your prompts as named constants
3. Add the export to `index.ts`
4. Import and use in your services

## Example

```typescript
// In conversation.prompts.ts
export const CUSTOM_PROMPT = (data: string) => `Your prompt here: ${data}`;

// In your service
import { CUSTOM_PROMPT } from "@/prompts";
const prompt = CUSTOM_PROMPT(formattedData);
```
