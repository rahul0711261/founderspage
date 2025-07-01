"use client"

import { useProgressContext } from "../../contexts/ProgressContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Users, Lightbulb, Coins } from "lucide-react"

const Leaderboard = () => {
  const progressContext = useProgressContext()

  // Safely get leaderboard data with fallback
  const leaderboard = progressContext.getLeaderboard
    ? progressContext.getLeaderboard()
    : {
        totalFounders: 1247,
        validatedIdeas: 342,
        fundsRaised: 2.5,
        foundersWithGuidance: 856,
      }

  const stats = [
    {
      icon: Users,
      title: "Total Founders",
      value: leaderboard.totalFounders || 1247,
      description: "Active on platform",
    },
    {
      icon: Lightbulb,
      title: "Ideas Validated",
      value: leaderboard.validatedIdeas || 342,
      description: "Successfully validated",
    },
    {
      icon: Coins,
      title: "Funds Raised",
      value: `${leaderboard.fundsRaised || 2.5}M`,
      description: "In Loki tokens",
    },
    {
      icon: Trophy,
      title: "Guided Founders",
      value: leaderboard.foundersWithGuidance || 856,
      description: "Received mentorship",
    },
  ]

  const topFounders = [
    { name: "Alex Chen", stage: "Series A", tokens: 1250, domain: "AI" },
    { name: "Sarah Kumar", stage: "Seed", tokens: 980, domain: "Fintech" },
    { name: "Mike Johnson", stage: "Pre-seed", tokens: 750, domain: "Web3" },
    { name: "Lisa Wang", stage: "MVP", tokens: 620, domain: "B2B" },
    { name: "David Smith", stage: "Idea", tokens: 450, domain: "C4S" },
  ]

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6" />
            Platform Leaderboard
          </CardTitle>
          <CardDescription>Track the success of our founder community</CardDescription>
        </CardHeader>
      </Card>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top Founders */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Founders</CardTitle>
          <CardDescription>Founders leading in their journey and token earnings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topFounders.map((founder, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold">#{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-medium">{founder.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {founder.domain} • {founder.stage}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">{founder.tokens} tokens</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievement Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🚀 Rising Stars</CardTitle>
            <CardDescription>New founders making rapid progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Emma Rodriguez</span>
                <Badge variant="outline">+150 tokens</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">James Park</span>
                <Badge variant="outline">+120 tokens</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Nina Patel</span>
                <Badge variant="outline">+95 tokens</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">💰 Funding Champions</CardTitle>
            <CardDescription>Successfully raised funding</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">TechFlow AI</span>
                <Badge variant="default">$2M Series A</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">PayEase</span>
                <Badge variant="default">$500K Seed</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">BlockChain Pro</span>
                <Badge variant="default">$1M Pre-seed</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🎯 Mentorship Leaders</CardTitle>
            <CardDescription>Founders helping others succeed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Alex Chen</span>
                <Badge variant="secondary">15 mentees</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Sarah Kumar</span>
                <Badge variant="secondary">12 mentees</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Mike Johnson</span>
                <Badge variant="secondary">8 mentees</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Leaderboard
