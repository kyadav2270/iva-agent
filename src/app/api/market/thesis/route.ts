import { NextRequest, NextResponse } from 'next/server'
import { MarketTrendsService } from '@/services/market-trends'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sector } = body

    if (!sector) {
      return NextResponse.json(
        { error: 'Sector is required' },
        { status: 400 }
      )
    }

    const marketTrends = new MarketTrendsService()
    const thesisEvolution = await marketTrends.updateInvestmentThesis(sector)

    if (!thesisEvolution) {
      return NextResponse.json(
        { error: 'Failed to evolve investment thesis' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      thesisEvolution,
      summary: {
        sector: thesisEvolution.sector,
        keyChangesCount: thesisEvolution.keyChanges.length,
        confidence: thesisEvolution.confidence,
        nextReviewDate: thesisEvolution.nextReviewDate,
        hasSignificantChanges: thesisEvolution.keyChanges.length >= 3,
        supportingDataPoints: thesisEvolution.supportingData.length
      },
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('Thesis evolution error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to evolve investment thesis', 
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: 'Investment Thesis Evolution',
    description: 'POST endpoint for evolving investment thesis based on market trends',
    required_fields: ['sector'],
    example: {
      sector: 'fintech'
    },
    process: [
      'Analyze recent market trends in sector',
      'Compare with existing investment thesis',
      'Identify key changes and evolution points',
      'Generate updated thesis with reasoning',
      'Provide supporting data and confidence metrics',
      'Set next review timeline'
    ],
    thesis_components: [
      'Market opportunity assessment',
      'Technology trend integration',
      'Regulatory environment consideration',
      'Competitive landscape analysis',
      'Investment strategy recommendations',
      'Risk factor identification'
    ]
  })
}