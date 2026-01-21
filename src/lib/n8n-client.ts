import type { ChatRequest, ChatResponse } from '@/types/chat';

const N8N_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;

export async function sendChatMessage(
  chatInput: string,
  sessionId: string
): Promise<ChatResponse> {
  if (!N8N_WEBHOOK_URL) {
    throw new Error('N8N_WEBHOOK_URL is not configured');
  }

  const request: ChatRequest = {
    chatInput: chatInput.trim(),
    sessionId,
  };

  const response = await fetch(N8N_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  const data: ChatResponse = await response.json();
  return data;
}

export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
