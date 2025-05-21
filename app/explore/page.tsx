"use client"

import React from "react"
import {
  Search,
  ArrowUp,
  PlusCircle,
  Bookmark,
  Bot,
  HelpCircle,
  Bell,
  User,
  Menu,
  ChevronDown,
  ChevronUp,
  Copy,
  ArrowUpLeft,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

// Types
type PromptItem = {
  id: number
  title: string
  description: string
  category: string
  rating: number
  price: number
  image: string
  author: string
  downloads: number
  saves: number
  type: "text" | "image" | "bundle"
  model: string
  models?: string[] // 번들에 포함된 모델 목록
}

// Types
type CategoryItem = {
  id: string
  languages: string
  category_group: string
  category_img: string
  category_name: string
  bg_color: string
  bg_hoover: string
}

// Sample data
const samplePrompts: PromptItem[] = [
  {
    id: 1,
    title: "Professional Email Writer",
    description: "Generate professional emails for any business situation",
    category: "Writing & Translation",
    rating: 4.8,
    price: 5,
    image: "/email-template-concept.png",
    author: "EmailPro",
    downloads: 310,
    saves: 100,
    type: "text",
    model: "Claude",
  },
  {
    id: 2,
    title: "SEO Blog Post Generator",
    description: "Create SEO-optimized blog posts with proper keywords",
    category: "Digital Marketing",
    rating: 4.6,
    price: 7,
    image: "/blog-writing-desk.png",
    author: "SEOMaster",
    downloads: 280,
    saves: 85,
    type: "text",
    model: "ChatGPT",
  },
  {
    id: 3,
    title: "Mountain Landscape at Sunset",
    description: "Beautiful mountain vista with dramatic lighting",
    category: "Image Generation",
    rating: 4.9,
    price: 4,
    image: "https://t4.ftcdn.net/jpg/06/78/84/37/360_F_678843798_BIFLi96iVowjCioXUSNrqsn25aH9tUgK.jpg",
    author: "ArtCreator",
    downloads: 410,
    saves: 200,
    type: "image",
    model: "Midjourney",
  },
  {
    id: 4,
    title: "Social Media Caption Generator",
    description: "Engaging captions for Instagram, Twitter, and Facebook",
    category: "Digital Marketing",
    rating: 4.5,
    price: 3,
    image: "/interconnected-social-media.png",
    author: "SocialPro",
    downloads: 290,
    saves: 120,
    type: "text",
    model: "Claude",
  },
  {
    id: 5,
    title: "Vibe - Coding Prompts Documentation",
    description: "This prompt helps you when vibe coding and building some Apps with detailed documentation",
    category: "Programming & Tech",
    rating: 4.9,
    price: 9,
    image: "/programming-code-abstract.png",
    author: "CodeMaster",
    downloads: 310,
    saves: 100,
    type: "text",
    model: "Claude",
  },
  {
    id: 6,
    title: "Futuristic Cityscape",
    description: "Cyberpunk-inspired urban landscape with neon lights",
    category: "Image Generation",
    rating: 4.7,
    price: 6,
    image: "/abstract-ai-art.png",
    author: "DigitalArtist",
    downloads: 380,
    saves: 175,
    type: "image",
    model: "Midjourney",
  },
  {
    id: 7,
    title: "인스타그램 마케팅 번들 프롬프트",
    description: "인스타그램 마케팅에 필요한 모든 프롬프트가 포함된 번들 패키지",
    category: "Digital Marketing",
    rating: 4.9,
    price: 19,
    image: "/placeholder.svg",
    author: "MarketingPro",
    downloads: 450,
    saves: 320,
    type: "bundle",
    model: "Multiple",
    models: ["ChatGPT", "Claude", "Midjourney"],
  },
  {
    id: 8,
    title: "AI 아트 크리에이터 번들",
    description: "다양한 스타일의 AI 아트를 생성하는 프롬프트 모음",
    category: "Image Generation",
    rating: 4.8,
    price: 24,
    image: "/placeholder.svg",
    author: "ArtistAI",
    downloads: 380,
    saves: 290,
    type: "bundle",
    model: "Multiple",
    models: ["Midjourney", "Stable Diffusion", "DALL-E"],
  },
  {
    id: 9,
    title: "비즈니스 문서 작성 번들",
    description: "비즈니스 계획서, 제안서, 보고서 등 다양한 문서 작성 프롬프트",
    category: "Business",
    rating: 4.7,
    price: 29,
    image: "/placeholder.svg",
    author: "BusinessWriter",
    downloads: 320,
    saves: 240,
    type: "bundle",
    model: "Multiple",
    models: ["ChatGPT", "Claude", "Perplexity", "Grok", "Gemini"],
  },
]

// Star rating component
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      <div className="text-yellow-400 mr-1">★</div>
      <span className="text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
  )
}

