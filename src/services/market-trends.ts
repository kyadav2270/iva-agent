import { ExaService } from './exa'
import { OpenAIService } from './openai'

interface TrendData {
  id: string
  title: string
  description: string
  category: 'technology' | 'regulation' | 'market' | 'consumer' | 'funding' | 'competitive'
  impact: 'low' | 'medium' | 'high' | 'transformational'
  timeframe: 'immediate' | 'short-term' | 'medium-term' | 'long-term'
  confidence: number // 0-100
  sources: string[]
  affectedSectors: string[]
  investmentImplications: string[]
  keyMetrics: { [key: string]: number }
  timestamp: string
}

interface MarketPrediction {
  id: string
  trend: TrendData
  prediction: string
  likelihood: number // 0-100
  timeline: string
  catalysts: string[]
  risks: string[]
  opportunities: string[]
  strategicRecommendations: string[]
  monitoringIndicators: string[]
}

interface ThesisEvolution {
  sector: string
  previousThesis: string
  updatedThesis: string
  keyChanges: string[]
  confidence: number
  reasoning: string
  supportingData: string[]
  nextReviewDate: string
}

interface MarketIntelligence {
  trends: TrendData[]
  predictions: MarketPrediction[]
  thesisEvolutions: ThesisEvolution[]
  emergingOpportunities: string[]
  risks: string[]
  timestamp: string
}

export class MarketTrendsService {
  private exaService: ExaService
  private openaiService: OpenAIService

  constructor() {
    this.exaService = new ExaService()
    this.openaiService = new OpenAIService()
  }

  async generateMarketIntelligence(sectors: string[] = ['fintech']): Promise<MarketIntelligence> {
    const trends: TrendData[] = []
    const predictions: MarketPrediction[] = []
    const thesisEvolutions: ThesisEvolution[] = []

    // Collect trend data for each sector
    for (const sector of sectors) {
      const sectorTrends = await this.analyzeSectorTrends(sector)
      trends.push(...sectorTrends)

      const sectorPredictions = await this.generateSectorPredictions(sector, sectorTrends)
      predictions.push(...sectorPredictions)

      const thesisEvolution = await this.evolveInvestmentThesis(sector, sectorTrends)
      if (thesisEvolution) {
        thesisEvolutions.push(thesisEvolution)
      }
    }

    // Generate cross-sector insights
    const emergingOpportunities = await this.identifyEmergingOpportunities(trends)
    const risks = await this.identifyMarketRisks(trends)

    return {
      trends,
      predictions,
      thesisEvolutions,
      emergingOpportunities,
      risks,
      timestamp: new Date().toISOString()
    }
  }

  private async analyzeSectorTrends(sector: string): Promise<TrendData[]> {
    const trends: TrendData[] = []

    try {
      // Technology trends
      const techTrends = await this.collectTechnologyTrends(sector)
      trends.push(...techTrends)

      // Regulatory trends
      const regulatoryTrends = await this.collectRegulatoryTrends(sector)
      trends.push(...regulatoryTrends)

      // Market trends
      const marketTrends = await this.collectMarketTrends(sector)
      trends.push(...marketTrends)

      // Funding trends
      const fundingTrends = await this.collectFundingTrends(sector)
      trends.push(...fundingTrends)

      return trends
    } catch (error) {
      console.error(`Error analyzing trends for ${sector}:`, error)
      return []
    }
  }

  private async collectTechnologyTrends(sector: string): Promise<TrendData[]> {
    const query = `${sector} technology trends 2024 AI blockchain machine learning automation innovation`
    const results = await this.exaService.performSearch(query, {
      numResults: 10,
      startPublishedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      includeDomains: ['techcrunch.com', 'wired.com', 'mit.edu', 'stanford.edu', 'accenture.com']
    })

    return await this.extractTrendsFromResults(results.results, 'technology', sector)
  }

  private async collectRegulatoryTrends(sector: string): Promise<TrendData[]> {
    const query = `${sector} regulation compliance policy government law 2024 2025`
    const results = await this.exaService.performSearch(query, {
      numResults: 8,
      startPublishedDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      includeDomains: ['sec.gov', 'federalreserve.gov', 'reuters.com', 'wsj.com', 'bloomberg.com']
    })

    return await this.extractTrendsFromResults(results.results, 'regulation', sector)
  }

  private async collectMarketTrends(sector: string): Promise<TrendData[]> {
    const query = `${sector} market trends growth consumer behavior adoption rates 2024`
    const results = await this.exaService.performSearch(query, {
      numResults: 8,
      startPublishedDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      includeDomains: ['mckinsey.com', 'bcg.com', 'pwc.com', 'deloitte.com', 'statista.com']
    })

    return await this.extractTrendsFromResults(results.results, 'market', sector)
  }

