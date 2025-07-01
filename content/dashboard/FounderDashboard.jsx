"use client"

import { useFounderContext } from "../../contexts/FounderContext"
import { useFundingContext } from "../../contexts/FundingContext"
import { useProgressContext } from "../../contexts/ProgressContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { User, Target, TrendingUp, Coins, Lightbulb } from "lucide-react"

const FounderDashboard = ({ onNavigate }) => {
  const founderSummary = useFounderContext().getFounderSummary()
  const fundingSummary = useFundingContext().getFundingSummary()
  const progressContext = useProgressContext()

  // Safely get progress summary with fallback
  const progressSummary = progressContext.getProgressSummary
    ? progressContext.getProgressSummary()
    : {
        progressPercentage: 0,
        lokaTokensAvailable: 0,
        currentStep: "founder-start",
        completedStepsCount: 0,
        totalSteps: 8,
      }

  const getNextAction = () => {
    if (!founderSummary.hasBasicInfo) return "complete-profile"
    if (founderSummary.isFirstTime === null) return "founder-type-selection"
    if (!founderSummary.stage) return "startup-stage-selection"
    if (founderSummary.needsFunding === null) return "funding-decision"
    if (founderSummary.hasIdea === null) return "idea-status-check"
    if (!founderSummary.domain) return "domain-selection"
    if (founderSummary.lookingForCofounder === null) return "team-status-check"
    if (founderSummary.needsFunding && !fundingSummary.category) return "funding-form"
    return "dashboard"
  }

  const nextAction = getNextAction()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back, {founderSummary.name || "Founder"}!</h1>
          <p className="text-lg text-gray-600">Your startup journey dashboard</p>
        </header>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Status</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{founderSummary.hasBasicInfo ? "Complete" : "Incomplete"}</div>
              <p className="text-xs text-muted-foreground">
                {founderSummary.isFirstTime ? "First-time founder" : "Experienced founder"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Journey Progress</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(progressSummary.progressPercentage)}%</div>
              <Progress value={progressSummary.progressPercentage} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Funding Status</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{founderSummary.needsFunding ? "Seeking" : "Not Needed"}</div>
              <p className="text-xs text-muted-foreground">{fundingSummary.category || "Category not set"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loka Tokens</CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progressSummary.lokaTokensAvailable}</div>
              <p className="text-xs text-muted-foreground">Available for AI services</p>
            </CardContent>
          </Card>
        </div>

        {/* Next Action */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Next Step</CardTitle>
            <CardDescription>Continue your founder journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">
                  {nextAction === "complete-profile" && "Complete Your Profile"}
                  {nextAction === "founder-type-selection" && "Select Founder Type"}
                  {nextAction === "startup-stage-selection" && "Choose Startup Stage"}
                  {nextAction === "funding-decision" && "Funding Decision"}
                  {nextAction === "idea-status-check" && "Idea Status Check"}
                  {nextAction === "domain-selection" && "Select Domain"}
                  {nextAction === "team-status-check" && "Team Status Check"}
                  {nextAction === "funding-form" && "Complete Funding Application"}
                  {nextAction === "dashboard" && "All Set!"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {nextAction === "dashboard" ? "Your profile is complete" : "Click to continue"}
                </p>
              </div>
              {nextAction !== "dashboard" && <Button onClick={() => onNavigate(nextAction)}>Continue</Button>}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile & Team
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => onNavigate("founder-type-selection")}
              >
                Founder Type
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => onNavigate("team-status-check")}
              >
                Team Status
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Idea & Product
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => onNavigate("idea-status-check")}
              >
                Idea Status
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => onNavigate("domain-selection")}
              >
                Domain Selection
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Funding & Growth
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => onNavigate("funding-form")}
              >
                Funding Application
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => onNavigate("mentorship-options")}
              >
                Support Options
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default FounderDashboard
