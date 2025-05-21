"use client"

import {
  ArrowUp,
  Bell,
  Bookmark,
  Bot,
  HelpCircle,
  Menu,
  PlusCircle,
  Search,
  User,
  Copy,
  ArrowLeft,
  UserPlus,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState, useRef } from "react"

// 프롬프트 타입 정의
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
  date: string
}

// 번들 타입 정의
type BundleItem = {
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
  promptCount: number
  date: string
}

// 사용자 타입 정의
type UserProfile = {
  id: string
  username: string
  email: string
  bio: string
  joinDate: string
  promptsCount: number
  savedCount: number
  likesReceived: number
  interests: string[]
}

// 샘플 사용자 데이터
const sampleUsers: Record<string, UserProfile> = {
  user1: {
    id: "user1",
    username: "홍길동",
    email: "hong@example.com",
    bio: "안녕하세요! 저는 프롬프트 엔지니어링과 AI에 관심이 많은 사용자입니다. 다양한 AI 모델을 활용한 프롬프트를 만들고 공유하는 것을 좋아합니다.",
    joinDate: "2023년 10월 15일",
    promptsCount: 24,
    savedCount: 42,
    likesReceived: 156,
    interests: ["웹 개발", "AI", "디자인", "콘텐츠 작성", "마케팅"],
  },
  user2: {
    id: "user2",
    username: "김철수",
    email: "kim@example.com",
    bio: "AI 개발자이자 프롬프트 엔지니어입니다. 효율적인 프롬프트 작성법과 AI 모델 활용에 대한 팁을 공유합니다.",
    joinDate: "2023년 8월 5일",
    promptsCount: 36,
    savedCount: 58,
    likesReceived: 245,
    interests: ["AI 개발", "머신러닝", "프롬프트 엔지니어링", "데이터 분석"],
  },
  user3: {
    id: "user3",
    username: "이영희",
    email: "lee@example.com",
    bio: "디자이너이자 AI 아트 창작자입니다. 이미지 생성 AI를 활용한 작품과 프롬프트를 공유합니다.",
    joinDate: "2023년 9월 20일",
    promptsCount: 18,
    savedCount: 32,
    likesReceived: 120,
    interests: ["AI 아트", "디자인", "일러스트레이션", "미디어 아트"],
  },
}

