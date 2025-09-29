import { NextRequest, NextResponse } from 'next/server'
import { MarketTrendsService } from '@/services/market-trends'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sectorsParam = searchParams.get('sectors')
    const sectors = sectorsParam ? sectorsParam.split(',') : ['fintech']

    const marketTrends = new MarketTrendsService()
    const trends = await marketTrends.getTrendAnalysis(sectors)

    return NextResponse.json({
      success: true,
      trends,
      count: trends.length,
      summary: {
        byCategory: {
          technology: trends.filter(t => t.category === 'technology').length,
          regulation: trends.filter(t => t.category === 'regulation').length,
          market: trends.filter(t => t.category === 'market').length,
          funding: trends.filter(t => t.category === 'funding').length,
          competitive: trends.filter(t => t.category === 'competitive').length,
          consumer: trends.filter(t => t.category === 'consumer').length
        },
        byImpact: {
          transformational: trends.filter(t => t.impact === 'transformational').length,
          high: trends.filter(t => t.impact === 'high').length,
          medium: trends.filter(t => t.impact === 'medium').length,
          low: trends.filter(t => t.impact === 'low').length
        },
        byTimeframe: {
          immediate: trends.filter(t => t.timeframe === 'immediate').length,
          shortTerm: trends.filter(t => t.timeframe === 'short-term').length,
          mediumTerm: trends.filter(t => t.timeframe === 'medium-term').length,
          longTerm: trends.filter(t => t.timeframe === 'long-term').length
        },
        avgConfidence: trends.length > 0 ? Math.round(trends.reduce((sum, t) => sum + t.confidence, 0) / trends.length) : 0
      },
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('Get trends error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to get trends', 
        details: error.message 
      },
      { status: 500 }
    )
  }
}

export async function POST() {
  return NextResponse.json({
    endpoint: 'Market Trends Analysis',
    description: 'GET endpoint for retrieving market trends analysis',
    parameters: {
      sectors: 'Comma-separated list of sectors (optional, defaults to fintech)'
    },
    example: '/api/market/trends?sectors=fintech,healthtech,edtech',
    supported_sectors: [
      'fintech', 'healthtech', 'edtech', 'proptech', 'insurtech',
      'regtech', 'wealthtech', 'cybersecurity', 'ai', 'blockchain'
    ]
  })
}