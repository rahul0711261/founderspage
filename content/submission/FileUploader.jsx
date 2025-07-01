"use client"

import { useState } from "react"
import { useProgress } from "../../contexts/ProgressContext"
import BackButton from "../../components/BackButton"

export default function FileUploader() {
  const { dispatch: progressDispatch } = useProgress()
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (files) => {
    const fileArray = Array.from(files).map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      id: Date.now() + Math.random(),
    }))
    setUploadedFiles((prev) => [...prev, ...fileArray])
  }

  const removeFile = (id) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id))
  }

  const handleContinue = () => {
    progressDispatch({ type: "ADD_SUBMISSION", payload: { files: uploadedFiles } })
    progressDispatch({ type: "ADD_COMPLETED_STEP", payload: "file-upload" })
    progressDispatch({ type: "SET_CURRENT_STEP", payload: "mentorship-options" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Upload Documents</h1>
          <p className="text-gray-600 mb-8">Upload your pitch deck, business plan, or other relevant documents.</p>

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition duration-200 ${
              dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              multiple
              onChange={handleChange}
              className="hidden"
              id="file-upload"
              accept=".pdf,.doc,.docx,.ppt,.pptx"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="text-4xl mb-4">📁</div>
              <p className="text-lg font-medium text-gray-700 mb-2">Drag and drop files here, or click to select</p>
              <p className="text-sm text-gray-500">Supported formats: PDF, DOC, DOCX, PPT, PPTX</p>
            </label>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-800 mb-4">Uploaded Files:</h3>
              <div className="space-y-2">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{file.name}</p>
                      <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="text-red-500 hover:text-red-700 transition duration-200"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <button
              onClick={handleContinue}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
