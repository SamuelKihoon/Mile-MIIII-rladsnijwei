"use client"

import { useState } from "react"
import { ArrowUp, Search, PlusCircle, Bookmark, Bot, HelpCircle, ExternalLink, Bell, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Types
type AITool = {
  id: number
  name: string
  description: string
  category: string
  useCases: string[]
  image: string
  url: string
  pricing: string
  rating: number
  features: string[]
}

// Sample data
const aiTools: AITool[] = [
  {
    id: 1,
    name: "ChatGPT",
    description: "Conversational AI assistant that can answer questions, write content, and assist with various tasks.",
    category: "Text Generation",
    useCases: ["Content Writing", "Coding Assistance", "Learning", "Creative Writing"],
    image: "/chatgpt-logo-inspired.png",
    url: "https://chat.openai.com",
    pricing: "Free / $20 per month",
    rating: 4.8,
    features: [
      "Natural language understanding",
      "Code generation",
      "Multiple knowledge domains",
      "Conversation memory",
    ],
  },
  {
    id: 2,
    name: "Claude",
    description: "Advanced AI assistant with strong reasoning capabilities and longer context windows.",
    category: "Text Generation",
    useCases: ["Document Analysis", "Research", "Content Creation", "Problem Solving"],
    image: "/abstract-ai-logo.png",
    url: "https://claude.ai",
    pricing: "Free / $20 per month",
    rating: 4.7,
    features: ["100K+ token context", "Document understanding", "Thoughtful responses", "Reduced hallucinations"],
  },
  {
    id: 3,
    name: "MidJourney",
    description: "AI image generator that creates stunning artwork and realistic images from text descriptions.",
    category: "Image Generation",
    useCases: ["Digital Art", "Concept Design", "Marketing Materials", "Illustrations"],
    image: "/midjourney-ai-art.png",
    url: "https://www.midjourney.com",
    pricing: "From $10 per month",
    rating: 4.9,
    features: ["High-quality images", "Style customization", "Fast generation", "Community features"],
  },
  {
    id: 4,
    name: "DALL-E",
    description: "AI system that creates realistic images and art from natural language descriptions.",
    category: "Image Generation",
    useCases: ["Creative Design", "Marketing", "Concept Art", "Social Media Content"],
    image: "/abstract-ai-art.png",
    url: "https://openai.com/dall-e-3",
    pricing: "Usage-based pricing",
    rating: 4.6,
    features: ["Photorealistic images", "Follows detailed instructions", "Editing capabilities", "Commercial usage"],
  },
  {
    id: 5,
    name: "Perplexity",
    description: "AI-powered search engine that provides comprehensive answers with cited sources.",
    category: "Research",
    useCases: ["Academic Research", "Fact Checking", "Learning", "Information Gathering"],
    image: "/perplexity-ai-logo.png",
    url: "https://www.perplexity.ai",
    pricing: "Free / $20 per month",
    rating: 4.5,
    features: ["Real-time information", "Source citations", "Conversational interface", "Deep research"],
  },
  {
    id: 6,
    name: "Copilot",
    description: "AI pair programmer that helps write better code by suggesting whole lines or blocks of code.",
    category: "Coding",
    useCases: ["Software Development", "Code Completion", "Learning to Code", "Debugging"],
    image: "/github-copilot-logo.png",
    url: "https://github.com/features/copilot",
    pricing: "$10 per month",
    rating: 4.7,
    features: ["Code suggestions", "Multiple languages", "IDE integration", "Comment-to-code"],
  },
  {
    id: 7,
    name: "Jasper",
    description: "AI content platform designed to help create marketing copy, blog posts, and other content.",
    category: "Content Creation",
    useCases: ["Marketing Copy", "Blog Posts", "Social Media", "Email Campaigns"],
    image: "/abstract-ai-logo.png",
    url: "https://www.jasper.ai",
    pricing: "From $39 per month",
    rating: 4.4,
    features: ["Templates", "Brand voice", "SEO optimization", "Team collaboration"],
  },
  {
    id: 8,
    name: "Stable Diffusion",
    description: "Open-source AI image generation model capable of creating detailed images from text descriptions.",
    category: "Image Generation",
    useCases: ["Digital Art", "Design", "Prototyping", "Creative Projects"],
    image: "/stable-diffusion-abstract.png",
    url: "https://stability.ai",
    pricing: "Free / Self-hosted",
    rating: 4.5,
    features: ["Open source", "Local installation", "Community models", "Customization"],
  },
]

// Categories
const pricingCategories = [
  "All",
  "Completely free to use",
  "Free trial available",
  "Paid users only",
  "Paid, expensive",
]

// Helper function to determine pricing category
const getPricingCategory = (pricing: string): string => {
  if (pricing.toLowerCase().includes("free") && !pricing.toLowerCase().includes("$")) {
    return "Completely free to use"
  } else if (pricing.toLowerCase().includes("free") && pricing.toLowerCase().includes("$")) {
    return "Free trial available"
  } else if (pricing.toLowerCase().includes("$39") || pricing.toLowerCase().includes("$20")) {
    return "Paid, expensive"
  } else {
    return "Paid users only"
  }
}

// Use cases
const useCases = [
  "All",
  "Content Writing",
  "Coding Assistance",
  "Digital Art",
  "Research",
  "Marketing",
  "Learning",
  "Design",
]

export default function AIsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedUseCase, setSelectedUseCase] = useState("All")

  // Filter AI tools based on search, category, and use case
  const filteredTools = aiTools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())

    const pricingCategory = getPricingCategory(tool.pricing)
    const matchesCategory = selectedCategory === "All" || pricingCategory === selectedCategory

    const matchesUseCase = selectedUseCase === "All" || tool.useCases.some((useCase) => useCase === selectedUseCase)

    return matchesSearch && matchesCategory && matchesUseCase
  })

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-48 border-r bg-white">
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
          <Button variant="ghost" className="w-full justify-start gap-2" style={{ borderRadius: "12px" }} asChild>
            <Link href="/explore">
              <Search className="h-4 w-4" />
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
          <Button variant="secondary" className="w-full justify-start gap-2" style={{ borderRadius: "12px" }} asChild>
            <Link href="/ais">
              <Bot className="h-4 w-4" />
              AIs
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2" style={{ borderRadius: "12px" }}>
            <HelpCircle className="h-4 w-4" />
            Questions
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="flex items-center justify-between p-4 bg-gray-50">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
          <div className="md:hidden h-8 w-20 border rounded-md flex items-center justify-center font-bold">Logo</div>
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="relative group">
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
              <div className="absolute right-0 mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out z-50">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
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
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                      onClick={() => router.push("/profile")}
                    >
                      프로필 보기
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                      onClick={() => router.push("/settings")}
                    >
                      설정
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                      onClick={() => {
                        console.log("로그아웃 처리...")
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
        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">AI Tools Directory</h1>
              <p className="text-gray-600">
                Discover the perfect AI tools for your specific needs. Browse by category or use case to find the right
                solution.
              </p>
            </div>

            {/* Search and Filter Section */}
            <div className="mb-8 flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Input
                  type="text"
                  placeholder="Search AI tools..."
                  className="pr-10 h-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Category Tabs */}
            <Tabs defaultValue="All" className="mb-6" onValueChange={setSelectedCategory}>
              <TabsList className="mb-4">
                {pricingCategories.map((category) => (
                  <TabsTrigger key={category} value={category}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Use Case Filter */}
              <div className="mb-6 flex flex-wrap gap-2">
                {useCases.map((useCase) => (
                  <Badge
                    key={useCase}
                    variant={selectedUseCase === useCase ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedUseCase(useCase)}
                  >
                    {useCase}
                  </Badge>
                ))}
              </div>

              {/* AI Tools Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map((tool) => (
                  <AIToolCard key={tool.id} tool={tool} />
                ))}
              </div>

              {filteredTools.length === 0 && (
                <div className="text-center py-12">
                  <Bot className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700">No AI tools found</h3>
                  <p className="text-gray-500 mt-2">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                </div>
              )}
            </Tabs>

            {/* AI Recommendation Section */}
            <div className="mt-12 bg-gray-50 p-6 rounded-xl">
              <h2 className="text-2xl font-bold mb-4">Need help choosing?</h2>
              <p className="mb-6">
                Not sure which AI tool is right for your needs? Answer a few questions and we'll recommend the best
                options for you.
              </p>
              <Button>Get Personalized Recommendations</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

// AI Tool Card Component
function AIToolCard({ tool }: { tool: AITool }) {
  return (
    <Card className="h-full flex flex-col">
      <div className="px-2 py-3 flex items-center justify-center">
        <div className="w-full aspect-video overflow-hidden rounded-lg">
          <img
            src={tool.image || "/placeholder.svg"}
            alt={tool.name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>
      <CardHeader className="py-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{tool.name}</CardTitle>
            <CardDescription className="text-sm">{getPricingCategory(tool.pricing)}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-700 mb-4">{tool.description}</p>
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Best for:</h4>
          <div className="flex flex-wrap gap-1">
            {tool.useCases.map((useCase, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {useCase}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t pt-4">
        <div className="text-sm font-medium">{tool.pricing}</div>
        <Button size="sm" className="gap-1 w-36" asChild>
          <a href={tool.url} target="_blank" rel="noopener noreferrer">
            Visit Website <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
