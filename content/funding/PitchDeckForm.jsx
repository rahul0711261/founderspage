"use client"

import { useState } from "react"
import { useProgressContext } from "../../contexts/ProgressContext"
import BackButton from "../../components/BackButton"

const PitchDeckForm = ({ onComplete, onBack }) => {
  const { earnLokaTokens } = useProgressContext()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Basic Info
    companyName: "",
    tagline: "",
    website: "",

    // Founders
    founders: [{ name: "", role: "", equity: "", linkedin: "", github: "" }],

    // Milestones
    milestones: [],

    // Documents
    hasWebsite: null,
    websiteUrl: "",
    isOpenSource: null,
    githubUrl: "",
    isRegistered: null,
    registrationNumber: "",
    uploadedDocuments: [],
  })

  const addFounder = () => {
    setFormData({
      ...formData,
      founders: [...formData.founders, { name: "", role: "", equity: "", linkedin: "", github: "" }],
    })
  }

  const updateFounder = (index, field, value) => {
    const newFounders = [...formData.founders]
    newFounders[index][field] = value
    setFormData({ ...formData, founders: newFounders })
  }

  const addMilestone = () => {
    const milestone = {
      title: "",
      timeline: "",
      budget: "",
      description: "",
    }
    setFormData({
      ...formData,
      milestones: [...formData.milestones, milestone],
    })
  }

  const updateMilestone = (index, field, value) => {
    const newMilestones = [...formData.milestones]
    newMilestones[index][field] = value
    setFormData({ ...formData, milestones: newMilestones })
  }

  const handleSubmit = () => {
    if (earnLokaTokens) {
      earnLokaTokens(50, "Completed pitch deck")
    }
    if (onComplete) {
      onComplete("investor-connection")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <BackButton />
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Pitch Deck Creation</h1>

          {/* Step Navigation */}
          <div className="flex mb-8 border-b">
            {["Basic Info", "Founders", "Milestones", "Documents"].map((step, index) => (
              <button
                key={step}
                onClick={() => setCurrentStep(index + 1)}
                className={`px-4 py-2 font-medium ${
                  currentStep === index + 1
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {step}
              </button>
            ))}
          </div>

          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Basic Information</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Your company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="One-line description of what you do"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="https://your-website.com"
                />
              </div>

              <button
                onClick={() => setCurrentStep(2)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
              >
                Next: Founders
              </button>
            </div>
          )}

          {/* Step 2: Founders */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Founder Details</h2>
                <button
                  onClick={addFounder}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  Add Founder
                </button>
              </div>

              {formData.founders.map((founder, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium mb-4">Founder {index + 1}</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={founder.name}
                      onChange={(e) => updateFounder(index, "name", e.target.value)}
                      className="p-3 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Role (CEO, CTO, etc.)"
                      value={founder.role}
                      onChange={(e) => updateFounder(index, "role", e.target.value)}
                      className="p-3 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="number"
                      placeholder="Equity %"
                      value={founder.equity}
                      onChange={(e) => updateFounder(index, "equity", e.target.value)}
                      className="p-3 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="url"
                      placeholder="LinkedIn URL"
                      value={founder.linkedin}
                      onChange={(e) => updateFounder(index, "linkedin", e.target.value)}
                      className="p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              ))}

              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
                >
                  Next: Milestones
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Milestones */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Step by Milestones</h2>
                <button
                  onClick={addMilestone}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  Add Milestone
                </button>
              </div>

              {formData.milestones.map((milestone, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium mb-4">Milestone {index + 1}</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Milestone Title"
                      value={milestone.title}
                      onChange={(e) => updateMilestone(index, "title", e.target.value)}
                      className="p-3 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Timeline (e.g., 3 months)"
                      value={milestone.timeline}
                      onChange={(e) => updateMilestone(index, "timeline", e.target.value)}
                      className="p-3 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="number"
                      placeholder="Budget ($)"
                      value={milestone.budget}
                      onChange={(e) => updateMilestone(index, "budget", e.target.value)}
                      className="p-3 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <textarea
                    placeholder="Description"
                    value={milestone.description}
                    onChange={(e) => updateMilestone(index, "description", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    rows={3}
                  />
                </div>
              ))}

              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
                >
                  Next: Documents
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Documents */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Documentation & Assets</h2>

              <div className="space-y-6">
                {/* Website Status */}
                <div>
                  <p className="font-medium mb-3">Do you have a live website?</p>
                  <div className="flex gap-4 mb-4">
                    <button
                      onClick={() => setFormData({ ...formData, hasWebsite: true })}
                      className={`px-6 py-3 rounded-lg border-2 transition ${
                        formData.hasWebsite === true
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      Yes, I have a website
                    </button>
                    <button
                      onClick={() => setFormData({ ...formData, hasWebsite: false, websiteUrl: "" })}
                      className={`px-6 py-3 rounded-lg border-2 transition ${
                        formData.hasWebsite === false
                          ? "border-red-500 bg-red-50 text-red-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      No website yet
                    </button>
                  </div>

                  {formData.hasWebsite === true && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                      <input
                        type="url"
                        value={formData.websiteUrl || ""}
                        onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                        placeholder="https://your-website.com"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      {formData.websiteUrl && (
                        <div className="mt-2">
                          <a
                            href={formData.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            🔗 Visit website
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Open Source Status */}
                <div>
                  <p className="font-medium mb-3">Is your code open source?</p>
                  <div className="flex gap-4 mb-4">
                    <button
                      onClick={() => setFormData({ ...formData, isOpenSource: true })}
                      className={`px-6 py-3 rounded-lg border-2 transition ${
                        formData.isOpenSource === true
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      Yes, open source
                    </button>
                    <button
                      onClick={() => setFormData({ ...formData, isOpenSource: false, githubUrl: "" })}
                      className={`px-6 py-3 rounded-lg border-2 transition ${
                        formData.isOpenSource === false
                          ? "border-red-500 bg-red-50 text-red-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      No, closed source
                    </button>
                  </div>

                  {formData.isOpenSource === true && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Repository URL</label>
                      <input
                        type="url"
                        value={formData.githubUrl || ""}
                        onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                        placeholder="https://github.com/username/repository"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      {formData.githubUrl && (
                        <div className="mt-2">
                          <a
                            href={formData.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            🔗 View on GitHub
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Company Registration Status */}
                <div>
                  <p className="font-medium mb-3">Is your company registered?</p>
                  <div className="flex gap-4 mb-4">
                    <button
                      onClick={() => setFormData({ ...formData, isRegistered: true })}
                      className={`px-6 py-3 rounded-lg border-2 transition ${
                        formData.isRegistered === true
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      Yes, company is registered
                    </button>
                    <button
                      onClick={() => setFormData({ ...formData, isRegistered: false, uploadedDocuments: [] })}
                      className={`px-6 py-3 rounded-lg border-2 transition ${
                        formData.isRegistered === false
                          ? "border-red-500 bg-red-50 text-red-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      No, not registered yet
                    </button>
                  </div>

                  {formData.isRegistered === true && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Registration Details
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="Company Name"
                            value={formData.companyName || ""}
                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            placeholder="Registration Number"
                            value={formData.registrationNumber || ""}
                            onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      {/* Document Upload Section */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                        <div className="text-center">
                          <div className="text-4xl mb-4">📄</div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Company Documents</h3>
                          <p className="text-sm text-gray-500 mb-4">
                            Upload registration documents, certificates, or other legal documents in PDF format
                          </p>

                          <input
                            type="file"
                            multiple
                            accept=".pdf"
                            onChange={(e) => {
                              const files = Array.from(e.target.files)
                              const pdfFiles = files.filter((file) => file.type === "application/pdf")

                              if (pdfFiles.length !== files.length) {
                                alert("Please upload only PDF files")
                                return
                              }

                              const newDocuments = pdfFiles.map((file) => ({
                                id: Date.now() + Math.random(),
                                name: file.name,
                                size: file.size,
                                file: file,
                                uploadedAt: new Date(),
                              }))

                              setFormData({
                                ...formData,
                                uploadedDocuments: [...(formData.uploadedDocuments || []), ...newDocuments],
                              })
                            }}
                            className="hidden"
                            id="company-documents"
                          />
                          <label htmlFor="company-documents">
                            <button
                              type="button"
                              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg cursor-pointer inline-flex items-center gap-2"
                              onClick={() => document.getElementById("company-documents").click()}
                            >
                              📎 Choose PDF Files
                            </button>
                          </label>

                          <p className="text-xs text-gray-400 mt-2">PDF files only, max 10MB each</p>
                        </div>
                      </div>

                      {/* Display Uploaded Documents */}
                      {formData.uploadedDocuments && formData.uploadedDocuments.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-700">Uploaded Documents:</h4>
                          {formData.uploadedDocuments.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="text-red-500 text-xl">📄</div>
                                <div>
                                  <p className="font-medium text-gray-800">{doc.name}</p>
                                  <p className="text-sm text-gray-500">
                                    {(doc.size / 1024 / 1024).toFixed(2)} MB • Uploaded{" "}
                                    {doc.uploadedAt.toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  const updatedDocs = formData.uploadedDocuments.filter((d) => d.id !== doc.id)
                                  setFormData({ ...formData, uploadedDocuments: updatedDocs })
                                }}
                                className="text-red-500 hover:text-red-700 px-3 py-1 rounded text-sm"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                          <div className="text-center">
                            <p className="text-sm text-green-600">
                              ✅ {formData.uploadedDocuments.length} document
                              {formData.uploadedDocuments.length > 1 ? "s" : ""} uploaded successfully
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Progress Summary */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-3">Documentation Status</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div
                        className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
                          formData.hasWebsite === true ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"
                        }`}
                      >
                        {formData.hasWebsite === true ? "✓" : "○"}
                      </div>
                      <p className="font-medium">Website</p>
                      <p className="text-xs text-gray-600">
                        {formData.hasWebsite === true
                          ? "Live website"
                          : formData.hasWebsite === false
                            ? "No website"
                            : "Not specified"}
                      </p>
                    </div>

                    <div className="text-center">
                      <div
                        className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
                          formData.isOpenSource === true ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"
                        }`}
                      >
                        {formData.isOpenSource === true ? "✓" : "○"}
                      </div>
                      <p className="font-medium">Open Source</p>
                      <p className="text-xs text-gray-600">
                        {formData.isOpenSource === true
                          ? "GitHub repo"
                          : formData.isOpenSource === false
                            ? "Closed source"
                            : "Not specified"}
                      </p>
                    </div>

                    <div className="text-center">
                      <div
                        className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
                          formData.isRegistered === true ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"
                        }`}
                      >
                        {formData.isRegistered === true ? "✓" : "○"}
                      </div>
                      <p className="font-medium">Registration</p>
                      <p className="text-xs text-gray-600">
                        {formData.isRegistered === true
                          ? `${formData.uploadedDocuments?.length || 0} docs`
                          : formData.isRegistered === false
                            ? "Not registered"
                            : "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg flex-1"
                >
                  Complete Pitch Deck
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PitchDeckForm
