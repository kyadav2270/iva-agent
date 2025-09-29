import { ExaService } from './exa'
import { OpenAIService } from './openai'
import { DatabaseService } from '@/lib/supabase'

interface PortfolioCompany {
  id: string
  name: string
  website?: string
  industry?: string
  lastMonitored?: string
  alertsEnabled: boolean
}

interface MonitoringAlert {
  id: string
  companyId: string
  type: 'news' | 'financial' | 'competitive' | 'regulatory' | 'team'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  source: string
  url?: string
  timestamp: string
  acknowledged: boolean
}

interface MonitoringMetrics {
  companyId: string
  date: string
  newsVolume: number
  sentimentScore: number // -100 to 100
  marketMentions: number
  competitiveActivity: number
  fundingActivity: boolean
  teamChanges: number
  productUpdates: number
}

interface PortfolioInsight {
  id: string
  type: 'trend' | 'risk' | 'opportunity' | 'milestone'
  title: string
  description: string
  affectedCompanies: string[]
  priority: 'low' | 'medium' | 'high'
  timestamp: string
  actionRequired: boolean
}

export class PortfolioMonitorService {
  private exaService: ExaService
  private openaiService: OpenAIService

  constructor() {
    this.exaService = new ExaService()
    this.openaiService = new OpenAIService()
  }

