import { ExaService } from '@/services/exa'
import { OpenAIService } from '@/services/openai'
import { DDCollectorsService } from '@/services/dd-collectors'
import { DatabaseService, Company, Evaluation, Founder, MarketInsight } from '@/lib/supabase'
import { ComprehensiveDDReport } from '@/types/duediligence'

interface EvaluationInput {
  companyName: string
  website?: string
  description?: string
  founderNames?: string[]
}

interface EvaluationResult {
  company: Company
  evaluation: Evaluation
  founders: Founder[]
  marketInsight: MarketInsight
  ddReport?: ComprehensiveDDReport
  processingTime: number
  dataQuality: 'high' | 'medium' | 'low'
}

interface ProcessingStatus {
  step: string
  progress: number
  message: string
  completed: boolean
  error?: string
}

export class StartupEvaluator {
  private exaService: ExaService
  private openaiService: OpenAIService
  private ddCollectorsService: DDCollectorsService
  private statusCallback?: (status: ProcessingStatus) => void

  constructor(statusCallback?: (status: ProcessingStatus) => void) {
    this.exaService = new ExaService()
    this.openaiService = new OpenAIService()
    this.ddCollectorsService = new DDCollectorsService()
    this.statusCallback = statusCallback
  }

  private updateStatus(step: string, progress: number, message: string, completed = false, error?: string) {
    if (this.statusCallback) {
      this.statusCallback({ step, progress, message, completed, error })
    }
  }