// 샘플 프롬프트 데이터
const samplePrompts: Record<string, PromptItem[]> = {
  user1: [
    {
      id: 1,
      title: "웹사이트 디자인 아이디어 생성기",
      description: "웹사이트 디자인에 대한 창의적인 아이디어를 생성합니다.",
      category: "디자인",
      rating: 4.8,
      price: 0,
      image: "/website-development-concept.png",
      author: "홍길동",
      downloads: 120,
      saves: 45,
      type: "text",
      model: "ChatGPT",
      date: "2023년 12월 10일",
    },
    {
      id: 2,
      title: "블로그 포스트 아웃라인 생성기",
      description: "SEO에 최적화된 블로그 포스트 아웃라인을 생성합니다.",
      category: "콘텐츠 작성",
      rating: 4.6,
      price: 0,
      image: "/blog-writing-desk.png",
      author: "홍길동",
      downloads: 95,
      saves: 38,
      type: "text",
      model: "Claude",
      date: "2023년 11월 25일",
    },
    {
      id: 3,
      title: "코드 리팩토링 도우미",
      description: "기존 코드를 더 효율적이고 가독성 높게 리팩토링합니다.",
      category: "프로그래밍",
      rating: 4.9,
      price: 0,
      image: "/programming-code-abstract.png",
      author: "홍길동",
      downloads: 150,
      saves: 62,
      type: "text",
      model: "ChatGPT",
      date: "2023년 11월 15일",
    },
    {
      id: 4,
      title: "마케팅 이메일 템플릿 생성기",
      description: "효과���인 마케팅 이메일 템플릿을 생성합니다.",
      category: "마케팅",
      rating: 4.7,
      price: 0,
      image: "/email-template-concept.png",
      author: "홍길동",
      downloads: 85,
      saves: 30,
      type: "text",
      model: "Claude",
      date: "2023년 10월 30일",
    },
    {
      id: 5,
      title: "제품 설명 작성기",
      description: "매력적인 제품 설명을 작성합니다.",
      category: "마케팅",
      rating: 4.5,
      price: 0,
      image: "/product-showcase.png",
      author: "홍길동",
      downloads: 75,
      saves: 28,
      type: "text",
      model: "ChatGPT",
      date: "2023년 10월 20일",
    },
    {
      id: 6,
      title: "소셜 미디어 포스트 생성기",
      description: "다양한 소셜 미디어 플랫폼에 맞는 포스트를 생성합니다.",
      category: "마케팅",
      rating: 4.4,
      price: 0,
      image: "/interconnected-social-media.png",
      author: "홍길동",
      downloads: 65,
      saves: 25,
      type: "text",
      model: "Claude",
      date: "2023년 10월 10일",
    },
  ],
  user2: [
    {
      id: 1,
      title: "AI 모델 성능 최적화 프롬프트",
      description: "AI 모델의 성능을 최적화하는 프롬프트 기법을 제공합니다.",
      category: "AI 개발",
      rating: 4.9,
      price: 0,
      image: "/programming-code-abstract.png",
      author: "김철수",
      downloads: 180,
      saves: 75,
      type: "text",
      model: "ChatGPT",
      date: "2023년 12월 5일",
    },
    {
      id: 2,
      title: "데이터 분석 리포트 생성기",
      description: "데이터 분석 결과를 명확하게 설명하는 리포트를 생성합니다.",
      category: "데이터 분석",
      rating: 4.7,
      price: 0,
      image: "/seo-analytics-dashboard.png",
      author: "김철수",
      downloads: 135,
      saves: 60,
      type: "text",
      model: "Claude",
      date: "2023년 11월 20일",
    },
    {
      id: 3,
      title: "머신러닝 모델 설명 생성기",
      description: "복잡한 머신러닝 모델을 이해하기 쉽게 설명합니다.",
      category: "머신러닝",
      rating: 4.8,
      price: 0,
      image: "/code-interface-abstract.png",
      author: "김철수",
      downloads: 110,
      saves: 48,
      type: "text",
      model: "ChatGPT",
      date: "2023년 10월 25일",
    },
  ],
  user3: [
    {
      id: 1,
      title: "미드저니 아트 프롬프트 생성기",
      description: "미드저니에서 아름다운 이미지를 생성하는 프롬프트를 제공합니다.",
      category: "AI 아트",
      rating: 4.9,
      price: 0,
      image: "/midjourney-ai-art.png",
      author: "이영희",
      downloads: 220,
      saves: 95,
      type: "image",
      model: "Midjourney",
      date: "2023년 12월 15일",
    },
    {
      id: 2,
      title: "일러스트레이션 스타일 가이드",
      description: "다양한 일러스트레이션 스타일을 생성하는 프롬프트 기법을 제공합니다.",
      category: "일러스트레이션",
      rating: 4.8,
      price: 0,
      image: "/abstract-ai-art.png",
      author: "이영희",
      downloads: 185,
      saves: 80,
      type: "image",
      model: "Midjourney",
      date: "2023년 11월 30일",
    },
    {
      id: 3,
      title: "디자인 포트폴리오 이미지 생성기",
      description: "디자인 포트폴리오를 위한 고품질 이미지를 생성합니다.",
      category: "디자인",
      rating: 4.7,
      price: 0,
      image: "/stable-diffusion-abstract.png",
      author: "이영희",
      downloads: 150,
      saves: 65,
      type: "image",
      model: "Stable Diffusion",
      date: "2023년 11월 10일",
    },
  ],
}

