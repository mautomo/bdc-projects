'use client'

import { DashboardHeader } from '@/components/dashboard/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ShoppingBag, 
  Star, 
  TrendingUp, 
  Users, 
  MapPin,
  Calendar,
  Download,
  Filter
} from 'lucide-react'

export default function SecretShopPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Secret Shop Reports
            </h1>
            <p className="text-muted-foreground text-lg">
              Detailed customer experience analysis and competitive intelligence
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Shops</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">
                +12 this month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.2</div>
              <p className="text-xs text-muted-foreground">
                +0.3 from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Locations</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">
                Across 5 states
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shoppers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">
                Active this month
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="reports" className="space-y-4">
          <TabsList>
            <TabsTrigger value="reports">Recent Reports</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
            <TabsTrigger value="shoppers">Shoppers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="reports" className="space-y-4">
            <div className="grid gap-4">
              {[
                {
                  id: 'SS-2024-001',
                  location: 'Downtown Store',
                  shopper: 'Sarah M.',
                  score: 4.5,
                  date: '2024-01-15',
                  status: 'completed',
                  category: 'Customer Service'
                },
                {
                  id: 'SS-2024-002',
                  location: 'Mall Location',
                  shopper: 'John D.',
                  score: 3.8,
                  date: '2024-01-14',
                  status: 'completed',
                  category: 'Product Knowledge'
                },
                {
                  id: 'SS-2024-003',
                  location: 'Suburban Branch',
                  shopper: 'Lisa K.',
                  score: 4.8,
                  date: '2024-01-13',
                  status: 'completed',
                  category: 'Store Appearance'
                },
              ].map((report) => (
                <Card key={report.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{report.id}</CardTitle>
                        <CardDescription>
                          {report.location} • {report.shopper}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{report.category}</Badge>
                        <Badge 
                          variant={report.score >= 4.0 ? "default" : report.score >= 3.0 ? "secondary" : "destructive"}
                        >
                          ⭐ {report.score}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          {report.date}
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          {report.status}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        View Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Score Trends</CardTitle>
                  <CardDescription>Average scores over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Score trend chart will be displayed here
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Category Performance</CardTitle>
                  <CardDescription>Performance breakdown by evaluation category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { category: 'Customer Service', score: 4.2, change: '+0.3' },
                      { category: 'Product Knowledge', score: 3.8, change: '-0.1' },
                      { category: 'Store Appearance', score: 4.5, change: '+0.2' },
                      { category: 'Wait Time', score: 3.9, change: '+0.4' },
                    ].map((item) => (
                      <div key={item.category} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.category}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{item.score}</span>
                          <span className={`text-xs ${item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                            {item.change}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="locations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Location Performance</CardTitle>
                <CardDescription>Secret shop scores by location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Downtown Store', score: 4.5, shops: 24, lastVisit: '2024-01-15' },
                    { name: 'Mall Location', score: 3.8, shops: 18, lastVisit: '2024-01-14' },
                    { name: 'Suburban Branch', score: 4.8, shops: 21, lastVisit: '2024-01-13' },
                    { name: 'Airport Store', score: 4.1, shops: 15, lastVisit: '2024-01-12' },
                  ].map((location) => (
                    <div key={location.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{location.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {location.shops} shops • Last visit: {location.lastVisit}
                        </p>
                      </div>
                      <Badge 
                        variant={location.score >= 4.0 ? "default" : location.score >= 3.0 ? "secondary" : "destructive"}
                      >
                        ⭐ {location.score}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="shoppers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mystery Shoppers</CardTitle>
                <CardDescription>Active shoppers and their performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Sarah M.', shops: 15, avgScore: 4.2, joined: '2023-08-15', status: 'active' },
                    { name: 'John D.', shops: 12, avgScore: 4.0, joined: '2023-07-22', status: 'active' },
                    { name: 'Lisa K.', shops: 18, avgScore: 4.4, joined: '2023-06-10', status: 'active' },
                    { name: 'Mike R.', shops: 9, avgScore: 3.9, joined: '2023-09-05', status: 'inactive' },
                  ].map((shopper) => (
                    <div key={shopper.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{shopper.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {shopper.shops} shops • Joined: {shopper.joined}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          Avg: {shopper.avgScore}
                        </Badge>
                        <Badge 
                          variant={shopper.status === 'active' ? 'default' : 'secondary'}
                        >
                          {shopper.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}