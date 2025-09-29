import { NextRequest, NextResponse } from 'next/server'
import { PortfolioMonitorService } from '@/services/portfolio-monitor'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyIds = searchParams.get('companyIds')?.split(',') || []
    const severity = searchParams.get('severity') || undefined

    if (companyIds.length === 0) {
      return NextResponse.json(
        { error: 'Company IDs are required' },
        { status: 400 }
      )
    }

    const portfolioMonitor = new PortfolioMonitorService()
    const alerts = await portfolioMonitor.getPortfolioAlerts(companyIds, severity)

    return NextResponse.json({
      success: true,
      alerts,
      count: alerts.length,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('Get alerts error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to get alerts', 
        details: error.message 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { alertId, action } = body

    if (!alertId || !action) {
      return NextResponse.json(
        { error: 'Alert ID and action are required' },
        { status: 400 }
      )
    }

    const portfolioMonitor = new PortfolioMonitorService()

    if (action === 'acknowledge') {
      const success = await portfolioMonitor.acknowledgeAlert(alertId)
      
      return NextResponse.json({
        success,
        message: success ? 'Alert acknowledged' : 'Failed to acknowledge alert',
        timestamp: new Date().toISOString()
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )

  } catch (error: any) {
    console.error('Alert action error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to process alert action', 
        details: error.message 
      },
      { status: 500 }
    )
  }
}