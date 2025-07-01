"use client"

import { useState } from "react"
import { useFundingContext } from "../../contexts/FundingContext"
import { useProgressContext } from "../../contexts/ProgressContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, DollarSign, TrendingUp } from "lucide-react"

const FundingForm = ({ onComplete, onBack }) => {
  const { needsFunding, category, amount, updateFunding } = useFundingContext()
  const { earnLokaTokens, makeDecision } = useProgressContext()

  const [currentStep, setCurrentStep] = useState(needsFunding === null ? 1 : 2)
  const [localState, setLocalState] = useState({
    category: category || "",
    amount: amount || "",
    timeline: "",
    useOfFunds: "",
    equityToOffer: "",
    currentValuation: "",
    previousFunding: "",
    investorType: "",
  })

  const handleFundingNeedChange = (needs) => {
    updateFunding({ needsFunding: needs })
    if (needs && earnLokaTokens) {
      earnLokaTokens(15, "Selected funding need")
    }

    if (needs) {
      setCurrentStep(2) // Go to funding details
    } else {
      // No funding needed, complete the flow
      if (makeDecision) {
        makeDecision("needsFunding", false)
      }
      setTimeout(() => {
        if (onComplete) onComplete("mentorship-options")
      }, 1000)
    }
  }

  const handleSubmit = () => {
    updateFunding(localState)
    if (earnLokaTokens) {
      earnLokaTokens(35, "Completed funding application with equity details")
    }
    if (makeDecision) {
      makeDecision("fundingComplete", true)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-6 w-6" />
              <div>
                <CardTitle>Funding Requirements</CardTitle>
                <CardDescription>
                  {currentStep === 1 ? "Do you need funding for your startup?" : "Tell us about your funding needs"}
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
          {/* Step 1: Funding Need Decision */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Button
                  variant="outline"
                  className="h-32 flex flex-col items-center gap-4 text-center hover:border-green-300 hover:bg-green-50 bg-transparent"
                  onClick={() => handleFundingNeedChange(true)}
                >
                  <div className="text-4xl">💰</div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Yes - I need funding</h3>
                    <p className="text-sm text-gray-600">I'm looking to raise capital for my startup</p>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-32 flex flex-col items-center gap-4 text-center hover:border-blue-300 hover:bg-blue-50 bg-transparent"
                  onClick={() => handleFundingNeedChange(false)}
                >
                  <div className="text-4xl">🚀</div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">No - I'm bootstrapping</h3>
                    <p className="text-sm text-gray-600">I'm self-funding or don't need external investment</p>
                  </div>
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Funding Details Form */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Funding Stage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Funding Stage *</label>
                <select
                  value={localState.category}
                  onChange={(e) => setLocalState({ ...localState, category: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select funding stage...</option>
                  <option value="pre-seed">Pre-Seed ($10K - $250K)</option>
                  <option value="seed">Seed ($250K - $2M)</option>
                  <option value="series-a">Series A ($2M - $15M)</option>
                  <option value="series-b">Series B ($15M - $50M)</option>
                  <option value="series-c">Series C ($50M+)</option>
                </select>
              </div>

              {/* Amount Needed */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount Needed *</label>
                <Input
                  type="text"
                  value={localState.amount}
                  onChange={(e) => setLocalState({ ...localState, amount: e.target.value })}
                  placeholder="e.g., $500,000"
                  className="w-full"
                  required
                />
              </div>

              {/* Equity to Offer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equity to Offer (%) *
                  <span className="text-xs text-gray-500 ml-1">- How much equity are you willing to give up?</span>
                </label>
                <Input
                  type="number"
                  value={localState.equityToOffer}
                  onChange={(e) => setLocalState({ ...localState, equityToOffer: e.target.value })}
                  placeholder="e.g., 15"
                  min="1"
                  max="49"
                  className="w-full"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Typical ranges: Pre-seed (10-20%), Seed (15-25%), Series A (20-30%)
                </p>
              </div>

              {/* Current Valuation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Valuation (Pre-money)
                  <span className="text-xs text-gray-500 ml-1">- What do you think your company is worth?</span>
                </label>
                <Input
                  type="text"
                  value={localState.currentValuation}
                  onChange={(e) => setLocalState({ ...localState, currentValuation: e.target.value })}
                  placeholder="e.g., $2,000,000"
                  className="w-full"
                />
              </div>

              {/* Timeline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timeline *</label>
                <select
                  value={localState.timeline}
                  onChange={(e) => setLocalState({ ...localState, timeline: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select timeline...</option>
                  <option value="immediate">Immediately (0-1 month)</option>
                  <option value="3-months">Within 3 months</option>
                  <option value="6-months">Within 6 months</option>
                  <option value="12-months">Within 12 months</option>
                </select>
              </div>

              {/* Previous Funding */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Previous Funding Raised</label>
                <Input
                  type="text"
                  value={localState.previousFunding}
                  onChange={(e) => setLocalState({ ...localState, previousFunding: e.target.value })}
                  placeholder="e.g., $100,000 (or 'None' if first time)"
                  className="w-full"
                />
              </div>

              {/* Investor Type Preference */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Investor Type</label>
                <select
                  value={localState.investorType}
                  onChange={(e) => setLocalState({ ...localState, investorType: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select investor type...</option>
                  <option value="angel">Angel Investors</option>
                  <option value="vc">Venture Capital Firms</option>
                  <option value="strategic">Strategic Investors</option>
                  <option value="family-office">Family Offices</option>
                  <option value="crowdfunding">Crowdfunding</option>
                  <option value="any">Open to any type</option>
                </select>
              </div>

              {/* Use of Funds */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Use of Funds *</label>
                <Textarea
                  value={localState.useOfFunds}
                  onChange={(e) => setLocalState({ ...localState, useOfFunds: e.target.value })}
                  placeholder="Describe how you plan to use the funding (e.g., product development, marketing, hiring, etc.)"
                  className="min-h-[100px]"
                  required
                />
              </div>

              {/* Funding Summary Card */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-800">Funding Summary</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-blue-600 font-medium">Amount</p>
                      <p className="text-blue-800">{localState.amount || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-blue-600 font-medium">Equity</p>
                      <p className="text-blue-800">
                        {localState.equityToOffer ? `${localState.equityToOffer}%` : "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-blue-600 font-medium">Stage</p>
                      <p className="text-blue-800">{localState.category || "Not specified"}</p>
                    </div>
                  </div>
                  {localState.currentValuation && (
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <p className="text-xs text-blue-600">Pre-money valuation: {localState.currentValuation}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setCurrentStep(1)} className="bg-transparent">
                  Back to Decision
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={
                    !localState.category ||
                    !localState.amount ||
                    !localState.timeline ||
                    !localState.useOfFunds ||
                    !localState.equityToOffer
                  }
                  className="flex-1"
                >
                  Continue to Pitch Deck Creation
                </Button>
              </div>

              {(!localState.category ||
                !localState.amount ||
                !localState.timeline ||
                !localState.useOfFunds ||
                !localState.equityToOffer) && (
                <p className="text-sm text-red-500 text-center">Please fill in all required fields to continue</p>
              )}
            </div>
          )}

          {/* No Funding Selected */}
          {needsFunding === false && (
            <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="font-semibold text-blue-800 mb-2">Bootstrapping Journey</h3>
              <p className="text-blue-700 text-sm mb-4">
                Great choice! We'll provide resources and support for growing your startup without external funding.
              </p>
              <p className="text-xs text-blue-600">Moving to support services...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default FundingForm
