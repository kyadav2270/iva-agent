'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import EvaluationDetails from '@/components/EvaluationDetails'
import PortfolioView from '@/components/PortfolioView'
import TrendsView from '@/components/TrendsView'
import { TrendingUp, Users, DollarSign, Clock, AlertTriangle, CheckCircle, Eye, BarChart3, Radar } from 'lucide-react'

interface EvaluationSummary {
  id: string
  company_name: string
  overall_score: number
  recommendation: string
  created_at: string
  meets_criteria: boolean
}

interface DashboardStats {
  totalEvaluations: number
  highScoreDeals: number
  averageScore: number
  recentActivity: number
}

export default function Dashboard() {
  const [companyName, setCompanyName] = useState('')
  const [website, setWebsite] = useState('')
  const [founderNames, setFounderNames] = useState('')
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [currentStatus, setCurrentStatus] = useState<any>(null)
  const [recentEvaluations, setRecentEvaluations] = useState<any[]>([])
  const [highScoreDeals, setHighScoreDeals] = useState<any[]>([])
  const [selectedEvaluation, setSelectedEvaluation] = useState<any>(null)
  const [activeView, setActiveView] = useState<'dashboard' | 'portfolio' | 'trends'>('dashboard')
  const [stats, setStats] = useState<DashboardStats>({
    totalEvaluations: 0,
    highScoreDeals: 0,
    averageScore: 0,
    recentActivity: 0
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard')
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to load dashboard data')
      }
      
      setRecentEvaluations(result.data.recentEvaluations)
      setHighScoreDeals(result.data.highScoreDeals)
      setStats(result.data.stats)
      
    } catch (error: any) {
      console.error('Error loading dashboard data:', error)
      // Set default empty state
      setRecentEvaluations([])
      setHighScoreDeals([])
      setStats({
        totalEvaluations: 0,
        highScoreDeals: 0,
        averageScore: 0,
        recentActivity: 0
      })
    }
  }

  const handleEvaluate = async () => {
    if (!companyName.trim()) return
    
    setIsEvaluating(true)
    setCurrentStatus(null)
    
    try {
      const founderList = founderNames.split(',').map(name => name.trim()).filter(name => name)
      
      setCurrentStatus({ 
        step: 'api-call', 
        progress: 10, 
        message: 'Starting analysis...', 
        completed: false 
      })
      
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName: companyName.trim(),
          website: website.trim() || undefined,
          founderNames: founderList.length > 0 ? founderList : undefined
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Evaluation failed')
      }

      // Refresh dashboard data
      await loadDashboardData()
      
      // Clear form
      setCompanyName('')
      setWebsite('')
      setFounderNames('')
      
      // Show success message
      alert(`Evaluation completed! Score: ${data.data.evaluation.overall_score}/100`)
      
    } catch (error: any) {
      console.error('Evaluation failed:', error)
      alert(`Evaluation failed: ${error.message}`)
    } finally {
      setIsEvaluating(false)
      setCurrentStatus(null)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'INVEST':
      case 'STRONG_CONSIDER':
        return 'text-green-600 bg-green-50'
      case 'CONSIDER':
        return 'text-yellow-600 bg-yellow-50'
      default:
        return 'text-red-600 bg-red-50'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                IVA Dashboard
              </h1>
              <p className="text-lg text-gray-600">
                Intelligent Venture Analyst for Impression Ventures
              </p>
            </div>
            
            {/* Navigation */}
            <div className="flex space-x-2">
              <Button 
                variant={activeView === 'dashboard' ? 'default' : 'outline'}
                onClick={() => setActiveView('dashboard')}
                className="flex items-center space-x-2"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
              <Button 
                variant={activeView === 'portfolio' ? 'default' : 'outline'}
                onClick={() => setActiveView('portfolio')}
                className="flex items-center space-x-2"
              >
                <Eye className="h-4 w-4" />
                <span>Portfolio</span>
              </Button>
              <Button 
                variant={activeView === 'trends' ? 'default' : 'outline'}
                onClick={() => setActiveView('trends')}
                className="flex items-center space-x-2"
              >
                <Radar className="h-4 w-4" />
                <span>Market Trends</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Conditional Content Based on Active View */}
        {activeView === 'dashboard' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Evaluations</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEvaluations}</div>
              <p className="text-xs text-muted-foreground">
                Companies analyzed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High-Score Deals</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.highScoreDeals}</div>
              <p className="text-xs text-muted-foreground">
                Score ≥ 70 points
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageScore}</div>
              <p className="text-xs text-muted-foreground">
                Out of 100 points
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weekly Activity</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recentActivity}</div>
              <p className="text-xs text-muted-foreground">
                Evaluations this week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Deal Submission Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Evaluate New Deal</CardTitle>
                <CardDescription>
                  Submit a startup for AI-powered analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Company Name *
                  </label>
                  <Input
                    placeholder="e.g., Stripe, Plaid, Square"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    disabled={isEvaluating}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Website (optional)
                  </label>
                  <Input
                    placeholder="https://company.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    disabled={isEvaluating}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Founder Names (optional)
                  </label>
                  <Input
                    placeholder="John Doe, Jane Smith"
                    value={founderNames}
                    onChange={(e) => setFounderNames(e.target.value)}
                    disabled={isEvaluating}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Separate multiple names with commas
                  </p>
                </div>

                <Button 
                  onClick={handleEvaluate}
                  disabled={!companyName.trim() || isEvaluating}
                  className="w-full"
                >
                  {isEvaluating ? 'Analyzing...' : 'Start Analysis'}
                </Button>

                {/* Progress Indicator */}
                {currentStatus && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-900">
                        {currentStatus.step.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                      </span>
                      <span className="text-sm text-blue-700">
                        {currentStatus.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${currentStatus.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-blue-700 mt-1">
                      {currentStatus.message}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Evaluations & High Score Deals */}
          <div className="lg:col-span-2 space-y-8">
            {/* High Score Opportunities */}
            <Card>
              <CardHeader>
                <CardTitle>High-Score Opportunities</CardTitle>
                <CardDescription>
                  Deals scoring 70+ points - ready for partner review
                </CardDescription>
              </CardHeader>
              <CardContent>
                {highScoreDeals.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No high-score deals yet. Submit companies for analysis.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {highScoreDeals.map((deal: any) => (
                      <div 
                        key={deal.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedEvaluation(deal)}
                      >
                        <div>
                          <h4 className="font-medium">{deal.companies?.name || 'Unknown Company'}</h4>
                          <p className="text-sm text-gray-600">{deal.companies?.industry || 'Fintech'}</p>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${getScoreColor(deal.overall_score)}`}>
                            {deal.overall_score}/100
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${getRecommendationColor(deal.recommendation)}`}>
                            {deal.recommendation?.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Evaluations</CardTitle>
                <CardDescription>
                  Latest startup analyses and scores
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentEvaluations.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No evaluations yet. Start by analyzing your first startup.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {recentEvaluations.slice(0, 5).map((evaluation: any) => (
                      <div 
                        key={evaluation.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedEvaluation(evaluation)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${evaluation.meets_criteria ? 'bg-green-500' : 'bg-red-500'}`} />
                          <div>
                            <h4 className="font-medium">{evaluation.companies?.name || 'Unknown Company'}</h4>
                            <p className="text-sm text-gray-600">
                              {new Date(evaluation.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${getScoreColor(evaluation.overall_score)}`}>
                            {evaluation.overall_score}/100
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${getRecommendationColor(evaluation.recommendation)}`}>
                            {evaluation.recommendation?.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        </>
      )}

      {/* Portfolio View */}
      {activeView === 'portfolio' && <PortfolioView />}

      {/* Trends View */}
      {activeView === 'trends' && <TrendsView />}

        {/* Evaluation Details Modal */}
        {selectedEvaluation && (
          <EvaluationDetails 
            evaluation={selectedEvaluation}
            onClose={() => setSelectedEvaluation(null)}
          />
        )}
      </div>
    </div>
  )
}
