
export interface ModelInfo {
  name: string;
  size: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}
