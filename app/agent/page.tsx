"use client"

import {
  Bell,
  User,
  ArrowUp,
  Menu,
  Sparkles,
  Send,
  RefreshCw,
  Compass,
  PlusCircle,
  Bookmark,
  Bot,
  HelpCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AgentPage() {
  const [messages, setMessages] = React.useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "안녕하세요! 저는 AI 에이전트입니다. 무엇을 도와드릴까요?" },
  ])
  const [input, setInput] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const router = useRouter()

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage = { role: "user" as const, content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response after a delay
    setTimeout(() => {
      const responses = [
        "그것에 대해 더 자세히 알려주실 수 있을까요?",
        "이해했습니다. 제가 도와드리겠습니다.",
        "흥미로운 질문이네요. 생각해볼게요.",
        "좋은 질문입니다! 다음과 같이 생각해보세요...",
        "그 문제를 해결하기 위한 몇 가지 방법이 있습니다.",
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      setMessages((prev) => [...prev, { role: "assistant", content: randomResponse }])
      setIsLoading(false)
    }, 1500)
  }

  // Scroll to bottom when messages change
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-48 bg-white">
        <div className="p-4 py-6">
          <div className="flex items-center justify-center">
            <img
              src="https://birzont.github.io/BirzontArchive/res/birzont_black.png"
              alt="Birzont Logo"
              className="h-7 w-32 object-contain"
            />
          </div>
        </div>
        <div className="p-4 space-y-1">
          <Button variant="ghost" className="w-full justify-start gap-2" style={{ borderRadius: "12px" }} asChild>
            <Link href="/">
              <ArrowUp className="h-4 w-4" />
              Home
            </Link>
          </Button>
          <Button variant="secondary" className="w-full justify-start gap-2" style={{ borderRadius: "12px" }} asChild>
            <Link href="/agent">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              Agent
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2" style={{ borderRadius: "12px" }} asChild>
            <Link href="/explore">
              <Compass className="h-4 w-4" />
              Explore
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2" style={{ borderRadius: "12px" }} asChild>
            <Link href="/create">
              <PlusCircle className="h-4 w-4" />
              Create
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2" style={{ borderRadius: "12px" }} asChild>
            <Link href="/saved">
              <Bookmark className="h-4 w-4" />
              Saved
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2" style={{ borderRadius: "12px" }} asChild>
            <Link href="/ais">
              <Bot className="h-4 w-4" />
              AIs
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2" style={{ borderRadius: "12px" }} asChild>
            <Link href="/questions">
              <HelpCircle className="h-4 w-4" />
              Questions
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="flex items-center justify-between py-2 px-4 bg-[#F6F7FB]">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex items-center md:hidden">
            <Sparkles className="h-5 w-5 text-yellow-500 mr-2" />
            <h1 className="text-xl font-semibold">AI Agent</h1>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="relative group">
              <Button variant="ghost" size="icon" style={{ borderRadius: "24px" }}>
                <User className="h-5 w-5" />
              </Button>

              {/* Profile dropdown card */}
              <div className="absolute right-0 mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out z-50">
                <div
                  className="bg-white shadow-lg border border-gray-200 overflow-hidden"
                  style={{ borderRadius: "24px" }}
                >
                  <div className="p-4 border-b">
                    <div className="flex items-center">
                      <div
                        className="h-10 w-10 bg-gray-200 flex items-center justify-center"
                        style={{ borderRadius: "24px" }}
                      >
                        <User className="h-6 w-6 text-gray-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">사용자 이름</p>
                        <p className="text-xs text-gray-500">user@example.com</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <button
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                      style={{ borderRadius: "24px" }}
                      onClick={() => router.push("/profile")}
                    >
                      프로필 보기
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                      style={{ borderRadius: "24px" }}
                      onClick={() => router.push("/settings")}
                    >
                      설정
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                      style={{ borderRadius: "24px" }}
                      onClick={() => {
                        // Here you would typically call a logout function
                        console.log("Logging out...")
                        router.push("/login")
                      }}
                    >
                      로그아웃
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Agent Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#f6f7fb]">
          <div className="p-4 flex items-center justify-between bg-white border-b">
            <div className="flex items-center">
              <Sparkles className="h-5 w-5 text-yellow-500 mr-2" />
              <h1 className="text-xl font-semibold">AI Agent</h1>
            </div>
            <Button variant="outline" size="sm" style={{ borderRadius: "12px" }}>
              <RefreshCw className="h-4 w-4 mr-2" />새 대화
            </Button>
          </div>

          <div className="flex-1 overflow-auto p-4">
            <div className="max-w-4xl mx-auto">
              <Card className="mb-4" style={{ borderRadius: "24px" }}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="h-5 w-5 text-yellow-500 mr-2" />
                    AI 에이전트
                  </CardTitle>
                  <CardDescription>
                    AI 에이전트는 다양한 질문에 답변하고 작업을 수행할 수 있습니다. 무엇이든 물어보세요!
                  </CardDescription>
                </CardHeader>
              </Card>

              <div className="space-y-4 mb-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`flex max-w-[80%] ${
                        message.role === "user" ? "bg-blue-500 text-white" : "bg-white"
                      } p-3 rounded-2xl`}
                    >
                      <div className="mr-2 mt-0.5">
                        {message.role === "user" ? (
                          <User className="h-5 w-5" />
                        ) : (
                          <Sparkles className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                      <div>{message.content}</div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex bg-white p-3 rounded-2xl">
                      <div className="mr-2 mt-0.5">
                        <Sparkles className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div className="flex space-x-1">
                        <div
                          className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                          style={{ animationDelay: "0s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>

          <footer className="p-4 bg-white border-t">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="메시지를 입력하세요..."
                  className="flex-1"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage()
                    }
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isLoading}
                  className="ml-2"
                  style={{ borderRadius: "12px" }}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}