  async evaluateStartup(input: EvaluationInput): Promise<EvaluationResult> {
    const startTime = Date.now()
    
    try {
      this.updateStatus('initialization', 0, 'Starting evaluation process...')

      // Step 1: Check if company already exists
      this.updateStatus('database-check', 10, 'Checking existing records...')
      let company = await DatabaseService.getCompanyByName(input.companyName)
      
      // Step 2: Gather data from Exa.ai
      this.updateStatus('data-gathering', 20, 'Gathering company information...')
      const companyInfo = await this.exaService.searchCompanyInfo(input.companyName)
      
      this.updateStatus('news-search', 30, 'Searching recent news and updates...')
      const newsData = await this.exaService.searchRecentNews(input.companyName)
      
      this.updateStatus('competitor-analysis', 40, 'Analyzing competitive landscape...')
      const competitorData = await this.exaService.searchCompetitors(
        input.companyName, 
        companyInfo.industry || 'fintech'
      )
      
      this.updateStatus('market-research', 50, 'Researching market trends...')
      const marketData = await this.exaService.searchMarketData(
        companyInfo.industry || 'fintech'
      )

      // Step 3: Gather founder information
      this.updateStatus('founder-research', 60, 'Researching founder backgrounds...')
      const founderData = []
      const founderNames = input.founderNames || []
      
      for (const founderName of founderNames) {
        const background = await this.exaService.searchFounderBackground(founderName, input.companyName)
        founderData.push({
          name: founderName,
          ...background
        })
      }

      // Step 4: Create or update company record
      this.updateStatus('database-update', 65, 'Updating company records...')
      if (!company) {
        company = await DatabaseService.createCompany({
          name: input.companyName,
          website: input.website || companyInfo.website,
          description: input.description || companyInfo.description,
          industry: companyInfo.industry,
          location: companyInfo.location,
          employee_count: companyInfo.employeeCount ? parseInt(companyInfo.employeeCount.replace(/\D/g, '')) : undefined,
          founded_year: companyInfo.foundedYear
        })
      } else {
        // Update existing company with new information
        company = await DatabaseService.updateCompany(company.id, {
          website: company.website || companyInfo.website,
          description: company.description || companyInfo.description,
          industry: company.industry || companyInfo.industry,
          location: company.location || companyInfo.location,
          employee_count: company.employee_count || (companyInfo.employeeCount ? parseInt(companyInfo.employeeCount.replace(/\D/g, '')) : undefined),
          founded_year: company.founded_year || companyInfo.foundedYear
        })
      }

      // Step 5: Store founder information
      const founders: Founder[] = []
      for (const founderInfo of founderData) {
        const founder = await DatabaseService.createFounder({
          company_id: company.id,
          name: founderInfo.name,
          previous_companies: founderInfo.previousCompanies,
          education: founderInfo.education,
          fintech_experience: founderInfo.experience.some((exp: string) => 
            exp.toLowerCase().includes('fintech') || 
            exp.toLowerCase().includes('financial') ||
            exp.toLowerCase().includes('banking')
          )
        })
        founders.push(founder)
      }

      // Step 6: AI Analysis
      this.updateStatus('ai-analysis', 70, 'Running AI analysis...')
      const startupData = {
        companyInfo,
        newsData,
        competitorData,
        marketData,
        founderData
      }

      const investmentScore = await this.openaiService.analyzeStartup(startupData)
      
      this.updateStatus('memo-generation', 80, 'Generating investment memo...')
      const investmentMemo = await this.openaiService.generateInvestmentMemo(startupData, investmentScore)
      
      this.updateStatus('due-diligence', 85, 'Creating due diligence questions...')
      const ddQuestions = await this.openaiService.generateDueDiligenceQuestions(startupData, investmentScore)
      
      // Flatten due diligence questions
      const allQuestions = [
        ...ddQuestions.technical,
        ...ddQuestions.business,
        ...ddQuestions.financial,
        ...ddQuestions.legal,
        ...ddQuestions.market,
        ...ddQuestions.team
      ]

      // Step 7: Store evaluation results
      this.updateStatus('storing-results', 90, 'Storing evaluation results...')
      const evaluation = await DatabaseService.createEvaluation({
        company_id: company.id,
        overall_score: investmentScore.overall_score,
        team_score: investmentScore.team_score,
        market_score: investmentScore.market_score,
        product_score: investmentScore.product_score,
        traction_score: investmentScore.traction_score,
        competitive_advantage_score: investmentScore.competitive_advantage_score,
        business_model_score: investmentScore.business_model_score,
        meets_criteria: investmentScore.meets_criteria,
        strengths: investmentScore.strengths,
        red_flags: investmentScore.red_flags,
        investment_memo: investmentMemo.executive_summary + '\n\n' + 
                         investmentMemo.investment_thesis + '\n\n' +
                         investmentMemo.market_opportunity + '\n\n' +
                         investmentMemo.competitive_landscape + '\n\n' +
                         investmentMemo.team_assessment + '\n\n' +
                         investmentMemo.financial_projections + '\n\n' +
                         investmentMemo.risks_and_mitigations,
        due_diligence_questions: allQuestions,
        recommendation: investmentMemo.recommendation as 'PASS' | 'WEAK_PASS' | 'CONSIDER' | 'STRONG_CONSIDER' | 'INVEST',
        evaluation_date: new Date().toISOString()
      })

      // Step 8: Store market insights
      const marketInsight = await DatabaseService.createMarketInsight({
        company_id: company.id,
        market_size_billion: this.extractMarketSize(marketData),
        growth_rate_percent: this.extractGrowthRate(marketData),
        key_trends: marketData.keyTrends || [],
        competitive_landscape: {
          competitors: competitorData.slice(0, 5),
          analysis: investmentMemo.competitive_landscape
        },
        regulatory_environment: marketData.regulatoryEnvironment,
        market_timing_assessment: this.assessMarketTiming(marketData, newsData)
      })

      // Step 9: Generate comprehensive due diligence report (if score is high enough)
      let ddReport: ComprehensiveDDReport | undefined
      if (investmentScore.overall_score >= 60) {
        this.updateStatus('comprehensive-dd', 95, 'Generating comprehensive due diligence report...')
        
        ddReport = await this.ddCollectorsService.collectComprehensiveDueDiligence({
          companyName: input.companyName,
          website: input.website || companyInfo.website,
          industry: companyInfo.industry,
          description: input.description || companyInfo.description,
          foundedYear: companyInfo.foundedYear
        })
      }

      const processingTime = Date.now() - startTime
      
      this.updateStatus('completed', 100, 'Evaluation completed successfully!', true)

      // Determine data quality based on available information
      const dataQuality = this.assessDataQuality(companyInfo, newsData, competitorData, founderData)

      return {
        company,
        evaluation,
        founders,
        marketInsight,
        ddReport,
        processingTime,
        dataQuality
      }

    } catch (error: any) {
      this.updateStatus('error', 0, `Evaluation failed: ${error.message}`, false, error.message)
      throw error
    }
  }

