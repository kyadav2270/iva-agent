import { NextRequest, NextResponse } from 'next/server'
import { PortfolioMonitorService } from '@/services/portfolio-monitor'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyIds = searchParams.get('companyIds')?.split(',') || []

    if (companyIds.length === 0) {
      return NextResponse.json(
        { error: 'Company IDs are required' },
        { status: 400 }
      )
    }

    const portfolioMonitor = new PortfolioMonitorService()
    const insights = await portfolioMonitor.getPortfolioInsights(companyIds)

    return NextResponse.json({
      success: true,
      insights,
      count: insights.length,
      summary: {
        trends: insights.filter(i => i.type === 'trend').length,
        risks: insights.filter(i => i.type === 'risk').length,
        opportunities: insights.filter(i => i.type === 'opportunity').length,
        milestones: insights.filter(i => i.type === 'milestone').length,
        actionRequired: insights.filter(i => i.actionRequired).length
      },
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('Get insights error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to get insights', 
        details: error.message 
      },
      { status: 500 }
    )
  }
}

export async function POST() {
  return NextResponse.json({
    endpoint: 'Portfolio Insights',
    description: 'GET endpoint for retrieving portfolio insights',
    parameters: {
      companyIds: 'Comma-separated list of company IDs'
    },
    example: '/api/portfolio/insights?companyIds=company-1,company-2,company-3'
  })
}