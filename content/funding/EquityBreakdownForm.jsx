"use client"

import { useState } from "react"
import { useFunding } from "../../contexts/FundingContext"
import { useProgress } from "../../contexts/ProgressContext"
import BackButton from "../../components/BackButton"

export default function EquityBreakdownForm() {
  const { state, dispatch: fundingDispatch } = useFunding()
  const { dispatch: progressDispatch } = useProgress()
  const [equity, setEquity] = useState({
    founders: "",
    employees: "",
    investors: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const total =
      Number.parseInt(equity.founders) + Number.parseInt(equity.employees) + Number.parseInt(equity.investors)

    if (total === 100) {
      fundingDispatch({ type: "UPDATE_EQUITY_BREAKDOWN", payload: equity })
      progressDispatch({ type: "ADD_COMPLETED_STEP", payload: "equity-breakdown" })
      progressDispatch({ type: "SET_CURRENT_STEP", payload: "pitch-deck" })
    } else {
      alert("Equity percentages must add up to 100%")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Equity Breakdown</h1>
          <p className="text-gray-600 mb-8">Define how equity will be distributed in your startup.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Founders Equity (%)</label>
              <input
                type="number"
                value={equity.founders}
                onChange={(e) => setEquity({ ...equity, founders: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., 70"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employee Pool (%)</label>
              <input
                type="number"
                value={equity.employees}
                onChange={(e) => setEquity({ ...equity, employees: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., 15"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Investor Pool (%)</label>
              <input
                type="number"
                value={equity.investors}
                onChange={(e) => setEquity({ ...equity, investors: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., 15"
                required
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200"
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
