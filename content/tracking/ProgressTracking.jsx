"use client"

import { useState } from "react"
import { useProgressContext } from "../../contexts/ProgressContext"
import BackButton from "../../components/BackButton"

const ProgressTracking = ({ onComplete, onBack }) => {
  const { earnLokaTokens } = useProgressContext()
  const [trackingData, setTrackingData] = useState({
    userTraction: "",
    monthlyUsers: "",
    revenue: "",
    growthRate: "",
    keyMetrics: "",
  })

  const handleSubmit = () => {
    if (earnLokaTokens) {
      earnLokaTokens(30, "Completed progress tracking setup")
    }
    if (onComplete) {
      onComplete("dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <BackButton />
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Progress Tracking Setup</h1>
          <p className="text-gray-600 mb-8">Set up tracking for user traction, CRM portal, and proof of work</p>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current User Traction</label>
              <input
                type="text"
                value={trackingData.userTraction}
                onChange={(e) => setTrackingData({ ...trackingData, userTraction: e.target.value })}
                placeholder="e.g., 1000 active users, 500 signups"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Active Users</label>
              <input
                type="number"
                value={trackingData.monthlyUsers}
                onChange={(e) => setTrackingData({ ...trackingData, monthlyUsers: e.target.value })}
                placeholder="Number of monthly active users"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Revenue ($)</label>
              <input
                type="number"
                value={trackingData.revenue}
                onChange={(e) => setTrackingData({ ...trackingData, revenue: e.target.value })}
                placeholder="Monthly recurring revenue"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Growth Rate (%)</label>
              <input
                type="number"
                value={trackingData.growthRate}
                onChange={(e) => setTrackingData({ ...trackingData, growthRate: e.target.value })}
                placeholder="Monthly growth rate percentage"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Key Metrics & Proof of Work</label>
              <textarea
                value={trackingData.keyMetrics}
                onChange={(e) => setTrackingData({ ...trackingData, keyMetrics: e.target.value })}
                placeholder="Describe your key metrics, achievements, and proof of work..."
                className="w-full p-3 border border-gray-300 rounded-lg"
                rows={4}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">CRM Portal Integration</h3>
              <p className="text-blue-700 text-sm">
                We'll set up a smart traction tracking system to monitor your progress and provide insights for
                investors.
              </p>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg"
            >
              Complete Setup & Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProgressTracking
