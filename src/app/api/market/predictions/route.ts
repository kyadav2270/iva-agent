import { NextRequest, NextResponse } from 'next/server'
import { MarketTrendsService } from '@/services/market-trends'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sector = searchParams.get('sector') || 'fintech'

    const marketTrends = new MarketTrendsService()
    const predictions = await marketTrends.generateMarketPredictions(sector)

    return NextResponse.json({
      success: true,
      sector,
      predictions,
      count: predictions.length,
      summary: {
        highLikelihood: predictions.filter(p => p.likelihood >= 70).length,
        mediumLikelihood: predictions.filter(p => p.likelihood >= 40 && p.likelihood < 70).length,
        lowLikelihood: predictions.filter(p => p.likelihood < 40).length,
        avgLikelihood: predictions.length > 0 ? Math.round(predictions.reduce((sum, p) => sum + p.likelihood, 0) / predictions.length) : 0,
        totalOpportunities: predictions.reduce((sum, p) => sum + p.opportunities.length, 0),
        totalRisks: predictions.reduce((sum, p) => sum + p.risks.length, 0),
        totalRecommendations: predictions.reduce((sum, p) => sum + p.strategicRecommendations.length, 0)
      },
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('Get predictions error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to get predictions', 
        details: error.message 
      },
      { status: 500 }
    )
  }
}

export async function POST() {
  return NextResponse.json({
    endpoint: 'Market Predictions',
    description: 'GET endpoint for retrieving market predictions for a specific sector',
    parameters: {
      sector: 'Sector to analyze (optional, defaults to fintech)'
    },
    example: '/api/market/predictions?sector=fintech',
    prediction_types: [
      'Technology adoption predictions',
      'Market consolidation forecasts',
      'Regulatory change predictions',
      'Consumer behavior shifts',
      'Funding pattern changes',
      'Competitive landscape evolution'
    ]
  })
}