  private extractMarketSize(marketData: any): number | undefined {
    // Try to extract market size from the text data
    const text = JSON.stringify(marketData).toLowerCase()
    const marketSizeMatch = text.match(/\$(\d+(?:\.\d+)?)\s*(?:billion|bn)/i)
    return marketSizeMatch ? parseFloat(marketSizeMatch[1]) : undefined
  }

  private extractGrowthRate(marketData: any): number | undefined {
    // Try to extract growth rate from the text data
    const text = JSON.stringify(marketData).toLowerCase()
    const growthMatch = text.match(/(\d+(?:\.\d+)?)\s*%.*?(?:growth|cagr)/i)
    return growthMatch ? parseFloat(growthMatch[1]) : undefined
  }

  private assessMarketTiming(marketData: any, newsData: any): string {
    const trends = marketData.keyTrends || []
    const recentNews = newsData.recentNews || []
    
    if (trends.length === 0 && recentNews.length === 0) {
      return 'Insufficient data for timing assessment'
    }
    
    const positiveTrends = trends.filter((trend: string) => 
      trend.toLowerCase().includes('growth') || 
      trend.toLowerCase().includes('adoption') ||
      trend.toLowerCase().includes('innovation')
    ).length
    
    const totalTrends = trends.length
    
    if (positiveTrends / totalTrends > 0.6) {
      return 'Favorable market timing with strong positive trends'
    } else if (positiveTrends / totalTrends > 0.3) {
      return 'Moderate market timing with mixed signals'
    } else {
      return 'Challenging market timing with limited positive indicators'
    }
  }

  private assessDataQuality(companyInfo: any, newsData: any, competitorData: any[], founderData: any[]): 'high' | 'medium' | 'low' {
    let score = 0
    let maxScore = 0
    
    // Company information quality (25 points)
    maxScore += 25
    if (companyInfo.description) score += 5
    if (companyInfo.website) score += 5
    if (companyInfo.industry) score += 5
    if (companyInfo.foundedYear) score += 5
    if (companyInfo.location) score += 5
    
    // News data quality (25 points)
    maxScore += 25
    if (newsData.recentNews && newsData.recentNews.length > 0) score += 10
    if (newsData.pressReleases && newsData.pressReleases.length > 0) score += 10
    if (newsData.industryTrends && newsData.industryTrends.length > 0) score += 5
    
    // Competitive data quality (25 points)
    maxScore += 25
    if (competitorData.length >= 3) score += 15
    else if (competitorData.length >= 1) score += 8
    
    if (competitorData.some(comp => comp.highlights && comp.highlights.length > 0)) score += 10
    
    // Founder data quality (25 points)
    maxScore += 25
    if (founderData.length > 0) score += 10
    if (founderData.some(f => f.experience && f.experience.length > 0)) score += 15
    
    const qualityPercentage = (score / maxScore) * 100
    
    if (qualityPercentage >= 70) return 'high'
    if (qualityPercentage >= 40) return 'medium'
    return 'low'
  }

  async getEvaluationById(evaluationId: string) {
    return await DatabaseService.getEvaluation(evaluationId)
  }

  async getRecentEvaluations(limit = 10) {
    return await DatabaseService.getRecentEvaluations(limit)
  }

  async getHighScoreEvaluations(minScore = 70, limit = 10) {
    return await DatabaseService.getHighScoreEvaluations(minScore, limit)
  }

  async getCompanyEvaluations(companyId: string) {
    return await DatabaseService.getEvaluationsByCompany(companyId)
  }
}