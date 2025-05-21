"use client"

import React from "react"
import { useParams } from "next/navigation"
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
  Code,
  TrendingUp,
  Play,
  Pencil,
  Music,
  Smile,
  ChevronDown,
  Copy,
  ArrowUpLeft,
  ChevronUp,
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
  created_at?: string
  copied?: number
  saved?: number
  res1?: string
  created_user_handle?: string
  token_price?: number
  prompt_model?: string
  prompt_type?: string
}

type Subcategory = {
  id: string
  subcategory_name: string
  category_group: string
  languages: string
  icon_color: string
  icon_name: string
  subca_img: string
  bg_color: string
  subca_name: string
  main_category_group: string
}

type AIModel = {
  id: string
  model: string
  model_text: string
  model_icon: string
  model_iconbg: string
  ranking: number
}

// Sample data
const samplePrompts: PromptItem[] = [
  {
    id: 1,
    title: "Professional Email Writer",
    description: "Generate professional emails for any business situation",
    category: "Writing & Translation",
    rating: 4.8,
    price: 5.99,
    image: "/email-template-concept.png",
    author: "EmailPro",
    downloads: 310,
    saves: 100,
    type: "text",
    model: "ChatGPT",
  },
  {
    id: 2,
    title: "SEO Blog Post Generator",
    description: "Create SEO-optimized blog posts with proper keywords",
    category: "Digital Marketing",
    rating: 4.6,
    price: 7.99,
    image: "/blog-writing-desk.png",
    author: "SEOMaster",
    downloads: 280,
    saves: 85,
    type: "text",
    model: "Claude",
  },
  {
    id: 3,
    title: "Mountain Landscape at Sunset",
    description: "Beautiful mountain vista with dramatic lighting",
    category: "Image Generation",
    rating: 4.9,
    price: 4.99,
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
    price: 3.99,
    image: "/interconnected-social-media.png",
    author: "SocialPro",
    downloads: 290,
    saves: 120,
    type: "text",
    model: "Grok",
  },
  {
    id: 5,
    title: "n8n 인스타그램 자동 포스팅 프롬프트",
    description: "This prompt helps you when vibe coding and building some Apps with detailed documentation",
    category: "Programming & Tech",
    rating: 4.9,
    price: 9.99,
    image: "/programming-code-abstract.png",
    author: "CodeMaster",
    downloads: 310,
    saves: 100,
    type: "text",
    model: "Perplexity",
  },
  {
    id: 6,
    title: "수채화 느낌의 노을이 지는 장면",
    description: "Cyberpunk-inspired urban landscape with neon lights",
    category: "Image Generation",
    rating: 4.7,
    price: 6.99,
    image: "/abstract-ai-art.png",
    author: "DigitalArtist",
    downloads: 380,
    saves: 175,
    type: "image",
    model: "Midjourney",
  },
  // 각 모델별로 추가 프롬프트
  {
    id: 7,
    title: "Business Plan Generator",
    description: "Create comprehensive business plans with financial projections",
    category: "Business",
    rating: 4.8,
    price: 12.99,
    image: "/placeholder.svg",
    author: "BusinessGuru",
    downloads: 245,
    saves: 180,
    type: "text",
    model: "ChatGPT",
  },
  {
    id: 8,
    title: "Technical Documentation Writer",
    description: "Generate clear technical documentation for software products",
    category: "Programming & Tech",
    rating: 4.7,
    price: 8.99,
    image: "/placeholder.svg",
    author: "TechWriter",
    downloads: 215,
    saves: 95,
    type: "text",
    model: "Claude",
  },
  {
    id: 9,
    title: "Fantasy Character Portrait",
    description: "Create detailed fantasy character portraits for games and stories",
    category: "Image Generation",
    rating: 4.9,
    price: 7.99,
    image: "/placeholder.svg",
    author: "FantasyArtist",
    downloads: 350,
    saves: 270,
    type: "image",
    model: "Midjourney",
  },
  {
    id: 10,
    title: "Research Paper Analyzer",
    description: "Analyze academic papers and provide summaries and insights",
    category: "Academic",
    rating: 4.8,
    price: 5.99,
    image: "/placeholder.svg",
    author: "AcademicPro",
    downloads: 190,
    saves: 85,
    type: "text",
    model: "Perplexity",
  },
  {
    id: 11,
    title: "Witty Tweet Generator",
    description: "Create engaging and humorous tweets for social media",
    category: "Digital Marketing",
    rating: 4.6,
    price: 2.99,
    image: "/placeholder.svg",
    author: "SocialWit",
    downloads: 275,
    saves: 130,
    type: "text",
    model: "Grok",
  },
  {
    id: 12,
    title: "인스타그램 마케팅 번들 프롬프트",
    description: "인스타그램 마케팅에 필요한 모든 프롬프트가 포함된 번들 패키지",
    category: "Digital Marketing",
    rating: 4.9,
    price: 19.99,
    image: "/placeholder.svg",
    author: "MarketingPro",
    downloads: 450,
    saves: 320,
    type: "bundle",
    model: "Multiple",
    models: ["ChatGPT", "Claude", "Midjourney"],
  },
  {
    id: 13,
    title: "AI 아트 크리에이터 번들",
    description: "다양한 스타일의 AI 아트를 생성하는 프롬프트 모음",
    category: "Image Generation",
    rating: 4.8,
    price: 24.99,
    image: "/placeholder.svg",
    author: "ArtistAI",
    downloads: 380,
    saves: 290,
    type: "bundle",
    model: "Multiple",
    models: ["Midjourney", "Stable Diffusion", "DALL-E"],
  },
  {
    id: 14,
    title: "비즈니스 문서 작성 번들",
    description: "비즈니스 계획서, 제안서, 보고서 등 다양한 문서 작성 프롬프트",
    category: "Business",
    rating: 4.7,
    price: 29.99,
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
const PromptCard = ({ prompt, aiModels }: { prompt: PromptItem; aiModels: AIModel[] }) => {
  if (prompt.type === "image") {
    return (
      <Card className="aspect-[16/10] flex flex-col overflow-hidden rounded-xl group transition-all duration-300 hover:scale-105">
        <div className="relative">
          {/* Model badge */}
          <div className="absolute top-3 left-3 z-10 flex items-center bg-white rounded-lg pl-1 pr-2 py-1 shadow-sm">
            <div className="w-7 h-7 mr-1.5">
              {(() => {
                const modelName = prompt.prompt_model || prompt.model
                const modelInfo = aiModels.find((m) => m.model === modelName)

                if (modelInfo) {
                  return (
                    <div
                      className="w-7 h-7 rounded-md flex items-center justify-center overflow-hidden"
                      style={{ backgroundColor: modelInfo.model_iconbg || "#f3f4f6" }}
                    >
                      <img
                        src={modelInfo.model_icon || "/placeholder.svg"}
                        alt={modelInfo.model_text}
                        className="w-5 h-5 object-contain"
                        onError={(e) => {
                          e.currentTarget.src = "https://birzont.github.io/BirzontArchive/res/birzont_bicon.png"
                        }}
                      />
                    </div>
                  )
                } else {
                  // Fallback to the old logic if model not found in aiModels
                  if (modelName === "Midjourney") {
                    return (
                      <div className="w-7 h-7 bg-[#383640] rounded-md flex items-center justify-center overflow-hidden">
                        <img
                          src="https://companieslogo.com/img/orig/midjourney.D-733962ee.png?t=1720244494"
                          alt="Midjourney"
                          className="w-5 h-5 object-contain"
                        />
                      </div>
                    )
                  } else if (modelName === "ChatGPT") {
                    return (
                      <div className="w-7 h-7 bg-[#FFFFFF] rounded-md flex items-center justify-center overflow-hidden border border-gray-200">
                        <img
                          src="https://img.icons8.com/m_rounded/512/chatgpt.png"
                          alt="ChatGPT"
                          className="w-5 h-5 object-contain"
                        />
                      </div>
                    )
                  } else {
                    return (
                      <div className="w-7 h-7 bg-[#db8848] rounded-md flex items-center justify-center overflow-hidden">
                        <img
                          src="https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/claude.png"
                          alt="Claude"
                          className="w-5 h-5 object-contain"
                        />
                      </div>
                    )
                  }
                }
              })()}
            </div>
            <span className="text-base font-medium">
              {(() => {
                const modelName = prompt.prompt_model || prompt.model
                const modelInfo = aiModels.find((m) => m.model === modelName)
                return modelInfo ? modelInfo.model_text : modelName
              })()}
            </span>
          </div>

          {/* Stats */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
            <div className="flex items-center bg-white rounded-md px-2 py-1 text-sm shadow-sm group-hover:text-blue-700">
              <Copy className="h-4 w-4 mr-1.5" />
              <span>{prompt.copied || 0}</span>
            </div>
            <div className="flex items-center bg-white rounded-md px-2 py-1 text-sm shadow-sm group-hover:text-blue-700">
              <Bookmark className="h-4 w-4 mr-1.5" />
              <span>{prompt.saved || 0}</span>
            </div>
          </div>

          {/* Image */}
          <div className="flex-grow w-full">
            <div className="aspect-[21/9] w-full overflow-hidden">
              <img
                src={prompt.res1 || prompt.image || "/placeholder.svg"}
                alt={prompt.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        <CardContent className="p-3">
          <h3 className="font-medium text-lg group-hover:text-blue-700 transition-colors duration-300">
            {prompt.title}
          </h3>
          <div className="flex justify-between items-center text-sm text-gray-600 -mt-0.5">
            <span className="group-hover:text-blue-700 transition-colors duration-300">
              by {prompt.created_user_handle || prompt.author}
            </span>
            <div className="flex items-center">
              <span className="mr-1 group-hover:text-blue-700 transition-colors duration-300">
                🪙 {Math.round(prompt.token_price || prompt.price || 0)}
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
                <span>{prompt.copied || 0}</span>
              </div>
              <div className="flex items-center px-2 py-1 text-sm group-hover:text-blue-700">
                <Bookmark className="h-4 w-4 mr-1.5" />
                <span>{prompt.saved || 0}</span>
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
              {(() => {
                const modelName = prompt.prompt_model || prompt.model
                const modelInfo = aiModels.find((m) => m.model === modelName)

                if (modelInfo) {
                  return (
                    <div
                      className="w-7 h-7 rounded-md flex items-center justify-center overflow-hidden"
                      style={{ backgroundColor: modelInfo.model_iconbg || "#f3f4f6" }}
                    >
                      <img
                        src={modelInfo.model_icon || "/placeholder.svg"}
                        alt={modelInfo.model_text}
                        className="w-5 h-5 object-contain"
                        onError={(e) => {
                          e.currentTarget.src = "https://birzont.github.io/BirzontArchive/res/birzont_bicon.png"
                        }}
                      />
                    </div>
                  )
                } else {
                  // Fallback to the old logic if model not found in aiModels
                  if (modelName === "Claude") {
                    return (
                      <div className="w-7 h-7 bg-[#db8848] rounded-md flex items-center justify-center overflow-hidden">
                        <img
                          src="https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/claude.png"
                          alt="Claude"
                          className="w-5 h-5 object-contain"
                        />
                      </div>
                    )
                  } else if (modelName === "ChatGPT") {
                    return (
                      <div className="w-7 h-7 bg-[#FFFFFF] rounded-md flex items-center justify-center overflow-hidden border border-gray-200">
                        <img
                          src="https://img.icons8.com/m_rounded/512/chatgpt.png"
                          alt="ChatGPT"
                          className="w-5 h-5 object-contain"
                        />
                      </div>
                    )
                  } else {
                    return (
                      <div className="w-7 h-7 bg-[#383640] rounded-md flex items-center justify-center overflow-hidden">
                        <img
                          src="https://companieslogo.com/img/orig/midjourney.D-733962ee.png?t=1720244494"
                          alt="Midjourney"
                          className="w-5 h-5 object-contain"
                        />
                      </div>
                    )
                  }
                }
              })()}
            </div>
            <span className="text-base font-medium">
              {(() => {
                const modelName = prompt.prompt_model || prompt.model
                const modelInfo = aiModels.find((m) => m.model === modelName)
                return modelInfo ? modelInfo.model_text : modelName
              })()}
            </span>
          </div>

          <div className="absolute top-0 right-0 z-10 flex items-center gap-2">
            <div className="flex items-center bg-white/90 rounded-md px-2 py-1 text-sm shadow-sm group-hover:text-blue-700">
              <Copy className="h-4 w-4 mr-1.5" />
              <span>{prompt.copied || 0}</span>
            </div>
            <div className="flex items-center bg-white/90 rounded-md px-2 py-1 text-sm shadow-sm group-hover:text-blue-700">
              <Bookmark className="h-4 w-4 mr-1.5" />
              <span>{prompt.saved || 0}</span>
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
          <span className="group-hover:text-blue-700 transition-colors duration-300">
            by {prompt.created_user_handle || prompt.author}
          </span>
          <div className="flex items-center">
            <span className="mr-1 group-hover:text-blue-700 transition-colors duration-300">
              🪙 {Math.round(prompt.token_price || prompt.price || 0)}
            </span>
            <ArrowUpLeft className="h-3.5 w-3.5 group-hover:text-blue-700 transition-colors duration-300" />
          </div>
        </div>
      </div>
    </Card>
  )
}

export default function NavigatorPage() {
  const params = useParams()
  // 하이픈을 공백으로 변환
  const navigatorId = typeof params.id === "string" ? params.id.replace(/-/g, " ") : params.id
  const router = useRouter()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("all")
  const [isCategoryExpanded, setIsCategoryExpanded] = React.useState(false)
  const [selectedModel, setSelectedModel] = React.useState("all")
  const [isModelDropdownOpen, setIsModelDropdownOpen] = React.useState(false)
  const [subcategories, setSubcategories] = React.useState<Subcategory[]>([])
  const [dbPrompts, setDbPrompts] = React.useState<any[]>([])
  const [aiModels, setAiModels] = React.useState<AIModel[]>([])

  const [selectedSort, setSelectedSort] = React.useState("popular")
  const [selectedPrice, setSelectedPrice] = React.useState("all")
  const [selectedSource, setSelectedSource] = React.useState("all")

  React.useEffect(() => {
    async function fetchSubcategories() {
      try {
        const { data, error } = await supabase.from("subcategories").select("*").eq("main_category_group", navigatorId)

        if (error) {
          console.error("Error fetching subcategories:", error)
          return
        }

        setSubcategories(data || [])
      } catch (error) {
        console.error("Failed to fetch subcategories:", error)
      }
    }

    fetchSubcategories()
  }, [navigatorId])

  React.useEffect(() => {
    async function fetchPrompts() {
      try {
        const { data, error } = await supabase.from("prompts").select("*").eq("category", navigatorId)

        if (error) {
          console.error("Error fetching prompts:", error)
          return
        }

        setDbPrompts(data || [])
      } catch (error) {
        console.error("Failed to fetch prompts:", error)
      }
    }

    fetchPrompts()
  }, [navigatorId])

  React.useEffect(() => {
    async function fetchAIModels() {
      try {
        const { data, error } = await supabase.from("aimodels").select("*").order("ranking", { ascending: false })

        if (error) {
          console.error("Error fetching AI models:", error)
          return
        }

        setAiModels(data || [])
      } catch (error) {
        console.error("Failed to fetch AI models:", error)
      }
    }

    fetchAIModels()
  }, [])

  // Filter and sort prompts based on all selections
  const filteredPrompts = React.useMemo(() => {
    // Start with all prompts
    let filtered = [...samplePrompts, ...dbPrompts]

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (prompt) =>
          prompt.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prompt.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((prompt) => prompt.category === selectedCategory)
    }

    // Filter by model
    if (selectedModel !== "all") {
      // Find the corresponding model in aiModels
      const selectedAiModel = aiModels.find((model) => model.model === selectedModel)

      if (selectedAiModel) {
        filtered = filtered.filter(
          (prompt) => prompt.prompt_model === selectedAiModel.model || prompt.model === selectedAiModel.model,
        )
      } else {
        // Fallback to the old logic if the model is not found in aiModels
        const modelName =
          selectedModel === "chatgpt"
            ? "ChatGPT"
            : selectedModel === "claude"
              ? "Claude"
              : selectedModel === "midjourney"
                ? "Midjourney"
                : selectedModel === "perplexity"
                  ? "Perplexity"
                  : selectedModel === "grok"
                    ? "Grok"
                    : ""

        filtered = filtered.filter(
          (prompt) =>
            (prompt.prompt_model && prompt.prompt_model === modelName) || (prompt.model && prompt.model === modelName),
        )
      }
    }

    // Filter by price
    if (selectedPrice === "free") {
      filtered = filtered.filter(
        (prompt) =>
          (prompt.token_price !== undefined && prompt.token_price === 0) ||
          (prompt.price !== undefined && prompt.price === 0),
      )
    }

    // Filter by source
    if (selectedSource === "birzont") {
      filtered = filtered.filter((prompt) => prompt.created_user_handle === "Birzont")
    } else if (selectedSource === "community") {
      filtered = filtered.filter((prompt) => prompt.created_user_handle !== "Birzont")
    }

    // Sort prompts
    if (selectedSort === "popular") {
      filtered.sort((a, b) => (b.copied || 0) - (a.copied || 0))
    } else if (selectedSort === "newest") {
      filtered.sort((a, b) => {
        // If created_at exists for both, compare them
        if (a.created_at && b.created_at) {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        }
        // If only one has created_at, prioritize that one
        if (a.created_at) return -1
        if (b.created_at) return 1
        return 0
      })
    }

    // Sort by price if selected
    if (selectedPrice === "cheapest") {
      filtered.sort((a, b) => {
        const priceA = a.token_price !== undefined ? a.token_price : a.price || 0
        const priceB = b.token_price !== undefined ? b.token_price : b.price || 0
        return priceA - priceB
      })
    } else if (selectedPrice === "expensivest") {
      filtered.sort((a, b) => {
        const priceA = a.token_price !== undefined ? a.token_price : a.price || 0
        const priceB = b.token_price !== undefined ? b.token_price : b.price || 0
        return priceB - priceA
      })
    }

    return filtered
  }, [
    samplePrompts,
    dbPrompts,
    searchQuery,
    selectedCategory,
    selectedModel,
    selectedSort,
    selectedPrice,
    selectedSource,
    aiModels,
  ])

  // Categories for the horizontal scrolling section
  const categories = [
    { id: "tech", name: "Programs Tech", icon: <Code className="h-4 w-4" /> },
    { id: "marketing", name: "Digital Marketing", icon: <TrendingUp className="h-4 w-4" /> },
    { id: "video", name: "About Videos", icon: <Play className="h-4 w-4" /> },
    { id: "art", name: "Art Works", icon: <Pencil className="h-4 w-4" /> },
    { id: "music", name: "Music Prompt", icon: <Music className="h-4 w-4" /> },
    { id: "bot", name: "Bot Prompt", icon: <Bot className="h-4 w-4" /> },
    { id: "feeling", name: "Feeling Prompts", icon: <Smile className="h-4 w-4" /> },
  ]

  return (
    <>
      <style jsx global>{`
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `}</style>
      <div className="flex h-screen flex-col">
        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
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
              <Button
                variant="secondary"
                className="w-full justify-start gap-2"
                style={{ borderRadius: "12px" }}
                asChild
              >
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

          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Top Navigation */}
            <header className="flex items-center justify-between p-4 bg-[#F6F7FB]">
              {/* Left section */}
              <div className="flex items-center gap-4 w-1/4">
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
                <div className="md:hidden h-8 w-20 border rounded-md flex items-center justify-center font-bold">
                  Logo
                </div>
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
                <div className="mb-3 p-4 rounded-xl" style={{ backgroundColor: "#e8d6ca" }}>
                  <div className="mb-3">
                    <h3 className="text-lg font-bold tracking-wide text-gray-800">
                      explore {">"} {navigatorId}
                    </h3>
                  </div>
                  <div className="relative">
                    {/* Gradient overlay on the right side - only shown when not expanded */}
                    {!isCategoryExpanded && (
                      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-r from-transparent to-[#e8d6ca] z-10 pointer-events-none"></div>
                    )}

                    {/* "..." button positioned over */}
                    <Button
                      className={`absolute z-20 bg-gray-700 hover:bg-gray-800 text-white px-3 py-2 rounded-lg ${
                        isCategoryExpanded ? "right-2 bottom-2" : "right-2 top-1/2 -translate-y-1/2"
                      }`}
                      onClick={() => setIsCategoryExpanded(!isCategoryExpanded)}
                    >
                      {isCategoryExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </Button>

                    <div
                      className={`flex ${
                        isCategoryExpanded ? "flex-wrap" : "flex-nowrap overflow-x-auto scrollbar-hide pb-2"
                      } gap-3 ${isCategoryExpanded ? "" : "max-h-[70px] overflow-hidden"}`}
                      style={!isCategoryExpanded ? { scrollbarWidth: "none", msOverflowStyle: "none" } : {}}
                    >
                      {subcategories.length === 0 ? (
                        <div className="p-4 text-center w-full">
                          {/* Show different message based on whether data is still loading or not found */}
                          <p className="text-gray-500">No subcategories found for {navigatorId}</p>
                        </div>
                      ) : (
                        subcategories.map((subcategory) => {
                          // Map icon name to Lucide icon

                          return (
                            <Card
                              key={subcategory.id}
                              className="inline-flex flex-row items-center p-2.5 hover:bg-gray-100 cursor-pointer w-auto min-w-[140px] h-16 rounded-2xl shrink-0 bg-white"
                            >
                              <div
                                className="h-11 w-11 rounded-lg flex items-center justify-center mr-2"
                                style={{ backgroundColor: subcategory.bg_color || "#f3f4f6" }}
                              >
                                {subcategory.subca_img ? (
                                  <img
                                    src={subcategory.subca_img || "/placeholder.svg"}
                                    alt={subcategory.subca_name || subcategory.subcategory_name}
                                    className="w-7 h-7 object-contain"
                                    onError={(e) => {
                                      // Fallback to icon if image fails to load
                                      e.currentTarget.src =
                                        "https://birzont.github.io/BirzontArchive/res/birzont_bicon.png"
                                    }}
                                  />
                                ) : (
                                  // Fallback to the previous icon logic if subca_img is not available
                                  (() => {
                                    const IconComponent = (() => {
                                      switch (subcategory.icon_name) {
                                        case "PlusCircle":
                                          return PlusCircle
                                        case "ArrowUp":
                                          return ArrowUp
                                        case "Search":
                                          return Search
                                        case "Bookmark":
                                          return Bookmark
                                        case "Bot":
                                          return Bot
                                        case "HelpCircle":
                                          return HelpCircle
                                        case "User":
                                          return User
                                        case "Code":
                                          return Code
                                        case "TrendingUp":
                                          return TrendingUp
                                        case "Play":
                                          return Play
                                        case "Pencil":
                                          return Pencil
                                        case "Music":
                                          return Music
                                        case "Smile":
                                          return Smile
                                        case "Bell":
                                          return Bell
                                        default:
                                          return PlusCircle
                                      }
                                    })()

                                    const getTextColorClass = (color: string) => {
                                      switch (color) {
                                        case "blue":
                                          return "text-blue-600"
                                        case "green":
                                          return "text-green-600"
                                        case "purple":
                                          return "text-purple-600"
                                        case "pink":
                                          return "text-pink-600"
                                        case "yellow":
                                          return "text-yellow-600"
                                        case "red":
                                          return "text-red-600"
                                        case "indigo":
                                          return "text-indigo-600"
                                        case "cyan":
                                          return "text-cyan-600"
                                        case "amber":
                                          return "text-amber-600"
                                        case "lime":
                                          return "text-lime-600"
                                        case "rose":
                                          return "text-rose-600"
                                        case "emerald":
                                          return "text-emerald-600"
                                        case "fuchsia":
                                          return "text-fuchsia-600"
                                        case "teal":
                                          return "text-teal-600"
                                        case "violet":
                                          return "text-violet-600"
                                        default:
                                          return "text-gray-600"
                                      }
                                    }

                                    return (
                                      <IconComponent
                                        className={`h-7 w-7 ${getTextColorClass(subcategory.icon_color)}`}
                                      />
                                    )
                                  })()
                                )}
                              </div>
                              <p className="text-lg font-medium px-1">
                                {subcategory.subca_name || subcategory.subcategory_name}
                              </p>
                            </Card>
                          )
                        })
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className="mb-4 p-3 rounded-xl shadow-sm border border-gray-100"
                  style={{ backgroundColor: "#e8d6ca" }}
                >
                  <div className="flex flex-wrap gap-4 items-center">
                    {/* 첫 번째 Selection: 모델 선택 */}
                    <div className="min-w-[180px] relative model-dropdown" style={{ overflow: "visible" }}>
                      <div className="relative">
                        <button
                          type="button"
                          className="w-full pl-9 pr-3 py-2 bg-white text-gray-700 rounded-lg font-medium border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:outline-none flex items-center justify-between relative z-40"
                          onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                        >
                          <div className="flex items-center">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none model-select-icon">
                              <div
                                className={`w-5 h-5 rounded-md flex items-center justify-center ${
                                  selectedModel === "all"
                                    ? "bg-gray-100"
                                    : (
                                        () => {
                                          const model = aiModels.find((m) => m.model === selectedModel)
                                          return model ? model.model_iconbg : "bg-gray-100"
                                        }
                                      )()
                                }`}
                              >
                                {selectedModel === "all" ? (
                                  <img
                                    src="https://birzont.github.io/BirzontArchive/res/birzont_bicon.png"
                                    alt="All Models"
                                    className="w-4 h-4 object-contain"
                                  />
                                ) : (
                                  (() => {
                                    const model = aiModels.find((m) => m.model === selectedModel)
                                    return model ? (
                                      <img
                                        src={model.model_icon || "/placeholder.svg"}
                                        alt={model.model_text}
                                        className="w-4 h-4 object-contain"
                                        onError={(e) => {
                                          e.currentTarget.src =
                                            "https://birzont.github.io/BirzontArchive/res/birzont_bicon.png"
                                        }}
                                      />
                                    ) : (
                                      <img
                                        src="https://birzont.github.io/BirzontArchive/res/birzont_bicon.png"
                                        alt="Model"
                                        className="w-4 h-4 object-contain"
                                      />
                                    )
                                  })()
                                )}
                              </div>
                            </div>
                            <span className="ml-3">
                              {selectedModel === "all"
                                ? "All Models"
                                : (() => {
                                    const model = aiModels.find((m) => m.model === selectedModel)
                                    return model ? model.model_text : selectedModel
                                  })()}
                            </span>
                          </div>
                          <ChevronDown className="h-4 w-4 text-gray-500 ml-2" />
                        </button>

                        {isModelDropdownOpen && (
                          <div className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                            {/* All Models option always first */}
                            <div
                              className={`px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center ${
                                selectedModel === "all" ? "bg-gray-50" : ""
                              }`}
                              onClick={() => {
                                setSelectedModel("all")
                                setIsModelDropdownOpen(false)
                              }}
                            >
                              <div className="w-5 h-5 bg-gray-100 rounded-md flex items-center justify-center mr-2">
                                <img
                                  src="https://birzont.github.io/BirzontArchive/res/birzont_bicon.png"
                                  alt="All Models"
                                  className="w-4 h-4 object-contain"
                                />
                              </div>
                              <span>All Models</span>
                            </div>

                            {/* Models from aimodels table */}
                            {aiModels.map((model) => (
                              <div
                                key={model.id}
                                className={`px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center ${
                                  selectedModel === model.model ? "bg-gray-50" : ""
                                }`}
                                onClick={() => {
                                  setSelectedModel(model.model)
                                  setIsModelDropdownOpen(false)
                                }}
                              >
                                <div
                                  className={`w-5 h-5 rounded-md flex items-center justify-center mr-2`}
                                  style={{ backgroundColor: model.model_iconbg || "#f3f4f6" }}
                                >
                                  <img
                                    src={model.model_icon || "/placeholder.svg"}
                                    alt={model.model_text}
                                    className="w-4 h-4 object-contain"
                                    onError={(e) => {
                                      e.currentTarget.src =
                                        "https://birzont.github.io/BirzontArchive/res/birzont_bicon.png"
                                    }}
                                  />
                                </div>
                                <span>{model.model_text}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 두 번째 Selection: 정렬 옵션 */}
                    <div className="min-w-[120px] relative">
                      <select
                        className="w-full pl-3 pr-8 py-2 bg-white text-gray-700 rounded-lg font-medium border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:outline-none appearance-none"
                        value={selectedSort}
                        onChange={(e) => setSelectedSort(e.target.value)}
                      >
                        <option value="popular">Popular</option>
                        <option value="newest">Newest</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>

                    {/* 세 번째 Selection: 가격 필터 */}
                    <div className="min-w-[120px] relative">
                      <select
                        className="w-full pl-3 pr-8 py-2 bg-white text-gray-700 rounded-lg font-medium border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:outline-none appearance-none"
                        value={selectedPrice}
                        onChange={(e) => setSelectedPrice(e.target.value)}
                      >
                        <option value="all">All Prices</option>
                        <option value="free">Free</option>
                        <option value="cheapest">Cheapest</option>
                        <option value="expensivest">Expensivest</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>

                    {/* 네 번째 Selection: 출처 필터 */}
                    <div className="min-w-[120px] relative">
                      <select
                        className="w-full pl-3 pr-8 py-2 bg-white text-gray-700 rounded-lg font-medium border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:outline-none appearance-none"
                        value={selectedSource}
                        onChange={(e) => setSelectedSource(e.target.value)}
                      >
                        <option value="all">All Sources</option>
                        <option value="birzont">Birzont</option>
                        <option value="community">Community</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Featured Content Section */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">
                    Featured Contents for {navigatorId}
                    {selectedModel !== "all" && (
                      <span className="text-blue-600">
                        {" "}
                        - {(() => {
                          const model = aiModels.find((m) => m.model === selectedModel)
                          return model ? model.model_text : selectedModel
                        })()}
                      </span>
                    )}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPrompts.length > 0 ? (
                      filteredPrompts.map((prompt) => {
                        // Determine which card type to use based on prompt_type
                        if (prompt.prompt_type === "Image") {
                          return <PromptCard key={prompt.id} prompt={prompt} aiModels={aiModels} />
                        } else if (prompt.prompt_type === "Bundle") {
                          return <PromptCard key={prompt.id} prompt={prompt} aiModels={aiModels} />
                        } else {
                          // Default to normal prompt card
                          return <PromptCard key={prompt.id} prompt={prompt} aiModels={aiModels} />
                        }
                      })
                    ) : (
                      <div className="col-span-3 text-center py-10">
                        <p className="text-gray-500">No prompts found for this category.</p>
                        <button
                          onClick={() => router.push("/create")}
                          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Create a Prompt
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  )
}
