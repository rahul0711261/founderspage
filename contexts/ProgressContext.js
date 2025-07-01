"use client"

import { createContext, useContext, useState } from "react"

const ProgressContext = createContext()

const initialState = {
  currentStep: "founder-start",
  completedSteps: [],
  decisions: {
    isFirstTime: null,
    startupStage: null,
    needsFunding: null,
    hasIdea: null,
    selectedDomain: null,
    needsCofounder: null,
  },
  flowPaths: {
    firstTimeFlow: {
      yes: "startup-stage-selection",
      no: "level-ideation-mvp-check",
    },
    startupStageFlow: {
      "early-stage": "funding-decision",
      running: "funding-decision",
      profitable: "funding-decision",
      bootstrapped: "funding-decision",
    },
    fundingFlow: {
      yes: "startup-category-selection",
      no: "beyond-funding-support",
    },
    ideaFlow: {
      yes: "idea-strategy",
      no: "domain-selection",
    },
    domainFlow: {
      selected: "ai-agents-help",
    },
    cofounderFlow: {
      yes: "funding-decision", // After team details, go to funding
      no: "funding-decision", // Solo founders also go to funding
    },
  },
  stepDefinitions: {
    "founder-start": {
      title: "Welcome Founder",
      description: "Starting your founder journey",
      nextStep: "first-time-check",
    },
    "first-time-check": {
      title: "Experience Level",
      description: "First Time/Experienced?",
      type: "decision",
      options: ["yes", "no"],
    },
    "startup-stage-selection": {
      title: "Startup Stage",
      description: "Select your current stage",
      type: "selection",
      options: ["early-stage", "running", "profitable", "bootstrapped"],
    },
    "idea-status-check": {
      title: "Idea Status",
      description: "Do you have the idea ready?",
      type: "decision",
      options: ["yes", "no"],
    },
    "idea-strategy": {
      title: "Idea Strategy",
      description: "Pitch deck, early traction, Live url, Documentation",
      type: "form",
    },
    "domain-selection": {
      title: "Domain Selection",
      description: "Which domain you want to make startup in",
      type: "selection",
    },
    "ai-agents-help": {
      title: "AI Assistance",
      description: "Help in creating R&D, cold calling, Pitch deck, small prototype",
      type: "services",
    },
    "funding-decision": {
      title: "Funding Need",
      description: "Do you need funding?",
      type: "decision",
      options: ["yes", "no"],
    },
    "startup-category-selection": {
      title: "Startup Category",
      description: "C4S/Fintech/Web3/B2B",
      type: "selection",
    },
    "beyond-funding-support": {
      title: "Support Services",
      description: "AI chatbot, Mentorship, Legal, Auditing, Exit Planning",
      type: "multi-select",
    },
    "cofounder-decision": {
      title: "Co-founder Need",
      description: "Do you need a co-founder?",
      type: "decision",
      options: ["yes", "no"],
    },
    "cofounder-portal": {
      title: "Co-founder Portal",
      description: "Connect with potential co-founders",
      type: "portal",
    },
    "pitch-deck-creation": {
      title: "Pitch Deck",
      description: "Create comprehensive pitch deck with all details",
      type: "form",
    },
    "investor-connection": {
      title: "Investor Matching",
      description: "Connect with investor expertise who loves to invest in X domain",
      type: "matching",
    },
    "progress-tracking": {
      title: "Progress Tracking",
      description: "User Traction - CRM Portal smart traction/viewership proof of work",
      type: "tracking",
    },
  },
  currentPhase: "onboarding",
  overallProgress: 0,
  phaseProgress: {
    onboarding: 0,
    validation: 0,
    development: 0,
    funding: 0,
    growth: 0,
  },
  lokaTokens: {
    available: 100,
    spent: 0,
    earnedFrom: [],
  },
  aiServicesUsed: {
    rdHelp: false,
    coldCalling: false,
    pitchDeckHelp: false,
    prototypeCreation: false,
  },
  supportServices: {
    aiChatbot: false,
    mentorship: false,
    legal: false,
    auditing: false,
    exitPlanning: false,
  },
  milestones: {
    microGrantEligible: false,
    companyRegistered: false,
    userTractionRecorded: false,
    investorConnected: false,
  },
  errors: {},
  loading: false,
  shouldRedirect: false,
  nextStepToRedirect: null,
}

