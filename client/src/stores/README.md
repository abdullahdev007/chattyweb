# Insights Caching System

This document explains how the client-side insights caching system works to reduce server load and AI model usage.

## Overview

The insights caching system stores conversation insights locally using Zustand with localStorage persistence. It only fetches new insights from the server when conversations are actually updated.

## How It Works

### 1. **Smart Caching Logic**

- Insights are cached by conversation ID
- Cache validity is determined by:
  - Message count changes (new messages sent/received)
  - Time-based expiration (24 hours)
  - Conversation updates

### 2. **Cache Invalidation Triggers**

- **New Message**: When a user sends or receives a message
- **Time Expiration**: After 24 hours, insights are considered stale
- **Manual Refresh**: User can force refresh (with 1-minute cooldown)

### 3. **Storage Structure**

```typescript
{
  insights: Record<string, InsightsData>,        // Cached insights by conversation ID
  lastUpdated: Record<string, Date>,             // Last update timestamps
  messageCounts: Record<string, number>          // Message counts for change detection
}
```

### 4. **Optimized Operations**

- **setInsights**: Combines insights storage + message count update in one atomic operation
- **Better Performance**: Single state update instead of multiple separate updates
- **Cleaner Code**: Less function calls and better memoization

## Benefits

1. **Reduced Server Load**: No unnecessary API calls for unchanged conversations
2. **Faster Response**: Cached insights display instantly
3. **AI Cost Savings**: Reduced usage of Google Gemini AI model
4. **Better UX**: Users see insights immediately for previously analyzed conversations
5. **Offline Support**: Insights work even without internet connection

## Usage

### In Components

```typescript
import useGetConversationInsights from "@/hooks/conversations/useGetConversationInsights";

const { insights, loading, getConversationInsights } =
  useGetConversationInsights();

// Auto-fetches if cache is stale, otherwise uses cached data
useEffect(() => {
  if (selectedConversation) {
    getConversationInsights(selectedConversation._id);
  }
}, [selectedConversation]);
```

### Force Refresh

```typescript
// Bypass cache and force server fetch
getConversationInsights(conversationId, true);
```

## Cache Lifecycle

1. **First Visit**: Fetches from server and caches
2. **Subsequent Visits**: Uses cached data if valid
3. **Message Update**: Automatically invalidates cache
4. **Time Expiration**: Cache becomes stale after 24 hours
5. **Manual Refresh**: User can force refresh (with cooldown)

## Configuration

- **Cache Duration**: 24 hours (configurable in `useInsights` store)
- **Refresh Cooldown**: 1 minute between manual refreshes
- **Storage**: localStorage with key `"chattyweb-insights"`
- **Persistence**: Automatic across browser sessions

## Performance Impact

- **Initial Load**: Same as before (API call)
- **Cached Access**: Instant display (no API call)
- **Cache Miss**: API call + cache update
- **Storage**: Minimal localStorage usage (~1-5KB per conversation)

## Troubleshooting

### Clear Cache

```typescript
import useInsights from "@/stores/useInsights";

const { clearAllInsights } = useInsights();
clearAllInsights(); // Clears all cached insights
```

### Debug Cache State

```typescript
const { insights, lastUpdated, messageCounts } = useInsights();
console.log("Cache state:", { insights, lastUpdated, messageCounts });
```
