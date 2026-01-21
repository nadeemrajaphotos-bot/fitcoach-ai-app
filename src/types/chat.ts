export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  chatInput: string;
  sessionId: string;
}

export interface ChatResponse {
  output: string;
  sessionId: string;
}