export const ProgressProvider = ({ children }) => {
  const [state, setState] = useState(initialState)

  const goToStep = (stepName) => {
    setState((prev) => ({
      ...prev,
      currentStep: stepName,
    }))
  }

  const makeDecision = (decisionType, choice) => {
    console.log("🎯 Making decision:", decisionType, "=", choice)

    setState((prev) => {
      const newDecisions = { ...prev.decisions, [decisionType]: choice }
      let nextStep = prev.currentStep

      switch (decisionType) {
        case "isFirstTime":
          // First Time/Experienced decision
          if (choice === true) {
            // First Time -> Idea Status Check (simplified flow)
            nextStep = "idea-status-check"
          } else {
            // Experienced -> Startup Stage Selection
            nextStep = "startup-stage-selection"
          }
          break

        case "startupStage":
          // After startup stage selection -> Idea Status Check
          nextStep = "idea-status-check"
          break

        case "hasIdea":
          // Idea Status Check
          if (choice === true) {
            // Yes, I have idea -> Idea Strategy (Pitch deck, documentation, etc.)
            nextStep = "idea-strategy"
          } else {
            // No, I need ideas -> Domain Selection
            nextStep = "domain-selection"
          }
          break

        case "selectedDomain":
          // After domain selection -> AI Agents Help
          nextStep = "ai-agents-help"
          break

        case "needsCofounder":
          // Co-founder Decision -> Funding Decision (both yes and no go to funding)
          nextStep = "funding-decision"
          break

        case "needsFunding":
          // Funding Decision
          if (choice === true) {
            // Yes, need funding -> Funding Form (with equity questions)
            nextStep = "funding-form"
          } else {
            // No funding needed -> Beyond Funding Support (mentorship options)
            nextStep = "beyond-funding-support"
          }
          break

        case "fundingComplete":
          // After funding form -> Pitch Deck
          nextStep = "pitch-deck-creation"
          break

        default:
          break
      }

      console.log("📍 Decision result:", {
        decisionType,
        choice,
        nextStep,
        newDecisions,
      })

      return {
        ...prev,
        decisions: newDecisions,
        currentStep: nextStep,
        completedSteps: [...prev.completedSteps, prev.currentStep],
        shouldRedirect: true,
        nextStepToRedirect: nextStep,
      }
    })
  }

  const completeStep = (nextStepOverride = null) => {
    setState((prev) => {
      const currentStepDef = prev.stepDefinitions[prev.currentStep]
      let nextStep = nextStepOverride || currentStepDef?.nextStep

      if (!nextStep) {
        switch (prev.currentStep) {
          case "founder-start":
            nextStep = "first-time-check"
            break
          case "startup-category-selection":
            nextStep = "pitch-deck-creation"
            break
          case "idea-strategy":
            nextStep = "cofounder-decision"
            break
          case "domain-selection":
            nextStep = "ai-agents-help"
            break
          case "ai-agents-help":
            nextStep = "cofounder-decision"
            break
          case "pitch-deck-creation":
            nextStep = "investor-connection"
            break
          case "investor-connection":
            nextStep = "progress-tracking"
            break
          default:
            nextStep = "progress-tracking"
        }
      }

      return {
        ...prev,
        currentStep: nextStep,
        completedSteps: [...prev.completedSteps, prev.currentStep],
      }
    })
  }

  const earnLokaTokens = (amount, reason) => {
    setState((prev) => ({
      ...prev,
      lokaTokens: {
        ...prev.lokaTokens,
        available: prev.lokaTokens.available + amount,
        earnedFrom: [...prev.lokaTokens.earnedFrom, { amount, reason, date: new Date() }],
      },
    }))
  }

  const spendLokaTokens = (amount, service) => {
    setState((prev) => {
      if (prev.lokaTokens.available >= amount) {
        return {
          ...prev,
          lokaTokens: {
            ...prev.lokaTokens,
            available: prev.lokaTokens.available - amount,
            spent: prev.lokaTokens.spent + amount,
          },
          aiServicesUsed: {
            ...prev.aiServicesUsed,
            [service]: true,
          },
        }
      }
      return prev
    })
  }

  const updateSupportServices = (services) => {
    setState((prev) => ({
      ...prev,
      supportServices: { ...prev.supportServices, ...services },
    }))
  }

  const calculateProgress = () => {
    const totalSteps = Object.keys(state.stepDefinitions).length
    const completedCount = state.completedSteps.length
    return Math.round((completedCount / totalSteps) * 100)
  }

  const getCurrentStepInfo = () => {
    return state.stepDefinitions[state.currentStep] || {}
  }

  const getNextSteps = () => {
    const currentStepDef = state.stepDefinitions[state.currentStep]
    if (currentStepDef?.type === "decision") {
      return currentStepDef.options || []
    }
    return []
  }

  const canAccessStep = (stepName) => {
    const stepOrder = Object.keys(state.stepDefinitions)
    const currentIndex = stepOrder.indexOf(state.currentStep)
    const targetIndex = stepOrder.indexOf(stepName)
    return targetIndex <= currentIndex + 1
  }

  const resetProgress = () => {
    setState(initialState)
  }

  const setError = (field, error) => {
    setState((prev) => ({
      ...prev,
      errors: { ...prev.errors, [field]: error },
    }))
  }

  const clearError = (field) => {
    setState((prev) => {
      const newErrors = { ...prev.errors }
      delete newErrors[field]
      return { ...prev, errors: newErrors }
    })
  }

  const setLoading = (loading) => {
    setState((prev) => ({ ...prev, loading }))
  }

  const clearRedirectFlag = () => {
    console.log("🧹 Clearing redirect flag")
    setState((prev) => ({
      ...prev,
      shouldRedirect: false,
      nextStepToRedirect: null,
    }))
  }

  const getProgressSummary = () => {
    const totalSteps = Object.keys(state.stepDefinitions).length
    const completedCount = state.completedSteps.length
    const progressPercentage = Math.round((completedCount / totalSteps) * 100)

    const currentStepIndex = Object.keys(state.stepDefinitions).indexOf(state.currentStep)
    const stepKeys = Object.keys(state.stepDefinitions)
    const nextStep = currentStepIndex < stepKeys.length - 1 ? stepKeys[currentStepIndex + 1] : null

    return {
      currentStep: state.currentStep,
      completedStepsCount: completedCount,
      totalSteps: totalSteps,
      progressPercentage: progressPercentage,
      nextStep: nextStep,
      lokaTokensAvailable: state.lokaTokens.available,
      tokensSpent: state.lokaTokens.spent,
      currentPhase: state.currentPhase,
      achievements: state.achievements,
    }
  }

  const getLeaderboard = () => {
    return {
      totalFounders: 1247,
      validatedIdeas: 342,
      fundsRaised: 2.5,
      foundersWithGuidance: 856,
    }
  }

  const contextValue = {
    ...state,
    goToStep,
    makeDecision,
    completeStep,
    earnLokaTokens,
    spendLokaTokens,
    updateSupportServices,
    calculateProgress,
    getCurrentStepInfo,
    getNextSteps,
    canAccessStep,
    resetProgress,
    getProgressSummary,
    getLeaderboard,
    setError,
    clearError,
    setLoading,
    clearRedirectFlag,
  }

  return <ProgressContext.Provider value={contextValue}>{children}</ProgressContext.Provider>
}

export const useProgressContext = () => {
  const context = useContext(ProgressContext)
  if (!context) {
    throw new Error("useProgressContext must be used within a ProgressProvider")
  }
  return context
}

export default ProgressContext
