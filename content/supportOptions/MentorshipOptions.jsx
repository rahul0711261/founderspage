"use client"

import { useState } from "react"
import { useProgressContext } from "../../contexts/ProgressContext"
import BackButton from "../../components/BackButton"

const MentorshipOptions = ({ onComplete, onBack }) => {
  const { earnLokaTokens } = useProgressContext()
  const [selectedServices, setSelectedServices] = useState([])

  const services = [
    {
      id: "ai-chatbot",
      title: "AI Chatbot for Help",
      description: "24/7 AI assistant for startup guidance",
      cost: "Free",
    },
    {
      id: "mentorship",
      title: "Mentorship - Connect with Mentors",
      description: "Get paired with experienced entrepreneurs",
      cost: "10 Loka Tokens/month",
    },
    {
      id: "legal",
      title: "Legalities - Connect with Legal Team",
      description: "Professional legal support and compliance",
      cost: "15 Loka Tokens/session",
    },
    {
      id: "auditing",
      title: "Auditing - Connect with Finance Team",
      description: "Financial auditing and accounting support",
      cost: "20 Loka Tokens/session",
    },
    {
      id: "exit-planning",
      title: "List Startup - Exit Planning Team",
      description: "Strategic guidance for IPO or acquisition",
      cost: "25 Loka Tokens/session",
    },
  ]

  const handleServiceToggle = (serviceId) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter((s) => s !== serviceId))
    } else {
      setSelectedServices([...selectedServices, serviceId])
    }
  }

  const handleSubmit = () => {
    if (earnLokaTokens) {
      earnLokaTokens(20, "Selected support services")
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
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Beyond Funding - What Help You Need</h1>
          <p className="text-gray-600 mb-8">
            Select the support services that will help accelerate your startup journey
          </p>

          <div className="space-y-4 mb-8">
            {services.map((service) => (
              <div
                key={service.id}
                onClick={() => handleServiceToggle(service.id)}
                className={`p-6 border-2 rounded-lg cursor-pointer transition ${
                  selectedServices.includes(service.id)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-2">{service.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{service.cost}</span>
                  </div>
                  <div className="ml-4">
                    {selectedServices.includes(service.id) ? (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                    ) : (
                      <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center space-y-4">
            {selectedServices.length > 0 && (
              <p className="text-sm text-gray-600">
                Selected {selectedServices.length} service{selectedServices.length > 1 ? "s" : ""}
              </p>
            )}

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => onComplete && onComplete("dashboard")}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg"
              >
                Skip for Now
              </button>

              {selectedServices.length > 0 && (
                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
                >
                  Confirm Selection
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MentorshipOptions
