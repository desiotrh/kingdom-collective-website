'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiResponseGenerator } from '../utils/ai-response-generator';
import { conversationManager } from '../utils/conversation-memory';

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
      text: "Hello! I'm your Kingdom Collective assistant, grounded in biblical truth and committed to helping you discover our innovative apps. What can I help you with today?",
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

  const chatVariants = {
    closed: {
      x: 400,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut" as const
      }
    },
    open: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut" as const
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={chatVariants}
          initial="closed"
          animate="open"
          exit="closed"
          className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 w-96 h-[600px] bg-[#1a2332] rounded-2xl shadow-2xl border border-[#374151] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#374151] bg-gradient-to-r from-yellow-600 to-orange-600">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8ZM12 14C13.1 14 14 14.9 14 16C14 17.1 13.1 18 12 18C10.9 18 10 17.1 10 16C10 14.9 10.9 14 12 14ZM12 20C13.1 20 14 20.9 14 22C14 23.1 13.1 24 12 24C10.9 24 10 23.1 10 22C10 20.9 10.9 20 12 20Z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Kingdom Assistant</h2>
                <p className="text-xs text-yellow-200">Your Royal Guide</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-yellow-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 h-[480px]">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl ${
                    message.isUser
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                      : 'bg-[#2d3748] text-gray-100'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p className="text-xs opacity-50 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start mb-4"
              >
                <div className="bg-[#2d3748] text-gray-100 px-4 py-2 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-[#374151]">
            <div className="flex space-x-3">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about Kingdom apps..."
                className="flex-1 bg-[#2d3748] text-white placeholder-gray-400 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
                rows={1}
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
                className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
              >
                Send
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 