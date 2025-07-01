"use client"

import { useFounderContext } from "../../contexts/FounderContext"
import { useProgressContext } from "../../contexts/ProgressContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Circle, Lightbulb, ArrowLeft } from "lucide-react"

const IdeaStatusChecker = ({ onComplete, onBack }) => {
  const { startup, updateStartup } = useFounderContext()
  const progressContext = useProgressContext()

  const handleIdeaStatusSelect = (hasIdea) => {
    console.log("💡 Idea status selected:", hasIdea)

    // Update startup context
    updateStartup({ hasIdea })

    // Make decision in progress context
    if (progressContext.makeDecision) {
      progressContext.makeDecision("hasIdea", hasIdea)
    }

    // Earn tokens
    if (progressContext.earnLokaTokens) {
      progressContext.earnLokaTokens(15, "Completed idea status check")
    }

    console.log("🔄 After idea status update:", { hasIdea, shouldRedirect: progressContext.shouldRedirect })
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-6 w-6" />
              <div>
                <CardTitle>Do you have the idea ready?</CardTitle>
                <CardDescription>
                  This determines your next steps - idea validation or idea generation with AI assistance
                </CardDescription>
              </div>
            </div>
            {onBack && (
              <Button variant="outline" size="sm" onClick={onBack} className="flex items-center gap-2 bg-transparent">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Button
              variant={startup.hasIdea === true ? "default" : "outline"}
              className="h-32 flex flex-col items-center gap-4 text-center"
              onClick={() => handleIdeaStatusSelect(true)}
            >
              <div className="flex items-center gap-2">
                {startup.hasIdea === true ? <CheckCircle className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
                <span className="text-xl font-semibold">Yes, I have an idea</span>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">I have a specific startup idea and ready to validate it</p>
                <div className="flex flex-wrap gap-1 justify-center">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Idea validation</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Market research</span>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Pitch deck help</span>
                </div>
              </div>
            </Button>

            <Button
              variant={startup.hasIdea === false ? "default" : "outline"}
              className="h-32 flex flex-col items-center gap-4 text-center"
              onClick={() => handleIdeaStatusSelect(false)}
            >
              <div className="flex items-center gap-2">
                {startup.hasIdea === false ? <CheckCircle className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
                <span className="text-xl font-semibold">No, I need ideas</span>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  I want to explore domains and get AI-generated startup ideas
                </p>
                <div className="flex flex-wrap gap-1 justify-center">
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Domain exploration</span>
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">AI idea generation</span>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Market trends</span>
                </div>
              </div>
            </Button>
          </div>

          {startup.hasIdea !== null && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-center">
                ✅ Perfect! {startup.hasIdea ? "We'll help you validate your idea" : "We'll help you generate ideas"}.
                (+15 Loka Tokens earned!)
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default IdeaStatusChecker
