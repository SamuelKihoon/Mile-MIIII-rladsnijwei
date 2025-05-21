import { Sparkles } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#f6f7fb]">
      <div className="flex items-center mb-4">
        <Sparkles className="h-6 w-6 text-yellow-500 mr-2 animate-pulse" />
        <h1 className="text-2xl font-semibold">AI Agent</h1>
      </div>
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
        <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
      </div>
    </div>
  )
}
