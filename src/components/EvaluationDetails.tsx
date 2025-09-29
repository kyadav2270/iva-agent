'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FileText, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Shield, 
  Code, 
  BarChart3,
  AlertTriangle,
  CheckCircle,
  X,
  Download,
  Eye
} from 'lucide-react'

interface EvaluationDetailsProps {
  evaluation: any
  onClose: () => void
}

export default function EvaluationDetails({ evaluation, onClose }: EvaluationDetailsProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [loadingDDReport, setLoadingDDReport] = useState(false)
  const [ddReport, setDDReport] = useState<any>(null)

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'INVEST':
      case 'STRONG_CONSIDER':
        return 'bg-green-100 text-green-800'
      case 'CONSIDER':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-red-100 text-red-800'
    }
  }

  const generateDDReport = async () => {
    setLoadingDDReport(true)
    try {
      const response = await fetch('/api/dd-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: evaluation.companies?.name,
          website: evaluation.companies?.website,
          industry: evaluation.companies?.industry,
          description: evaluation.companies?.description,
          foundedYear: evaluation.companies?.founded_year
        })
      })
      
      const result = await response.json()
      if (response.ok) {
        setDDReport(result.ddReport)
      } else {
        alert('Failed to generate DD report: ' + result.error)
      }
    } catch (error) {
      console.error('Error generating DD report:', error)
      alert('Failed to generate DD report')
    } finally {
      setLoadingDDReport(false)
    }
  }

  const formatMemo = (memo: string) => {
    return memo.split('\n\n').map((section, index) => (
      <div key={index} className="mb-4">
        <p className="text-gray-700 leading-relaxed">{section}</p>
      </div>
    ))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {evaluation.companies?.name || 'Unknown Company'}
            </h2>
            <p className="text-gray-600">
              {evaluation.companies?.industry || 'Fintech'} • 
              Evaluated on {new Date(evaluation.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className={`text-3xl font-bold ${getScoreColor(evaluation.overall_score)}`}>
                {evaluation.overall_score}/100
              </div>
              <Badge className={getRecommendationColor(evaluation.recommendation)}>
                {evaluation.recommendation?.replace('_', ' ')}
              </Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="memo">Investment Memo</TabsTrigger>
              <TabsTrigger value="dd">Due Diligence</TabsTrigger>
              <TabsTrigger value="scores">Detailed Scores</TabsTrigger>
              <TabsTrigger value="questions">DD Questions</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-6 space-y-6">
              {/* Score Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Team</span>
                    </div>
                    <div className={`text-2xl font-bold ${getScoreColor(evaluation.team_score)}`}>
                      {evaluation.team_score}/100
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Market</span>
                    </div>
                    <div className={`text-2xl font-bold ${getScoreColor(evaluation.market_score)}`}>
                      {evaluation.market_score}/100
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Code className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium">Product</span>
                    </div>
                    <div className={`text-2xl font-bold ${getScoreColor(evaluation.product_score)}`}>
                      {evaluation.product_score}/100
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium">Traction</span>
                    </div>
                    <div className={`text-2xl font-bold ${getScoreColor(evaluation.traction_score)}`}>
                      {evaluation.traction_score}/100
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-indigo-500" />
                      <span className="text-sm font-medium">Competitive</span>
                    </div>
                    <div className={`text-2xl font-bold ${getScoreColor(evaluation.competitive_advantage_score)}`}>
                      {evaluation.competitive_advantage_score}/100
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Business Model</span>
                    </div>
                    <div className={`text-2xl font-bold ${getScoreColor(evaluation.business_model_score)}`}>
                      {evaluation.business_model_score}/100
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Strengths and Red Flags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Key Strengths</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {(evaluation.strengths || []).map((strength: string, index: number) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      <span>Red Flags</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {(evaluation.red_flags || []).map((flag: string, index: number) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm">{flag}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Investment Memo Tab */}
            <TabsContent value="memo" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Investment Memo</span>
                  </CardTitle>
                  <CardDescription>
                    AI-generated comprehensive investment analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {evaluation.investment_memo ? (
                    <div className="prose max-w-none">
                      {formatMemo(evaluation.investment_memo)}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">Investment memo not available for this evaluation.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Due Diligence Tab */}
            <TabsContent value="dd" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Comprehensive Due Diligence</span>
                  </CardTitle>
                  <CardDescription>
                    Deep-dive analysis covering financial, legal, technical, and market aspects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!ddReport ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">
                        Generate a comprehensive due diligence report for this company
                      </p>
                      <Button 
                        onClick={generateDDReport} 
                        disabled={loadingDDReport}
                        className="mb-2"
                      >
                        {loadingDDReport ? 'Generating...' : 'Generate DD Report'}
                      </Button>
                      <p className="text-xs text-gray-500">
                        This will analyze 100+ data points across 5 categories
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* DD Report Summary */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{ddReport.overallScore}/100</div>
                          <div className="text-sm text-blue-800">Overall Score</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-lg font-bold text-green-600">{ddReport.recommendation}</div>
                          <div className="text-sm text-green-800">Recommendation</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-lg font-bold text-purple-600">{ddReport.dataQuality}/100</div>
                          <div className="text-sm text-purple-800">Data Quality</div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                          <div className="text-lg font-bold text-orange-600">{ddReport.analysisConfidence}/100</div>
                          <div className="text-sm text-orange-800">Confidence</div>
                        </div>
                      </div>

                      {/* Key Findings */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Key Findings</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {ddReport.keyFindings?.map((finding: string, index: number) => (
                                <li key={index} className="flex items-start space-x-2">
                                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm">{finding}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Red Flags</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {ddReport.redFlags?.map((flag: string, index: number) => (
                                <li key={index} className="flex items-start space-x-2">
                                  <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm">{flag}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Detailed Scores Tab */}
            <TabsContent value="scores" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Score Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { label: 'Team', score: evaluation.team_score, weight: '20%' },
                        { label: 'Market', score: evaluation.market_score, weight: '20%' },
                        { label: 'Product', score: evaluation.product_score, weight: '20%' },
                        { label: 'Traction', score: evaluation.traction_score, weight: '15%' },
                        { label: 'Competitive Advantage', score: evaluation.competitive_advantage_score, weight: '15%' },
                        { label: 'Business Model', score: evaluation.business_model_score, weight: '10%' }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{item.label}</span>
                            <span className="text-sm text-gray-500">({item.weight})</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${item.score}%` }}
                              />
                            </div>
                            <span className={`font-bold ${getScoreColor(item.score)}`}>
                              {item.score}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Investment Criteria</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Meets Investment Criteria</span>
                        <Badge variant={evaluation.meets_criteria ? "default" : "destructive"}>
                          {evaluation.meets_criteria ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Industry Focus</span>
                        <Badge variant="outline">Fintech</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Stage Requirement</span>
                        <Badge variant="outline">Post-MVP</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Geographic Focus</span>
                        <Badge variant="outline">North America</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Minimum Funding</span>
                        <Badge variant="outline">$2M+</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* DD Questions Tab */}
            <TabsContent value="questions" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Due Diligence Questions</CardTitle>
                  <CardDescription>
                    AI-generated questions for deep-dive analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {evaluation.due_diligence_questions && evaluation.due_diligence_questions.length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {['Technical', 'Business', 'Financial', 'Legal', 'Market', 'Team'].map((category, categoryIndex) => {
                          const categoryQuestions = evaluation.due_diligence_questions
                            .slice(categoryIndex * 3, (categoryIndex + 1) * 3)
                          
                          if (categoryQuestions.length === 0) return null
                          
                          return (
                            <Card key={category}>
                              <CardHeader className="pb-3">
                                <CardTitle className="text-lg">{category}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <ul className="space-y-2">
                                  {categoryQuestions.map((question: string, index: number) => (
                                    <li key={index} className="flex items-start space-x-2">
                                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                      <span className="text-sm">{question}</span>
                                    </li>
                                  ))}
                                </ul>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No due diligence questions available for this evaluation.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}