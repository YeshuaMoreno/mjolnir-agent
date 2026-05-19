export interface ChatRequest {
  user_id: number;
  message: string;
  conversation_id?: number | null;
}

export interface ChatResponse {
  reply: string;
  conversation_id: number;
}
