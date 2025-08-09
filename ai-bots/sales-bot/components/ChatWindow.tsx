'use client';

import { useState, useRef, useEffect } from 'react';
import ChatAvatar from './ChatAvatar';
import ToneToggle from './ToneToggle';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hey! I'm your Kingdom Studios sales assistant. I can help you with product demos, pricing, and closing deals. What can I help you with today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tone, setTone] = useState<'marketplace' | 'kingdom'>('kingdom');
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputText, tone);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const generateBotResponse = (userInput: string, currentTone: 'marketplace' | 'kingdom'): string => {
    const input = userInput.toLowerCase();
    
    if (currentTone === 'kingdom') {
      if (input.includes('pricing') || input.includes('cost') || input.includes('price')) {
        return "Our Kingdom Studios packages start at $997 for the basic setup, going up to $2,997 for the full enterprise solution. Each package includes our signature Kingdom branding, custom animations, and dedicated support. What's your budget range?";
      }
      if (input.includes('demo') || input.includes('show') || input.includes('example')) {
        return "Absolutely! I'd love to show you our Kingdom Studios magic. We create stunning visual experiences that transform your brand into something truly royal. Would you like to see some of our recent Kingdom projects?";
      }
      if (input.includes('features') || input.includes('what') || input.includes('include')) {
        return "Kingdom Studios delivers premium features: custom Kingdom animations, royal color schemes, exclusive fonts, 24/7 Kingdom support, and our signature 'crown' effect. We make your brand feel like royalty!";
      }
    } else {
      if (input.includes('pricing') || input.includes('cost') || input.includes('price')) {
        return "Our competitive pricing starts at $497 for the starter package, with premium options at $1,497. We offer flexible payment plans and volume discounts for larger teams. What's your budget?";
      }
      if (input.includes('demo') || input.includes('show') || input.includes('example')) {
        return "I'd be happy to show you our portfolio! We have case studies from various industries showing 40% average conversion improvements. Would you like to see some specific examples?";
      }
      if (input.includes('features') || input.includes('what') || input.includes('include')) {
        return "Our platform includes advanced analytics, A/B testing tools, customizable templates, integration with major CRMs, and dedicated account management. Plus, we offer comprehensive training and support.";
      }
    }

    return currentTone === 'kingdom' 
      ? "That's a great question! In the Kingdom Studios world, we believe every brand deserves to feel like royalty. Let me know more about your specific needs and I'll craft the perfect Kingdom solution for you."
      : "Great question! Our platform is designed to maximize your ROI with proven conversion strategies. Tell me more about your specific use case and I'll show you exactly how we can help.";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-4 bg-[#1a2332] rounded-2xl shadow-2xl border border-[#374151]">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-[#374151]">
        <div className="flex items-center space-x-3">
          <ChatAvatar tone={tone} />
          <div>
            <h1 className="text-xl font-bold text-white">
              {tone === 'kingdom' ? 'Kingdom Studios Assistant' : 'Sales Assistant'}
            </h1>
            <p className="text-sm text-gray-400">
              {tone === 'kingdom' ? 'Your Royal Sales Partner' : 'Your Sales Partner'}
            </p>
          </div>
        </div>
        <ToneToggle tone={tone} onToneChange={setTone} />
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto custom-scrollbar p-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.isUser
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#2d3748] text-gray-100'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className="text-xs opacity-50 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-[#2d3748] text-gray-100 px-4 py-2 rounded-2xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t border-[#374151]">
        <div className="flex space-x-3">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 bg-[#2d3748] text-white placeholder-gray-400 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
} 