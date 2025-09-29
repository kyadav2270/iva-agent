import OpenAI from 'openai'

let openai: OpenAI | null = null

function getOpenAIClient(): OpenAI {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required')
    }
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!
    })
  }
  return openai
}

interface StartupData {
  companyInfo: any
  newsData: any
  competitorData: any[]
  marketData: any
  founderData: any[]
}

interface InvestmentScore {
  overall_score: number
  team_score: number
  market_score: number
  product_score: number
  traction_score: number
  competitive_advantage_score: number
  business_model_score: number
  meets_criteria: boolean
  strengths: string[]
  red_flags: string[]
  reasoning: string
}

interface InvestmentMemo {
  executive_summary: string
  investment_thesis: string
  market_opportunity: string
  competitive_landscape: string
  team_assessment: string
  financial_projections: string
  risks_and_mitigations: string
  recommendation: 'PASS' | 'WEAK_PASS' | 'CONSIDER' | 'STRONG_CONSIDER' | 'INVEST'
  due_diligence_questions: string[]
}

interface DueDiligenceQuestions {
  technical: string[]
  business: string[]
  financial: string[]
  legal: string[]
  market: string[]
  team: string[]
}

export class OpenAIService {
  private maxRetries = 3
  private retryDelay = 1000

  constructor() {
    // API key validation moved to getOpenAIClient() for lazy initialization
  }

  // Helper function to truncate and optimize data for token limits - ULTRA AGGRESSIVE
  private optimizeStartupData(startupData: StartupData): any {
    return {
      company: startupData.companyInfo?.name || 'Unknown',
      description: this.truncateText(startupData.companyInfo?.description, 100),
      industry: startupData.companyInfo?.industry || 'Unknown',
      location: startupData.companyInfo?.location || 'Unknown',
      founded: startupData.companyInfo?.foundedYear,
      news: (startupData.newsData?.recentNews || []).slice(0, 2).map((news: any) => 
        this.truncateText(news.title, 60)
      ),
      competitors: (startupData.competitorData || []).slice(0, 3).map((comp: any) => 
        this.truncateText(comp.title, 50)
      ),
      trends: (startupData.marketData?.keyTrends || []).slice(0, 2).map((trend: string) => 
        this.truncateText(trend, 50)
      ),
      founders: (startupData.founderData || []).slice(0, 2).map((founder: any) => ({
        name: founder.name,
        exp: (founder.experience || []).slice(0, 1).map((exp: string) => 
          this.truncateText(exp, 40)
        )[0] || 'No data'
      }))
    }
  }

  private truncateText(text: string | undefined, maxLength: number): string {
    if (!text) return ''
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  async retryRequest<T>(requestFn: () => Promise<T>): Promise<T> {
    let lastError: Error
    
    for (let i = 0; i < this.maxRetries; i++) {
      try {
        return await requestFn()
      } catch (error: any) {
        lastError = error
        if (error.status === 429) {
          // Rate limit hit, wait longer
          await new Promise(resolve => setTimeout(resolve, this.retryDelay * (i + 1) * 2))
        } else if (i < this.maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelay * (i + 1)))
        }
      }
    }
    
