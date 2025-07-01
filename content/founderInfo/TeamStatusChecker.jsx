"use client"

import { useFounderContext } from "../../contexts/FounderContext"
import { useProgressContext } from "../../contexts/ProgressContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Circle, Users, ArrowLeft } from "lucide-react"
import { useState } from "react"

const TeamStatusChecker = ({ onComplete, onBack }) => {
  const { cofounder, updateCofounder } = useFounderContext()
  const progressContext = useProgressContext()

  const [showTeamForm, setShowTeamForm] = useState(false)
  const [teamData, setTeamData] = useState({
    currentTeamSize: 1,
    lookingForRoles: [],
    teamMembers: [{ name: "", role: "", linkedin: "", skills: "" }],
  })

  const handleCofounderDecision = (needsCofounder) => {
    updateCofounder({ lookingForCofounder: needsCofounder })

    if (needsCofounder) {
      // Show team form instead of immediately completing
      setShowTeamForm(true)
    } else {
      // Solo founder - proceed to funding decision
      if (progressContext.makeDecision) {
        progressContext.makeDecision("needsCofounder", needsCofounder)
      }
      if (progressContext.earnLokaTokens) {
        progressContext.earnLokaTokens(15, "Completed team status check - solo founder")
      }
    }
  }

  const handleTeamFormSubmit = () => {
    updateCofounder({
      lookingForCofounder: true,
      currentTeamSize: teamData.currentTeamSize,
      lookingForRoles: teamData.lookingForRoles,
      teamMembers: teamData.teamMembers,
    })

    if (progressContext.makeDecision) {
      progressContext.makeDecision("needsCofounder", true)
    }
    if (progressContext.earnLokaTokens) {
      progressContext.earnLokaTokens(25, "Completed team details form")
    }

    // Show success message and then navigate
    setTimeout(() => {
      // Navigate to funding decision
      if (onComplete) {
        onComplete("funding-decision")
      }
    }, 2000)
  }

  const addTeamMember = () => {
    setTeamData({
      ...teamData,
      teamMembers: [...teamData.teamMembers, { name: "", role: "", linkedin: "", skills: "" }],
    })
  }

  const removeTeamMember = (index) => {
    if (teamData.teamMembers.length > 1) {
      const newMembers = teamData.teamMembers.filter((_, i) => i !== index)
      setTeamData({ ...teamData, teamMembers: newMembers })
    }
  }

  const updateTeamMember = (index, field, value) => {
    const newMembers = [...teamData.teamMembers]
    newMembers[index][field] = value
    setTeamData({ ...teamData, teamMembers: newMembers })
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              <div>
                <CardTitle>Do you need a co-founder?</CardTitle>
                <CardDescription>
                  Building a strong team is crucial for startup success. Let us know if you need help finding a
                  co-founder.
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
          {!showTeamForm && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Button
                variant={cofounder.lookingForCofounder === true ? "default" : "outline"}
                className="h-32 flex flex-col items-center gap-4 text-center"
                onClick={() => handleCofounderDecision(true)}
              >
                <div className="flex items-center gap-2">
                  {cofounder.lookingForCofounder === true ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <Circle className="h-6 w-6" />
                  )}
                  <span className="text-xl font-semibold">Yes, I need a co-founder</span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    I want to find a co-founder to complement my skills and share the journey
                  </p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Co-founder matching</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Skill assessment</span>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Portal access</span>
                  </div>
                </div>
              </Button>

              <Button
                variant={cofounder.lookingForCofounder === false ? "default" : "outline"}
                className="h-32 flex flex-col items-center gap-4 text-center"
                onClick={() => handleCofounderDecision(false)}
              >
                <div className="flex items-center gap-2">
                  {cofounder.lookingForCofounder === false ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <Circle className="h-6 w-6" />
                  )}
                  <span className="text-xl font-semibold">No, solo founder</span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    I prefer to work alone or already have my team in place
                  </p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Solo resources</span>
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Freelancer network</span>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Advisory support</span>
                  </div>
                </div>
              </Button>
            </div>
          )}

          {showTeamForm && (
            <div className="space-y-6 border-t pt-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-green-800 mb-2">🎉 Great! Let's build your team profile</h3>
                <p className="text-sm text-gray-600">
                  Tell us about your current team and what roles you're looking for
                </p>
              </div>

              {/* Current Team Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Team Size</label>
                <select
                  value={teamData.currentTeamSize}
                  onChange={(e) => setTeamData({ ...teamData, currentTeamSize: Number.parseInt(e.target.value) })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>Just me (1 person)</option>
                  <option value={2}>2 people</option>
                  <option value={3}>3 people</option>
                  <option value={4}>4 people</option>
                  <option value={5}>5+ people</option>
                </select>
              </div>

              {/* Roles Looking For */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What roles are you looking for? (Select all that apply)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "CTO/Technical Co-founder",
                    "CEO/Business Co-founder",
                    "CMO/Marketing Co-founder",
                    "CFO/Finance Co-founder",
                    "CPO/Product Co-founder",
                    "COO/Operations Co-founder",
                    "Head of Sales",
                    "Head of Design",
                    "Other",
                  ].map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        const newRoles = teamData.lookingForRoles.includes(role)
                          ? teamData.lookingForRoles.filter((r) => r !== role)
                          : [...teamData.lookingForRoles, role]
                        setTeamData({ ...teamData, lookingForRoles: newRoles })
                      }}
                      className={`p-3 text-sm border-2 rounded-lg transition ${
                        teamData.lookingForRoles.includes(role)
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
                {teamData.lookingForRoles.length > 0 && (
                  <p className="text-sm text-green-600 mt-2">
                    ✅ Selected {teamData.lookingForRoles.length} role{teamData.lookingForRoles.length > 1 ? "s" : ""}
                  </p>
                )}
              </div>

              {/* Current Team Members */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">Current Team Members</label>
                  <Button onClick={addTeamMember} variant="outline" size="sm" className="bg-transparent">
                    + Add Member
                  </Button>
                </div>

                <div className="space-y-4">
                  {teamData.teamMembers.map((member, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-gray-800">Team Member {index + 1}</h4>
                        {teamData.teamMembers.length > 1 && (
                          <Button
                            onClick={() => removeTeamMember(index)}
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            Remove
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={member.name}
                          onChange={(e) => updateTeamMember(index, "name", e.target.value)}
                          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="Role/Position"
                          value={member.role}
                          onChange={(e) => updateTeamMember(index, "role", e.target.value)}
                          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="url"
                          placeholder="LinkedIn Profile URL"
                          value={member.linkedin}
                          onChange={(e) => updateTeamMember(index, "linkedin", e.target.value)}
                          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="Key Skills (e.g., React, Marketing, Finance)"
                          value={member.skills}
                          onChange={(e) => updateTeamMember(index, "skills", e.target.value)}
                          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Summary */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <h4 className="font-semibold text-blue-800 mb-3">Team Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-blue-600 font-medium">Current Size</p>
                      <p className="text-blue-800">{teamData.currentTeamSize} people</p>
                    </div>
                    <div>
                      <p className="text-blue-600 font-medium">Looking For</p>
                      <p className="text-blue-800">
                        {teamData.lookingForRoles.length > 0
                          ? `${teamData.lookingForRoles.length} role${teamData.lookingForRoles.length > 1 ? "s" : ""}`
                          : "No roles selected"}
                      </p>
                    </div>
                    <div>
                      <p className="text-blue-600 font-medium">Team Members</p>
                      <p className="text-blue-800">
                        {teamData.teamMembers.filter((m) => m.name.trim()).length} detailed
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="text-center space-y-4">
                <Button
                  onClick={handleTeamFormSubmit}
                  disabled={teamData.lookingForRoles.length === 0}
                  className="w-full md:w-auto px-8 py-3"
                >
                  Complete Team Profile & Continue
                </Button>

                {teamData.lookingForRoles.length === 0 && (
                  <p className="text-sm text-red-500">Please select at least one role you're looking for</p>
                )}

                <p className="text-xs text-gray-500">
                  Next: We'll help you with funding decisions and connect you with our co-founder matching portal
                </p>
              </div>
            </div>
          )}

          {cofounder.lookingForCofounder !== null && !showTeamForm && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-center">
                ✅ Perfect!{" "}
                {cofounder.lookingForCofounder
                  ? "We'll connect you with our co-founder portal to find the right match"
                  : "We'll provide solo founder resources and support"}
                . (+15 Loka Tokens earned!)
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default TeamStatusChecker
