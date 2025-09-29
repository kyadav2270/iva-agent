import { NextRequest, NextResponse } from 'next/server'
import { PortfolioMonitorService } from '@/services/portfolio-monitor'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { companyIds } = body

    if (!companyIds || !Array.isArray(companyIds) || companyIds.length === 0) {
      return NextResponse.json(
        { error: 'Company IDs array is required' },
        { status: 400 }
      )
    }

    const portfolioMonitor = new PortfolioMonitorService()

    console.log(`Monitoring ${companyIds.length} portfolio companies`)

    const results = await portfolioMonitor.monitorPortfolioCompanies(companyIds)

    return NextResponse.json({
      success: true,
      summary: {
        alertsGenerated: results.alerts.length,
        companiesMonitored: results.metrics.length,
        insightsGenerated: results.insights.length,
        criticalAlerts: results.alerts.filter(a => a.severity === 'critical').length,
        highPriorityInsights: results.insights.filter(i => i.priority === 'high').length
      },
      data: results,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('Portfolio monitoring error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to monitor portfolio', 
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: 'Portfolio Monitor',
    description: 'POST endpoint for monitoring portfolio companies',
    required_fields: ['companyIds'],
    example: {
      companyIds: ['company-1', 'company-2', 'company-3']
    },
    features: [
      'Real-time news monitoring',
      'Financial activity tracking',
      'Competitive landscape analysis',
      'Team change detection',
      'Sentiment analysis',
      'Portfolio-wide insights'
    ]
  })
}