"use client"

import { useState } from "react"
import { useFounder } from "../../contexts/FounderContext"
import { useProgress } from "../../contexts/ProgressContext"
import BackButton from "../../components/BackButton"

export default function AllIdeaGenerator() {
  const { dispatch } = useFounder()
  const { dispatch: progressDispatch } = useProgress()
  const [selectedDomain, setSelectedDomain] = useState("")
  const [generatedIdeas, setGeneratedIdeas] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)

  const domains = [
    "FinTech",
    "HealthTech",
    "EdTech",
    "E-commerce",
    "SaaS",
    "AI/ML",
    "Blockchain",
    "IoT",
    "CleanTech",
    "FoodTech",
  ]

  const ideaTemplates = {
    FinTech: [
      "AI-powered personal finance advisor",
      "Micro-investment platform for beginners",
      "Blockchain-based remittance service",
    ],
    HealthTech: [
      "Telemedicine platform for rural areas",
      "AI diagnostic tool for early disease detection",
      "Mental health support app with peer connections",
    ],
    EdTech: [
      "Personalized learning platform using AI",
      "Virtual reality training for technical skills",
      "Gamified coding education for kids",
    ],
  }

  const generateIdeas = () => {
    if (!selectedDomain) return

    setIsGenerating(true)
    setTimeout(() => {
      const ideas = ideaTemplates[selectedDomain] || [
        `${selectedDomain} solution for small businesses`,
        `AI-powered ${selectedDomain} platform`,
        `Mobile-first ${selectedDomain} application`,
      ]
      setGeneratedIdeas(ideas)
      setIsGenerating(false)
    }, 1500)
  }

  const selectIdea = (idea) => {
    dispatch({ type: "SET_IDEA_DESCRIPTION", payload: idea })
    dispatch({ type: "SET_DOMAIN", payload: selectedDomain })
    dispatch({ type: "SET_HAS_IDEA", payload: true })

    // Add navigation to next step
    setTimeout(() => {
      progressDispatch({ type: "ADD_COMPLETED_STEP", payload: "idea-generation" })
      progressDispatch({ type: "SET_CURRENT_STEP", payload: "domain-selector" })
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">AI Idea Generator</h1>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Domain</label>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Choose a domain...</option>
              {domains.map((domain) => (
                <option key={domain} value={domain}>
                  {domain}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={generateIdeas}
            disabled={!selectedDomain || isGenerating}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 mb-6"
          >
            {isGenerating ? "Generating Ideas..." : "Generate Ideas"}
          </button>

          {generatedIdeas.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Generated Ideas:</h2>
              {generatedIdeas.map((idea, index) => (
                <div key={index} className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <p className="text-gray-800 mb-3">{idea}</p>
                  <button
                    onClick={() => selectIdea(idea)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm transition duration-200"
                  >
                    Select This Idea
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
