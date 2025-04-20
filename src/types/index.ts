export interface MessageType {
  text: string;
  sender: 'user' | 'bot';
  sentiment?: string;
}

export interface ChatResponse {
  response: string;
  sentiment: string;
}