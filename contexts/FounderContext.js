"use client"

import { createContext, useContext, useState } from "react"

// Initial state for founder context
const initialState = {
  founder: {
    id: null,
    name: "",
    email: "",
    type: "", // "individual" | "team"
    experience: "", // "first-time" | "experienced"
    stage: "", // "early-stage" | "running" | "profitable" | "bootstrapped"
    isFirstTime: null, // true | false | null
  },
  startup: {
    hasIdea: null, // true | false | null
    ideaDescription: "",
    domain: "", // Selected domain
    stage: "", // "ideation" | "mvp" | "launched" | "scaling"
    hasTeam: null, // true | false | null
    teamSize: 0,
    needsFunding: null, // true | false | null
    fundingAmount: "",
    companyRegistered: null, // true | false | null
    registrationDetails: {
      companyName: "",
      registrationNumber: "",
      companyType: "",
      incorporationDate: "",
      registeredAddress: "",
      businessAddress: "",
      panNumber: "",
      authorizedCapital: "",
      paidUpCapital: "",
      documents: {},
    },
  },
  cofounder: {
    lookingForCofounder: null, // true | false | null
    skills: [],
    experience: "",
  },
  progress: {
    currentStep: "dashboard",
    completedSteps: [],
    totalSteps: 10,
    progressPercentage: 0,
  },
  tokens: {
    available: 100, // Starting tokens
    earned: 0,
    spent: 0,
    history: [],
  },
  errors: {},
  loading: false,
}

// Context
const FounderContext = createContext()

// Provider component
export const FounderProvider = ({ children }) => {
  const [state, setState] = useState(initialState)

  // Update founder info
  const updateFounder = (updates) => {
    console.log("🔄 Updating founder:", updates)
    setState((prev) => ({
      ...prev,
      founder: { ...prev.founder, ...updates },
    }))
  }

  // Update startup info
  const updateStartup = (updates) => {
    console.log("🚀 Updating startup:", updates)
    setState((prev) => ({
      ...prev,
      startup: { ...prev.startup, ...updates },
    }))
  }

  // Update cofounder info
  const updateCofounder = (updates) => {
    console.log("👥 Updating cofounder:", updates)
    setState((prev) => ({
      ...prev,
      cofounder: { ...prev.cofounder, ...updates },
    }))
  }

  // Update progress
  const updateProgress = (step, completed = true) => {
    console.log("📈 Updating progress:", step, completed)
    setState((prev) => {
      const newCompletedSteps = completed
        ? [...new Set([...prev.progress.completedSteps, step])]
        : prev.progress.completedSteps.filter((s) => s !== step)

      const progressPercentage = (newCompletedSteps.length / prev.progress.totalSteps) * 100

      return {
        ...prev,
        progress: {
          ...prev.progress,
          currentStep: step,
          completedSteps: newCompletedSteps,
          progressPercentage: Math.round(progressPercentage),
        },
      }
    })
  }

  // Earn tokens
  const earnTokens = (amount, reason) => {
    console.log("🪙 Earning tokens:", amount, reason)
    setState((prev) => ({
      ...prev,
      tokens: {
        ...prev.tokens,
        available: prev.tokens.available + amount,
        earned: prev.tokens.earned + amount,
        history: [
          ...prev.tokens.history,
          {
            type: "earned",
            amount,
            reason,
            timestamp: new Date(),
            id: Date.now(),
          },
        ],
      },
    }))
  }

  // Spend tokens
  const spendTokens = (amount, reason) => {
    console.log("💸 Spending tokens:", amount, reason)
    setState((prev) => {
      if (prev.tokens.available >= amount) {
        return {
          ...prev,
          tokens: {
            ...prev.tokens,
            available: prev.tokens.available - amount,
            spent: prev.tokens.spent + amount,
            history: [
              ...prev.tokens.history,
              {
                type: "spent",
                amount,
                reason,
                timestamp: new Date(),
                id: Date.now(),
              },
            ],
          },
        }
      }
      return prev
    })
  }

  // Get founder summary for dashboard
  const getFounderSummary = () => {
    return {
      name: state.founder.name || "Anonymous Founder",
      type: state.founder.type || "Not specified",
      experience: state.founder.experience || "Not specified",
      stage: state.founder.stage || "Not specified",
      isFirstTime: state.founder.isFirstTime,
      hasIdea: state.startup.hasIdea,
      domain: state.startup.domain || "Not selected",
      hasTeam: state.startup.hasTeam,
      needsFunding: state.startup.needsFunding,
      companyRegistered: state.startup.companyRegistered,
      progressPercentage: state.progress.progressPercentage,
      completedSteps: state.progress.completedSteps.length,
      totalSteps: state.progress.totalSteps,
      tokensAvailable: state.tokens.available,
      tokensEarned: state.tokens.earned,
      currentStep: state.progress.currentStep,
      lookingForCofounder: state.cofounder.lookingForCofounder,
      hasBasicInfo: !!(state.founder.name && state.founder.email),
    }
  }

  // Get startup summary
  const getStartupSummary = () => {
    return {
      hasIdea: state.startup.hasIdea,
      ideaDescription: state.startup.ideaDescription,
      domain: state.startup.domain,
      stage: state.startup.stage,
      hasTeam: state.startup.hasTeam,
      teamSize: state.startup.teamSize,
      needsFunding: state.startup.needsFunding,
      fundingAmount: state.startup.fundingAmount,
      companyRegistered: state.startup.companyRegistered,
    }
  }

  // Error management
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

  // Reset all data
  const resetFounder = () => {
    setState(initialState)
  }

  const contextValue = {
    // State
    ...state,
    // Actions
    updateFounder,
    updateStartup,
    updateCofounder,
    updateProgress,
    earnTokens,
    spendTokens,
    getFounderSummary,
    getStartupSummary,
    // Error Management
    setError,
    clearError,
    setLoading,
    resetFounder,
  }

  return <FounderContext.Provider value={contextValue}>{children}</FounderContext.Provider>
}

// Custom hook
export const useFounderContext = () => {
  const context = useContext(FounderContext)
  if (!context) {
    throw new Error("useFounderContext must be used within a FounderProvider")
  }
  return context
}

export default FounderContext
