// Impression Ventures Investment Criteria Configuration

export interface InvestmentCriteria {
  essential: EssentialCriteria
  scoring: ScoringCriteria[]
  filters: FilterCriteria
  preferences: PreferenceCriteria
}

export interface EssentialCriteria {
  industry: string[]
  stage: string[]
  geography: string[]
  roundSize: {
    minimum: number
    preferred: number
  }
}

export interface ScoringCriteria {
  name: string
  category: string
  weight: number
  maxPoints: number
  description: string
  indicators: Indicator[]
}

export interface Indicator {
  type: 'positive' | 'negative'
  keywords: string[]
  weight: number
  description: string
}

export interface FilterCriteria {
  excludeIndustries: string[]
  excludeStages: string[]
  minTeamSize: number
  maxTeamSize: number
  excludeGeographies: string[]
}

export interface PreferenceCriteria {
  preferredVerticals: string[]
  preferredBusinessModels: string[]
  preferredTechnologies: string[]
  preferredFounderProfiles: string[]
}

// Impression Ventures Specific Configuration
export const IMPRESSION_VENTURES_CRITERIA: InvestmentCriteria = {
  essential: {
    industry: [
      'Fintech',
      'Financial Technology',
      'InsurTech',
      'Insurance Technology', 
      'WealthTech',
      'Wealth Management Technology',
      'Banking Technology',
      'RegTech',
      'Regulatory Technology',
      'PayTech',
      'Payment Technology'
    ],
    stage: [
      'Post-MVP',
      'Seed',
      'Pre-Series A',
      'Series A'
    ],
    geography: [
      'United States',
      'Canada',
      'North America'
    ],
    roundSize: {
      minimum: 2000000, // $2M
      preferred: 5000000  // $5M
    }
  },

  scoring: [
    {
      name: 'Team Experience',
      category: 'team',
      weight: 20,
      maxPoints: 20,
      description: 'Fintech domain expertise, previous exits, and leadership capabilities',
      indicators: [
        {
          type: 'positive',
          keywords: ['fintech experience', 'financial services', 'banking', 'previous exit', 'IPO', 'acquisition'],
          weight: 5,
          description: 'Previous fintech or financial services experience'
        },
        {
          type: 'positive', 
          keywords: ['Goldman Sachs', 'JPMorgan', 'McKinsey', 'BCG', 'Bain', 'Stripe', 'Square', 'PayPal'],
          weight: 4,
          description: 'Experience at top-tier financial or fintech companies'
        },
        {
          type: 'positive',
          keywords: ['Stanford', 'Harvard', 'MIT', 'Wharton', 'MBA', 'computer science', 'engineering'],
          weight: 3,
          description: 'Strong educational background'
        },
        {
          type: 'positive',
          keywords: ['serial entrepreneur', 'repeat founder', 'multiple startups'],
          weight: 4,
          description: 'Serial entrepreneurship experience'
        },
        {
          type: 'negative',
          keywords: ['first time founder', 'no financial experience', 'student', 'recent graduate'],
          weight: -2,
          description: 'Limited relevant experience'
        }
      ]
    },

    {
      name: 'Market Opportunity',
      category: 'market',
      weight: 20,
      maxPoints: 20,
      description: 'Total addressable market size, growth rate, and market timing',
      indicators: [
        {
          type: 'positive',
          keywords: ['$1B+ market', 'billion dollar', 'TAM', 'large market', 'growing market'],
          weight: 5,
          description: 'Large total addressable market (>$1B)'
        },
        {
          type: 'positive',
          keywords: ['20% growth', '25% CAGR', 'fast growing', 'expanding market', 'emerging'],
          weight: 4,
          description: 'High market growth rate'
        },
        {
          type: 'positive',
          keywords: ['regulatory tailwinds', 'open banking', 'API mandate', 'digital transformation'],
          weight: 3,
          description: 'Favorable regulatory or industry trends'
        },
        {
          type: 'positive',
          keywords: ['COVID accelerated', 'pandemic', 'digital adoption', 'remote', 'contactless'],
          weight: 3,
          description: 'Pandemic-driven digital adoption'
        },
        {
          type: 'negative',
          keywords: ['declining market', 'shrinking', 'legacy', 'outdated', 'small market'],
          weight: -3,
          description: 'Declining or small market'
        }
      ]
    },

    {
      name: 'Product Innovation',
      category: 'product',
      weight: 20,
      maxPoints: 20,
      description: 'AI/ML integration, novel technology, and technical innovation',
      indicators: [
        {
          type: 'positive',
          keywords: ['artificial intelligence', 'machine learning', 'AI', 'ML', 'neural networks', 'deep learning'],
          weight: 5,
          description: 'AI/ML integration'
        },
        {
          type: 'positive',
          keywords: ['blockchain', 'DeFi', 'cryptocurrency', 'smart contracts', 'Web3'],
          weight: 4,
          description: 'Blockchain and crypto innovation'
        },
        {
          type: 'positive',
          keywords: ['API-first', 'microservices', 'cloud-native', 'real-time', 'automation'],
          weight: 4,
          description: 'Modern technical architecture'
        },
        {
          type: 'positive',
          keywords: ['patent', 'proprietary', 'novel approach', 'first-to-market', 'breakthrough'],
          weight: 4,
          description: 'Intellectual property and innovation'
        },
        {
          type: 'negative',
          keywords: ['me-too', 'copycat', 'existing solution', 'no differentiation'],
          weight: -3,
          description: 'Lack of innovation or differentiation'
        }
      ]
    },

    {
      name: 'Traction & Validation',
      category: 'traction',
      weight: 15,
      maxPoints: 15,
      description: 'Customer validation, revenue growth, and user metrics',
      indicators: [
        {
          type: 'positive',
          keywords: ['paying customers', 'revenue', 'MRR', 'ARR', 'subscription'],
          weight: 5,
          description: 'Revenue and paying customers'
        },
        {
          type: 'positive',
          keywords: ['month over month growth', 'user growth', 'customer acquisition', 'retention'],
          weight: 4,
          description: 'Strong growth metrics'
        },
        {
          type: 'positive',
          keywords: ['enterprise customers', 'Fortune 500', 'pilot programs', 'partnerships'],
          weight: 3,
          description: 'Enterprise validation'
        },
        {
          type: 'positive',
          keywords: ['product-market fit', 'customer love', 'NPS', 'testimonials'],
          weight: 3,
          description: 'Customer satisfaction indicators'
        },
        {
          type: 'negative',
          keywords: ['no customers', 'pre-revenue', 'concept stage', 'no validation'],
          weight: -3,
          description: 'Lack of customer validation'
        }
      ]
    },

    {
      name: 'Competitive Advantage',
      category: 'competitive',
      weight: 15,
      maxPoints: 15,
      description: 'Moat, IP, network effects, and sustainable differentiation',
      indicators: [
        {
          type: 'positive',
          keywords: ['network effects', 'platform', 'two-sided market', 'viral'],
          weight: 5,
          description: 'Network effects and platform dynamics'
        },
        {
          type: 'positive',
          keywords: ['regulatory moat', 'compliance', 'license', 'certification'],
          weight: 4,
          description: 'Regulatory barriers to entry'
        },
        {
          type: 'positive',
          keywords: ['data advantage', 'proprietary data', 'unique dataset', 'data network'],
          weight: 4,
          description: 'Data-driven competitive advantage'
        },
        {
          type: 'positive',
          keywords: ['switching costs', 'integration', 'mission critical', 'embedded'],
          weight: 3,
          description: 'High customer switching costs'
        },
        {
          type: 'negative',
          keywords: ['commoditized', 'easy to replicate', 'low barriers', 'saturated market'],
          weight: -3,
          description: 'Weak competitive position'
        }
      ]
    },

    {
      name: 'Business Model',
      category: 'business',
      weight: 10,
      maxPoints: 10,
      description: 'Scalable, recurring revenue model with strong unit economics',
      indicators: [
        {
          type: 'positive',
          keywords: ['SaaS', 'subscription', 'recurring revenue', 'MRR', 'ARR'],
          weight: 4,
          description: 'Recurring revenue model'
        },
        {
          type: 'positive',
          keywords: ['transaction fees', 'take rate', 'volume based', 'usage based'],
          weight: 3,
          description: 'Transaction-based revenue'
        },
        {
          type: 'positive',
          keywords: ['unit economics', 'LTV/CAC', 'positive margins', 'profitable'],
          weight: 3,
          description: 'Strong unit economics'
        },
        {
          type: 'negative',
          keywords: ['one-time fee', 'services revenue', 'low margins', 'burn rate'],
          weight: -2,
          description: 'Weak business model fundamentals'
        }
      ]
    }
  ],

  filters: {
    excludeIndustries: [
      'Cannabis',
      'Gambling',
      'Adult Entertainment',
      'Weapons',
      'Tobacco'
    ],
    excludeStages: [
      'Idea Stage',
      'Pre-MVP',
      'Late Stage',
      'IPO'
    ],
    minTeamSize: 2,
    maxTeamSize: 50,
    excludeGeographies: [
      'China',
      'Russia',
      'Iran',
      'North Korea'
    ]
  },

  preferences: {
    preferredVerticals: [
      'B2B Fintech',
      'API Infrastructure',
      'Embedded Finance',
      'RegTech',
      'InsurTech',
      'Credit & Lending',
      'Wealth Management',
      'SMB Banking'
    ],
    preferredBusinessModels: [
      'SaaS',
      'API Revenue',
      'Transaction Fees',
      'Subscription',
      'Platform'
    ],
    preferredTechnologies: [
      'Machine Learning',
      'APIs',
      'Cloud Infrastructure',
      'Mobile-First',
      'Real-Time Processing'
    ],
    preferredFounderProfiles: [
      'Ex-Goldman Sachs',
      'Ex-JPMorgan',
      'Ex-Stripe',
      'Ex-Square',
      'Ex-McKinsey',
      'Previous Fintech Exit',
      'Domain Expert'
    ]
  }
}

