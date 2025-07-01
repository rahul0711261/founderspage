"use client"

import { useState } from "react"
import { useProgressContext } from "../../contexts/ProgressContext"
import BackButton from "../../components/BackButton"

const InvestorConnection = ({ onComplete, onBack }) => {
  const { earnLokaTokens } = useProgressContext()
  const [selectedDomains, setSelectedDomains] = useState([])
  const [selectedInvestors, setSelectedInvestors] = useState([])

  const domains = ["AI/ML", "Web3/B2B", "Fintech", "C4S"]

  const investors = {
    "AI/ML": [
      { name: "TechVentures AI", focus: "Early-stage AI startups", ticket: "$100K-$500K" },
      { name: "Neural Capital", focus: "ML and automation", ticket: "$250K-$1M" },
      { name: "AI Seed Fund", focus: "AI applications", ticket: "$50K-$300K" },
    ],
    "Web3/B2B": [
      { name: "Blockchain Ventures", focus: "Web3 infrastructure", ticket: "$200K-$800K" },
      { name: "Crypto Capital", focus: "DeFi and NFT", ticket: "$100K-$600K" },
      { name: "Decentralized Fund", focus: "Web3 applications", ticket: "$150K-$500K" },
    ],
    Fintech: [
      { name: "FinTech Partners", focus: "Financial services", ticket: "$300K-$1M" },
      { name: "Payment Ventures", focus: "Payment solutions", ticket: "$200K-$700K" },
      { name: "Banking Innovation", focus: "Digital banking", ticket: "$250K-$900K" },
    ],
    C4S: [
      { name: "Consumer Fund", focus: "Consumer apps", ticket: "$150K-$600K" },
      { name: "Social Ventures", focus: "Social platforms", ticket: "$100K-$500K" },
      { name: "Community Capital", focus: "Community-driven", ticket: "$200K-$800K" },
    ],
  }

  const handleDomainSelect = (domain) => {
    if (selectedDomains.includes(domain)) {
      setSelectedDomains(selectedDomains.filter((d) => d !== domain))
    } else {
      setSelectedDomains([...selectedDomains, domain])
    }
  }

  const handleInvestorSelect = (investor) => {
    if (selectedInvestors.includes(investor.name)) {
      setSelectedInvestors(selectedInvestors.filter((i) => i !== investor.name))
    } else {
      setSelectedInvestors([...selectedInvestors, investor.name])
    }
  }

  const handleSubmit = () => {
    if (earnLokaTokens) {
      earnLokaTokens(40, "Connected with investors")
    }
    if (onComplete) {
      onComplete("progress-tracking")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <BackButton />
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Connect with Investors</h1>
          <p className="text-gray-600 mb-8">
            Select domains and connect with investors who love to invest in your area
          </p>

          {/* Domain Selection */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Select Your Domain(s)</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {domains.map((domain) => (
                <button
                  key={domain}
                  onClick={() => handleDomainSelect(domain)}
                  className={`p-4 border-2 rounded-lg text-center ${
                    selectedDomains.includes(domain)
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {domain}
                </button>
              ))}
            </div>
          </div>

          {/* Investor List */}
          {selectedDomains.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Available Investors</h2>
              <div className="space-y-4">
                {selectedDomains.map((domain) => (
                  <div key={domain}>
                    <h3 className="font-medium text-blue-600 mb-3">{domain} Investors</h3>
                    <div className="grid gap-4">
                      {investors[domain]?.map((investor) => (
                        <div
                          key={investor.name}
                          onClick={() => handleInvestorSelect(investor)}
                          className={`p-4 border-2 rounded-lg cursor-pointer ${
                            selectedInvestors.includes(investor.name)
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{investor.name}</h4>
                              <p className="text-sm text-gray-600">{investor.focus}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-green-600">{investor.ticket}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit */}
          {selectedInvestors.length > 0 && (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Selected {selectedInvestors.length} investor{selectedInvestors.length > 1 ? "s" : ""}
              </p>
              <button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg"
              >
                Connect with Selected Investors
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InvestorConnection
