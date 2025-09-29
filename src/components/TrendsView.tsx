'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Zap, Globe, DollarSign, AlertTriangle, BarChart3, Radar, RefreshCw } from 'lucide-react'

export default function TrendsView() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [trends, setTrends] = useState<any[]>([])

  const generateIntelligence = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/market/intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectors: ['fintech', 'healthtech', 'edtech']
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        setTrends(result.data.trends || [])
        alert(`Market intelligence generated! Found ${result.summary.trendsIdentified} trends`)
      } else {
        alert('Failed to generate market intelligence')
      }
    } catch (error) {
      console.error('Intelligence generation error:', error)
      alert('Failed to generate market intelligence')
    } finally {
      setIsGenerating(false)
    }
  }

  const mockTrends = [
    {
      title: 'AI-Powered Financial Services',
      category: 'technology',
      impact: 'transformational',
      confidence: 85,
      timeframe: 'short-term',
      description: 'Widespread adoption of AI in financial services for risk assessment, fraud detection, and personalized banking'
    },
    {
      title: 'Open Banking Evolution',
      category: 'regulation',
      impact: 'high',
      confidence: 78,
      timeframe: 'medium-term',
      description: 'Expansion of open banking frameworks globally, creating new opportunities for fintech innovation'
    },
    {
      title: 'Embedded Finance Growth',
      category: 'market',
      impact: 'high',
      confidence: 82,
      timeframe: 'immediate',
      description: 'Non-financial companies increasingly embedding financial services into their platforms'
    }
  ]

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'transformational': return 'bg-purple-100 text-purple-800'
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technology': return <Zap className="h-4 w-4" />
      case 'regulation': return <AlertTriangle className="h-4 w-4" />
      case 'market': return <Globe className="h-4 w-4" />
      case 'funding': return <DollarSign className="h-4 w-4" />
      default: return <BarChart3 className="h-4 w-4" />
    }
  }

  const displayTrends = trends.length > 0 ? trends.slice(0, 10) : mockTrends

  return (
    <div className="space-y-6">
      {/* Market Intelligence Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Trends</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayTrends.length}</div>
            <p className="text-xs text-muted-foreground">Across all sectors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Impact</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {displayTrends.filter(t => t.impact === 'high' || t.impact === 'transformational').length}
            </div>
            <p className="text-xs text-muted-foreground">Transformational trends</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Math.round(displayTrends.reduce((acc, t) => acc + (t.confidence || 0), 0) / displayTrends.length)}%
            </div>
            <p className="text-xs text-muted-foreground">Analysis confidence</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Intelligence</CardTitle>
            <Radar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button 
              onClick={generateIntelligence} 
              disabled={isGenerating}
              size="sm"
              className="w-full"
            >
              {isGenerating ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                'Generate'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Trends List */}
      <Card>
        <CardHeader>
          <CardTitle>Market Trends & Predictions</CardTitle>
          <CardDescription>
            AI-powered analysis of emerging trends across multiple sectors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {displayTrends.map((trend, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="mt-1">
                      {getCategoryIcon(trend.category)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium mb-2">{trend.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{trend.description}</p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="capitalize">
                          {trend.category}
                        </Badge>
                        <Badge className={getImpactColor(trend.impact)}>
                          {trend.impact} impact
                        </Badge>
                        <Badge variant="secondary">
                          {trend.timeframe}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-lg font-bold text-blue-600">
                      {trend.confidence}%
                    </div>
                    <div className="text-xs text-gray-500">confidence</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Investment Implications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Investment Opportunities</CardTitle>
            <CardDescription>Emerging opportunities based on trend analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <h5 className="font-medium text-green-800 mb-1">AI-First Fintech</h5>
                <p className="text-sm text-green-700">Companies building AI-native financial products</p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h5 className="font-medium text-blue-800 mb-1">Embedded Finance Infrastructure</h5>
                <p className="text-sm text-blue-700">B2B platforms enabling embedded financial services</p>
              </div>
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <h5 className="font-medium text-purple-800 mb-1">Regulatory Technology</h5>
                <p className="text-sm text-purple-700">Solutions for evolving compliance requirements</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Risks</CardTitle>
            <CardDescription>Potential risks and challenges to monitor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <h5 className="font-medium text-red-800 mb-1">Regulatory Uncertainty</h5>
                <p className="text-sm text-red-700">Evolving regulations may impact business models</p>
              </div>
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <h5 className="font-medium text-orange-800 mb-1">Market Saturation</h5>
                <p className="text-sm text-orange-700">Increasing competition in core fintech segments</p>
              </div>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h5 className="font-medium text-yellow-800 mb-1">Economic Headwinds</h5>
                <p className="text-sm text-yellow-700">Potential impact on funding and customer adoption</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features Available */}
      <Card>
        <CardHeader>
          <CardTitle>Market Intelligence Features</CardTitle>
          <CardDescription>Comprehensive market trend analysis and prediction</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Trend Prediction</h4>
              <p className="text-sm text-gray-600">AI-powered analysis of emerging market trends</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Investment Thesis Evolution</h4>
              <p className="text-sm text-gray-600">Dynamic thesis updates based on market changes</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Cross-Sector Analysis</h4>
              <p className="text-sm text-gray-600">Multi-sector trend correlation and impact assessment</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}