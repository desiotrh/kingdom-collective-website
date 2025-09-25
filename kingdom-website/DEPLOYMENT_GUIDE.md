# Kingdom Collective Chatbot Deployment Guide

## Overview
This guide covers deploying the enhanced Kingdom Collective chatbot with RAG capabilities, dual-mode functionality, and comprehensive evaluation systems.

## Prerequisites

### Required Services
1. **OpenAI Account** - For GPT-4 and embeddings
2. **Supabase Project** - For vector storage and database
3. **Vercel Account** - For hosting (or your preferred platform)
4. **Domain** - For production deployment

### Required API Keys
- OpenAI API Key
- Supabase Project URL and Service Role Key
- Stripe Keys (if using payments)
- Email service credentials (optional)

## Setup Instructions

### 1. Environment Configuration

Create a `.env.local` file in the `kingdom-website` directory:

```bash
# Copy from env.example
cp env.example .env.local
```

Fill in your actual values:

```env
OPENAI_API_KEY=sk-your-openai-key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXTAUTH_SECRET=your-random-secret
NEXTAUTH_URL=https://yourdomain.com
```

### 2. Supabase Setup

#### Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and service role key

#### Run Database Schema
```bash
# Connect to your Supabase project and run the schema
psql -h your-project.supabase.co -U postgres -d postgres -f supabase/schema.sql
```

Or use the Supabase dashboard SQL editor to run the contents of `supabase/schema.sql`.

#### Enable pgvector Extension
In your Supabase dashboard:
1. Go to Database → Extensions
2. Enable the `vector` extension

### 3. Knowledge Base Ingestion

#### Install Dependencies
```bash
cd kingdom-website
npm install
```

#### Run Ingestion Script
```bash
npm run ingest
```

This will:
- Process all markdown and YAML files in the `/kb` directory
- Generate embeddings using OpenAI
- Store vectors in Supabase

### 4. Local Development

#### Start Development Server
```bash
npm run dev
```

#### Test the Chatbot
1. Open http://localhost:3000
2. Click the chat button
3. Test both Faith and Marketplace modes
4. Verify responses include sources

### 5. Production Deployment

#### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy from main branch (as per user preference)

#### Environment Variables in Vercel
Add all your environment variables in the Vercel dashboard:
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

#### Build and Deploy
```bash
npm run build
```

## Testing and Validation

### 1. Run Evaluation Suite
```bash
npm run test
npm run evaluate
```

### 2. Manual Testing Checklist
- [ ] Chatbot opens and closes properly
- [ ] Faith Mode vs Marketplace Mode toggle works
- [ ] Responses are accurate and cite sources
- [ ] Function calling works (pricing, features, etc.)
- [ ] Mobile responsiveness
- [ ] Error handling works
- [ ] Rate limiting is in place

### 3. Performance Testing
- [ ] Response times under 3 seconds
- [ ] Vector search performance
- [ ] Concurrent user handling
- [ ] Memory usage optimization

## Monitoring and Maintenance

### 1. Set Up Monitoring
- **Error Tracking**: Use Sentry or similar
- **Performance**: Vercel Analytics or PostHog
- **Usage Analytics**: Track chatbot interactions
- **Uptime Monitoring**: UptimeRobot or similar

### 2. Regular Maintenance Tasks

#### Weekly
- Review chatbot interactions and feedback
- Update knowledge base with new information
- Check for failed responses or errors
- Monitor API usage and costs

#### Monthly
- Run full evaluation suite
- Update dependencies
- Review and optimize prompts
- Analyze user feedback and improve responses

#### Quarterly
- Comprehensive knowledge base review
- Performance optimization
- Security audit
- Feature enhancement planning

### 3. Knowledge Base Updates

#### Adding New Content
1. Add new markdown/YAML files to `/kb` directory
2. Run ingestion script: `npm run ingest`
3. Test new content with evaluation suite
4. Deploy updates

#### Updating Existing Content
1. Modify files in `/kb` directory
2. Run ingestion script to update vectors
3. Test changes
4. Deploy updates

## Troubleshooting

### Common Issues

#### 1. Chatbot Not Responding
- Check OpenAI API key and quota
- Verify Supabase connection
- Check browser console for errors
- Ensure API routes are working

#### 2. Poor Response Quality
- Review and update system prompts
- Check knowledge base content
- Run evaluation suite to identify issues
- Adjust retrieval parameters

#### 3. Slow Response Times
- Optimize vector search queries
- Check Supabase performance
- Review OpenAI API response times
- Consider caching strategies

#### 4. Missing Sources
- Verify knowledge base ingestion
- Check vector similarity thresholds
- Review retrieval logic
- Ensure proper chunking

### Debug Mode
Enable debug logging by setting:
```env
DEBUG=true
NODE_ENV=development
```

## Security Considerations

### 1. API Security
- Rate limiting on chat endpoints
- Input validation and sanitization
- Proper error handling (no sensitive data exposure)
- CORS configuration

### 2. Data Protection
- Encrypt sensitive data
- Implement proper access controls
- Regular security audits
- GDPR/CCPA compliance

### 3. OpenAI Security
- Monitor API usage and costs
- Implement usage limits
- Review and filter user inputs
- Regular prompt security reviews

## Scaling Considerations

### 1. Performance Optimization
- Implement response caching
- Optimize vector search
- Use CDN for static assets
- Database query optimization

### 2. Cost Management
- Monitor OpenAI API usage
- Implement usage quotas
- Optimize embedding generation
- Consider alternative models for non-critical queries

### 3. High Availability
- Implement proper error handling
- Set up monitoring and alerting
- Plan for API rate limits
- Consider backup systems

## Support and Maintenance

### 1. Documentation
- Keep deployment guide updated
- Document any custom configurations
- Maintain troubleshooting guides
- Update API documentation

### 2. Team Training
- Train team on chatbot management
- Document knowledge base update procedures
- Create response quality guidelines
- Establish escalation procedures

### 3. Continuous Improvement
- Regular user feedback collection
- A/B testing for prompt improvements
- Performance monitoring and optimization
- Feature enhancement based on usage patterns

## Conclusion

This deployment guide provides a comprehensive approach to deploying and maintaining the Kingdom Collective chatbot. Regular monitoring, testing, and updates will ensure optimal performance and user satisfaction.

For additional support or questions, contact the development team or refer to the project documentation.