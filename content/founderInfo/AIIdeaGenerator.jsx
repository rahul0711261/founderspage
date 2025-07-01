"use client"

import { useState, useEffect, useRef } from "react"
import { useFounderContext } from "../../contexts/FounderContext"
import { useProgressContext } from "../../contexts/ProgressContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sparkles,
  TrendingUp,
  Zap,
  MessageCircle,
  Send,
  Bot,
  User,
  ArrowLeft,
  Lightbulb,
  Target,
  Users,
} from "lucide-react"

const AIIdeaGenerator = ({ onComplete, onBack }) => {
  const { startup, updateStartup } = useFounderContext()
  const progressContext = useProgressContext()
  const [selectedIdea, setSelectedIdea] = useState(null)
  const [showChatbot, setShowChatbot] = useState(false)
  const [messages, setMessages] = useState([])
  const [currentMessage, setCurrentMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [chatStep, setChatStep] = useState("greeting")
  const [userResponses, setUserResponses] = useState({})
  const [conversationFlow, setConversationFlow] = useState(0)

  // Refs for auto-scrolling
  const scrollAreaRef = useRef(null)
  const messagesEndRef = useRef(null)

  // Safely access lokaTokens
  const lokaTokens = progressContext.lokaTokens || { available: 100, spent: 0 }

  const domainNames = {
    AI: "Artificial Intelligence",
    Web3: "Web3 & Blockchain",
    Fintech: "Financial Technology",
    B2B: "Business to Business",
    C4S: "Consumer for Social",
    Other: "Other Domain",
  }

  // Auto-scroll function
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      })
    }
  }

  // Auto-scroll whenever messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Auto-scroll when typing indicator changes
  useEffect(() => {
    if (isTyping) {
      scrollToBottom()
    }
  }, [isTyping])

  // Auto-start chatbot when component loads and user needs ideas
  useEffect(() => {
    const shouldStartChatbot =
      startup.hasIdea === false &&
      startup.domain &&
      startup.domain !== "" &&
      !selectedIdea &&
      !showChatbot &&
      lokaTokens.available >= 5

    if (shouldStartChatbot) {
      setTimeout(() => {
        startChatbot()
      }, 2000)
    }
  }, [startup.hasIdea, startup.domain, selectedIdea, showChatbot])

  const startChatbot = () => {
    if (lokaTokens.available < 5) {
      alert("You need at least 5 Loka tokens to use AI assistance")
      return
    }

    setShowChatbot(true)

    if (progressContext.spendLokaTokens) {
      progressContext.spendLokaTokens(5, "rdHelp")
    }

    // Initialize chat with greeting
    const initialMessages = [
      {
        id: 1,
        type: "ai",
        content: `Hi there! 👋 I'm your AI startup advisor. I see you're interested in the ${domainNames[startup.domain] || startup.domain} domain but don't have a specific idea yet. That's perfectly fine - I'm here to help you discover amazing opportunities!`,
        timestamp: new Date(),
      },
      {
        id: 2,
        type: "ai",
        content: `Let me ask you a few questions to understand your interests and generate personalized startup ideas. This will help me create ideas that match your skills and passion! 🚀`,
        timestamp: new Date(),
      },
    ]

    setMessages(initialMessages)
    setChatStep("greeting")
    setConversationFlow(0)

    // Start the conversation flow
    setTimeout(() => {
      askNextQuestion()
    }, 2000)
  }

  const askNextQuestion = () => {
    const questions = [
      {
        step: "background",
        question:
          "First, tell me about your background. Are you more technical (coding, engineering) or business-oriented (marketing, sales, management)?",
        options: [
          "Technical Background",
          "Business Background",
          "Both Technical & Business",
          "Neither - I'm exploring",
        ],
      },
      {
        step: "experience",
        question: "What's your experience level with startups and the tech industry?",
        options: ["Complete beginner", "Some experience", "Experienced professional", "Serial entrepreneur"],
      },
      {
        step: "problems",
        question: `What problems in ${startup.domain} frustrate you the most or seem unsolved?`,
        options: ["Write custom response", "Not sure yet", "Multiple problems", "One specific problem"],
      },
      {
        step: "target-users",
        question: "Who would you most like to help with your startup?",
        options: ["Individual consumers", "Small businesses", "Large enterprises", "Other startups", "Everyone"],
      },
      {
        step: "business-model",
        question: "How would you prefer to make money?",
        options: ["Subscription/SaaS", "One-time purchases", "Advertising", "Commission/Marketplace", "Not sure yet"],
      },
    ]

    if (conversationFlow < questions.length) {
      const currentQuestion = questions[conversationFlow]

      setTimeout(() => {
        const questionMessage = {
          id: messages.length + 1,
          type: "ai",
          content: currentQuestion.question,
          timestamp: new Date(),
          options: currentQuestion.options,
          step: currentQuestion.step,
        }
        setMessages((prev) => [...prev, questionMessage])
        setChatStep(currentQuestion.step)
      }, 1000)
    } else {
      // All questions answered, generate ideas
      setTimeout(() => {
        generatePersonalizedIdeas()
      }, 1000)
    }
  }

  const handleOptionSelect = (option, step) => {
    // Add user response
    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: option,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    // Store response
    setUserResponses((prev) => ({
      ...prev,
      [step]: option,
    }))

    // AI acknowledgment
    setTimeout(() => {
      const acknowledgments = [
        "Great choice! That helps me understand you better.",
        "Perfect! This gives me good insight into your preferences.",
        "Excellent! I'm getting a clearer picture of what might work for you.",
        "Wonderful! This information is very helpful.",
        "Fantastic! I can already see some interesting possibilities.",
      ]

      const ackMessage = {
        id: messages.length + 2,
        type: "ai",
        content: acknowledgments[Math.floor(Math.random() * acknowledgments.length)],
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, ackMessage])

      // Move to next question
      setConversationFlow((prev) => prev + 1)
      setTimeout(() => {
        askNextQuestion()
      }, 1500)
    }, 800)
  }

  const sendMessage = () => {
    if (!currentMessage.trim()) return

    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: currentMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const messageContent = currentMessage
    setCurrentMessage("")
    setIsTyping(true)

    // Generate contextual AI response
    setTimeout(() => {
      const aiResponse = generateContextualResponse(messageContent, chatStep)
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const generateContextualResponse = (userInput, step) => {
    const responses = {
      greeting: [
        `Thanks for sharing that! "${userInput}" - that's really helpful context.`,
        `I appreciate you telling me about "${userInput}". This gives me good insight.`,
      ],
      background: [
        `Interesting background! "${userInput}" opens up many possibilities in ${startup.domain}.`,
        `Great to know about "${userInput}". This will help me suggest relevant ideas.`,
      ],
      experience: [
        `Perfect! With your experience level of "${userInput}", I can tailor ideas accordingly.`,
        `Thanks for sharing "${userInput}". This helps me understand what complexity level works for you.`,
      ],
      problems: [
        `"${userInput}" is a great insight! Problem identification is the first step to great solutions.`,
        `Excellent point about "${userInput}". The best startups solve real problems.`,
      ],
      "target-users": [
        `Focusing on "${userInput}" is smart! Knowing your target audience is crucial.`,
        `"${userInput}" is a great target market. I can suggest ideas specifically for them.`,
      ],
      "business-model": [
        `"${userInput}" is a solid approach! Business model clarity is important from the start.`,
        `Great choice with "${userInput}". This helps me suggest monetizable ideas.`,
      ],
      "idea-discussion": [
        `That's a thoughtful question about "${userInput}". Let me elaborate on that.`,
        `Great point about "${userInput}". Here's what I think about that aspect.`,
      ],
    }

    const responseTexts = responses[step] || responses["idea-discussion"]

    return {
      id: messages.length + 2,
      type: "ai",
      content: responseTexts[Math.floor(Math.random() * responseTexts.length)],
      timestamp: new Date(),
    }
  }

  const generatePersonalizedIdeas = () => {
    setIsTyping(true)

    setTimeout(() => {
      const analysisMessage = {
        id: messages.length + 1,
        type: "ai",
        content: `Perfect! Based on our conversation, I've analyzed your responses and I'm now generating personalized ${startup.domain} startup ideas that match your profile. Give me a moment to craft something special for you... 🤔💭`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, analysisMessage])
      setIsTyping(false)

      // Generate ideas based on responses
      setTimeout(() => {
        const ideas = createPersonalizedIdeas()
        const ideaMessage = {
          id: messages.length + 2,
          type: "ai",
          content: `🎉 Here are 3 personalized ${startup.domain} startup ideas crafted specifically for you based on your background, experience, and preferences:`,
          timestamp: new Date(),
          ideas: ideas,
        }
        setMessages((prev) => [...prev, ideaMessage])
        setChatStep("idea-selection")
      }, 3000)
    }, 1000)
  }

  const createPersonalizedIdeas = () => {
    const domainSpecificIdeas = {
      AI: [
        {
          id: 1,
          title: "AI-Powered Personal Learning Assistant",
          description:
            "An intelligent tutoring system that adapts to individual learning styles, creates personalized study plans, and provides real-time feedback for students and professionals.",
          marketSize: "Large ($5B+)",
          difficulty: userResponses.background?.includes("Technical") ? "Medium" : "High",
          trendScore: 94,
          tags: ["EdTech", "AI", "Personalization", "SaaS"],
          reasoning: `Based on your ${userResponses.background || "background"} and interest in helping ${userResponses["target-users"] || "people"}, this AI solution addresses the growing need for personalized education.`,
        },
        {
          id: 2,
          title: "Smart Business Process Automation Platform",
          description:
            "AI-driven platform that analyzes business workflows and automatically creates custom automation solutions without requiring coding knowledge.",
          marketSize: "Large ($8B+)",
          difficulty: "High",
          trendScore: 89,
          tags: ["Business Automation", "No-Code", "AI", "Enterprise"],
          reasoning: `Perfect for your ${userResponses.experience || "experience level"} and focus on ${userResponses["target-users"] || "business solutions"}. Automation is a massive trend.`,
        },
        {
          id: 3,
          title: "AI Health & Wellness Coach",
          description:
            "Personalized AI coach that combines health data, lifestyle patterns, and behavioral psychology to provide customized wellness recommendations.",
          marketSize: "Medium ($2B+)",
          difficulty: "Medium",
          trendScore: 87,
          tags: ["HealthTech", "AI", "Wellness", "Mobile"],
          reasoning: `Aligns with your interest in ${userResponses.problems || "solving real problems"} and the growing health consciousness trend.`,
        },
      ],
      Web3: [
        {
          id: 1,
          title: "Decentralized Freelancer Marketplace",
          description:
            "Blockchain-based platform connecting freelancers and clients with smart contracts for automatic payments, reputation tracking, and dispute resolution.",
          marketSize: "Large ($3B+)",
          difficulty: userResponses.background?.includes("Technical") ? "Medium" : "High",
          trendScore: 85,
          tags: ["DeFi", "Marketplace", "Smart Contracts", "Freelancing"],
          reasoning: `Matches your ${userResponses.background || "background"} and addresses trust issues in freelancing with blockchain transparency.`,
        },
        {
          id: 2,
          title: "NFT-Based Digital Identity Platform",
          description:
            "Secure digital identity solution using NFTs to verify credentials, certificates, and achievements across different platforms and institutions.",
          marketSize: "Medium ($1.5B+)",
          difficulty: "High",
          trendScore: 82,
          tags: ["NFT", "Identity", "Security", "Verification"],
          reasoning: `Perfect for your ${userResponses.experience || "experience"} and the growing need for digital identity solutions.`,
        },
        {
          id: 3,
          title: "Decentralized Content Creator Economy",
          description:
            "Platform where creators can tokenize their content, fans can invest in creators' success, and revenue is shared transparently through smart contracts.",
          marketSize: "Large ($4B+)",
          difficulty: "High",
          trendScore: 88,
          tags: ["Creator Economy", "Tokenization", "DeFi", "Social"],
          reasoning: `Aligns with your focus on ${userResponses["target-users"] || "helping creators"} and the booming creator economy.`,
        },
      ],
      Fintech: [
        {
          id: 1,
          title: "AI-Powered Personal Finance Coach",
          description:
            "Smart financial advisor that analyzes spending patterns, provides personalized budgeting advice, and automatically optimizes investments for individual users.",
          marketSize: "Large ($6B+)",
          difficulty: "Medium",
          trendScore: 91,
          tags: ["Personal Finance", "AI", "Budgeting", "Investment"],
          reasoning: `Perfect match for your ${userResponses.background || "background"} and the universal need for better financial management.`,
        },
        {
          id: 2,
          title: "SME Invoice Financing Platform",
          description:
            "Digital platform that provides instant cash flow solutions for small businesses by purchasing their invoices at competitive rates using AI risk assessment.",
          marketSize: "Large ($10B+)",
          difficulty: userResponses.background?.includes("Business") ? "Medium" : "High",
          trendScore: 86,
          tags: ["B2B", "Invoice Financing", "SME", "Cash Flow"],
          reasoning: `Addresses the cash flow problems you mentioned and targets ${userResponses["target-users"] || "small businesses"}.`,
        },
        {
          id: 3,
          title: "Micro-Investment Social Platform",
          description:
            "Social investing app where users can start investing with small amounts, follow successful investors, and learn through community-driven education.",
          marketSize: "Medium ($3B+)",
          difficulty: "Medium",
          trendScore: 84,
          tags: ["Social Investing", "Micro-Investment", "Education", "Community"],
          reasoning: `Combines your interest in ${userResponses.problems || "financial accessibility"} with social learning.`,
        },
      ],
    }

    return domainSpecificIdeas[startup.domain] || domainSpecificIdeas.AI
  }

  const selectIdeaFromChat = (idea) => {
    setSelectedIdea(idea)
    updateStartup({
      hasIdea: true,
      ideaDescription: idea.description,
    })

    const selectionMessage = {
      id: messages.length + 1,
      type: "ai",
      content: `🎉 Excellent choice! "${idea.title}" is a fantastic opportunity with huge potential. Here's why I think this is perfect for you:

✅ **Market Fit**: ${idea.reasoning}
📊 **Market Size**: ${idea.marketSize} 
🎯 **Target Users**: ${idea.targetUsers || "Individual consumers"}
💰 **Business Model**: ${idea.businessModel || "Subscription/SaaS"}
📈 **Trend Score**: ${idea.trendScore}%

You're all set to move forward with this idea! I'll help you validate and develop it further. Good luck! 🚀`,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, selectionMessage])

    if (progressContext.earnLokaTokens) {
      progressContext.earnLokaTokens(25, "Selected AI-generated idea")
    }

    setTimeout(() => {
      setShowChatbot(false)
      if (onComplete) {
        onComplete("team-status-check")
      }
    }, 4000)
  }

  const quickQuestions = [
    "What are the current market trends?",
    "How do I validate this idea?",
    "What's the competition like?",
    "How much funding would I need?",
    "What skills do I need for this?",
    "Can you explain this idea more?",
    "What are the risks?",
    "How long to build an MVP?",
  ]

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6" />
              <div>
                <CardTitle>AI Startup Idea Generator</CardTitle>
                <CardDescription>
                  Get AI-powered startup ideas in the {domainNames[startup.domain] || startup.domain} domain
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
          {!selectedIdea ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {showChatbot ? "AI Conversation Active" : "Ready for AI Idea Generation"}
                </h3>
                <p className="text-muted-foreground">
                  {showChatbot
                    ? `Our AI is chatting with you about ${domainNames[startup.domain] || startup.domain} startup ideas`
                    : `Generate personalized startup ideas for ${domainNames[startup.domain] || startup.domain}`}
                </p>
              </div>

              <div className="space-y-2">
                <Button onClick={startChatbot} disabled={lokaTokens.available < 5} className="w-full md:w-auto">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {showChatbot ? "Chatbot Active" : "Start AI Chat"} (5 Loka Tokens)
                </Button>

                {lokaTokens.available < 5 && (
                  <p className="text-sm text-red-500">You need 5 Loka tokens. Complete more steps to earn tokens!</p>
                )}
              </div>
            </div>
          ) : (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Zap className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800">Idea Selected!</span>
                  </div>
                  <p className="text-sm text-green-700">
                    You've selected "{selectedIdea.title}" as your startup idea. +25 Loka Tokens earned!
                  </p>
                  <p className="text-xs text-green-600">Next: Let's check your team status and co-founder needs</p>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* AI Chatbot Dialog */}
      <Dialog open={showChatbot} onOpenChange={setShowChatbot}>
        <DialogContent className="max-w-3xl h-[700px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Startup Advisor - {domainNames[startup.domain]} Ideas
            </DialogTitle>
            <DialogDescription>
              Personalized conversation to generate the perfect startup idea for you
            </DialogDescription>
          </DialogHeader>

          {/* Chat Messages */}
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 border rounded-lg">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-lg p-3 ${
                      message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.type === "ai" && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                      {message.type === "user" && <User className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-line">{message.content}</p>

                        {/* Render option buttons */}
                        {message.options && (
                          <div className="mt-3 space-y-2">
                            {message.options.map((option, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className="w-full justify-start text-xs bg-background hover:bg-primary hover:text-primary-foreground"
                                onClick={() => handleOptionSelect(option, message.step)}
                              >
                                {option}
                              </Button>
                            ))}
                          </div>
                        )}

                        {/* Render startup ideas if present */}
                        {message.ideas && (
                          <div className="mt-4 space-y-4">
                            {message.ideas.map((idea) => (
                              <Card
                                key={idea.id}
                                className="bg-background border-2 hover:border-primary transition-colors"
                              >
                                <CardHeader className="pb-3">
                                  <div className="flex items-center justify-between">
                                    <CardTitle className="text-base flex items-center gap-2">
                                      <Lightbulb className="h-4 w-4" />
                                      {idea.title}
                                    </CardTitle>
                                    <Badge variant="secondary" className="text-xs">
                                      <TrendingUp className="h-3 w-3 mr-1" />
                                      {idea.trendScore}%
                                    </Badge>
                                  </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                  <p className="text-xs text-muted-foreground mb-3">{idea.description}</p>

                                  <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                                    <div className="flex items-center gap-1">
                                      <Target className="h-3 w-3" />
                                      <span>{idea.marketSize}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Users className="h-3 w-3" />
                                      <span>{idea.difficulty}</span>
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap gap-1 mb-3">
                                    {idea.tags.map((tag, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>

                                  <div className="text-xs text-muted-foreground mb-3 p-2 bg-muted/50 rounded">
                                    <strong>Why this fits you:</strong> {idea.reasoning}
                                  </div>

                                  <Button size="sm" className="w-full" onClick={() => selectIdeaFromChat(idea)}>
                                    Select This Idea 🚀
                                  </Button>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Invisible div to scroll to */}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Quick Questions */}
          {chatStep === "idea-selection" && (
            <div className="px-4">
              <p className="text-xs text-muted-foreground mb-2">Quick questions about the ideas:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs bg-transparent"
                    onClick={() => setCurrentMessage(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Message Input */}
          <div className="flex gap-2 p-4 border-t">
            <Input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Ask me anything about these startup ideas..."
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              disabled={isTyping}
            />
            <Button onClick={sendMessage} disabled={!currentMessage.trim() || isTyping}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AIIdeaGenerator
