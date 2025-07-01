"use client"

import { createContext, useContext, useState } from "react"

const initialState = {
  // Basic funding info
  needsFunding: null,
  category: "",
  amount: "",
  timeline: "",
  useOfFunds: "",

  // Company registration status
  isRegistered: null,
  showCompanyRegistration: false,

  // Company details (for registered companies)
  companyDetails: {
    name: "",
    registrationNumber: "",
    incorporationDate: "",
    companyType: "",
    registeredAddress: "",
    operationalAddress: "",
    panNumber: "",
    gstNumber: "",
    authorizedCapital: "",
    paidUpCapital: "",
    directors: [],
    shareholders: [],
  },

  // Document uploads
  documents: {
    certificateOfIncorporation: null,
    memorandumOfAssociation: null,
    articlesOfAssociation: null,
    panCard: null,
    gstCertificate: null,
    bankStatement: null,
    auditedFinancials: null,
    boardResolution: null,
    shareholderAgreement: null,
    complianceCertificate: null,
  },

  // Form state
  currentStep: 1,
  completedSteps: [],
  errors: {},
  loading: false,
}

const FundingContext = createContext()

export const FundingProvider = ({ children }) => {
  const [state, setState] = useState(initialState)

  const updateFunding = (updates) => {
    console.log("FundingContext: updateFunding called with:", updates)
    setState((prev) => {
      const newState = { ...prev, ...updates }
      console.log("FundingContext: New state:", newState)
      return newState
    })
  }

  const updateCompanyDetails = (updates) => {
    console.log("FundingContext: updateCompanyDetails called with:", updates)
    setState((prev) => ({
      ...prev,
      companyDetails: { ...prev.companyDetails, ...updates },
    }))
  }

  const updateDocument = (documentType, file) => {
    console.log("FundingContext: updateDocument called:", documentType, file)
    setState((prev) => ({
      ...prev,
      documents: { ...prev.documents, [documentType]: file },
    }))
  }

  const setCurrentStep = (step) => {
    setState((prev) => ({ ...prev, currentStep: step }))
  }

  const markStepCompleted = (step) => {
    setState((prev) => ({
      ...prev,
      completedSteps: [...new Set([...prev.completedSteps, step])],
    }))
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

  const getFundingSummary = () => {
    return {
      needsFunding: state.needsFunding,
      category: state.category,
      amount: state.amount,
      timeline: state.timeline,
      isRegistered: state.isRegistered,
      showCompanyRegistration: state.showCompanyRegistration,
      currentStep: state.currentStep,
      completedSteps: state.completedSteps,
      documentsUploaded: Object.values(state.documents).filter(Boolean).length,
      totalDocuments: Object.keys(state.documents).length,
    }
  }

  const resetFundingData = () => {
    setState(initialState)
  }

  const contextValue = {
    // State
    ...state,
    // Update Methods
    updateFunding,
    updateCompanyDetails,
    updateDocument,
    setCurrentStep,
    markStepCompleted,
    // Error Management
    setError,
    clearError,
    setLoading,
    // Utility Methods
    getFundingSummary,
    resetFundingData,
  }

  return <FundingContext.Provider value={contextValue}>{children}</FundingContext.Provider>
}

export const useFundingContext = () => {
  const context = useContext(FundingContext)
  if (!context) {
    throw new Error("useFundingContext must be used within a FundingProvider")
  }
  return context
}
