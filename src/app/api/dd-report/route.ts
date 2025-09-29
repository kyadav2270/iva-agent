import { NextRequest, NextResponse } from 'next/server'
import { DDCollectorsService } from '@/services/dd-collectors'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { companyName, website, industry, description, foundedYear } = body

    if (!companyName) {
      return NextResponse.json(
        { error: 'Company name is required' },
        { status: 400 }
      )
    }

    const ddCollectors = new DDCollectorsService()

    console.log(`Generating comprehensive DD report for: ${companyName}`)

    const ddReport = await ddCollectors.collectComprehensiveDueDiligence({
      companyName,
      website,
      industry,
      description,
      foundedYear
    })

    return NextResponse.json({
      success: true,
      ddReport,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('DD Report generation error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to generate DD report', 
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: 'DD Report Generator',
    description: 'POST endpoint for generating comprehensive due diligence reports',
    required_fields: ['companyName'],
    optional_fields: ['website', 'industry', 'description', 'foundedYear'],
    example: {
      companyName: 'Stripe',
      website: 'https://stripe.com',
      industry: 'Fintech',
      description: 'Payment processing platform',
      foundedYear: 2010
    }
  })
}