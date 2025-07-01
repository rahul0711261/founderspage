"use client"

import { useFounderContext } from "../../contexts/FounderContext"
import { useProgressContext } from "../../contexts/ProgressContext"
import BackButton from "../../components/BackButton"

const StartupStageSelector = ({ onComplete, onBack }) => {
  const { startup, updateStartup } = useFounderContext()
  const progressContext = useProgressContext()

  const stages = [
    { id: "early-stage", title: "Early Stage", description: "X amount of users, building initial traction" },
    { id: "running", title: "Running (Loss)", description: "Active business but not yet profitable" },
    { id: "profitable", title: "Profitable", description: "Generating consistent profits" },
    { id: "bootstrapped", title: "Bootstrapped", description: "Self-funded and sustainable growth" },
  ]

  const handleStageSelect = (stageId) => {
    updateStartup({ stage: stageId })
    if (progressContext.makeDecision) {
      progressContext.makeDecision("startupStage", stageId)
    }
    if (progressContext.earnLokaTokens) {
      progressContext.earnLokaTokens(15, "Selected startup stage")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <BackButton />
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Startup Stage Selection</h1>
          <p className="text-gray-600 mb-8">What stage is your startup currently in?</p>

          <div className="space-y-4">
            {stages.map((stage) => (
              <div
                key={stage.id}
                onClick={() => handleStageSelect(stage.id)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                  startup.stage === stage.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <h3 className="font-semibold text-gray-800">{stage.title}</h3>
                <p className="text-sm text-gray-600">{stage.description}</p>
              </div>
            ))}
          </div>

          {startup.stage && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">✅ Stage selected! Moving to funding decision...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StartupStageSelector