  private async collectFundingTrends(sector: string): Promise<TrendData[]> {
    const query = `${sector} venture capital funding investment trends 2024 startup`
    const results = await this.exaService.performSearch(query, {
      numResults: 8,
      startPublishedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      includeDomains: ['pitchbook.com', 'crunchbase.com', 'cbinsights.com', 'techcrunch.com']
    })

    return await this.extractTrendsFromResults(results.results, 'funding', sector)
  }

  private async extractTrendsFromResults(
    results: any[], 
    category: TrendData['category'], 
    sector: string
  ): Promise<TrendData[]> {
    if (results.length === 0) return []

    const prompt = `Analyze these ${category} articles for ${sector} sector and extract key trends:

ARTICLES:
${JSON.stringify(results.slice(0, 5).map(r => ({
  title: r.title,
  text: r.text?.substring(0, 500),
  url: r.url
})), null, 2)}

Extract 3-5 key trends. For each trend, provide:

Return results in JSON format:
{
  "trends": [
    {
      "title": "Trend title (max 60 chars)",
      "description": "Detailed description (2-3 sentences)",
      "impact": "low|medium|high|transformational",
      "timeframe": "immediate|short-term|medium-term|long-term",
      "confidence": number (0-100),
      "sources": ["source1", "source2"],
      "affectedSectors": ["sector1"],
      "investmentImplications": ["implication1", "implication2"],
      "keyMetrics": {"metric1": value, "metric2": value}
    }
  ]
}`

    try {
      const response = await this.openaiService.retryRequest(async () => {
        const openai = await import('openai').then(mod => new mod.default({
          apiKey: process.env.OPENAI_API_KEY!
        }))
        
        return await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.4,
          max_tokens: 2000,
          response_format: { type: 'json_object' }
        })
      })

      const result = JSON.parse(response.choices[0].message.content || '{"trends":[]}')
      const trendsData = result.trends || []

