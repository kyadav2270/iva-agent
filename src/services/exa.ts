import axios from 'axios'

interface ExaSearchResult {
  title: string
  url: string
  text: string
  highlights: string[]
  publishedDate?: string
  author?: string
}

interface ExaSearchResponse {
  results: ExaSearchResult[]
  autopromptString?: string
}

interface CompanyInfo {
  name: string
  website?: string
  description?: string
  industry?: string
  foundedYear?: number
  employeeCount?: string
  location?: string
  funding?: string
  products?: string[]
}

interface MarketData {
  marketSize?: string
  growthRate?: string
  keyTrends: string[]
  competitiveData: any[]
  regulatoryEnvironment?: string
}

interface NewsData {
  recentNews: ExaSearchResult[]
  pressReleases: ExaSearchResult[]
  industryTrends: ExaSearchResult[]
}

export class ExaService {
  private apiKey: string
  private baseUrl = 'https://api.exa.ai'
  private requestCount = 0
  private lastRequestTime = 0
  private readonly rateLimitDelay = 1000 // 1 second between requests

  constructor() {
    // Lazy initialization - will be set when first method is called
    this.apiKey = ''
  }

  private getApiKey(): string {
    if (!this.apiKey) {
      this.apiKey = process.env.EXA_API_KEY!
      if (!this.apiKey) {
        throw new Error('EXA_API_KEY environment variable is required')
      }
    }
    return this.apiKey
  }

  private async rateLimitedRequest<T>(requestFn: () => Promise<T>): Promise<T> {
    const now = Date.now()
    const timeSinceLastRequest = now - this.lastRequestTime
    
    if (timeSinceLastRequest < this.rateLimitDelay) {
      await new Promise(resolve => setTimeout(resolve, this.rateLimitDelay - timeSinceLastRequest))
    }
    
    this.lastRequestTime = Date.now()
    this.requestCount++
    
    try {
      return await requestFn()
    } catch (error: any) {
      if (error.response?.status === 429) {
        await new Promise(resolve => setTimeout(resolve, 5000))
        return await requestFn()
      }
      throw error
    }
  }

  private async search(query: string, options: {
    type?: 'neural' | 'keyword'
    numResults?: number
    includeDomains?: string[]
    excludeDomains?: string[]
    startPublishedDate?: string
    endPublishedDate?: string
    includeText?: boolean
    highlights?: boolean
  } = {}): Promise<ExaSearchResponse> {
    const {
      type = 'neural',
      numResults = 3,
      includeDomains,
      excludeDomains,
      startPublishedDate,
      endPublishedDate,
      includeText = true,
      highlights = true
    } = options

    return this.rateLimitedRequest(async () => {
      const response = await axios.post(
        `${this.baseUrl}/search`,
        {
          query,
          type,
          numResults,
          includeDomains,
          excludeDomains,
          startPublishedDate,
          endPublishedDate,
          contents: {
            text: includeText,
            highlights: highlights ? {
              numSentences: 3,
              highlightsPerUrl: 3
            } : undefined
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.getApiKey()}`,
            'Content-Type': 'application/json'
          }
        }
      )
      
      return response.data
    })
  }

  async searchCompanyInfo(companyName: string): Promise<CompanyInfo> {
    try {
      // Search for basic company information
      const basicQuery = `${companyName} company overview description products funding`
      const basicResults = await this.search(basicQuery, {
        numResults: 3,
        includeDomains: ['crunchbase.com', 'linkedin.com', 'pitchbook.com', 'techcrunch.com']
      })

      // Search for specific fintech information
      const fintechQuery = `${companyName} fintech financial technology banking insurance`
      const fintechResults = await this.search(fintechQuery, {
        numResults: 3
      })

      // Extract company information from results
      const allResults = [...basicResults.results, ...fintechResults.results]
      const companyInfo: CompanyInfo = {
        name: companyName,
        products: []
      }

      // Parse results to extract structured information
      for (const result of allResults) {
        const text = result.text?.toLowerCase() || ''
        const title = result.title?.toLowerCase() || ''
        
        // Extract website
        if (!companyInfo.website && result.url.includes(companyName.toLowerCase().replace(/\s+/g, ''))) {
          const domain = new URL(result.url).hostname
          if (!domain.includes('crunchbase') && !domain.includes('linkedin')) {
            companyInfo.website = `https://${domain}`
          }
        }
        
        // Extract description
        if (!companyInfo.description && result.highlights && result.highlights.length > 0) {
          companyInfo.description = result.highlights[0]
        }
        
        // Extract industry
        if (!companyInfo.industry) {
          const fintechKeywords = ['fintech', 'financial technology', 'banking', 'insurance', 'payments', 'lending', 'wealth management']
          for (const keyword of fintechKeywords) {
            if (text.includes(keyword) || title.includes(keyword)) {
              companyInfo.industry = 'Fintech'
              break
            }
          }
        }
        
        // Extract founded year
        if (!companyInfo.foundedYear) {
          const yearMatch = text.match(/founded\s+(?:in\s+)?(\d{4})|established\s+(?:in\s+)?(\d{4})/i)
          if (yearMatch) {
            companyInfo.foundedYear = parseInt(yearMatch[1] || yearMatch[2])
          }
        }
        
        // Extract employee count
        if (!companyInfo.employeeCount) {
          const employeeMatch = text.match(/(\d+[-\s]*\d*)\s+employees?/i)
          if (employeeMatch) {
            companyInfo.employeeCount = employeeMatch[1]
          }
        }
        
        // Extract location
        if (!companyInfo.location) {
          const locationMatch = text.match(/(?:based in|headquarters in|located in)\s+([^,.]+)/i)
          if (locationMatch) {
            companyInfo.location = locationMatch[1].trim()
          }
        }
      }

      return companyInfo
    } catch (error) {
      console.error('Error searching company info:', error)
      return { name: companyName }
    }
  }

