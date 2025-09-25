import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { loadKnowledgeBase, searchKnowledgeBase, generateResponse } from '../../../lib/knowledge-base';

// Request validation schema
const ChatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string(),
  })),
  mode: z.enum(['faith', 'marketplace']).default('marketplace'),
  sessionId: z.string().optional(),
});

// Load knowledge base once at startup
let knowledgeBase: any = null;

function getKnowledgeBase() {
  if (!knowledgeBase) {
    try {
      knowledgeBase = loadKnowledgeBase();
    } catch (error) {
      console.error('Error loading knowledge base:', error);
      knowledgeBase = { apps: {}, pricing: {}, legal: {}, support: {}, faqs: {} };
    }
  }
  return knowledgeBase;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, mode, sessionId } = ChatRequestSchema.parse(body);
    
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'user') {
      return NextResponse.json({ error: 'Invalid message format' }, { status: 400 });
    }
    
    // Get the user's question
    const userQuestion = lastMessage.content;
    
    // Load knowledge base
    const kb = getKnowledgeBase();
    
    // Search for relevant information
    const searchResults = searchKnowledgeBase(userQuestion, kb);
    
    // Generate response based on search results and mode
    const response = generateResponse(userQuestion, searchResults, mode);
    
    // Create sources from search results
    const sources = searchResults.map(result => {
      if (result.type === 'app') {
        return {
          title: result.app.name,
          section: 'Product Information',
          url: `/products/${result.key}`
        };
      } else if (result.type === 'pricing') {
        return {
          title: 'Pricing Information',
          section: 'Pricing',
          url: '/pricing'
        };
      } else if (result.type === 'legal') {
        return {
          title: 'Legal Documents',
          section: 'Legal',
          url: '/legal'
        };
      } else if (result.type === 'support') {
        return {
          title: 'Support Information',
          section: 'Support',
          url: '/contact'
        };
      } else if (result.type === 'faq') {
        return {
          title: 'Frequently Asked Questions',
          section: 'FAQ',
          url: '/faq'
        };
      }
      return null;
    }).filter(Boolean);
    
    return NextResponse.json({
      message: response,
      sources: sources
    });
    
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}