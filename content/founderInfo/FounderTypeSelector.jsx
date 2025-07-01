"use client"

import { useFounderContext } from "../../contexts/FounderContext"
import { useProgressContext } from "../../contexts/ProgressContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Circle, User, ArrowLeft } from "lucide-react"

const FounderTypeSelector = ({ onComplete, onBack }) => {
  const { founder, updateFounder } = useFounderContext()
  const progressContext = useProgressContext()

  const handleExperienceSelect = (isFirstTime) => {
    updateFounder({ isFirstTime })
    if (progressContext.makeDecision) {
      progressContext.makeDecision("isFirstTime", isFirstTime)
    }
    if (progressContext.earnLokaTokens) {
      progressContext.earnLokaTokens(10, "Completed founder type selection")
    }
    // Let context handle the redirect
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-6 w-6" />
              <div>
                <CardTitle>First Time/Experienced?</CardTitle>
                <CardDescription>
                  This helps us customize your journey and provide relevant guidance based on your experience level
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
              variant={founder.isFirstTime === true ? "default" : "outline"}
              className="h-32 flex flex-col items-center gap-4 text-center"
              onClick={() => handleExperienceSelect(true)}
            >
              <div className="flex items-center gap-2">
                {founder.isFirstTime === true ? <CheckCircle className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
                <span className="text-xl font-semibold">Yes, First Time</span>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">New to entrepreneurship and need comprehensive guidance</p>
                <div className="flex flex-wrap gap-1 justify-center">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Step-by-step guidance</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Mentorship matching</span>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Resource library</span>
                </div>
              </div>
            </Button>

            <Button
              variant={founder.isFirstTime === false ? "default" : "outline"}
              className="h-32 flex flex-col items-center gap-4 text-center"
              onClick={() => handleExperienceSelect(false)}
            >
              <div className="flex items-center gap-2">
                {founder.isFirstTime === false ? <CheckCircle className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
                <span className="text-xl font-semibold">No, Experienced</span>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Have previous startup experience and looking for advanced tools
                </p>
                <div className="flex flex-wrap gap-1 justify-center">
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Advanced tools</span>
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Investor network</span>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Peer connections</span>
                </div>
              </div>
            </Button>
          </div>

          {founder.isFirstTime !== null && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-center">
                ✅ Great! You've selected{" "}
                <strong>{founder.isFirstTime ? "First-time founder" : "Experienced founder"}</strong>. We'll customize
                your journey accordingly. (+10 Loka Tokens earned!)
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default FounderTypeSelector
