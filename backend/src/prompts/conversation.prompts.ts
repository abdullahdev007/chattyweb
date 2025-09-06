export const CONVERSATION_ANALYSIS_PROMPT = (
  formattedMessages: string,
) => `Analyze the following conversation and provide insights in JSON format:

Conversation:
${formattedMessages}

Please return a JSON object with the following structure:
{
  "summary": "A brief summary of the conversation (2-3 sentences)",
  "sentiment": "positive, negative, or neutral",
  "keyTakeaways": ["key point 1", "key point 2", "key point 3"]
}

Focus on the main topics discussed, overall tone, and most important points.`;