// Helper functions for criteria evaluation
export class CriteriaEvaluator {
  
  static checkEssentialCriteria(companyData: any): {
    passes: boolean
    failures: string[]
  } {
    const failures: string[] = []
    const criteria = IMPRESSION_VENTURES_CRITERIA.essential
    
    // Check industry
    if (!this.matchesAny(companyData.industry, criteria.industry)) {
      failures.push(`Industry "${companyData.industry}" not in target industries`)
    }
    
    // Check geography
    if (!this.matchesAny(companyData.location, criteria.geography)) {
      failures.push(`Location "${companyData.location}" not in target geographies`)
    }
    
    // Check round size (if available)
    if (companyData.fundingAmount && companyData.fundingAmount < criteria.roundSize.minimum) {
      failures.push(`Round size $${companyData.fundingAmount} below minimum $${criteria.roundSize.minimum}`)
    }
    
    return {
      passes: failures.length === 0,
      failures
    }
  }
  
  static scoreCompany(companyData: any, analysis: string): {
    totalScore: number
    categoryScores: Record<string, number>
    breakdown: any[]
  } {
    const categoryScores: Record<string, number> = {}
    const breakdown: any[] = []
    
    for (const scoringCriteria of IMPRESSION_VENTURES_CRITERIA.scoring) {
      let categoryScore = 0
      const indicators: any[] = []
      
      for (const indicator of scoringCriteria.indicators) {
        const matches = this.findKeywordMatches(analysis, indicator.keywords)
        if (matches.length > 0) {
          const indicatorScore = indicator.weight * Math.min(matches.length, 3) // Cap at 3 matches
          categoryScore += indicatorScore
          
          indicators.push({
            description: indicator.description,
            matches,
            score: indicatorScore,
            type: indicator.type
          })
        }
      }
      
      // Normalize to max points for category
      categoryScore = Math.min(Math.max(categoryScore, 0), scoringCriteria.maxPoints)
      categoryScores[scoringCriteria.category] = categoryScore
      
      breakdown.push({
        category: scoringCriteria.category,
        name: scoringCriteria.name,
        score: categoryScore,
        maxPoints: scoringCriteria.maxPoints,
        indicators
      })
    }
    
    const totalScore = Object.values(categoryScores).reduce((sum, score) => sum + score, 0)
    
    return {
      totalScore,
      categoryScores,
      breakdown
    }
  }
  
