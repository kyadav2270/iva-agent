import { NextRequest, NextResponse } from 'next/server'
import { MarketTrendsService } from '@/services/market-trends'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sectors = ['fintech'] } = body

    if (!Array.isArray(sectors) || sectors.length === 0) {
      return NextResponse.json(
        { error: 'Sectors array is required' },
        { status: 400 }
      )
    }

    const marketTrends = new MarketTrendsService()

    console.log(`Generating market intelligence for sectors: ${sectors.join(', ')}`)

    const intelligence = await marketTrends.generateMarketIntelligence(sectors)

    return NextResponse.json({
      success: true,
      summary: {
        trendsIdentified: intelligence.trends.length,
        predictionsGenerated: intelligence.predictions.length,
        thesesEvolved: intelligence.thesisEvolutions.length,
        opportunitiesFound: intelligence.emergingOpportunities.length,
        risksIdentified: intelligence.risks.length,
        highImpactTrends: intelligence.trends.filter(t => t.impact === 'high' || t.impact === 'transformational').length,
        highConfidencePredictions: intelligence.predictions.filter(p => p.likelihood >= 70).length
      },
      data: intelligence,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('Market intelligence generation error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to generate market intelligence', 
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: 'Market Intelligence Generator',
    description: 'POST endpoint for generating comprehensive market intelligence',
    required_fields: [],
    optional_fields: ['sectors'],
    example: {
      sectors: ['fintech', 'healthtech', 'edtech']
    },
    features: [
      'Technology trend analysis',
      'Regulatory trend monitoring',
      'Market behavior analysis',
      'Funding pattern recognition',
      'Investment thesis evolution',
      'Emerging opportunity identification',
      'Risk assessment',
      'Predictive analytics'
    ]
  })
}