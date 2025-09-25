-- Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create the knowledge base vectors table
CREATE TABLE IF NOT EXISTS kb_vectors (
  id BIGSERIAL PRIMARY KEY,
  app TEXT,
  section TEXT,
  title TEXT,
  url TEXT,
  content TEXT,
  embedding VECTOR(3072),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for vector similarity search
CREATE INDEX IF NOT EXISTS kb_vectors_embedding_idx 
ON kb_vectors USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);

-- Create index for text search
CREATE INDEX IF NOT EXISTS kb_vectors_content_idx 
ON kb_vectors USING gin (to_tsvector('english', content));

-- Create index for app and section filtering
CREATE INDEX IF NOT EXISTS kb_vectors_app_section_idx 
ON kb_vectors (app, section);

-- Create leads table for lead generation
CREATE TABLE IF NOT EXISTS leads (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  interest TEXT NOT NULL,
  company TEXT,
  source TEXT DEFAULT 'chatbot',
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create chat sessions table for conversation tracking
CREATE TABLE IF NOT EXISTS chat_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  mode TEXT DEFAULT 'marketplace',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB
);

-- Create chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT REFERENCES chat_sessions(id),
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  sources JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create function for document matching
CREATE OR REPLACE FUNCTION match_documents (
  query_embedding VECTOR(3072),
  match_threshold FLOAT DEFAULT 0.55,
  match_count INT DEFAULT 6
)
RETURNS TABLE (
  id BIGINT,
  app TEXT,
  section TEXT,
  title TEXT,
  url TEXT,
  content TEXT,
  similarity FLOAT
)
LANGUAGE SQL STABLE
AS $$
  SELECT
    kb_vectors.id,
    kb_vectors.app,
    kb_vectors.section,
    kb_vectors.title,
    kb_vectors.url,
    kb_vectors.content,
    1 - (kb_vectors.embedding <=> query_embedding) AS similarity
  FROM kb_vectors
  WHERE 1 - (kb_vectors.embedding <=> query_embedding) > match_threshold
  ORDER BY kb_vectors.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_kb_vectors_updated_at
  BEFORE UPDATE ON kb_vectors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (this would be replaced by your ingestion pipeline)
INSERT INTO kb_vectors (app, section, title, url, content, embedding, metadata) VALUES
('studios', 'overview', 'Kingdom Studios Overview', '/products/studios', 'Kingdom Studios is our flagship creative platform designed to help content creators, agencies, and creative professionals produce high-quality content with purpose and excellence.', '[0.1,0.2,0.3]'::vector, '{"type": "product_overview"}'),
('circle', 'pricing', 'Kingdom Circle Pricing', '/products/circle', 'Kingdom Circle offers multiple pricing tiers from free to enterprise, starting at $0 for basic features and scaling to $149/month for enterprise features.', '[0.4,0.5,0.6]'::vector, '{"type": "pricing_info"}')
ON CONFLICT DO NOTHING;

-- Create RLS policies (Row Level Security)
ALTER TABLE kb_vectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Allow public read access to kb_vectors
CREATE POLICY "Allow public read access to kb_vectors" ON kb_vectors
  FOR SELECT USING (true);

-- Allow public insert access to leads
CREATE POLICY "Allow public insert access to leads" ON leads
  FOR INSERT WITH CHECK (true);

-- Allow public access to chat sessions and messages
CREATE POLICY "Allow public access to chat_sessions" ON chat_sessions
  FOR ALL USING (true);

CREATE POLICY "Allow public access to chat_messages" ON chat_messages
  FOR ALL USING (true);