  async searchRecentNews(companyName: string, daysBack = 90): Promise<NewsData> {
    try {
      const endDate = new Date().toISOString().split('T')[0]
      const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

      // Search for recent news
      const newsQuery = `${companyName} news funding investment announcement`
      const newsResults = await this.search(newsQuery, {
        numResults: 3,
        startPublishedDate: startDate,
        endPublishedDate: endDate,
        includeDomains: ['techcrunch.com', 'reuters.com', 'bloomberg.com', 'wsj.com', 'prnewswire.com']
      })

      // Search for press releases
      const prQuery = `${companyName} press release announcement`
      const prResults = await this.search(prQuery, {
        numResults: 3,
        startPublishedDate: startDate,
        endPublishedDate: endDate
      })

      // Search for industry trends
      const trendsQuery = `fintech trends 2024 financial technology innovation ${companyName}`
      const trendsResults = await this.search(trendsQuery, {
        numResults: 3,
        startPublishedDate: startDate
      })

      return {
        recentNews: newsResults.results,
        pressReleases: prResults.results,
        industryTrends: trendsResults.results
      }
    } catch (error) {
      console.error('Error searching recent news:', error)
      return {
        recentNews: [],
        pressReleases: [],
        industryTrends: []
      }
    }
  }

  async searchCompetitors(companyName: string, industry: string = 'fintech'): Promise<ExaSearchResult[]> {
    try {
      const competitorQuery = `${industry} companies similar to ${companyName} competitors alternative`
      const results = await this.search(competitorQuery, {
        numResults: 3,
        excludeDomains: ['wikipedia.org']
      })

      return results.results
    } catch (error) {
      console.error('Error searching competitors:', error)
      return []
    }
  }

  async searchMarketData(industry: string, vertical?: string): Promise<MarketData> {
    try {
      // Search for market size and growth
      const marketQuery = `${industry} ${vertical || ''} market size growth rate forecast 2024`
      const marketResults = await this.search(marketQuery, {
        numResults: 3,
        includeDomains: ['statista.com', 'mckinsey.com', 'pwc.com', 'deloitte.com', 'accenture.com']
      })

      // Search for industry trends
      const trendsQuery = `${industry} trends innovation technology disruption`
      const trendsResults = await this.search(trendsQuery, {
        numResults: 5
      })

      // Search for regulatory environment
      const regulatoryQuery = `${industry} regulation compliance requirements laws`
      const regulatoryResults = await this.search(regulatoryQuery, {
        numResults: 3,
        includeDomains: ['sec.gov', 'federalreserve.gov', 'occ.gov', 'cftc.gov']
      })

      // Extract key trends from results
      const keyTrends: string[] = []
      for (const result of trendsResults.results) {
        if (result.highlights) {
          keyTrends.push(...result.highlights)
        }
      }

      return {
        keyTrends: keyTrends.slice(0, 5),
        competitiveData: marketResults.results,
        regulatoryEnvironment: regulatoryResults.results[0]?.text
      }
    } catch (error) {
      console.error('Error searching market data:', error)
      return {
        keyTrends: [],
        competitiveData: []
      }
    }
  }

  async searchFounderBackground(founderName: string, companyName: string): Promise<{
    experience: string[]
    education: string[]
    previousCompanies: string[]
    achievements: string[]
  }> {
    try {
      const query = `${founderName} ${companyName} CEO founder experience background LinkedIn`
      const results = await this.search(query, {
        numResults: 3,
        includeDomains: ['linkedin.com', 'crunchbase.com', 'bloomberg.com']
      })

      const background = {
        experience: [] as string[],
        education: [] as string[],
        previousCompanies: [] as string[],
        achievements: [] as string[]
      }

      for (const result of results.results) {
        if (result.highlights) {
          background.experience.push(...result.highlights)
        }
      }

      return background
    } catch (error) {
      console.error('Error searching founder background:', error)
      return {
        experience: [],
        education: [],
        previousCompanies: [],
        achievements: []
      }
    }
  }

  async searchIndustryTrends(industry: string = 'fintech'): Promise<string[]> {
    try {
      const query = `${industry} trends 2024 innovation technology artificial intelligence blockchain`
      const results = await this.search(query, {
        numResults: 3,
        startPublishedDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      })

      const trends: string[] = []
      for (const result of results.results) {
        if (result.highlights) {
          trends.push(...result.highlights)
        }
      }

      return trends.slice(0, 10)
    } catch (error) {
      console.error('Error searching industry trends:', error)
      return []
    }
  }

  getRequestStats() {
    return {
      requestCount: this.requestCount,
      lastRequestTime: this.lastRequestTime
    }
  }

  // Public search method for DD collectors
  async performSearch(query: string, options: {
    numResults?: number
    includeDomains?: string[]
    excludeDomains?: string[]
    startPublishedDate?: string
    endPublishedDate?: string
  } = {}): Promise<{ results: ExaSearchResult[] }> {
    return await this.search(query, {
      type: 'neural',
      includeText: true,
      highlights: true,
      ...options
    })
  }
}