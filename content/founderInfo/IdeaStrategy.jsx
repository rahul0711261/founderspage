"use client"

import { useState } from "react"
import { useFounderContext } from "../../contexts/FounderContext"
import { useProgressContext } from "../../contexts/ProgressContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Lightbulb, FileText, Globe, TrendingUp } from "lucide-react"

const IdeaStrategy = ({ onComplete, onBack }) => {
  const { startup, updateStartup } = useFounderContext()
  const progressContext = useProgressContext()

  const [uploadedFiles, setUploadedFiles] = useState([])

  const [formData, setFormData] = useState({
    ideaDescription: startup.ideaDescription || "",
    pitchDeckReady: null,
    hasWebsite: null,
    websiteUrl: "",
    hasDocumentation: null,
    documentationDetails: "",
    earlyTraction: "",
    targetMarket: "",
    competitiveAdvantage: "",
  })

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files)
    const pdfFiles = files.filter((file) => file.type === "application/pdf")

    if (pdfFiles.length !== files.length) {
      alert("Please upload only PDF files")
      return
    }

    const newFiles = pdfFiles.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      file: file,
      uploadedAt: new Date(),
    }))

    setUploadedFiles((prev) => [...prev, ...newFiles])
  }

  const removeFile = (fileId) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  const handleSubmit = () => {
    // Update startup context with idea strategy details
    updateStartup({
      ideaDescription: formData.ideaDescription,
      pitchDeckReady: formData.pitchDeckReady,
      hasWebsite: formData.hasWebsite,
      websiteUrl: formData.websiteUrl,
      hasDocumentation: formData.hasDocumentation,
      documentationDetails: formData.documentationDetails,
      uploadedDocuments: uploadedFiles, // Add uploaded files
      earlyTraction: formData.earlyTraction,
      targetMarket: formData.targetMarket,
      competitiveAdvantage: formData.competitiveAdvantage,
    })

    // Earn tokens
    if (progressContext.earnLokaTokens) {
      const baseTokens = 30
      const fileBonus = uploadedFiles.length * 5 // 5 extra tokens per uploaded file
      progressContext.earnLokaTokens(
        baseTokens + fileBonus,
        `Completed idea strategy${uploadedFiles.length > 0 ? ` with ${uploadedFiles.length} documents` : ""}`,
      )
    }

    // Next step: Co-founder decision
    if (progressContext.makeDecision) {
      progressContext.makeDecision("ideaStrategyComplete", true)
    }

    // Navigate to co-founder decision
    setTimeout(() => {
      if (onComplete) {
        onComplete("cofounder-decision")
      }
    }, 1000)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-6 w-6" />
              <div>
                <CardTitle>Idea Strategy</CardTitle>
                <CardDescription>Tell us about your startup idea, documentation, and early traction</CardDescription>
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
        <CardContent className="space-y-6">
          {/* Idea Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Describe Your Startup Idea *</label>
            <Textarea
              value={formData.ideaDescription}
              onChange={(e) => setFormData({ ...formData, ideaDescription: e.target.value })}
              placeholder="Explain your startup idea, what problem it solves, and how it works..."
              className="min-h-[100px]"
              required
            />
          </div>

          {/* Target Market */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Market</label>
            <Input
              value={formData.targetMarket}
              onChange={(e) => setFormData({ ...formData, targetMarket: e.target.value })}
              placeholder="Who are your target customers? (e.g., Small businesses, Students, etc.)"
            />
          </div>

          {/* Competitive Advantage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Competitive Advantage</label>
            <Textarea
              value={formData.competitiveAdvantage}
              onChange={(e) => setFormData({ ...formData, competitiveAdvantage: e.target.value })}
              placeholder="What makes your solution unique? How is it different from existing solutions?"
              className="min-h-[80px]"
            />
          </div>

          {/* Early Traction */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Early Traction</label>
            <Textarea
              value={formData.earlyTraction}
              onChange={(e) => setFormData({ ...formData, earlyTraction: e.target.value })}
              placeholder="Any early users, feedback, partnerships, or validation you've received..."
              className="min-h-[80px]"
            />
          </div>

          {/* Pitch Deck Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Do you have a pitch deck ready?</label>
            <div className="flex gap-4">
              <Button
                variant={formData.pitchDeckReady === true ? "default" : "outline"}
                onClick={() => setFormData({ ...formData, pitchDeckReady: true })}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Yes, I have a pitch deck
              </Button>
              <Button
                variant={formData.pitchDeckReady === false ? "default" : "outline"}
                onClick={() => setFormData({ ...formData, pitchDeckReady: false })}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                No, I need help creating one
              </Button>
            </div>
          </div>

          {/* Website Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Do you have a live website or landing page?
            </label>
            <div className="flex gap-4 mb-3">
              <Button
                variant={formData.hasWebsite === true ? "default" : "outline"}
                onClick={() => setFormData({ ...formData, hasWebsite: true })}
                className="flex items-center gap-2"
              >
                <Globe className="h-4 w-4" />
                Yes, I have a website
              </Button>
              <Button
                variant={formData.hasWebsite === false ? "default" : "outline"}
                onClick={() => setFormData({ ...formData, hasWebsite: false })}
                className="flex items-center gap-2"
              >
                <Globe className="h-4 w-4" />
                No website yet
              </Button>
            </div>

            {formData.hasWebsite === true && (
              <Input
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                placeholder="Enter your website URL (e.g., https://yoursite.com)"
                type="url"
              />
            )}
          </div>

          {/* Documentation Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Do you have technical documentation or specifications?
            </label>
            <div className="flex gap-4 mb-3">
              <Button
                variant={formData.hasDocumentation === true ? "default" : "outline"}
                onClick={() => setFormData({ ...formData, hasDocumentation: true })}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Yes, I have documentation
              </Button>
              <Button
                variant={formData.hasDocumentation === false ? "default" : "outline"}
                onClick={() => setFormData({ ...formData, hasDocumentation: false })}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                No documentation yet
              </Button>
            </div>

            {formData.hasDocumentation === true && (
              <div className="space-y-4">
                <Textarea
                  value={formData.documentationDetails}
                  onChange={(e) => setFormData({ ...formData, documentationDetails: e.target.value })}
                  placeholder="Describe your documentation (technical specs, user guides, API docs, etc.)"
                  className="min-h-[60px]"
                />

                {/* File Upload Section */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Documentation</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Upload your technical documentation, specs, or guides in PDF format
                    </p>

                    <input
                      type="file"
                      multiple
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="documentation-upload"
                    />
                    <label htmlFor="documentation-upload">
                      <Button variant="outline" className="cursor-pointer bg-transparent" asChild>
                        <span className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Choose PDF Files
                        </span>
                      </Button>
                    </label>

                    <p className="text-xs text-gray-400 mt-2">PDF files only, max 10MB each</p>
                  </div>
                </div>

                {/* Uploaded Files Display */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-700">Uploaded Documents:</h4>
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-red-500" />
                          <div>
                            <p className="font-medium text-gray-800">{file.name}</p>
                            <p className="text-sm text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB • Uploaded{" "}
                              {file.uploadedAt.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Progress Summary */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-800">Your Idea Progress</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div className="text-center">
                  <Badge variant={formData.ideaDescription ? "default" : "secondary"}>
                    {formData.ideaDescription ? "✓" : "○"} Idea
                  </Badge>
                </div>
                <div className="text-center">
                  <Badge variant={formData.pitchDeckReady === true ? "default" : "secondary"}>
                    {formData.pitchDeckReady === true ? "✓" : "○"} Pitch Deck
                  </Badge>
                </div>
                <div className="text-center">
                  <Badge variant={formData.hasWebsite === true ? "default" : "secondary"}>
                    {formData.hasWebsite === true ? "✓" : "○"} Website
                  </Badge>
                </div>
                <div className="text-center">
                  <Badge variant={formData.hasDocumentation === true ? "default" : "secondary"}>
                    {formData.hasDocumentation === true ? "✓" : "○"} Docs
                  </Badge>
                </div>
                <div className="text-center">
                  <Badge variant={uploadedFiles.length > 0 ? "default" : "secondary"}>
                    {uploadedFiles.length > 0 ? "✓" : "○"} Files ({uploadedFiles.length})
                  </Badge>
                </div>
              </div>
              {uploadedFiles.length > 0 && (
                <p className="text-xs text-blue-600 mt-2 text-center">
                  +{uploadedFiles.length * 5} bonus tokens for uploading {uploadedFiles.length} document
                  {uploadedFiles.length > 1 ? "s" : ""}!
                </p>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="text-center">
            <Button
              onClick={handleSubmit}
              disabled={!formData.ideaDescription.trim()}
              className="w-full md:w-auto px-8"
            >
              Continue to Co-founder Decision
            </Button>
            {!formData.ideaDescription.trim() && (
              <p className="text-sm text-red-500 mt-2">Please describe your startup idea to continue</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default IdeaStrategy