// 샘플 번들 데이터
const sampleBundles: Record<string, BundleItem[]> = {
  user1: [
    {
      id: 1,
      title: "웹 개발자 필수 프롬프트 모음",
      description: "웹 개발에 필요한 다양한 프롬프트를 모아놓은 번들입니다.",
      category: "웹 개발",
      rating: 4.9,
      price: 0,
      image: "/website-development-concept.png",
      author: "홍길동",
      downloads: 320,
      saves: 145,
      promptCount: 5,
      date: "2023년 12월 15일",
    },
    {
      id: 2,
      title: "콘텐츠 마케팅 프롬프트 번들",
      description: "블로그, 소셜 미디어, 이메일 마케팅을 위한 프롬프트 모음",
      category: "마케팅",
      rating: 4.7,
      price: 0,
      image: "/interconnected-social-media.png",
      author: "홍길동",
      downloads: 280,
      saves: 120,
      promptCount: 4,
      date: "2023년 11월 20일",
    },
    {
      id: 3,
      title: "SEO 최적화 프롬프트 번들",
      description: "검색 엔진 최적화를 위한 다양한 프롬프트 모음",
      category: "마케팅",
      rating: 4.6,
      price: 0,
      image: "/seo-analytics-dashboard.png",
      author: "홍길동",
      downloads: 240,
      saves: 110,
      promptCount: 3,
      date: "2023년 11월 10일",
    },
    {
      id: 4,
      title: "UI/UX 디자인 프롬프트 번들",
      description: "사용자 인터페이스 및 경험 디자인을 위한 프롬프트 모음",
      category: "디자인",
      rating: 4.8,
      price: 0,
      image: "/modern-living-space.png",
      author: "홍길동",
      downloads: 300,
      saves: 135,
      promptCount: 6,
      date: "2023년 12월 5일",
    },
    {
      id: 5,
      title: "프로그래밍 도우미 번들",
      description: "다양한 프로그래밍 언어와 프레임워크를 위한 프롬프트 모음",
      category: "프로그래밍",
      rating: 4.9,
      price: 0,
      image: "/programming-code-abstract.png",
      author: "홍길동",
      downloads: 350,
      saves: 160,
      promptCount: 7,
      date: "2023년 12월 20일",
    },
  ],
  user2: [
    {
      id: 1,
      title: "AI 개발자 프롬프트 번들",
      description: "AI 모델 개발 및 최적화를 위한 프롬프트 모음",
      category: "AI 개발",
      rating: 4.8,
      price: 0,
      image: "/code-interface-abstract.png",
      author: "김철수",
      downloads: 350,
      saves: 180,
      promptCount: 6,
      date: "2023년 12월 10일",
    },
    {
      id: 2,
      title: "데이터 분석 프롬프트 번들",
      description: "데이터 분석 및 시각화를 위한 프롬프트 모음",
      category: "데이터 분석",
      rating: 4.7,
      price: 0,
      image: "/seo-analytics-dashboard.png",
      author: "김철수",
      downloads: 320,
      saves: 150,
      promptCount: 5,
      date: "2023년 11월 25일",
    },
    {
      id: 3,
      title: "머신러닝 프로젝트 번들",
      description: "머신러닝 프로젝트 개발을 위한 프롬프트 모음",
      category: "머신러닝",
      rating: 4.9,
      price: 0,
      image: "/code-interface-abstract.png",
      author: "김철수",
      downloads: 380,
      saves: 190,
      promptCount: 8,
      date: "2023년 12월 15일",
    },
    {
      id: 4,
      title: "머신러닝 프로젝트 번들",
      description: "머신러닝 프로젝트 개발을 위한 프롬프트 모음",
      category: "머신러닝",
      rating: 4.9,
      price: 0,
      image: "/code-interface-abstract.png",
      author: "김철수",
      downloads: 380,
      saves: 190,
      promptCount: 8,
      date: "2023년 12월 15일",
    },
    {
      id: 5,
      title: "머신러닝 프로젝트 번들",
      description: "머신러닝 프로젝트 개발을 위한 프롬프트 모음",
      category: "머신러닝",
      rating: 4.9,
      price: 0,
      image: "/code-interface-abstract.png",
      author: "김철수",
      downloads: 380,
      saves: 190,
      promptCount: 8,
      date: "2023년 12월 15일",
    },
  ],
  user3: [
    {
      id: 1,
      title: "디자인 포트폴리오 이미지 번들",
      description: "포트폴리오 제작에 필요한 다양한 이미지 생성 프롬프트",
      category: "디자인",
      rating: 4.9,
      price: 0,
      image: "/abstract-ai-art.png",
      author: "이영희",
      downloads: 420,
      saves: 195,
      promptCount: 8,
      date: "2023년 12월 20일",
    },
    {
      id: 2,
      title: "일러스트레이션 스타일 번들",
      description: "다양한 일러스트레이션 스타일을 위한 프롬프트 모음",
      category: "일러스트레이션",
      rating: 4.8,
      price: 0,
      image: "/midjourney-ai-art.png",
      author: "이영희",
      downloads: 380,
      saves: 175,
      promptCount: 6,
      date: "2023년 12월 5일",
    },
    {
      id: 3,
      title: "미디어 아트 프롬프트 번들",
      description: "창의적인 미디어 아트 작품을 위한 프롬프트 모음",
      category: "미디어 아트",
      rating: 4.7,
      price: 0,
      image: "/abstract-ai-art.png",
      author: "이영희",
      downloads: 340,
      saves: 160,
      promptCount: 5,
      date: "2023년 11월 15일",
    },
  ],
}

