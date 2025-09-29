# IVA (Intelligent Venture Analyst)

## AI-Powered Deal Screening & Due Diligence Agent for Impression Ventures

![IVA Dashboard](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=IVA+Dashboard)

IVA is an intelligent venture capital analysis platform that automates the initial evaluation of fintech startups for Impression Ventures. It combines real-time market intelligence with AI-powered analysis to identify high-potential investments that match your thesis.

### 🚀 Key Features

- **Automated Due Diligence**: Reduces 4-6 hours of manual research per deal to 5 minutes
- **AI-Powered Analysis**: Uses GPT-4 and real-time market data for comprehensive evaluation
- **Investment Scoring**: 100-point scoring system based on Impression Ventures criteria
- **Market Intelligence**: Real-time competitive analysis and market trend identification
- **Investment Memos**: Automatically generated professional investment reports
- **Founder Research**: Deep-dive background analysis on founding teams

### 📊 Core Capabilities

#### 1. **Automated Startup Evaluation**
- Company information gathering via Exa.ai
- News and market trend analysis
- Competitive landscape mapping
- Founder background research

#### 2. **Investment Scoring Algorithm**
- **Team Experience** (20 points): Fintech background, previous exits
- **Market Opportunity** (20 points): TAM > $1B, growth potential
- **Product Innovation** (20 points): AI/ML, blockchain, novel tech
- **Traction** (15 points): Customer validation, revenue growth
- **Competitive Advantage** (15 points): Moat, IP, network effects
- **Business Model** (10 points): Scalable, recurring revenue

#### 3. **Impression Ventures Criteria**
- **Essential Requirements**: Fintech focus, Post-MVP stage, North America, $2M+ rounds
- **Specialized Analysis**: InsurTech, WealthTech, RegTech, Banking Tech
- **Investment Thesis Alignment**: B2B solutions, API infrastructure

## 🛠 Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **AI**: OpenAI GPT-4, Exa.ai for market intelligence
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **UI Components**: Radix UI, Lucide Icons

## ⚡ Quick Start

### Prerequisites

- Node.js 18+ and npm
- API keys for OpenAI and Exa.ai
- Supabase account

### 1. Installation

```bash
# Clone and install dependencies
git clone <repository>
cd iva-agent
npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env.local

# Add your API keys to .env.local
OPENAI_API_KEY=your_openai_api_key_here
EXA_API_KEY=your_exa_api_key_here
SUPABASE_URL=your_supabase_project_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Database Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. In the SQL editor, run the schema from `supabase/schema.sql`
3. Copy your project URL and anon key to `.env.local`

### 4. API Keys Setup

#### OpenAI API Key
1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create a new secret key
3. Add to `.env.local` as `OPENAI_API_KEY`

#### Exa.ai API Key
1. Sign up at [exa.ai](https://exa.ai)
2. Get your API key from the dashboard
3. Add to `.env.local` as `EXA_API_KEY`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see IVA in action!

## 📋 Usage Guide

### Evaluating a Startup

1. **Submit Company Information**
   - Enter company name (required)
   - Add website URL (optional)
   - List founder names (optional)

2. **Analysis Process**
   - AI gathers market intelligence
   - Analyzes competitive landscape
   - Evaluates against Impression Ventures criteria
   - Generates investment score and memo

3. **Review Results**
   - Overall score out of 100 points
   - Category breakdown (team, market, product, etc.)
   - Investment recommendation
   - Due diligence questions

### Dashboard Features

- **High-Score Opportunities**: Deals scoring 70+ points
- **Recent Evaluations**: Latest analysis results
- **Performance Metrics**: Stats on deal flow and scoring
- **Progress Tracking**: Real-time analysis status

## 🎯 Investment Criteria

### Essential Requirements (Must Have)
- ✅ **Industry**: Fintech, InsurTech, WealthTech, Banking Tech
- ✅ **Stage**: Post-MVP with first customer validation
- ✅ **Geography**: North American operations
- ✅ **Round Size**: $2M+ funding capacity

### Scoring Categories
- 🏆 **Team Experience** (20 pts): Domain expertise, exits
- 📈 **Market Size** (20 pts): TAM > $1B, growth rate
- 🚀 **Innovation** (20 pts): AI/ML, blockchain, novel tech
- 📊 **Traction** (15 pts): Customers, revenue, validation
- 🛡️ **Competitive Advantage** (15 pts): Moat, IP, network effects
- 💰 **Business Model** (10 pts): Scalable, recurring revenue

## 🔧 Development

### Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── page.tsx        # Main dashboard
│   └── layout.tsx      # Root layout
├── components/          # React components
│   └── ui/             # Reusable UI components
├── lib/                # Utility functions
│   ├── supabase.ts     # Database client
│   ├── evaluator.ts    # Main evaluation pipeline
│   └── utils.ts        # Helper functions
├── services/           # API integrations
│   ├── exa.ts         # Exa.ai market intelligence
│   └── openai.ts      # OpenAI analysis engine
├── config/             # Configuration files
│   └── criteria.ts     # Investment criteria
└── prompts/            # AI prompts
    └── analysis.ts     # Specialized analysis prompts
```

### Key Components

- **StartupEvaluator**: Main evaluation orchestrator
- **ExaService**: Market intelligence and data gathering
- **OpenAIService**: AI analysis and memo generation
- **DatabaseService**: Supabase database operations

### Running Tests

```bash
# Run test suite
npm test

# Run with coverage
npm run test:coverage
```

## 🚀 Deployment

### Vercel Deployment

1. **Connect Repository**
   ```bash
   npx vercel --prod
   ```

2. **Environment Variables**
   - Add all `.env.local` variables to Vercel dashboard
   - Ensure Supabase URL is production URL

3. **Database Migration**
   - Run schema SQL in production Supabase
   - Update environment variables

### Production Checklist

- [ ] All API keys configured
- [ ] Database schema deployed
- [ ] Environment variables set
- [ ] DNS configured (if custom domain)
- [ ] Analytics and monitoring enabled

## 💰 Cost Estimation

### Monthly Operating Costs

| Service | Cost Range | Usage |
|---------|------------|-------|
| OpenAI API | $50-200 | 100-500 evaluations |
| Exa.ai | $49-299 | Based on search volume |
| Supabase | Free-$25 | Database and auth |
| Vercel | Free-$20 | Hosting and functions |
| **Total** | **$100-550** | Scales with usage |

### ROI Analysis
- **Time Saved**: 40 hours/week @ $150/hour = $6,000/week
- **Better Decision Making**: 2-3x improvement in deal quality
- **Payback Period**: Less than 1 week

## 📈 Performance Metrics

### Target KPIs
- **Deals Processed**: 100+ per week
- **Analysis Time**: < 5 minutes per deal
- **Cost per Evaluation**: < $2
- **Accuracy Rate**: > 80% partner agreement

### Quality Metrics
- False positive rate < 20%
- High-score deal accuracy > 80%
- Data quality scoring system

## 🤝 Support & Contributing

### Getting Help
- Review the [troubleshooting guide](SETUP.md)
- Check existing [issues](../../issues)
- Contact the development team

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📝 License

This project is proprietary software developed for Impression Ventures.

---

## 🎉 Next Steps

1. **Get API Keys**: Set up OpenAI and Exa.ai accounts
2. **Deploy Database**: Create Supabase project and run schema
3. **Test Analysis**: Start with a known fintech company
4. **Customize Criteria**: Adjust scoring for your specific thesis
5. **Scale Usage**: Process your current deal pipeline

**Ready to revolutionize your deal screening? Let's build the future of venture analysis together! 🚀**
