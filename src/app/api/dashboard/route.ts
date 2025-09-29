import { NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/supabase'

export async function GET() {
  try {
    // Get recent evaluations and high score deals
    const recent = await DatabaseService.getRecentEvaluations(10)
    const highScore = await DatabaseService.getHighScoreEvaluations(70, 5)
    
    // Calculate stats
    let stats = {
      totalEvaluations: 0,
      highScoreDeals: 0,
      averageScore: 0,
      recentActivity: 0
    }

    if (recent && recent.length > 0) {
      const totalScore = recent.reduce((sum: number, evaluation: any) => sum + (evaluation.overall_score || 0), 0)
      const avgScore = totalScore / recent.length
      
      stats = {
        totalEvaluations: recent.length,
        highScoreDeals: (highScore || []).length,
        averageScore: Math.round(avgScore),
        recentActivity: recent.filter((evaluation: any) => {
          const evalDate = new Date(evaluation.created_at)
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          return evalDate > weekAgo
        }).length
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        recentEvaluations: recent || [],
        highScoreDeals: highScore || [],
        stats
      }
    })

  } catch (error: any) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to load dashboard data' },
      { status: 500 }
    )
  }
}