'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, TrendingUp, Users, Eye, Bell, Activity } from 'lucide-react'

export default function PortfolioView() {
  const [isMonitoring, setIsMonitoring] = useState(false)

  const mockCompanies = [
    { id: '1', name: 'FinanceFlow', status: 'Strong', lastUpdate: '2 hours ago', alerts: 0 },
    { id: '2', name: 'PaymentPro', status: 'Attention', lastUpdate: '1 day ago', alerts: 2 },
    { id: '3', name: 'LendingLogic', status: 'Strong', lastUpdate: '3 hours ago', alerts: 0 },
  ]

  const mockAlerts = [
    { id: '1', company: 'PaymentPro', type: 'News', severity: 'medium', message: 'Regulatory announcement in target market' },
    { id: '2', company: 'PaymentPro', type: 'Financial', severity: 'high', message: 'New funding round announced by competitor' },
  ]

  const startMonitoring = async () => {
    setIsMonitoring(true)
    try {
      const response = await fetch('/api/portfolio/monitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyIds: mockCompanies.map(c => c.id)
        })
      })
      
      if (response.ok) {
        alert('Portfolio monitoring started successfully!')
      } else {
        alert('Failed to start monitoring')
      }
    } catch (error) {
      console.error('Monitoring error:', error)
      alert('Failed to start monitoring')
    } finally {
      setIsMonitoring(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Companies</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCompanies.length}</div>
            <p className="text-xs text-muted-foreground">Active investments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{mockAlerts.length}</div>
            <p className="text-xs text-muted-foreground">Requiring attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+12%</div>
            <p className="text-xs text-muted-foreground">Avg. growth this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monitoring</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button 
              onClick={startMonitoring} 
              disabled={isMonitoring}
              size="sm"
              className="w-full"
            >
              {isMonitoring ? 'Monitoring...' : 'Start Monitor'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Companies */}
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Companies</CardTitle>
            <CardDescription>Real-time monitoring and health status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockCompanies.map((company) => (
                <div key={company.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${company.status === 'Strong' ? 'bg-green-500' : 'bg-orange-500'}`} />
                    <div>
                      <h4 className="font-medium">{company.name}</h4>
                      <p className="text-sm text-gray-600">Last update: {company.lastUpdate}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={company.status === 'Strong' ? 'default' : 'secondary'}>
                      {company.status}
                    </Badge>
                    {company.alerts > 0 && (
                      <Badge variant="destructive">{company.alerts} alerts</Badge>
                    )}
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Active Alerts</CardTitle>
            <CardDescription>Issues requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAlerts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No active alerts</p>
              ) : (
                mockAlerts.map((alert) => (
                  <div key={alert.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className={`h-4 w-4 mt-0.5 ${
                          alert.severity === 'high' ? 'text-red-500' : 'text-orange-500'
                        }`} />
                        <div>
                          <h5 className="font-medium">{alert.company}</h5>
                          <p className="text-sm text-gray-600">{alert.message}</p>
                        </div>
                      </div>
                      <Badge variant={alert.severity === 'high' ? 'destructive' : 'secondary'}>
                        {alert.type}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features Available */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Monitoring Features</CardTitle>
          <CardDescription>Comprehensive real-time portfolio intelligence</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Real-time News Monitoring</h4>
              <p className="text-sm text-gray-600">Track news, funding, and competitive developments</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Sentiment Analysis</h4>
              <p className="text-sm text-gray-600">AI-powered sentiment tracking across all portfolio companies</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Competitive Intelligence</h4>
              <p className="text-sm text-gray-600">Monitor competitive landscape and threats</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}