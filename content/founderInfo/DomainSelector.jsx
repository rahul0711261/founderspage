"use client"

import { useFounderContext } from "../../contexts/FounderContext"
import { useProgressContext } from "../../contexts/ProgressContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, ArrowLeft } from "lucide-react"

const DomainSelector = ({ onComplete, onBack }) => {
  const { startup, updateStartup } = useFounderContext()
  const progressContext = useProgressContext()

  const domains = [
    {
      id: "AI",
      title: "Artificial Intelligence",
      description: "Machine learning, automation, intelligent systems",
      icon: "🤖",
      examples: ["ChatGPT alternatives", "AI analytics", "Computer vision"],
      trending: true,
    },
    {
      id: "Web3",
      title: "Web3 & Blockchain",
      description: "Decentralized applications, crypto, NFTs",
      icon: "⛓️",
      examples: ["DeFi platforms", "NFT marketplaces", "Crypto wallets"],
      trending: true,
    },
    {
      id: "Fintech",
      title: "Financial Technology",
      description: "Digital payments, banking, financial services",
      icon: "💳",
      examples: ["Payment gateways", "Digital banking", "Investment platforms"],
      trending: false,
    },
    {
      id: "B2B",
      title: "Business to Business",
      description: "Enterprise solutions, SaaS, productivity tools",
      icon: "🏢",
      examples: ["CRM systems", "Project management", "HR solutions"],
      trending: false,
    },
    {
      id: "C4S",
      title: "Consumer for Social",
      description: "Social platforms, community apps, consumer products",
      icon: "👥",
      examples: ["Social networks", "Community platforms", "Consumer apps"],
      trending: false,
    },
    {
      id: "Other",
      title: "Other Domain",
      description: "Healthcare, education, e-commerce, etc.",
      icon: "🌟",
      examples: ["HealthTech", "EdTech", "E-commerce"],
      trending: false,
    },
  ]

  const handleDomainSelect = (domainId) => {
    console.log("🎯 Domain selected:", domainId)

    // Update founder context
    updateStartup({ domain: domainId })

    // Make decision in progress context - this should trigger navigation
    if (progressContext.makeDecision) {
      progressContext.makeDecision("selectedDomain", domainId)
    }

    // Earn tokens
    if (progressContext.earnLokaTokens) {
      progressContext.earnLokaTokens(20, "Selected startup domain")
    }

    console.log("✅ Domain selection complete, should redirect to AI idea generator")
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Which domain interests you?</CardTitle>
              <CardDescription>
                {startup.hasIdea
                  ? "Select the domain that best fits your startup idea"
                  : "Choose a domain to explore startup opportunities and get AI-generated ideas"}
              </CardDescription>
            </div>
            {onBack && (
              <Button variant="outline" size="sm" onClick={onBack} className="flex items-center gap-2 bg-transparent">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {domains.map((domain) => (
          <Card
            key={domain.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              startup.domain === domain.id ? "ring-2 ring-primary" : ""
            }`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{domain.icon}</span>
                  <div>
                    <CardTitle className="text-lg">{domain.title}</CardTitle>
                    {domain.trending && (
                      <Badge variant="secondary" className="text-xs">
                        Trending
                      </Badge>
                    )}
                  </div>
                </div>
                {startup.domain === domain.id ? (
                  <CheckCircle className="h-6 w-6 text-primary" />
                ) : (
                  <Circle className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{domain.description}</p>
              <div className="space-y-2">
                <p className="text-xs font-medium">Popular examples:</p>
                <div className="flex flex-wrap gap-1">
                  {domain.examples.map((example, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {example}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button
                className="w-full mt-4"
                variant={startup.domain === domain.id ? "default" : "outline"}
                onClick={() => handleDomainSelect(domain.id)}
              >
                {startup.domain === domain.id ? "Selected" : "Select Domain"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {startup.domain && (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm">
                ✅ Great choice! You've selected <strong>{domains.find((d) => d.id === startup.domain)?.title}</strong>
              </p>
              <p className="text-xs text-muted-foreground">
                +20 Loka Tokens earned!
                {startup.hasIdea === false && " Next: AI-powered idea generation"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default DomainSelector