// 번들 카드 컴포넌트
const BundleCard = ({ bundle }: { bundle: BundleItem }) => {
  return (
    <Card className="rounded-xl overflow-hidden border border-gray-200 h-full flex flex-col bg-white transition-all duration-300 hover:scale-105">
      <div className="p-4">
        <h3 className="font-medium text-gray-800">{bundle.title}</h3>
      </div>
      <div className="p-2 flex-grow flex items-end">
        <div className="aspect-[4/3] rounded-lg overflow-hidden w-full">
          <img src={bundle.image || "/placeholder.svg"} alt={bundle.title} className="w-full h-full object-cover" />
        </div>
      </div>
    </Card>
  )
}

// 프롬프트 카드 컴포넌트
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
              <span className="mr-1 group-hover:text-blue-700 transition-colors duration-300">{prompt.date}</span>
            </div>
          </div>
        </CardContent>
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
          <span className="group-hover:text-blue-700 transition-colors duration-300">{prompt.category}</span>
          <div className="flex items-center">
            <span className="mr-1 group-hover:text-blue-700 transition-colors duration-300">{prompt.date}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default function UserProfilePage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [userPrompts, setUserPrompts] = useState<PromptItem[]>([])
  const [userBundles, setUserBundles] = useState<BundleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showLeftButton, setShowLeftButton] = useState(false)
  const [showRightButton, setShowRightButton] = useState(true)

  const bundlesContainerRef = useRef<HTMLDivElement>(null)

  const scrollBundles = (direction: "left" | "right") => {
    if (bundlesContainerRef.current) {
      const container = bundlesContainerRef.current
      const scrollAmount = direction === "left" ? -300 : 300
      container.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  const handleScroll = () => {
    if (bundlesContainerRef.current) {
      const container = bundlesContainerRef.current
      setShowLeftButton(container.scrollLeft > 0)
      setShowRightButton(container.scrollLeft < container.scrollWidth - container.clientWidth - 10)
    }
  }

  useEffect(() => {
    // 실제 애플리케이션에서는 API 호출로 대체
    const fetchUserData = () => {
      setLoading(true)

      // 샘플 데이터에서 사용자 정보 가져오기
      const profile = sampleUsers[userId]
      const prompts = samplePrompts[userId] || []
      const bundles = sampleBundles[userId] || []

      setTimeout(() => {
        setUserProfile(profile || null)
        setUserPrompts(prompts)
        setUserBundles(bundles)
        setLoading(false)
      }, 500) // 로딩 시뮬레이션
    }

    fetchUserData()
  }, [userId])

  useEffect(() => {
    // 번들 컨테이너의 스크롤 이벤트 리스너 등록
    const container = bundlesContainerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
      // 초기 상태 확인
      handleScroll()
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll)
      }
    }
  }, [userBundles])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">사용자 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">사용자를 찾을 수 없습니다</h2>
          <p className="text-gray-600 mb-4">요청하신 사용자 프로필이 존재하지 않습니다.</p>
          <Button onClick={() => router.push("/")}>홈으로 돌아가기</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-48 border-r bg-white">
        <div className="p-4 py-6">
          <div className="h-10 flex items-center justify-center">
            <img
              src="https://birzont.github.io/BirzontArchive/res/birzont_black.png"
              alt="Birzont Logo"
              className="h-8 object-contain"
            />
          </div>
        </div>
        <div className="p-4 space-y-1">
          <Button variant="ghost" className="w-full justify-start gap-2" asChild>
            <Link href="/">
              <ArrowUp className="h-4 w-4" />
              Home
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2" asChild>
            <Link href="/explore">
              <Search className="h-4 w-4" />
              Explore
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2" asChild>
            <Link href="/create">
              <PlusCircle className="h-4 w-4" />
              Create
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2" asChild>
            <Link href="/saved">
              <Bookmark className="h-4 w-4" />
              Saved
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2" asChild>
            <Link href="/ais">
              <Bot className="h-4 w-4" />
              AIs
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2" asChild>
            <Link href="/questions">
              <HelpCircle className="h-4 w-4" />
              Questions
            </Link>
          </Button>
        </div>
      </div>
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-gray-50">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="relative w-full max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="프롬프트 검색..."
                className="w-full bg-white pl-8 rounded-lg border border-gray-300"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="relative group">
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
              <div className="absolute right-0 mt-2 w-60 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out z-50">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-200 rounded-full p-2">
                        <User className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">사용자 이름</p>
                        <p className="text-sm text-gray-500">user@example.com</p>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-100">
                    <button
                      onClick={() => router.push("/profile")}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                    >
                      프로필 보기
                    </button>
                    <button
                      onClick={() => router.push("/settings")}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                    >
                      설정
                    </button>
                    <button
                      onClick={() => {
                        console.log("로그아웃 처리...")
                        router.push("/login")
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                    >
                      로그아웃
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        {/* Profile content */}
        <div className="flex-1 overflow-auto p-2">
          <div className="w-full mx-auto">
            {/* Back button */}
            <div className="mt-4 mb-2">
              <Button variant="ghost" size="sm" onClick={() => router.back()} className="flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                뒤로 가기
              </Button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-3 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-32"></div>
                  <div className="px-6 py-4 flex flex-col md:flex-row md:items-center gap-4 relative">
                    <div className="flex-shrink-0 -mt-12 md:-mt-16">
                      <div className="bg-white p-1 rounded-full inline-block ring-4 ring-white">
                        <div className="bg-gray-200 rounded-full p-6">
                          <User className="h-12 w-12 text-gray-600" />
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h1 className="text-2xl font-bold">{userProfile.username}</h1>
                      <p className="text-gray-500">{userProfile.email}</p>
                      <p className="text-gray-600 mt-2">{userProfile.bio}</p>
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <UserPlus className="h-4 w-4" />
                        팔로우
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        메시지
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">{userProfile.username}님의 번들</h2>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => scrollBundles("left")}
                        className={`h-8 w-8 rounded-full ${!showLeftButton ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={!showLeftButton}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => scrollBundles("right")}
                        className={`h-8 w-8 rounded-full ${!showRightButton ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={!showRightButton}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {userBundles.length > 0 ? (
                    <div
                      ref={bundlesContainerRef}
                      className="flex overflow-x-auto pb-4 scrollbar-hide"
                      onScroll={handleScroll}
                    >
                      <style jsx global>{`
                        .scrollbar-hide::-webkit-scrollbar {
                          display: none;
                        }
                        .scrollbar-hide {
                          -ms-overflow-style: none;
                          scrollbar-width: none;
                        }
                      `}</style>
                      <div className="flex [&>*:not(:first-child)]:ml-3">
                        {userBundles.map((bundle) => (
                          <div key={bundle.id} className="min-w-[90px] sm:min-w-[110px] aspect-[3/4]">
                            <BundleCard bundle={bundle} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">아직 생성한 번들이 없습니다.</p>
                  )}

                  <div className="mt-6 pt-6 border-t border-gray-400">
                    <h2 className="text-xl font-semibold mb-4">{userProfile.username}님의 프롬프트</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {userPrompts.map((prompt) => (
                        <PromptCard key={prompt.id} prompt={prompt} />
                      ))}
                    </div>
                    {userPrompts.length > 6 && (
                      <div className="mt-4 text-center">
                        <Button variant="outline">더 보기</Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold mb-4">통계</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">작성한 프롬프트</span>
                      <span className="font-medium">{userProfile.promptsCount}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-gray-600">저장한 프롬프트</span>
                      <span className="font-medium">{userProfile.savedCount}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-gray-600">받은 좋아요</span>
                      <span className="font-medium">{userProfile.likesReceived}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-gray-600">가입일</span>
                      <span className="font-medium">{userProfile.joinDate}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold mb-4">관심 분야</h2>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.interests.map((interest, index) => (
                      <div key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                        {interest}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="relative">
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      Ads
                    </div>
                    <div className="aspect-[1/1] w-full overflow-hidden">
                      <img
                        src="/placeholder.svg?key=fyiob"
                        alt="Advertisement"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium mb-2">프롬프트 마켓플레이스 프리미엄</h3>
                      <p className="text-sm text-gray-500 mb-3">
                        프리미엄 멤버십으로 업그레이드하고 더 많은 기능을 이용해보세요.
                      </p>
                      <Button className="w-full">Visit</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