  private static matchesAny(value: string, targets: string[]): boolean {
    if (!value) return false
    const lowerValue = value.toLowerCase()
    return targets.some(target => lowerValue.includes(target.toLowerCase()))
  }
  
  private static findKeywordMatches(text: string, keywords: string[]): string[] {
    if (!text) return []
    const lowerText = text.toLowerCase()
    return keywords.filter(keyword => lowerText.includes(keyword.toLowerCase()))
  }
}

// Investment thesis templates for different verticals
export const INVESTMENT_THESIS_TEMPLATES = {
  'B2B Fintech': `
Impression Ventures targets B2B fintech solutions that enable traditional financial institutions 
to modernize their infrastructure and offer new digital services. We focus on API-first platforms, 
embedded finance solutions, and infrastructure that helps banks compete with digital-native challengers.
  `,
  
  'InsurTech': `
We invest in insurance technology companies that digitize and automate insurance processes, 
improve underwriting through data and AI, and create new distribution channels. Our focus 
is on B2B solutions that help traditional insurers modernize their operations.
  `,
  
  'RegTech': `
Regulatory technology investments focus on solutions that help financial institutions comply 
with evolving regulations efficiently. We target platforms that automate compliance processes, 
provide real-time monitoring, and reduce regulatory risk.
  `,
  
  'Credit & Lending': `
We invest in innovative lending platforms and credit infrastructure that expand access to 
capital while managing risk effectively. Our focus includes alternative credit scoring, 
automated underwriting, and new lending models for underserved segments.
  `
}