import type React from "react"

import { useState } from "react"
import { useChatBoatMutation } from "@/features/users/userApi"
import { Send, Bot, User } from "lucide-react"

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "👋 Hi! Tell me your symptoms and I'll suggest a doctor." },
  ])
  const [input, setInput] = useState("")
  const [chatBoat, { isLoading }] = useChatBoatMutation()

  const handleSend = async () => {
    if (!input.trim()) return

    setMessages((prev) => [...prev, { role: "patient", text: input }])

    try {
      const currentInput = input
      setInput("")
      const res = await chatBoat(currentInput).unwrap()
      console.log("chat response", res)

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: res.replay,
        },
      ])
    } catch (error) {
      console.log(error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const loading = isLoading

  return (
    <div className="flex flex-col w-96 h-[600px] bg-gradient-to-b from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden backdrop-blur-sm">
      
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-4 flex items-center gap-3 shadow-lg">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">CareSlot Assistant</h3>
          <p className="text-xs text-blue-100">Always here to help</p>
        </div>
      </div>

    
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2 ${
              msg.role === "patient" ? "justify-end" : "justify-start"
            } animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            {msg.role === "bot" && (
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}

            <div
              className={`px-4 py-3 rounded-2xl max-w-[75%] shadow-sm ${
                msg.role === "patient"
                  ? "bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-tr-sm"
                  : "bg-white text-gray-800 border border-gray-200 rounded-tl-sm"
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>

            {msg.role === "patient" && (
              <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-2 justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white border border-gray-200 shadow-sm">
              <div className="flex items-center gap-1">
                <span
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></span>
                <span
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></span>
                <span
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex gap-2 items-end">
          <input
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-2xl outline-none text-sm text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            type="text"
            placeholder="Describe your symptoms..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-3 rounded-2xl font-medium hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
