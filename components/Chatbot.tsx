
import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import ChatIcon from './icons/ChatIcon';
import CloseIcon from './icons/CloseIcon';
import SendIcon from './icons/SendIcon';
import LoadingSpinner from './icons/LoadingSpinner';

export default function Chatbot(): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isLoading, error, sendMessage } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSend();
    }
  };

  return (
    <>
      <div className={`fixed bottom-4 right-4 z-40 transition-transform duration-300 ${isOpen ? 'scale-0' : 'scale-100'}`}>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-brand-secondary text-white p-4 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          aria-label="Open chat"
        >
          <ChatIcon />
        </button>
      </div>

      <div
        className={`fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 w-[calc(100%-2rem)] max-w-sm h-[70vh] max-h-[600px] bg-dark-200 rounded-lg shadow-2xl flex flex-col transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <header className="bg-dark-300 p-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-dark-content hover:text-white"
            aria-label="Close chat"
          >
            <CloseIcon />
          </button>
        </header>

        <div className="flex-1 p-4 overflow-y-auto">
          <div className="flex flex-col space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-sm px-4 py-2 rounded-xl ${
                    message.role === 'user'
                      ? 'bg-brand-secondary text-white rounded-br-none'
                      : 'bg-dark-300 text-dark-content rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex justify-start">
                 <div className="max-w-xs lg:max-w-sm px-4 py-2 rounded-xl bg-dark-300 text-dark-content rounded-bl-none">
                   <LoadingSpinner />
                 </div>
               </div>
            )}
             {error && (
               <div className="flex justify-start">
                 <div className="max-w-xs lg:max-w-sm px-4 py-2 rounded-xl bg-red-500/20 text-red-300 rounded-bl-none">
                   <p className="text-sm">{error}</p>
                 </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="p-4 border-t border-dark-300">
          <div className="flex items-center bg-dark-300 rounded-lg">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question..."
              className="w-full bg-transparent p-3 text-dark-content focus:outline-none"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-3 text-brand-secondary disabled:text-gray-500 hover:text-blue-400"
              aria-label="Send message"
            >
              <SendIcon />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
