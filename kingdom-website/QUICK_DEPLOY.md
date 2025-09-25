# 🚀 Quick Deploy Guide - Kingdom Collective Chatbot

## Prerequisites
- OpenAI API key
- Supabase account
- Vercel account (or your preferred hosting platform)

## Step 1: Environment Setup

### Run the setup script:
```powershell
.\setup-env.ps1
```

### Or manually create `.env.local`:
```env
OPENAI_API_KEY=sk-your-openai-key-here
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXTAUTH_SECRET=your-random-secret-here
NEXTAUTH_URL=https://yourdomain.com
```

## Step 2: Supabase Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Note your project URL and service role key

2. **Run Database Schema**
   - Go to SQL Editor in Supabase dashboard
   - Copy and paste the contents of `supabase/schema.sql`
   - Run the SQL to create tables and functions

3. **Enable pgvector Extension**
   - Go to Database → Extensions
   - Enable the `vector` extension

## Step 3: Deploy

### Option A: Automated Deployment
```powershell
.\deploy-chatbot.ps1
```

### Option B: Manual Deployment
```bash
# Install dependencies
npm install

# Ingest knowledge base
npm run ingest

# Build for production
npm run build

# Test locally
npm start
```

## Step 4: Vercel Deployment

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select the `kingdom-website` folder

2. **Set Environment Variables**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add all variables from your `.env.local`

3. **Deploy**
   - Deploy from main branch (as per user preference)
   - Wait for deployment to complete

## Step 5: Post-Deployment

1. **Ingest Knowledge Base**
   ```bash
   npm run ingest
   ```

2. **Test the Chatbot**
   - Visit your deployed site
   - Click the chat button
   - Test both Faith and Marketplace modes

3. **Run Evaluation**
   ```bash
   npm run evaluate
   ```

## Features Included

✅ **RAG-Based Responses** - Accurate answers with source citations  
✅ **Dual Mode Toggle** - Faith Mode vs Marketplace Mode  
✅ **Function Calling** - Dynamic pricing, features, and lead generation  
✅ **Comprehensive KB** - All 7 Kingdom apps documented  
✅ **Evaluation System** - Automated quality testing  
✅ **Mobile Responsive** - Works on all devices  
✅ **Production Ready** - Error handling, rate limiting, security  

## Troubleshooting

### Chatbot Not Responding
- Check OpenAI API key and quota
- Verify Supabase connection
- Check browser console for errors

### Poor Response Quality
- Run `npm run ingest` to update knowledge base
- Check system prompts in API route
- Run evaluation suite

### Deployment Issues
- Verify all environment variables are set
- Check Vercel build logs
- Ensure Supabase project is properly configured

## Support

For issues or questions:
- Check the full `DEPLOYMENT_GUIDE.md`
- Review the `.cursorrules` for development standards
- Test with the evaluation suite

## Quick Commands

```bash
npm run dev          # Local development
npm run build        # Production build
npm run start        # Start production server
npm run ingest       # Update knowledge base
npm run evaluate     # Test chatbot quality
npm run lint         # Code quality check
```

---

**🎉 Your Kingdom Collective chatbot is now ready to serve users with accurate, contextual, and brand-appropriate responses!**
