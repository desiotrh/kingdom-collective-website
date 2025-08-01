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
  const [isTyping, setIsTyping] = useState(false);
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

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      isUser: true,
      timestamp: new Date(),
      context: {
        page: currentPage,
        intent: 'user_message'
      }
    };

    setMessages(prev => [...prev, userMessage]);
    if (!messageText) {
      setInputText('');
    }
    setIsLoading(true);
    setIsTyping(true);

    // Save user message to conversation memory
    conversationManager.addMessage(sessionId, userMessage);

    try {
      // Generate AI response
      const response = aiResponseGenerator.generateResponse(textToSend, sessionId, currentPage);
      
      // Simulate typing delay with realistic timing
      const typingDelay = 1000 + Math.random() * 2000;
      await new Promise(resolve => setTimeout(resolve, typingDelay));

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
        context: {
          page: currentPage,
          intent: 'bot_response'
        }
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Save bot message to conversation memory
      conversationManager.addMessage(sessionId, botMessage);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date(),
        context: {
          page: currentPage,
          intent: 'error'
        }
      };
      setMessages(prev => [...prev, errorMessage]);
      conversationManager.addMessage(sessionId, errorMessage);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendButtonClick = () => {
    handleSendMessage();
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed right-4 md:right-8 top-20 md:top-16 transform z-[9999] w-[85vw] max-w-[400px] h-[70vh] max-h-[600px] bg-black/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden transition-all duration-500 ease-out ${
      isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
    }`}>
      {/* Header */}
      <div className="relative p-2 md:p-3 border-b border-white/10 bg-black/30">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <div className={`transition-all duration-300 ${isTyping ? 'animate-pulse' : ''}`}>
              <ChatAvatar tone="kingdom" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-green-500 rounded-full border border-white animate-pulse"></div>
            {isTyping && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-kingdom-gold rounded-full border border-white animate-ping"></div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm md:text-base font-bold text-white truncate">Kingdom Assistant</h2>
            <p className="text-xs text-white/70 truncate">
              {isTyping ? 'Typing...' : 'How can I help?'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10 flex-shrink-0"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 md:p-4 h-[calc(100%-140px)] bg-transparent">
        {messages.length === 1 && messages[0].id === 'welcome' && (
          <div className="mb-4">
            <div className="text-center mb-4">
              <h3 className="text-base font-bold text-white mb-1">Welcome to Kingdom Collective</h3>
              <p className="text-xs text-white/70">Choose a topic to get started:</p>
            </div>
            
            {/* Quick Action Bubbles */}
            <div className="grid grid-cols-1 gap-2 mb-4">
              <button
                onClick={() => {
                  const newMessage: Message = {
                    id: Date.now().toString(),
                    text: "Tell me about your AI bots and how they can help my business.",
                    isUser: true,
                    timestamp: new Date(),
                    context: {
                      page: currentPage,
                      intent: 'quick_action'
                    }
                  };
                  setMessages(prev => [...prev, newMessage]);
                  conversationManager.addMessage(sessionId, newMessage);
                  handleSendMessage("Tell me about your AI bots and how they can help my business.");
                }}
                className="w-full p-3 bg-gradient-to-r from-kingdom-gold/20 to-kingdom-orange/20 border border-kingdom-gold/30 rounded-xl text-left hover:from-kingdom-gold/30 hover:to-kingdom-orange/30 transition-all duration-200 backdrop-blur-sm"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-kingdom-gold to-kingdom-orange rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-kingdom-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">AI Bots</h4>
                    <p className="text-xs text-white/70">Sales, lead gen, onboarding</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  const newMessage: Message = {
                    id: Date.now().toString(),
                    text: "Show me your Kingdom apps and their features.",
                    isUser: true,
                    timestamp: new Date(),
                    context: {
                      page: currentPage,
                      intent: 'quick_action'
                    }
                  };
                  setMessages(prev => [...prev, newMessage]);
                  conversationManager.addMessage(sessionId, newMessage);
                  handleSendMessage("Show me your Kingdom apps and their features.");
                }}
                className="w-full p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl text-left hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-200 backdrop-blur-sm"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">Kingdom Apps</h4>
                    <p className="text-xs text-white/70">Circle, Clips, Launchpad, Lens</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  const newMessage: Message = {
                    id: Date.now().toString(),
                    text: "Tell me about Kingdom Collective and your mission.",
                    isUser: true,
                    timestamp: new Date(),
                    context: {
                      page: currentPage,
                      intent: 'quick_action'
                    }
                  };
                  setMessages(prev => [...prev, newMessage]);
                  conversationManager.addMessage(sessionId, newMessage);
                  handleSendMessage("Tell me about Kingdom Collective and your mission.");
                }}
                className="w-full p-3 bg-gradient-to-r from-green-500/20 to-teal-500/20 border border-green-500/30 rounded-xl text-left hover:from-green-500/30 hover:to-teal-500/30 transition-all duration-200 backdrop-blur-sm"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">About Us</h4>
                    <p className="text-xs text-white/70">Mission, values, biblical foundation</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-3 md:mb-4 animate-fade-in`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div
              className={`max-w-[85%] md:max-w-[280px] px-3 md:px-4 py-2 rounded-xl transition-all duration-300 ${
                message.isUser
                  ? 'bg-gradient-to-r from-kingdom-gold/90 to-kingdom-orange/90 text-kingdom-dark shadow-lg hover:shadow-xl backdrop-blur-sm'
                  : 'bg-white/10 text-white border border-white/20 shadow-lg backdrop-blur-sm hover:shadow-xl'
              }`}
            >
              <p className="text-xs leading-relaxed whitespace-pre-wrap break-words">{message.text}</p>
              <p className={`text-xs mt-1 ${message.isUser ? 'text-kingdom-dark/70' : 'text-white/60'}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-3 md:mb-4 animate-fade-in">
            <div className="bg-white/10 text-white px-3 md:px-4 py-2 rounded-xl border border-white/20 shadow-lg backdrop-blur-sm">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-kingdom-gold rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-kingdom-gold rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1.5 h-1.5 bg-kingdom-gold rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 md:p-4 border-t border-white/10 bg-black/30">
        <div className="flex space-x-2">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about Kingdom apps, AI bots, or anything else..."
            className="flex-1 bg-white/10 text-white placeholder-white/50 rounded-xl px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-kingdom-gold/50 border border-white/20 backdrop-blur-sm transition-all duration-200 hover:border-white/30 text-xs"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSendButtonClick}
            disabled={!inputText.trim() || isLoading}
            className="bg-gradient-to-r from-kingdom-gold to-kingdom-orange hover:from-kingdom-gold/90 hover:to-kingdom-orange/90 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-kingdom-dark px-4 py-2 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg disabled:transform-none flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 