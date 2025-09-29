# IVA Setup Guide

## API Keys Setup

### 1. OpenAI API Key
1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key and add it to `.env.local` as `OPENAI_API_KEY`

### 2. Exa.ai API Key
1. Go to [https://exa.ai](https://exa.ai)
2. Sign up for an account
3. Navigate to your dashboard
4. Copy your API key and add it to `.env.local` as `EXA_API_KEY`

### 3. Supabase Setup
1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > API
4. Copy the Project URL and add it to `.env.local` as `SUPABASE_URL`
5. Copy the anon public key and add it to `.env.local` as `SUPABASE_ANON_KEY`

## Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your actual API keys
# Then run the development server
npm run dev
```

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
│   └── ui/             # Reusable UI components
├── lib/                # Utility functions
├── services/           # API integrations
├── config/             # Configuration files
└── prompts/            # AI prompts
```

## Features

- 🤖 AI-powered startup evaluation
- 🔍 Automated market research via Exa.ai
- 📊 Investment scoring algorithm
- 💼 Impression Ventures criteria integration
- 📈 Real-time deal screening
- 📑 Automated investment memo generation