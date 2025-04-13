"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { MessageSquare, Send, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "👋 Hi there! I'm the FoodBridge assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Mock responses based on user input
  const getBotResponse = (userMessage: string): string => {
    const lowerCaseMessage = userMessage.toLowerCase()

    if (lowerCaseMessage.includes("donate") || lowerCaseMessage.includes("donation")) {
      return "To donate food, click on the 'Donate Food' button in the navigation menu or visit the donation page directly. You'll need to fill out a simple form with details about your food donation."
    } else if (lowerCaseMessage.includes("collect") || lowerCaseMessage.includes("ngo")) {
      return "If you're an NGO looking to collect food, you'll need to register and verify your organization first. Then, you can browse available donations in your area and claim them."
    } else if (lowerCaseMessage.includes("biogas") || lowerCaseMessage.includes("plant")) {
      return "Biogas plants convert food waste into renewable energy through anaerobic digestion. Check out our Information page to learn more about how biogas plants work and their environmental benefits."
    } else if (lowerCaseMessage.includes("track") || lowerCaseMessage.includes("status")) {
      return "You can track the status of your donations or collections from your dashboard. Just log in to your account and navigate to the tracking section."
    } else if (
      lowerCaseMessage.includes("register") ||
      lowerCaseMessage.includes("sign up") ||
      lowerCaseMessage.includes("account")
    ) {
      return "To create an account, click on the 'Sign Up' button in the top right corner. You'll need to provide some basic information and select your role (donor, NGO, driver, or biogas plant)."
    } else if (
      lowerCaseMessage.includes("hello") ||
      lowerCaseMessage.includes("hi") ||
      lowerCaseMessage.includes("hey")
    ) {
      return "Hello! How can I assist you with FoodBridge today?"
    } else if (lowerCaseMessage.includes("thank")) {
      return "You're welcome! Is there anything else I can help you with?"
    } else {
      return "I'm not sure I understand. Could you please rephrase your question? You can ask me about donating food, collecting donations, tracking status, or creating an account."
    }
  }

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Simulate bot typing
    setIsTyping(true)

    // Add bot response after a delay
    setTimeout(
      () => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: getBotResponse(userMessage.text),
          sender: "bot",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    ) // Random delay between 1-2 seconds
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Chat button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 p-0 shadow-lg bg-green-600 hover:bg-green-700 z-50"
        aria-label="Chat with us"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </Button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-[350px] h-[500px] bg-white rounded-lg shadow-xl overflow-hidden z-50 flex flex-col"
          >
            {/* Header */}
            <div className="bg-green-600 text-white p-4 flex items-center">
              <Avatar className="h-8 w-8 mr-3 bg-white text-green-600">
                <AvatarFallback>FB</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">FoodBridge Assistant</h3>
                <p className="text-xs text-green-100">We typically reply in a few minutes</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "user" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className={`text-xs mt-1 ${message.sender === "user" ? "text-green-100" : "text-gray-500"}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t p-3 flex items-center">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 mr-2"
              />
              <Button
                onClick={handleSendMessage}
                disabled={inputValue.trim() === "" || isTyping}
                size="icon"
                className="bg-green-600 hover:bg-green-700"
              >
                {isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
