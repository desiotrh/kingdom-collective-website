'use client';

import React, { useState, useRef, useEffect } from 'react';
import { aiResponseGenerator } from '../utils/ai-response-generator';
import { conversationManager } from '../utils/conversation-memory';
import ChatAvatar from './ChatAvatar';
import Image from 'next/image';

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
      text: "Hi! I'm your Kingdom Collective assistant — here to help you navigate our apps, tools, and features built with purpose. Whether you're exploring for business or faith, I've got you covered. How can I help today?",
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
    <div className={`chat-container ${isOpen ? 'block' : 'hidden'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray/30">
        <div className="flex items-center gap-3">
          <ChatAvatar />
          <div>
            <h3 className="text-white font-semibold text-sm">Kingdom Assistant</h3>
            <p className="text-gray-400 text-xs">AI-powered guidance</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-80">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-message ${message.isUser ? 'chat-message-user' : 'chat-message-assistant'}`}
          >
            <div className="flex items-start gap-3">
              {!message.isUser && (
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#FFD700] to-yellow-400 flex items-center justify-center flex-shrink-0">
                  <Image
                    src="/kingdom-flame-avatar.png"
                    alt="Kingdom Assistant"
                    width={16}
                    height={16}
                    className="w-4 h-4"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="bg-black/30 text-white rounded-xl p-3 text-sm sm:text-base leading-relaxed">
                  {message.text}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {message.isUser && (
                <div className="w-6 h-6 rounded-full bg-blue flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-navy">👤</span>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="chat-message chat-message-assistant">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#FFD700] to-yellow-400 flex items-center justify-center flex-shrink-0">
                <Image
                  src="/kingdom-flame-avatar.png"
                  alt="Kingdom Assistant"
                  width={16}
                  height={16}
                  className="w-4 h-4"
                />
              </div>
              <div className="flex-1">
                <div className="bg-black/30 text-white rounded-xl p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray/30">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your question here..."
            className="w-full px-4 py-2 rounded-md bg-black/20 text-white placeholder-white/60 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
            disabled={isLoading}
          />
          <button
            onClick={handleSendButtonClick}
            disabled={isLoading || !inputText.trim()}
            className="bg-gradient-to-r from-[#FFD700] to-yellow-400 text-black font-semibold px-4 py-2 rounded-md shadow-md hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
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