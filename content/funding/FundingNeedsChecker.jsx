"use client"

import { useState } from "react"
import { useFunding } from "../../contexts/FundingContext"
import { useProgress } from "../../contexts/ProgressContext"
import BackButton from "../../components/BackButton"

export default function FundingNeedsChecker() {
  const { dispatch: fundingDispatch } = useFunding()
  const { dispatch: progressDispatch } = useProgress()
  const [needsFunding, setNeedsFunding] = useState(null)

  const handleFundingDecision = (needs) => {
    setNeedsFunding(needs)
    fundingDispatch({ type: "SET_NEEDS_FUNDING", payload: needs })

    setTimeout(() => {
      progressDispatch({ type: "ADD_COMPLETED_STEP", payload: "funding-needs" })
      if (needs) {
        // If they need funding, go to funding form
        progressDispatch({ type: "SET_CURRENT_STEP", payload: "funding-form" })
      } else {
        // If they don't need funding, skip to file upload or mentorship
        progressDispatch({ type: "SET_CURRENT_STEP", payload: "file-upload" })
      }
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Do you need funding?</h1>
          <p className="text-gray-600 mb-8 text-center">
            Let us know if you're looking to raise capital for your startup.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div
              onClick={() => handleFundingDecision(true)}
              className={`p-8 rounded-lg border-2 cursor-pointer transition duration-200 text-center ${
                needsFunding === true
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="text-4xl mb-4">💰</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Yes - I need funding</h2>
              <p className="text-gray-600">
                I'm looking to raise capital to grow my startup and need help with the funding process.
              </p>
            </div>

            <div
              onClick={() => handleFundingDecision(false)}
              className={`p-8 rounded-lg border-2 cursor-pointer transition duration-200 text-center ${
                needsFunding === false
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="text-4xl mb-4">🚀</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">No - I'm bootstrapping</h2>
              <p className="text-gray-600">
                I'm self-funding my startup or don't need external investment at this time.
              </p>
            </div>
          </div>

          {needsFunding === true && (
            <div className="mt-8 p-6 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Funding Support</h3>
              <p className="text-green-700 text-sm">
                We'll help you prepare for fundraising, connect with investors, and guide you through the process.
              </p>
            </div>
          )}

          {needsFunding === false && (
            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Bootstrap Support</h3>
              <p className="text-blue-700 text-sm">
                We'll provide resources for growing your startup without external funding.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