  async monitorPortfolioCompanies(companyIds: string[]): Promise<{
    alerts: MonitoringAlert[]
    metrics: MonitoringMetrics[]
    insights: PortfolioInsight[]
  }> {
    const alerts: MonitoringAlert[] = []
    const metrics: MonitoringMetrics[] = []
    const insights: PortfolioInsight[] = []

    // Get portfolio companies from database
    const companies = await this.getPortfolioCompanies(companyIds)

    // Monitor each company in parallel
    const monitoringTasks = companies.map(company => 
      this.monitorSingleCompany(company)
    )

    const results = await Promise.allSettled(monitoringTasks)

    // Aggregate results
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        alerts.push(...result.value.alerts)
        metrics.push(result.value.metrics)
      } else {
        console.error(`Failed to monitor ${companies[index].name}:`, result.reason)
      }
    })

    // Generate portfolio-wide insights
    const portfolioInsights = await this.generatePortfolioInsights(companies, alerts, metrics)
    insights.push(...portfolioInsights)

    // Store results in database
    await this.storeMonitoringResults(alerts, metrics, insights)

    return { alerts, metrics, insights }
  }

  private async monitorSingleCompany(company: PortfolioCompany): Promise<{
    alerts: MonitoringAlert[]
    metrics: MonitoringMetrics
  }> {
    const alerts: MonitoringAlert[] = []
    
    // Search for recent news and updates (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const today = new Date().toISOString().split('T')[0]

    try {
      // News monitoring
      const newsData = await this.exaService.searchRecentNews(company.name, 7)
      const newsAlerts = await this.analyzeNewsForAlerts(company, newsData.recentNews)
      alerts.push(...newsAlerts)

      // Financial activity monitoring
      const financialQuery = `${company.name} funding investment acquisition merger valuation`
      const financialResults = await this.exaService.performSearch(financialQuery, {
        numResults: 5,
        startPublishedDate: sevenDaysAgo,
        endPublishedDate: today,
        includeDomains: ['techcrunch.com', 'reuters.com', 'bloomberg.com', 'pitchbook.com']
      })
      const financialAlerts = await this.analyzeFinancialActivity(company, financialResults.results)
      alerts.push(...financialAlerts)

      // Competitive monitoring
      const competitorQuery = `${company.industry || 'fintech'} competitor launch product new funding`
      const competitiveResults = await this.exaService.performSearch(competitorQuery, {
        numResults: 5,
        startPublishedDate: sevenDaysAgo,
        excludeDomains: [company.website?.replace('https://', '').replace('http://', '') || '']
      })
      const competitiveAlerts = await this.analyzeCompetitiveActivity(company, competitiveResults.results)
      alerts.push(...competitiveAlerts)

      // Team changes monitoring
      const teamQuery = `${company.name} CEO founder "joins" "leaves" "appointed" "resigned"`
      const teamResults = await this.exaService.performSearch(teamQuery, {
        numResults: 3,
        startPublishedDate: sevenDaysAgo,
        includeDomains: ['linkedin.com', 'techcrunch.com', 'bloomberg.com']
      })
      const teamAlerts = await this.analyzeTeamChanges(company, teamResults.results)
      alerts.push(...teamAlerts)

      // Calculate metrics
      const metrics = await this.calculateMonitoringMetrics(company, {
        news: newsData.recentNews,
        financial: financialResults.results,
        competitive: competitiveResults.results,
        team: teamResults.results
      })

      return { alerts, metrics }

    } catch (error) {
      console.error(`Error monitoring ${company.name}:`, error)
      return {
        alerts: [{
          id: `error_${Date.now()}`,
          companyId: company.id,
          type: 'news',
          severity: 'medium',
          title: 'Monitoring Error',
          description: `Failed to monitor ${company.name}: ${error}`,
          source: 'System',
          timestamp: new Date().toISOString(),
          acknowledged: false
        }],
        metrics: this.getDefaultMetrics(company.id)
      }
    }
  }

  private async analyzeNewsForAlerts(company: PortfolioCompany, newsItems: any[]): Promise<MonitoringAlert[]> {
    if (newsItems.length === 0) return []

    const prompt = `Analyze these news items for ${company.name} and identify any important alerts:

NEWS ITEMS:
${JSON.stringify(newsItems.slice(0, 5), null, 2)}

Generate alerts for:
- Major funding announcements
- Product launches
- Partnership announcements
- Regulatory issues
- Leadership changes
- Negative news or controversies
- Market expansion

Return results in JSON format as an array:
[{"type":"news|financial|competitive|regulatory|team","severity":"low|medium|high|critical","title":"Alert title","description":"Brief description","source":"Source name","url":"URL if available"}]`

    try {
      const response = await this.openaiService.retryRequest(async () => {
        const openai = await import('openai').then(mod => new mod.default({
          apiKey: process.env.OPENAI_API_KEY!
        }))
        
        return await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          max_tokens: 1500,
          response_format: { type: 'json_object' }
        })
      })

      const result = JSON.parse(response.choices[0].message.content || '{"alerts":[]}')
      const alertsData = result.alerts || result || []
      
      return alertsData.map((alert: any, index: number) => ({
        id: `news_${company.id}_${Date.now()}_${index}`,
        companyId: company.id,
        type: alert.type || 'news',
        severity: alert.severity || 'medium',
        title: alert.title || 'News Alert',
        description: alert.description || '',
        source: alert.source || 'News',
        url: alert.url,
        timestamp: new Date().toISOString(),
        acknowledged: false
      }))
    } catch (error) {
      console.error('Error analyzing news alerts:', error)
      return []
    }
  }

  private async analyzeFinancialActivity(company: PortfolioCompany, financialData: any[]): Promise<MonitoringAlert[]> {
    if (financialData.length === 0) return []

    // Simple keyword-based analysis for financial events
    const alerts: MonitoringAlert[] = []

    for (const item of financialData.slice(0, 3)) {
      const text = (item.title + ' ' + (item.text || '')).toLowerCase()
      
      if (text.includes('funding') || text.includes('investment') || text.includes('round')) {
        alerts.push({
          id: `financial_${company.id}_${Date.now()}_funding`,
          companyId: company.id,
          type: 'financial',
          severity: 'high',
          title: 'Funding Activity Detected',
          description: `Potential funding activity: ${item.title}`,
          source: 'Financial Monitor',
          url: item.url,
          timestamp: new Date().toISOString(),
          acknowledged: false
        })
      }

      if (text.includes('acquisition') || text.includes('merger') || text.includes('acquired')) {
        alerts.push({
          id: `financial_${company.id}_${Date.now()}_ma`,
          companyId: company.id,
          type: 'financial',
          severity: 'critical',
          title: 'M&A Activity Detected',
          description: `Potential M&A activity: ${item.title}`,
          source: 'Financial Monitor',
          url: item.url,
          timestamp: new Date().toISOString(),
          acknowledged: false
        })
      }
    }

    return alerts
  }

  private async analyzeCompetitiveActivity(company: PortfolioCompany, competitiveData: any[]): Promise<MonitoringAlert[]> {
    const alerts: MonitoringAlert[] = []

    for (const item of competitiveData.slice(0, 3)) {
      const text = (item.title + ' ' + (item.text || '')).toLowerCase()
      
      if (text.includes('launch') || text.includes('new product') || text.includes('announces')) {
        // Skip if it mentions our company (to avoid false positives)
        if (!text.includes(company.name.toLowerCase())) {
          alerts.push({
            id: `competitive_${company.id}_${Date.now()}_launch`,
            companyId: company.id,
            type: 'competitive',
            severity: 'medium',
            title: 'Competitive Product Launch',
            description: `Competitive activity detected: ${item.title}`,
            source: 'Competitive Monitor',
            url: item.url,
            timestamp: new Date().toISOString(),
            acknowledged: false
          })
        }
      }
    }

    return alerts
  }

  private async analyzeTeamChanges(company: PortfolioCompany, teamData: any[]): Promise<MonitoringAlert[]> {
    const alerts: MonitoringAlert[] = []

    for (const item of teamData.slice(0, 3)) {
      const text = (item.title + ' ' + (item.text || '')).toLowerCase()
      
      if (text.includes(company.name.toLowerCase()) && 
          (text.includes('ceo') || text.includes('founder') || text.includes('cto'))) {
        
        let severity: 'low' | 'medium' | 'high' = 'medium'
        let alertType = 'Team Change'
        
        if (text.includes('leaves') || text.includes('resigned') || text.includes('stepping down')) {
          severity = 'high'
          alertType = 'Leadership Departure'
        } else if (text.includes('joins') || text.includes('appointed') || text.includes('hired')) {
          severity = 'medium'
          alertType = 'Leadership Appointment'
        }
        
        alerts.push({
          id: `team_${company.id}_${Date.now()}_change`,
          companyId: company.id,
          type: 'team',
          severity,
          title: alertType,
          description: `Leadership change detected: ${item.title}`,
          source: 'Team Monitor',
          url: item.url,
          timestamp: new Date().toISOString(),
          acknowledged: false
        })
      }
    }

    return alerts
  }

  private async calculateMonitoringMetrics(company: PortfolioCompany, data: {
    news: any[]
    financial: any[]
    competitive: any[]
    team: any[]
  }): Promise<MonitoringMetrics> {
    // Calculate sentiment score using AI
    let sentimentScore = 0
    if (data.news.length > 0) {
      try {
        const newsText = data.news.slice(0, 3).map(item => item.title).join('. ')
        sentimentScore = await this.calculateSentiment(newsText)
      } catch (error) {
        console.error('Error calculating sentiment:', error)
      }
    }

    return {
      companyId: company.id,
      date: new Date().toISOString().split('T')[0],
      newsVolume: data.news.length,
      sentimentScore,
      marketMentions: data.news.length + data.financial.length,
      competitiveActivity: data.competitive.length,
      fundingActivity: data.financial.some(item => 
        item.title?.toLowerCase().includes('funding') || 
        item.title?.toLowerCase().includes('investment')
      ),
      teamChanges: data.team.length,
      productUpdates: data.news.filter(item => 
        item.title?.toLowerCase().includes('product') ||
        item.title?.toLowerCase().includes('launch') ||
        item.title?.toLowerCase().includes('feature')
      ).length
    }
  }

  private async calculateSentiment(text: string): Promise<number> {
    const prompt = `Analyze the sentiment of this news text about a fintech company. Return a score from -100 (very negative) to 100 (very positive):

TEXT: ${text}

Return only a number between -100 and 100:`

    try {
      const response = await this.openaiService.retryRequest(async () => {
        const openai = await import('openai').then(mod => new mod.default({
          apiKey: process.env.OPENAI_API_KEY!
        }))
        
        return await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          max_tokens: 10
        })
      })

      const scoreText = response.choices[0].message.content?.trim() || '0'
      const score = parseInt(scoreText.replace(/[^-\d]/g, ''))
      return isNaN(score) ? 0 : Math.max(-100, Math.min(100, score))
    } catch (error) {
      console.error('Error calculating sentiment:', error)
      return 0
    }
  }

  private async generatePortfolioInsights(
    companies: PortfolioCompany[],
    alerts: MonitoringAlert[],
    metrics: MonitoringMetrics[]
  ): Promise<PortfolioInsight[]> {
    const insights: PortfolioInsight[] = []

    // Analyze funding trends across portfolio
    const fundingAlerts = alerts.filter(a => a.type === 'financial')
    if (fundingAlerts.length >= 2) {
      insights.push({
        id: `insight_funding_${Date.now()}`,
        type: 'trend',
        title: 'Increased Funding Activity',
        description: `${fundingAlerts.length} portfolio companies showing funding activity this week`,
        affectedCompanies: fundingAlerts.map(a => a.companyId),
        priority: 'medium',
        timestamp: new Date().toISOString(),
        actionRequired: false
      })
    }

    // Analyze sentiment trends
    const avgSentiment = metrics.reduce((sum, m) => sum + m.sentimentScore, 0) / metrics.length
    if (avgSentiment < -30) {
      insights.push({
        id: `insight_sentiment_${Date.now()}`,
        type: 'risk',
        title: 'Negative Sentiment Trend',
        description: `Portfolio showing negative sentiment (${avgSentiment.toFixed(1)}) - may require attention`,
        affectedCompanies: metrics.filter(m => m.sentimentScore < -30).map(m => m.companyId),
        priority: 'high',
        timestamp: new Date().toISOString(),
        actionRequired: true
      })
    }

    // Detect competitive pressures
    const highCompetitiveActivity = metrics.filter(m => m.competitiveActivity >= 3)
    if (highCompetitiveActivity.length > 0) {
      insights.push({
        id: `insight_competitive_${Date.now()}`,
        type: 'risk',
        title: 'Increased Competitive Activity',
        description: `${highCompetitiveActivity.length} companies facing increased competitive pressure`,
        affectedCompanies: highCompetitiveActivity.map(m => m.companyId),
        priority: 'medium',
        timestamp: new Date().toISOString(),
        actionRequired: true
      })
    }

    return insights
  }

  private async getPortfolioCompanies(companyIds: string[]): Promise<PortfolioCompany[]> {
    // This would fetch from database - simplified for now
    const companies: PortfolioCompany[] = []
    
    for (const id of companyIds) {
      try {
        const company = await DatabaseService.getCompany(id)
        if (company) {
          companies.push({
            id: company.id,
            name: company.name,
            website: company.website || undefined,
            industry: company.industry || undefined,
            lastMonitored: company.updated_at,
            alertsEnabled: true
          })
        }
      } catch (error) {
        console.error(`Failed to fetch company ${id}:`, error)
      }
    }
    
    return companies
  }

  private async storeMonitoringResults(
    alerts: MonitoringAlert[],
    metrics: MonitoringMetrics[],
    insights: PortfolioInsight[]
  ): Promise<void> {
    // Store in database - implementation would depend on schema
    console.log(`Storing ${alerts.length} alerts, ${metrics.length} metrics, ${insights.length} insights`)
  }

  private getDefaultMetrics(companyId: string): MonitoringMetrics {
    return {
      companyId,
      date: new Date().toISOString().split('T')[0],
      newsVolume: 0,
      sentimentScore: 0,
      marketMentions: 0,
      competitiveActivity: 0,
      fundingActivity: false,
      teamChanges: 0,
      productUpdates: 0
    }
  }

  // Public methods for API
  async getPortfolioAlerts(companyIds: string[], severity?: string): Promise<MonitoringAlert[]> {
    // Implementation would fetch from database
    return []
  }

  async acknowledgeAlert(alertId: string): Promise<boolean> {
    // Implementation would update database
    return true
  }

  async getPortfolioMetrics(companyIds: string[], dateRange?: { from: string; to: string }): Promise<MonitoringMetrics[]> {
    // Implementation would fetch from database
    return []
  }

  async getPortfolioInsights(companyIds: string[]): Promise<PortfolioInsight[]> {
    // Implementation would fetch from database
    return []
  }
}