// Prompt card component
const PromptCard = ({ prompt }: { prompt: PromptItem }) => {
  if (prompt.type === "image") {
    return (
      <Card className="aspect-[16/10] flex flex-col overflow-hidden rounded-xl group transition-all duration-300 hover:scale-105">
        <div className="relative">
          {/* Model badge */}
          <div className="absolute top-3 left-3 z-10 flex items-center bg-white rounded-lg pl-1 pr-2 py-1 shadow-sm">
            <div className="w-7 h-7 mr-1.5">
              {prompt.model === "Midjourney" ? (
                <div className="w-7 h-7 bg-[#383640] rounded-md flex items-center justify-center overflow-hidden">
                  <img
                    src="https://companieslogo.com/img/orig/midjourney.D-733962ee.png?t=1720244494"
                    alt="Midjourney"
                    className="w-5 h-5 object-contain"
                  />
                </div>
              ) : prompt.model === "ChatGPT" ? (
                <div className="w-7 h-7 bg-[#FFFFFF] rounded-md flex items-center justify-center overflow-hidden border border-gray-200">
                  <img
                    src="https://img.icons8.com/m_rounded/512/chatgpt.png"
                    alt="ChatGPT"
                    className="w-5 h-5 object-contain"
                  />
                </div>
              ) : (
                <div className="w-7 h-7 bg-[#db8848] rounded-md flex items-center justify-center overflow-hidden">
                  <img
                    src="https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/claude.png"
                    alt="Claude"
                    className="w-5 h-5 object-contain"
                  />
                </div>
              )}
            </div>
            <span className="text-base font-medium">{prompt.model}</span>
          </div>

          {/* Stats */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
            <div className="flex items-center bg-white rounded-md px-2 py-1 text-sm shadow-sm group-hover:text-blue-700">
              <Copy className="h-4 w-4 mr-1.5" />
              <span>{prompt.downloads}</span>
            </div>
            <div className="flex items-center bg-white rounded-md px-2 py-1 text-sm shadow-sm group-hover:text-blue-700">
              <Bookmark className="h-4 w-4 mr-1.5" />
              <span>{prompt.saves}</span>
            </div>
          </div>

          {/* Image */}
          <div className="flex-grow w-full">
            <div className="aspect-[21/9] w-full overflow-hidden">
              <img src={prompt.image || "/placeholder.svg"} alt={prompt.title} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
        <CardContent className="p-3">
          <h3 className="font-medium text-lg group-hover:text-blue-700 transition-colors duration-300">
            {prompt.title}
          </h3>
          <div className="flex justify-between items-center text-sm text-gray-600 -mt-0.5">
            <span className="group-hover:text-blue-700 transition-colors duration-300">by {prompt.author}</span>
            <div className="flex items-center">
              <span className="mr-1 group-hover:text-blue-700 transition-colors duration-300">
                🪙 {prompt.price.toFixed(2)}
              </span>
              <ArrowUpLeft className="h-3.5 w-3.5 group-hover:text-blue-700 transition-colors duration-300" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (prompt.type === "bundle") {
    return (
      <Card className="aspect-[16/10] flex flex-col overflow-hidden rounded-xl group transition-all duration-300 hover:scale-105">
        <div className="p-3 flex flex-col h-full bg-[#f2f2ed]">
          {/* 상단 영역: 모델 아이콘(왼쪽)과 통계(오른쪽) */}
          <div className="flex justify-between items-start mb-3">
            {/* 모델 아이콘 표시 - 동적으로 렌더링 */}
            <div className="flex justify-start gap-2">
              {(prompt.models || ["ChatGPT"]).map((modelName, index) => {
                // 최대 5개까지만 표시
                if (index >= 5) return null

                return (
                  <div
                    key={modelName}
                    className={`w-7 h-7 ${
                      modelName === "Claude"
                        ? "bg-[#db8848]"
                        : modelName === "ChatGPT"
                          ? "bg-[#FFFFFF] border border-gray-200"
                          : modelName === "Midjourney"
                            ? "bg-[#383640]"
                            : modelName === "Perplexity"
                              ? "bg-[#0a6469]"
                              : modelName === "Grok"
                                ? "bg-[#000000]"
                                : modelName === "Stable Diffusion"
                                  ? "bg-[#7e64e6]"
                                  : modelName === "DALL-E"
                                    ? "bg-[#10a37f]"
                                    : modelName === "Gemini"
                                      ? "bg-[#1e88e5]"
                                      : "bg-gray-200"
                    } rounded-md flex items-center justify-center overflow-hidden`}
                  >
                    <img
                      src={
                        modelName === "Claude"
                          ? "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/claude.png"
                          : modelName === "ChatGPT"
                            ? "https://img.icons8.com/m_rounded/512/chatgpt.png"
                            : modelName === "Midjourney"
                              ? "https://companieslogo.com/img/orig/midjourney.D-733962ee.png?t=1720244494"
                              : modelName === "Perplexity"
                                ? "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/perplexity.png"
                                : modelName === "Grok"
                                  ? "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/grok.png"
                                  : modelName === "Stable Diffusion"
                                    ? "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/stable-diffusion.png"
                                    : modelName === "DALL-E"
                                      ? "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/dalle.png"
                                      : modelName === "Gemini"
                                        ? "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/gemini.png"
                                        : "/placeholder.svg"
                      }
                      alt={modelName}
                      className="w-5 h-5 object-contain"
                      onError={(e) => {
                        e.currentTarget.src = "https://birzont.github.io/BirzontArchive/res/birzont_bicon.png"
                      }}
                    />
                  </div>
                )
              })}
            </div>

            {/* 통계 - 오른쪽 상단 */}
            <div className="flex items-center gap-2">
              <div className="flex items-center px-2 py-1 text-sm group-hover:text-blue-700">
                <Copy className="h-4 w-4 mr-1.5" />
                <span>{prompt.downloads}</span>
              </div>
              <div className="flex items-center px-2 py-1 text-sm group-hover:text-blue-700">
                <Bookmark className="h-4 w-4 mr-1.5" />
                <span>{prompt.saves}</span>
              </div>
            </div>
          </div>

          {/* 제목 - 정중앙에 배치 */}
          <div className="flex-grow flex items-center justify-center">
            <h3 className="font-bold text-lg text-center group-hover:text-blue-700 transition-colors duration-300">
              {prompt.title}
            </h3>
          </div>

          {/* 하단 정보 - 작성자(좌측)와 가격(우측) */}
          <div className="flex justify-between items-center text-sm text-gray-600 mt-auto">
            <span className="group-hover:text-blue-700 transition-colors duration-300">by {prompt.author}</span>
            <div className="flex items-center">
              <span className="mr-1 group-hover:text-blue-700 transition-colors duration-300">
                🪙 {Math.round(prompt.price)}
              </span>
              <ArrowUpLeft className="h-3.5 w-3.5 group-hover:text-blue-700 transition-colors duration-300" />
            </div>
          </div>
        </div>
      </Card>
    )
  }

  // Text prompt card
  return (
    <Card className="aspect-[16/10] flex flex-col overflow-hidden rounded-xl group transition-all duration-300 hover:scale-105">
      <div className="p-3 flex flex-col h-full">
        {/* Header with model and stats */}
        <div className="relative mb-3">
          <div className="inline-flex items-center bg-gray-100 rounded-lg pl-1 pr-2 py-1">
            <div className="w-7 h-7 mr-1.5">
              {prompt.model === "Claude" ? (
                <div className="w-7 h-7 bg-[#db8848] rounded-md flex items-center justify-center overflow-hidden">
                  <img
                    src="https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/claude.png"
                    alt="Claude"
                    className="w-5 h-5 object-contain"
                  />
                </div>
              ) : prompt.model === "ChatGPT" ? (
                <div className="w-7 h-7 bg-[#FFFFFF] rounded-md flex items-center justify-center overflow-hidden border border-gray-200">
                  <img
                    src="https://img.icons8.com/m_rounded/512/chatgpt.png"
                    alt="ChatGPT"
                    className="w-5 h-5 object-contain"
                  />
                </div>
              ) : (
                <div className="w-7 h-7 bg-[#383640] rounded-md flex items-center justify-center overflow-hidden">
                  <img
                    src="https://companieslogo.com/img/orig/midjourney.D-733962ee.png?t=1720244494"
                    alt="Midjourney"
                    className="w-5 h-5 object-contain"
                  />
                </div>
              )}
            </div>
            <span className="text-base font-medium">{prompt.model}</span>
          </div>

          <div className="absolute top-0 right-0 z-10 flex items-center gap-2">
            <div className="flex items-center bg-white/90 rounded-md px-2 py-1 text-sm shadow-sm group-hover:text-blue-700">
              <Copy className="h-4 w-4 mr-1.5" />
              <span>{prompt.downloads}</span>
            </div>
            <div className="flex items-center bg-white/90 rounded-md px-2 py-1 text-sm shadow-sm group-hover:text-blue-700">
              <Bookmark className="h-4 w-4 mr-1.5" />
              <span>{prompt.saves}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <h3 className="font-medium text-lg mb-1 group-hover:text-blue-700 transition-colors duration-300">
          {prompt.title}
        </h3>
        <p className="text-sm text-gray-700 mb-3 line-clamp-3 group-hover:text-blue-700 transition-colors duration-300">
          {prompt.description}
        </p>
        <div className="flex justify-between items-center text-sm text-gray-600 mt-auto">
          <span className="group-hover:text-blue-700 transition-colors duration-300">by {prompt.author}</span>
          <div className="flex items-center">
            <span className="mr-1 group-hover:text-blue-700 transition-colors duration-300">
              🪙 {prompt.price.toFixed(2)}
            </span>
            <ArrowUpLeft className="h-3.5 w-3.5 group-hover:text-blue-700 transition-colors duration-300" />
          </div>
        </div>
      </div>
    </Card>
  )
}

export default function ExplorePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("all")
  const [isCategoryExpanded, setIsCategoryExpanded] = React.useState(false)
  const [categories, setCategories] = React.useState<CategoryItem[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = React.useState(true)

  React.useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoadingCategories(true)
        const { data, error } = await supabase
          .from("categories")
          .select("id, languages, category_group, category_img, category_name, bg_color, bg_hoover")

        if (error) {
          console.error("Error fetching categories:", error)
          return
        }

        setCategories(data || [])
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setIsLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  // Filter prompts based on search query and category
  const filteredPrompts = samplePrompts.filter((prompt) => {
    const matchesSearch =
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "all" || prompt.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Categories for the horizontal scrolling section
  // const categories = [
  //   { id: "tech", name: "Programs Tech", icon: <Code className="h-4 w-4" /> },
  //   { id: "marketing", name: "Digital Marketing", icon: <TrendingUp className="h-4 w-4" /> },
  //   { id: "video", name: "About Videos", icon: <Play className="h-4 w-4" /> },
  //   { id: "art", name: "Art Works", icon: <Pencil className="h-4 w-4" /> },
  //   { id: "music", name: "Music Prompt", icon: <Music className="h-4 w-4" /> },
  //   { id: "bot", name: "Bot Prompt", icon: <Bot className="h-4 w-4" /> },
  //   { id: "feeling", name: "Feeling Prompts", icon: <Smile className="h-4 w-4" /> },
  // ]

  const sortedPrompts = [...samplePrompts].sort((a, b) => b.rating - a.rating)

  return (
    <div className="flex h-screen">
      {/* Keep the sidebar unchanged */}
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
          <Button variant="secondary" className="w-full justify-start gap-2" style={{ borderRadius: "12px" }} asChild>
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
        <header className="flex items-center justify-between p-4 bg-gray-50">
          {/* Left section */}
          <div className="flex items-center gap-4 w-1/4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
            <div className="md:hidden h-8 w-20 border rounded-md flex items-center justify-center font-bold">Logo</div>
          </div>

          {/* Center section - Search */}
          <div className="hidden md:flex justify-center items-center w-2/4">
            <div className="relative w-96">
              <Input type="text" placeholder="Search..." className="pr-10 h-10" />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2 justify-end w-1/4">
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
        <main className="flex-1 overflow-auto p-6 bg-[#F6F7FB]">
          <div className="max-w-6xl mx-auto">
            {/* Category Navigation */}
            <div className="mb-6 bg-[#e8d6ca] p-4 rounded-xl">
              <div className="mb-3">
                <h3 className="text-lg font-semibold">Categories</h3>
              </div>
              <div className="relative">
                {/* Gradient overlay on the right side - only shown when not expanded */}
                {!isCategoryExpanded && (
                  <div className="absolute right-0 top-0 bottom-0 w-48 bg-gradient-to-r from-transparent via-[#e8d6ca]/70 to-[#e8d6ca] z-10 pointer-events-none"></div>
                )}
                {!isCategoryExpanded && (
                  <div className="absolute right-0 top-0 bottom-0 w-[120px] flex pointer-events-none z-10">
                    <div className="w-1/3 opacity-30"></div>
                    <div className="w-1/3 opacity-60"></div>
                    <div className="w-1/3 opacity-90 bg-[#e8d6ca]"></div>
                  </div>
                )}

                {/* "..." button positioned over the gradient */}
                <Button
                  className={`absolute z-20 bg-gray-700 hover:bg-gray-800 text-white px-3 py-2 rounded-lg ${
                    isCategoryExpanded ? "right-2 bottom-2" : "right-2 top-1/2 -translate-y-1/2"
                  }`}
                  onClick={() => setIsCategoryExpanded(!isCategoryExpanded)}
                >
                  {isCategoryExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </Button>

                <div className={`flex flex-wrap gap-[15px] items-center ${isCategoryExpanded ? "" : ""}`}>
                  {isLoadingCategories ? (
                    // 로딩 상태 표시
                    Array(6)
                      .fill(0)
                      .map((_, index) => (
                        <Card
                          key={`skeleton-${index}`}
                          className="aspect-square flex flex-col p-2.5 bg-white w-[120px] rounded-2xl animate-pulse"
                        >
                          <div className="h-12 w-12 bg-gray-200 rounded-lg mb-auto"></div>
                          <div className="h-5 bg-gray-200 rounded w-full mt-auto"></div>
                        </Card>
                      ))
                  ) : categories.length === 0 ? (
                    // 카테고리가 없는 경우
                    <p className="text-center py-4 text-gray-500 w-full">등록된 카테고리가 없습니다.</p>
                  ) : (
                    // 카테고리 표시
                    categories.map((category) => (
                      <Card
                        key={category.id}
                        className={`aspect-square flex flex-col p-2.5 bg-white hover:bg-[${
                          category.bg_hoover || "#f8f8f8"
                        }] cursor-pointer w-[120px] rounded-2xl`}
                        onClick={() => {
                          router.push(`/navigator/${category.category_group.toLowerCase().replace(/\s+/g, "-")}`)
                        }}
                      >
                        <div
                          className="h-12 w-12 rounded-lg flex items-center justify-center overflow-hidden"
                          style={{ backgroundColor: category.bg_color || "#ffffff" }}
                        >
                          <img
                            src={category.category_img || "/placeholder.svg"}
                            alt={category.category_name}
                            className="w-8 h-8 object-contain"
                            onError={(e) => {
                              e.currentTarget.src = "https://birzont.github.io/BirzontArchive/res/birzont_bicon.png"
                            }}
                          />
                        </div>
                        <div className="mt-auto">
                          <p className="text-base font-medium">{category.category_name}</p>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Featured Content Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Featured Contents</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedPrompts.slice(0, 6).map((prompt) => (
                  <PromptCard key={prompt.id} prompt={prompt} />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