      return trendsData.map((trend: any, index: number) => ({
        id: `${category}_${sector}_${Date.now()}_${index}`,
        title: trend.title || 'Unknown Trend',
        description: trend.description || '',
        category,
        impact: trend.impact || 'medium',
        timeframe: trend.timeframe || 'medium-term',
        confidence: trend.confidence || 50,
        sources: trend.sources || [],
        affectedSectors: trend.affectedSectors || [sector],
        investmentImplications: trend.investmentImplications || [],
        keyMetrics: trend.keyMetrics || {},
        timestamp: new Date().toISOString()
      }))
    } catch (error) {
      console.error(`Error extracting ${category} trends:`, error)
      return []
    }
  }

  private async generateSectorPredictions(sector: string, trends: TrendData[]): Promise<MarketPrediction[]> {
    if (trends.length === 0) return []

    const prompt = `Based on these trends in ${sector}, generate 2-3 specific market predictions:

TRENDS:
${JSON.stringify(trends.slice(0, 5), null, 2)}

For each prediction, provide:

Return results in JSON format:
{
  "predictions": [
    {
      "prediction": "Specific prediction statement",
      "likelihood": number (0-100),
      "timeline": "When this will happen",
      "catalysts": ["catalyst1", "catalyst2"],
      "risks": ["risk1", "risk2"],
      "opportunities": ["opportunity1", "opportunity2"],
      "strategicRecommendations": ["recommendation1"],
      "monitoringIndicators": ["indicator1", "indicator2"]
    }
  ]
}`

    try {
      const response = await this.openaiService.retryRequest(async () => {
        const openai = await import('openai').then(mod => new mod.default({
          apiKey: process.env.OPENAI_API_KEY!
        }))
        
        return await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.5,
          max_tokens: 2000,
          response_format: { type: 'json_object' }
        })
      })

      const result = JSON.parse(response.choices[0].message.content || '{"predictions":[]}')
      const predictionsData = result.predictions || []

      return predictionsData.map((pred: any, index: number) => ({
        id: `prediction_${sector}_${Date.now()}_${index}`,
        trend: trends[0], // Use primary trend
        prediction: pred.prediction || '',
        likelihood: pred.likelihood || 50,
        timeline: pred.timeline || 'Medium-term',
        catalysts: pred.catalysts || [],
        risks: pred.risks || [],
        opportunities: pred.opportunities || [],
        strategicRecommendations: pred.strategicRecommendations || [],
        monitoringIndicators: pred.monitoringIndicators || []
      }))
    } catch (error) {
      console.error(`Error generating predictions for ${sector}:`, error)
      return []
    }
  }

  private async evolveInvestmentThesis(sector: string, trends: TrendData[]): Promise<ThesisEvolution | null> {
    if (trends.length === 0) return null

    // This would normally fetch the previous thesis from database
    const previousThesis = this.getDefaultThesis(sector)

    const prompt = `Given these trends in ${sector}, evolve our investment thesis:

CURRENT THESIS: ${previousThesis}

RECENT TRENDS:
${JSON.stringify(trends.slice(0, 5), null, 2)}

Provide updated thesis considering these trends:

Return results in JSON format:
{
  "updatedThesis": "New investment thesis (2-3 paragraphs)",
  "keyChanges": ["change1", "change2", "change3"],
  "confidence": number (0-100),
  "reasoning": "Why these changes are needed (1 paragraph)",
  "supportingData": ["data point 1", "data point 2"],
  "nextReviewDate": "YYYY-MM-DD"
}`

    try {
      const response = await this.openaiService.retryRequest(async () => {
        const openai = await import('openai').then(mod => new mod.default({
          apiKey: process.env.OPENAI_API_KEY!
        }))
        
        return await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.4,
          max_tokens: 1500,
          response_format: { type: 'json_object' }
        })
      })

      const result = JSON.parse(response.choices[0].message.content || '{}')

      return {
        sector,
        previousThesis,
        updatedThesis: result.updatedThesis || previousThesis,
        keyChanges: result.keyChanges || [],
        confidence: result.confidence || 70,
        reasoning: result.reasoning || '',
        supportingData: result.supportingData || [],
        nextReviewDate: result.nextReviewDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    } catch (error) {
      console.error(`Error evolving thesis for ${sector}:`, error)
      return null
    }
  }

  private async identifyEmergingOpportunities(trends: TrendData[]): Promise<string[]> {
    const highImpactTrends = trends.filter(t => t.impact === 'high' || t.impact === 'transformational')
    
    if (highImpactTrends.length === 0) return []

    const prompt = `Based on these high-impact trends, identify 5 specific emerging investment opportunities:

TRENDS:
${JSON.stringify(highImpactTrends.slice(0, 8), null, 2)}

Return results in JSON format as an array of opportunity descriptions:
{"opportunities": ["opportunity 1", "opportunity 2", ...]}`

    try {
      const response = await this.openaiService.retryRequest(async () => {
        const openai = await import('openai').then(mod => new mod.default({
          apiKey: process.env.OPENAI_API_KEY!
        }))
        
        return await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.6,
          max_tokens: 800,
          response_format: { type: 'json_object' }
        })
      })

      const result = JSON.parse(response.choices[0].message.content || '{"opportunities":[]}')
      return result.opportunities || []
    } catch (error) {
      console.error('Error identifying opportunities:', error)
      return []
    }
  }

  private async identifyMarketRisks(trends: TrendData[]): Promise<string[]> {
    const prompt = `Based on these trends, identify 5 key market risks for venture investors:

TRENDS:
${JSON.stringify(trends.slice(0, 10), null, 2)}

Return results in JSON format as an array of risk descriptions:
{"risks": ["risk 1", "risk 2", ...]}`

    try {
      const response = await this.openaiService.retryRequest(async () => {
        const openai = await import('openai').then(mod => new mod.default({
          apiKey: process.env.OPENAI_API_KEY!
        }))
        
        return await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.4,
          max_tokens: 600,
          response_format: { type: 'json_object' }
        })
      })

      const result = JSON.parse(response.choices[0].message.content || '{"risks":[]}')
      return result.risks || []
    } catch (error) {
      console.error('Error identifying risks:', error)
      return []
    }
  }

  private getDefaultThesis(sector: string): string {
    const defaultTheses: { [key: string]: string } = {
      fintech: "We focus on B2B fintech infrastructure companies that enable traditional financial institutions to modernize their technology stack. Priority areas include payments infrastructure, compliance tech, and embedded finance solutions.",
      healthtech: "We invest in healthcare technology companies that improve patient outcomes while reducing costs. Focus areas include digital health platforms, medical devices, and healthcare analytics.",
      edtech: "We target educational technology companies that address skill gaps and improve learning outcomes. Priority areas include corporate training, professional development, and certification platforms."
    }

    return defaultTheses[sector.toLowerCase()] || `We invest in innovative ${sector} companies that address large market opportunities with scalable technology solutions.`
  }

  // Public API methods
  async getTrendAnalysis(sectors: string[]): Promise<TrendData[]> {
    const allTrends: TrendData[] = []
    
    for (const sector of sectors) {
      const sectorTrends = await this.analyzeSectorTrends(sector)
      allTrends.push(...sectorTrends)
    }

    return allTrends.sort((a, b) => {
      const impactWeight = { transformational: 4, high: 3, medium: 2, low: 1 }
      return (impactWeight[b.impact] * b.confidence) - (impactWeight[a.impact] * a.confidence)
    })
  }

  async generateMarketPredictions(sector: string): Promise<MarketPrediction[]> {
    const trends = await this.analyzeSectorTrends(sector)
    return await this.generateSectorPredictions(sector, trends)
  }

  async updateInvestmentThesis(sector: string): Promise<ThesisEvolution | null> {
    const trends = await this.analyzeSectorTrends(sector)
    return await this.evolveInvestmentThesis(sector, trends)
  }
}