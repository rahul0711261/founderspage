"use client"
import { useState, useEffect } from "react"
import { FounderProvider } from "./contexts/FounderContext"
import { FundingProvider } from "./contexts/FundingContext"
import { ProgressProvider } from "./contexts/ProgressContext"
import { useProgressContext } from "./contexts/ProgressContext"

// Import all components
import FounderDashboard from "./content/dashboard/FounderDashboard"
import Leaderboard from "./content/dashboard/Leaderboard"

// Founder Info Components
import FounderTypeSelector from "./content/founderInfo/FounderTypeSelector"
import IdeaStatusChecker from "./content/founderInfo/IdeaStatusChecker"
import DomainSelector from "./content/founderInfo/DomainSelector"
import TeamStatusChecker from "./content/founderInfo/TeamStatusChecker"
import AIIdeaGenerator from "./content/founderInfo/AIIdeaGenerator"
import StartupStageSelector from "./content/founderInfo/StartupStageSelector"
import IdeaStrategy from "./content/founderInfo/IdeaStrategy"

// Funding Components
import FundingForm from "./content/funding/FundingForm"
import PitchDeckForm from "./content/funding/PitchDeckForm"
import InvestorConnection from "./content/funding/InvestorConnection"

// Support Components
import MentorshipOptions from "./content/supportOptions/MentorshipOptions"

// Tracking Components
import ProgressTracking from "./content/tracking/ProgressTracking"

function AppContent() {
  const progressContext = useProgressContext()
  const [currentView, setCurrentView] = useState("dashboard")

  // Handle navigation
  const handleNavigate = (stepName) => {
    console.log("🧭 Navigating to:", stepName)
    setCurrentView(stepName)
    if (progressContext.goToStep) {
      progressContext.goToStep(stepName)
    }
  }

  // Handle back navigation
  const handleBack = () => {
    setCurrentView("dashboard")
  }

  // Handle step completion
  const handleStepComplete = (nextStep) => {
    console.log("✅ Step completed, next:", nextStep)
    if (nextStep) {
      setCurrentView(nextStep)
    } else {
      setCurrentView("dashboard")
    }
  }

  // Listen for redirect flags from context
  useEffect(() => {
    if (progressContext.shouldRedirect && progressContext.nextStepToRedirect) {
      console.log("🔄 Auto-redirecting to:", progressContext.nextStepToRedirect)

      // Map context steps to view names
      const stepMapping = {
        "first-time-check": "founder-type-selection",
        "startup-stage-selection": "startup-stage-selection",
        "idea-status-check": "idea-status-check",
        "idea-strategy": "idea-strategy",
        "domain-selection": "domain-selection",
        "ai-agents-help": "ai-idea-generator",
        "funding-decision": "funding-form",
        "funding-form": "funding-form",
        "beyond-funding-support": "mentorship-options",
        "cofounder-decision": "team-status-check",
        "cofounder-portal": "team-status-check",
        "pitch-deck-creation": "pitch-deck",
        "investor-connection": "investor-connection",
        "progress-tracking": "progress-tracking",
        "mentorship-options": "mentorship-options",
      }

      const targetView = stepMapping[progressContext.nextStepToRedirect] || progressContext.nextStepToRedirect
      setCurrentView(targetView)

      // Clear the redirect flag
      if (progressContext.clearRedirectFlag) {
        progressContext.clearRedirectFlag()
      }
    }
  }, [progressContext.shouldRedirect, progressContext.nextStepToRedirect])

  const renderCurrentView = () => {
    switch (currentView) {
      case "dashboard":
        return <FounderDashboard onNavigate={handleNavigate} />
      case "leaderboard":
        return <Leaderboard />

      // Founder Info Flow
      case "founder-type-selection":
        return <FounderTypeSelector onComplete={handleStepComplete} onBack={handleBack} />
      case "startup-stage-selection":
        return <StartupStageSelector onComplete={handleStepComplete} onBack={handleBack} />
      case "idea-status-check":
        return <IdeaStatusChecker onComplete={handleStepComplete} onBack={handleBack} />
      case "domain-selection":
        return <DomainSelector onComplete={handleStepComplete} onBack={handleBack} />
      case "ai-idea-generator":
        return <AIIdeaGenerator onComplete={handleStepComplete} onBack={handleBack} />
      case "team-status-check":
        return <TeamStatusChecker onComplete={handleStepComplete} onBack={handleBack} />
      case "idea-strategy":
        return <IdeaStrategy onComplete={handleStepComplete} onBack={handleBack} />

      // Funding Flow
      case "funding-form":
        return <FundingForm onComplete={handleStepComplete} onBack={handleBack} />
      case "pitch-deck":
        return <PitchDeckForm onComplete={handleStepComplete} onBack={handleBack} />
      case "investor-connection":
        return <InvestorConnection onComplete={handleStepComplete} onBack={handleBack} />

      // Support & Tracking
      case "mentorship-options":
        return <MentorshipOptions onComplete={handleStepComplete} onBack={handleBack} />
      case "progress-tracking":
        return <ProgressTracking onComplete={handleStepComplete} onBack={handleBack} />

      default:
        return <FounderDashboard onNavigate={handleNavigate} />
    }
  }

  return <div className="App min-h-screen">{renderCurrentView()}</div>
}

function App() {
  return (
    <ProgressProvider>
      <FounderProvider>
        <FundingProvider>
          <AppContent />
        </FundingProvider>
      </FounderProvider>
    </ProgressProvider>
  )
}

export default App
