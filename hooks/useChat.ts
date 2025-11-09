
import { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { ChatMessage } from '../types';

const API_KEY = process.env.API_KEY;

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatRef = useRef<Chat | null>(null);

  useEffect(() => {
    const initChat = () => {
      if (!API_KEY) {
        // FIX: Corrected typo in environment variable name for error message.
        setError("API key is missing. Please set the API_KEY environment variable.");
        console.error("API key is missing.");
        return;
      }
      try {
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        const newChat = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: "You are a friendly and knowledgeable customer support agent for 'Visio3D', a web-based 3D model viewer. Your goal is to help users with questions about using the app, supported file formats (primarily .glb), and basic 3D concepts. Keep your answers concise, helpful, and easy to understand. Do not mention that you are an AI.",
          },
        });
        chatRef.current = newChat;
        setMessages([
          {
            id: 'init',
            role: 'model',
            text: 'Hello! How can I help you with the 3D viewer today?',
          },
        ]);
      } catch (e) {
        setError("Failed to initialize the chat service.");
        console.error(e);
      }
    };
    initChat();
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (isLoading || !text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    if (!chatRef.current) {
        setError("Chat is not initialized.");
        setIsLoading(false);
        return;
    }
    
    try {
      const result = await chatRef.current.sendMessage({ message: text });
      
      const modelMessage: ChatMessage = {
        id: Date.now().toString() + '-model',
        role: 'model',
        text: result.text,
      };
      setMessages((prev) => [...prev, modelMessage]);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`Failed to get response: ${errorMessage}`);
      const errorResponse: ChatMessage = {
        id: Date.now().toString() + '-error',
        role: 'model',
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
      };
      setMessages((prev) => [...prev, errorResponse]);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  return { messages, isLoading, error, sendMessage };
}
