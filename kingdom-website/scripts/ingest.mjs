#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize clients
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configuration
const KB_DIR = path.join(__dirname, '../kb');
const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 100;

// Chunk text into smaller pieces
function chunkText(text, chunkSize = CHUNK_SIZE, overlap = CHUNK_OVERLAP) {
  const chunks = [];
  let start = 0;
  
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    let chunk = text.slice(start, end);
    
    // Try to break at sentence boundaries
    if (end < text.length) {
      const lastSentence = chunk.lastIndexOf('.');
      const lastNewline = chunk.lastIndexOf('\n');
      const breakPoint = Math.max(lastSentence, lastNewline);
      
      if (breakPoint > start + chunkSize * 0.5) {
        chunk = text.slice(start, start + breakPoint + 1);
        start = start + breakPoint + 1;
      } else {
        start = end;
      }
    } else {
      start = end;
    }
    
    chunks.push(chunk.trim());
  }
  
  return chunks;
}

// Extract metadata from file path
function extractMetadata(filePath, content) {
  const relativePath = path.relative(KB_DIR, filePath);
  const pathParts = relativePath.split(path.sep);
  
  const metadata = {
    file_path: relativePath,
    app: pathParts[1] || null,
    section: pathParts[2] || null,
    type: pathParts[0] || 'unknown'
  };
  
  // Extract title from content
  const titleMatch = content.match(/^#\s+(.+)$/m);
  if (titleMatch) {
    metadata.title = titleMatch[1];
  }
  
  // Extract URL from path
  metadata.url = `/${relativePath.replace(/\.(md|yml)$/, '')}`;
  
  return metadata;
}

// Process markdown file
async function processMarkdownFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const metadata = extractMetadata(filePath, content);
    
    // Remove markdown headers and clean content
    const cleanContent = content
      .replace(/^#+\s+.*$/gm, '') // Remove headers
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to text
      .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold formatting
      .replace(/\*([^*]+)\*/g, '$1') // Remove italic formatting
      .trim();
    
    const chunks = chunkText(cleanContent);
    
    return chunks.map((chunk, index) => ({
      content: chunk,
      metadata: {
        ...metadata,
        chunk_index: index,
        total_chunks: chunks.length
      }
    }));
  } catch (error) {
    console.error(`Error processing markdown file ${filePath}:`, error);
    return [];
  }
}

// Process YAML file
async function processYamlFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const data = yaml.load(content);
    const metadata = extractMetadata(filePath, content);
    
    // Convert YAML to text representation
    const textContent = JSON.stringify(data, null, 2);
    const chunks = chunkText(textContent);
    
    return chunks.map((chunk, index) => ({
      content: chunk,
      metadata: {
        ...metadata,
        chunk_index: index,
        total_chunks: chunks.length,
        data_type: 'yaml'
      }
    }));
  } catch (error) {
    console.error(`Error processing YAML file ${filePath}:`, error);
    return [];
  }
}

// Generate embeddings for text chunks
async function generateEmbeddings(chunks) {
  const embeddings = [];
  
  for (const chunk of chunks) {
    try {
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-large',
        input: chunk.content,
      });
      
      embeddings.push({
        ...chunk,
        embedding: response.data[0].embedding
      });
    } catch (error) {
      console.error('Error generating embedding:', error);
    }
  }
  
  return embeddings;
}

// Upsert embeddings to Supabase
async function upsertEmbeddings(embeddings) {
  const records = embeddings.map(emb => ({
    app: emb.metadata.app,
    section: emb.metadata.section,
    title: emb.metadata.title,
    url: emb.metadata.url,
    content: emb.content,
    embedding: emb.embedding,
    metadata: emb.metadata
  }));
  
  const { data, error } = await supabase
    .from('kb_vectors')
    .upsert(records, {
      onConflict: 'app,section,title,url,chunk_index'
    });
  
  if (error) {
    console.error('Error upserting embeddings:', error);
    throw error;
  }
  
  return data;
}

// Process all files in directory
async function processDirectory(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const allChunks = [];
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      const subChunks = await processDirectory(fullPath);
      allChunks.push(...subChunks);
    } else if (entry.isFile()) {
      if (entry.name.endsWith('.md')) {
        const chunks = await processMarkdownFile(fullPath);
        allChunks.push(...chunks);
      } else if (entry.name.endsWith('.yml') || entry.name.endsWith('.yaml')) {
        const chunks = await processYamlFile(fullPath);
        allChunks.push(...chunks);
      }
    }
  }
  
  return allChunks;
}

// Main ingestion function
async function main() {
  try {
    console.log('Starting knowledge base ingestion...');
    
    // Check if KB directory exists
    try {
      await fs.access(KB_DIR);
    } catch (error) {
      console.error(`Knowledge base directory not found: ${KB_DIR}`);
      process.exit(1);
    }
    
    // Process all files
    console.log('Processing files...');
    const allChunks = await processDirectory(KB_DIR);
    console.log(`Found ${allChunks.length} text chunks`);
    
    if (allChunks.length === 0) {
      console.log('No content to process');
      return;
    }
    
    // Generate embeddings
    console.log('Generating embeddings...');
    const embeddings = await generateEmbeddings(allChunks);
    console.log(`Generated ${embeddings.length} embeddings`);
    
    // Upsert to database
    console.log('Upserting to database...');
    await upsertEmbeddings(embeddings);
    console.log('Successfully ingested knowledge base');
    
  } catch (error) {
    console.error('Ingestion failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main as ingestKnowledgeBase };
