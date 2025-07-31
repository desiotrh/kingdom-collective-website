'use client';

import React, { useState, useRef, useEffect } from 'react';
import { aiResponseGenerator } from '../utils/ai-response-generator';
import { conversationManager } from '../utils/conversation-memory';
import ChatAvatar from './ChatAvatar';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  context?: {
    page?: string;
    intent?: string;
    entities?: string[];
  };
}

interface EnhancedChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
}

export default function EnhancedChatWindow({ isOpen, onClose, currentPage }: EnhancedChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize session
  useEffect(() => {
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
    
    // Add welcome message
    const welcomeMessage: Message = {
      id: 'welcome',
      text: "🔥 Greetings! I am your Kingdom Collective assistant, standing firm in biblical truth. I'm here to guide you through our innovative apps and help you discover how technology can serve God's purpose. What would you like to explore today?",
      isUser: false,
      timestamp: new Date(),
      context: {
        page: currentPage,
        intent: 'greeting'
      }
    };
    setMessages([welcomeMessage]);
  }, [currentPage]);

  // Update current page in memory when it changes
  useEffect(() => {
    if (sessionId) {
      conversationManager.updateCurrentPage(sessionId, currentPage);
    }
  }, [currentPage, sessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Generate AI response
      const response = aiResponseGenerator.generateResponse(inputText, sessionId, currentPage);
      
      // Simulate typing delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
        context: {
          page: currentPage,
          intent: 'response'
        }
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-[9999] w-[420px] h-[650px] bg-gradient-to-br from-kingdom-dark via-kingdom-darker to-kingdom-navy rounded-3xl shadow-2xl border border-kingdom-gold/20 overflow-hidden backdrop-blur-sm">
      {/* Header */}
      <div className="relative p-6 border-b border-kingdom-gold/20 bg-gradient-to-r from-kingdom-gold/10 via-kingdom-orange/10 to-kingdom-gold/10">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <ChatAvatar tone="kingdom" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-kingdom-dark animate-pulse"></div>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">Kingdom Assistant</h2>
            <p className="text-sm text-kingdom-gold/80">Grounded in Truth, Powered by Innovation</p>
          </div>
          <button
            onClick={onClose}
            className="text-kingdom-gold/60 hover:text-kingdom-gold transition-colors p-2 rounded-full hover:bg-kingdom-gold/10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 h-[500px] bg-gradient-to-b from-transparent to-kingdom-dark/20">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-6`}
          >
            <div
              className={`max-w-[280px] px-5 py-3 rounded-2xl ${
                message.isUser
                  ? 'bg-gradient-to-r from-kingdom-gold to-kingdom-orange text-kingdom-dark shadow-lg'
                  : 'bg-kingdom-darker/80 text-white border border-kingdom-gold/20 shadow-lg backdrop-blur-sm'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
              <p className={`text-xs mt-2 ${message.isUser ? 'text-kingdom-dark/70' : 'text-kingdom-gold/60'}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-6">
            <div className="bg-kingdom-darker/80 text-white px-5 py-3 rounded-2xl border border-kingdom-gold/20 shadow-lg backdrop-blur-sm">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-kingdom-gold rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-kingdom-gold rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-kingdom-gold rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t border-kingdom-gold/20 bg-gradient-to-r from-kingdom-dark/50 to-kingdom-darker/50">
        <div className="flex space-x-3">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about Kingdom apps, biblical wisdom, or technology..."
            className="flex-1 bg-kingdom-darker/80 text-white placeholder-kingdom-gold/40 rounded-2xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-kingdom-gold/50 border border-kingdom-gold/20 backdrop-blur-sm"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
            className="bg-gradient-to-r from-kingdom-gold to-kingdom-orange hover:from-kingdom-gold/90 hover:to-kingdom-orange/90 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-kingdom-dark px-6 py-3 rounded-2xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 