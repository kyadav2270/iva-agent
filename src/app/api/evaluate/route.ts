import { NextRequest, NextResponse } from 'next/server'
import { StartupEvaluator } from '@/lib/evaluator'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { companyName, website, founderNames } = body

    if (!companyName) {
      return NextResponse.json(
        { error: 'Company name is required' },
        { status: 400 }
      )
    }

    // Create evaluator with status callback that we'll ignore for API
    const evaluator = new StartupEvaluator()

    const result = await evaluator.evaluateStartup({
      companyName: companyName.trim(),
      website: website?.trim() || undefined,
      founderNames: founderNames || undefined
    })

    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error: any) {
    console.error('Evaluation API error:', error)
    return NextResponse.json(
      { error: error.message || 'Evaluation failed' },
      { status: 500 }
    )
  }
}