    throw lastError!
  }

  async analyzeStartup(startupData: StartupData): Promise<InvestmentScore> {
    // Optimize data to reduce token count
    const optimizedData = this.optimizeStartupData(startupData)
    
    const prompt = `Score fintech startup for Impression Ventures. Essential: Fintech, Post-MVP, North America, $2M+. Score 0-100: Team(20)+Market(20)+Product(20)+Traction(15)+Competitive(15)+Business(10).

Data: ${JSON.stringify(optimizedData)}

Return response in JSON format:
{"overall_score":number,"team_score":number,"market_score":number,"product_score":number,"traction_score":number,"competitive_advantage_score":number,"business_model_score":number,"meets_criteria":boolean,"strengths":["str1","str2","str3"],"red_flags":["flag1","flag2","flag3"],"reasoning":"brief explanation"}`

    return this.retryRequest(async () => {
      const response = await getOpenAIClient().chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'VC expert. Analyze fintech startups.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 400,
        response_format: { type: 'json_object' }
      })

      const content = response.choices[0].message.content
      if (!content) throw new Error('Empty response from OpenAI')

      return JSON.parse(content) as InvestmentScore
    })
  }

  async generateInvestmentMemo(startupData: StartupData, score: InvestmentScore): Promise<InvestmentMemo> {
    // Use optimized data to reduce token usage
    const optimizedData = this.optimizeStartupData(startupData)
    
    const prompt = `Write investment memo for ${optimizedData.company}. Score: ${score.overall_score}/100.

Data: ${JSON.stringify(optimizedData)}
Scores: Team(${score.team_score}) Market(${score.market_score}) Product(${score.product_score})
Strengths: ${score.strengths?.join(', ')}
Risks: ${score.red_flags?.join(', ')}

Return response in JSON format:
{"executive_summary":"2 sentences","investment_thesis":"why invest","market_opportunity":"market size/timing","competitive_landscape":"differentiation","team_assessment":"team strength","financial_projections":"projections","risks_and_mitigations":"key risks","recommendation":"PASS|CONSIDER|STRONG_CONSIDER|INVEST","due_diligence_questions":["q1","q2","q3"]}`

    return this.retryRequest(async () => {
      const response = await getOpenAIClient().chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a senior venture capital associate at Impression Ventures. Write professional, thorough investment memos.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.4,
        max_tokens: 3000,
        response_format: { type: 'json_object' }
      })

      const content = response.choices[0].message.content
      if (!content) throw new Error('Empty response from OpenAI')

      return JSON.parse(content) as InvestmentMemo
    })
  }

  async generateDueDiligenceQuestions(startupData: StartupData, score: InvestmentScore): Promise<DueDiligenceQuestions> {
    const prompt = `Generate DD questions for fintech ${startupData.companyInfo?.name || 'startup'}. Score: ${score.overall_score}/100. 
Strengths: ${score.strengths?.join(', ')}.
Risks: ${score.red_flags?.join(', ')}.

Return 3 questions each category in JSON format:
{"technical":["q1","q2","q3"],"business":["q1","q2","q3"],"financial":["q1","q2","q3"],"legal":["q1","q2","q3"],"market":["q1","q2","q3"],"team":["q1","q2","q3"]}`

    return this.retryRequest(async () => {
      const response = await getOpenAIClient().chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an experienced venture capital due diligence specialist. Generate thorough, specific questions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      })

      const content = response.choices[0].message.content
      if (!content) throw new Error('Empty response from OpenAI')

      return JSON.parse(content) as DueDiligenceQuestions
    })
  }

  async identifyRedFlags(startupData: StartupData): Promise<string[]> {
    const prompt = `
Analyze this startup data and identify potential red flags that would concern venture investors.

COMPANY DATA:
${JSON.stringify(startupData, null, 2)}

Common red flags to look for:
- Team issues (lack of experience, founder conflicts)
- Market problems (small TAM, declining market)
- Product issues (weak differentiation, technical risks)
- Business model concerns (poor unit economics, unsustainable growth)
- Competitive threats (strong incumbents, low barriers)
- Financial red flags (high burn rate, limited runway)
- Legal/regulatory risks
- Customer concentration risk
- Technology risks

Identify the top 5 most concerning red flags. Be specific and cite evidence from the data.

Respond with results in JSON format as an array of strings:
["red flag 1 with specific details", "red flag 2 with specific details", ...]
`

    return this.retryRequest(async () => {
      const response = await getOpenAIClient().chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 400,
        response_format: { type: 'json_object' }
      })

      const content = response.choices[0].message.content
      if (!content) throw new Error('Empty response from OpenAI')

      const result = JSON.parse(content)
      return result.red_flags || []
    })
  }

  async analyzeCompetitiveLandscape(companyName: string, competitorData: any[]): Promise<{
    directCompetitors: string[]
    indirectCompetitors: string[]
    competitiveAdvantages: string[]
    threats: string[]
    marketPosition: string
  }> {
    const prompt = `
Analyze the competitive landscape for ${companyName} based on the following competitor data:

COMPETITOR DATA:
${JSON.stringify(competitorData, null, 2)}

Provide analysis on:
1. Direct competitors (same product/market)
2. Indirect competitors (adjacent solutions)
3. Competitive advantages for ${companyName}
4. Competitive threats
5. Market position assessment

Respond with results in JSON format:
{
  "directCompetitors": ["competitor1", "competitor2", ...],
  "indirectCompetitors": ["competitor1", "competitor2", ...],
  "competitiveAdvantages": ["advantage1", "advantage2", ...],
  "threats": ["threat1", "threat2", ...],
  "marketPosition": "market position description"
}
`

    return this.retryRequest(async () => {
      const response = await getOpenAIClient().chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.4,
        max_tokens: 1500,
        response_format: { type: 'json_object' }
      })

      const content = response.choices[0].message.content
      if (!content) throw new Error('Empty response from OpenAI')

      return JSON.parse(content)
    })
  }

  async suggestFollowUpQuestions(startupData: StartupData, score: InvestmentScore): Promise<string[]> {
    const prompt = `
Based on this startup analysis, suggest 10 specific follow-up questions that Impression Ventures should ask in the next meeting.

STARTUP DATA:
${JSON.stringify(startupData.companyInfo, null, 2)}

ANALYSIS RESULTS:
Score: ${score.overall_score}/100
Strengths: ${score.strengths.join(', ')}
Concerns: ${score.red_flags.join(', ')}

Focus on:
- Areas where more information is needed
- Validating key assumptions
- Understanding competitive differentiation
- Financial projections and unit economics
- Regulatory and compliance considerations
- Team and execution capabilities

Respond with results in JSON format as an array of specific, actionable questions:
["question 1", "question 2", ...]
`

    return this.retryRequest(async () => {
      const response = await getOpenAIClient().chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 400,
        response_format: { type: 'json_object' }
      })

      const content = response.choices[0].message.content
      if (!content) throw new Error('Empty response from OpenAI')

      const result = JSON.parse(content)
      return result.questions || []
    })
  }

  // Due Diligence Analysis Methods
  async analyzeDDFinancials(companyName: string, searchResults: any[]): Promise<any> {
    const prompt = `Extract financial metrics for ${companyName} from search results:

${JSON.stringify(searchResults.slice(0, 3), null, 2)}

Extract data and return in JSON format:
{"burnRate":number,"burnTrend":"increasing|stable|decreasing","runway":number,"burnConfidence":number,"mrr":number,"arr":number,"growthRate":number,"churnRate":number,"ltv":number,"cac":number,"ltvCacRatio":number,"grossMargin":number,"contributionMargin":number,"paybackPeriod":number,"profitabilityScore":number,"totalRaised":number,"lastRoundSize":number,"lastRoundDate":"YYYY-MM-DD","valuation":number,"leadInvestors":["investor1"]}`

    return this.retryRequest(async () => {
      const response = await getOpenAIClient().chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 800,
        response_format: { type: 'json_object' }
      })
      return JSON.parse(response.choices[0].message.content || '{}')
    })
  }

  async analyzeDDLegal(companyName: string, searchResults: any[]): Promise<any> {
    const prompt = `Extract legal/compliance data for ${companyName}:

${JSON.stringify(searchResults.slice(0, 3), null, 2)}

Extract data and return in JSON format:
{"licenses":["license1"],"jurisdictions":["jurisdiction1"],"complianceScore":number,"pendingApplications":["app1"],"patents":[{"title":"","registrationNumber":"","status":"granted","jurisdiction":"","filingDate":"YYYY-MM-DD","strength":number}],"trademarks":[],"copyrights":[],"tradeSecrets":["secret1"],"ipStrength":number,"activeCases":[],"settledCases":[],"litigationRisk":number,"jurisdiction":"Delaware","entityType":"C-Corp","subsidiaries":["sub1"],"stakeholders":[{"name":"","role":"","ownership":number,"votingRights":number}],"governance":{"boardSize":number,"independentDirectors":number,"committees":["committee1"],"votingStructure":"","protectiveProvisions":["provision1"]},"customerContracts":{"totalValue":number,"termLength":number,"keyTerms":["term1"],"riskFactors":["risk1"],"riskScore":number},"supplierContracts":{},"employmentContracts":{},"contractRisk":"low|medium|high"}`

    return this.retryRequest(async () => {
      const response = await getOpenAIClient().chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 1200,
        response_format: { type: 'json_object' }
      })
      return JSON.parse(response.choices[0].message.content || '{}')
    })
  }

  async analyzeDDTechnical(companyName: string, searchResults: any[]): Promise<any> {
    const prompt = `Extract technical data for ${companyName}:

${JSON.stringify(searchResults.slice(0, 3), null, 2)}

Extract data and return in JSON format:
{"scalabilityScore":number,"modernityScore":number,"securityScore":number,"maintainabilityScore":number,"technicalDebt":"low|medium|high","certifications":["cert1"],"vulnerabilities":[{"severity":"low|medium|high|critical","description":"","status":"open|patched","discoveryDate":"YYYY-MM-DD"}],"dataProtection":{"gdprCompliance":number,"ccpaCompliance":number,"dataMinimization":number,"accessControls":number,"encryption":number},"incidents":[],"devTeamSize":number,"velocity":{"sprintCapacity":number,"velocityTrend":"increasing|stable|decreasing","blockerFrequency":number,"deliveryPredictability":number},"codeQuality":{"testCoverage":number,"technicalDebtRatio":number,"codeComplexity":number,"duplicatedLines":number,"maintainabilityIndex":number},"deploymentFreq":"Daily|Weekly|Monthly","leadTime":"1-2 days","failureRate":number,"apiQuality":number,"dependencies":[{"name":"","version":"","type":"critical|important|optional","vulnerabilities":number,"riskScore":number}],"integrations":[],"capabilities":[]}`

    return this.retryRequest(async () => {
      const response = await getOpenAIClient().chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 1200,
        response_format: { type: 'json_object' }
      })
      return JSON.parse(response.choices[0].message.content || '{}')
    })
  }

  async analyzeDDMarket(companyName: string, searchResults: any[]): Promise<any> {
    const prompt = `Extract market validation data for ${companyName}:

${JSON.stringify(searchResults.slice(0, 3), null, 2)}

Extract data and return in JSON format:
{"interviews":[],"surveys":[],"npsScore":number,"satisfactionScore":number,"churnReasons":["reason1"],"directCompetitors":[{"name":"","marketShare":number,"strengths":["strength1"],"weaknesses":["weakness1"],"pricing":"","differentiationFactor":"","threatLevel":"low|medium|high"}],"indirectCompetitors":[],"marketPosition":{"ranking":number,"marketShare":number,"brandRecognition":number,"customerLoyalty":number,"pricingPower":number},"differentiationFactors":["factor1"],"competitiveAdvantage":number,"tam":number,"sam":number,"som":number,"penetration":number,"growthPotential":number,"conversionRates":{"leads":number,"qualified":number,"opportunities":number,"closed":number,"conversionRate":number},"salesCycle":number,"avgDealSize":number,"acquisitionChannels":[{"channel":"","cost":number,"volume":number,"quality":number,"roi":number}]}`

    return this.retryRequest(async () => {
      const response = await getOpenAIClient().chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 1200,
        response_format: { type: 'json_object' }
      })
      return JSON.parse(response.choices[0].message.content || '{}')
    })
  }

  async analyzeDDTeam(companyName: string, searchResults: any[]): Promise<any> {
    const prompt = `Extract team assessment data for ${companyName}:

${JSON.stringify(searchResults.slice(0, 3), null, 2)}

Extract data and return in JSON format:
{"founders":[{"name":"","role":"","previousExperience":[{"company":"","role":"","duration":"","achievements":["achievement1"],"relevanceScore":number}],"education":[{"institution":"","degree":"","field":"","year":number,"prestige":number}],"networkStrength":number,"domainExpertise":number,"leadershipScore":number,"commitmentLevel":number}],"keyEmployees":[{"role":"","experienceLevel":"","performanceRating":number,"retentionRisk":number,"criticalityToCompany":"low|medium|high"}],"boardMembers":[{"name":"","background":"","relevantExperience":["exp1"],"networkValue":number,"activeContribution":number}],"advisors":[{"name":"","expertise":["area1"],"relevanceToCompany":number,"activeInvolvement":number,"networkValue":number}],"experienceScore":number,"domainExpertise":number,"executionCapability":number,"cultureFit":number,"keyPersonRisk":number,"hiringPlan":{"totalPositions":number,"criticalPositions":["role1"],"timeline":[{"role":"","startDate":"YYYY-MM-DD","expectedCloseDate":"YYYY-MM-DD","priority":"low|medium|high"}],"budget":number,"successProbability":number},"talentPipeline":{"sourceQuality":number,"responseRate":number,"conversionRate":number,"timeToHire":number},"compensation":{"marketCompetitiveness":number,"equityAllocated":number,"retentionPackages":boolean,"performanceIncentives":boolean,"benchmarkScore":number},"retentionRisk":number}`

    return this.retryRequest(async () => {
      const response = await getOpenAIClient().chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 1500,
        response_format: { type: 'json_object' }
      })
      return JSON.parse(response.choices[0].message.content || '{}')
    })
  }
}