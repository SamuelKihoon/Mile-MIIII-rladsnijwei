"use client"

import type React from "react"

import {
  ArrowUp,
  Bookmark,
  Bot,
  HelpCircle,
  Menu,
  PlusCircle,
  User,
  Copy,
  ArrowLeft,
  Upload,
  Compass,
  Sparkles,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { toast } from "@/hooks/use-toast"
import { createClient } from "@supabase/supabase-js"

// Supabase 클라이언트 설정
const supabaseUrl = "https://fanlqfaphmayjxaavjrh.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhbmxxZmFwaG1heWp4YWF2anJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5NzMzMjgsImV4cCI6MjA2MjU0OTMyOH0.uF25iL8b445XNLRITVhn6Iqf6J8u9KRDI0XTg5djuPE"

// 세션 유지 및 자동 토큰 갱신 옵션 추가
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // 세션을 로컬에 저장
    autoRefreshToken: true,
  },
})

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

// 사용자 데이터 타입 정의
type UserData = {
  username?: string
  handle?: string
  plaintext?: string | null
  avatar_url?: string | null
  bg_url?: string | null
  following_num?: number | null
  followers_num?: number | null
}

// 샘플 프롬프트 데이터
const myPrompts: PromptItem[] = [
  {
    id: 1,
    title: "웹사이트 디자인 아이디어 생성기",
    description: "웹사이트 디자인에 대한 창의적인 아이디어를 생성합니다.",
    category: "디자인",
    rating: 4.8,
    price: 0,
    image: "/website-development-concept.png",
    author: "사용자 이름",
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
    category: "마케팅",
    rating: 4.6,
    price: 0,
    image: "/blog-writing-desk.png",
    author: "사용자 이름",
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
    author: "사용자 이름",
    downloads: 150,
    saves: 62,
    type: "text",
    model: "ChatGPT",
    date: "2023년 11월 15일",
  },
  {
    id: 4,
    title: "마케팅 이메일 템플릿 생성기",
    description: "효과적인 마케팅 이메일 템플릿을 생성합니다.",
    category: "마케팅",
    rating: 4.7,
    price: 0,
    image: "/email-template-concept.png",
    author: "사용자 이름",
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
    author: "사용자 이름",
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
    author: "사용자 이름",
    downloads: 65,
    saves: 25,
    type: "text",
    model: "Claude",
    date: "2023년 10월 10일",
  },
]

// 샘플 번들 데이터
const myBundles: BundleItem[] = [
  {
    id: 1,
    title: "웹 개발자 필수 프롬프트 모음",
    description: "웹 개발에 필요한 다양한 프롬프트를 모아놓은 번들입니다.",
    category: "웹 개발",
    rating: 4.9,
    price: 0,
    image: "/website-development-concept.png",
    author: "사용자 이름",
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
    author: "사용자 이름",
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
    author: "사용자 이름",
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
    author: "사용자 이름",
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
    author: "사용자 이름",
    downloads: 350,
    saves: 160,
    promptCount: 7,
    date: "2023년 12월 20일",
  },
]

// 번들 카드 컴포넌트
const BundleCard = ({ bundle }: { bundle: BundleItem }) => {
  return (
    <Card className="rounded-xl overflow-hidden border border-gray-200 h-full flex flex-col bg-white transition-all duration-300 hover:scale-105">
      <div className="p-4">
        <h3 className="font-medium text-gray-800">{bundle.title}</h3>
      </div>
      <div className="p-2 flex-grow flex items-end">
        <div className="aspect-[4/3] rounded-lg overflow-hidden w-full">
          <img
            src={bundle.image || "/placeholder.svg"}
            alt={bundle.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/tied-bundle.png"
            }}
          />
        </div>
      </div>
    </Card>
  )
}

// 프롬프트 카드 컴포넌트
const PromptCard = ({ prompt }: { prompt: PromptItem }) => {
  if (prompt.type === "image") {
    return (
      <Card className="aspect-[16/9] flex flex-col overflow-hidden rounded-xl group transition-all duration-300 hover:scale-105">
        <div className="relative">
          {/* Model badge */}
          <div className="absolute top-3 left-3 z-10 flex items-center bg-white rounded-lg pl-1 pr-2 py-1 shadow-sm">
            <div className="w-7 h-7 mr-1.5">
              {prompt.model === "Midjourney" ? (
                <div className="w-7 h-7 bg-[#383640] rounded-md flex items-center justify-center overflow-hidden">
                  <img src="/abstract-geometric-landscape.png" alt="Midjourney" className="w-5 h-5 object-contain" />
                </div>
              ) : prompt.model === "ChatGPT" ? (
                <div className="w-7 h-7 bg-[#FFFFFF] rounded-md flex items-center justify-center overflow-hidden border border-gray-200">
                  <img src="/chatgpt-logo.png" alt="ChatGPT" className="w-5 h-5 object-contain" />
                </div>
              ) : (
                <div className="w-7 h-7 bg-[#db8848] rounded-md flex items-center justify-center overflow-hidden">
                  <img src="/claude_anthropic_ai.png" alt="Claude" className="w-5 h-5 object-contain" />
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
              <img
                src={prompt.image || "/placeholder.svg"}
                alt={prompt.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg?key=ntki7"
                }}
              />
            </div>
          </div>
        </div>
        <CardContent className="p-2">
          <h3 className="font-medium text-base group-hover:text-blue-700 transition-colors duration-300">
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
    <Card className="aspect-[16/9] flex flex-col overflow-hidden rounded-xl group transition-all duration-300 hover:scale-105">
      <div className="p-3 flex flex-col h-full">
        {/* Header with model and stats */}
        <div className="relative mb-3">
          <div className="inline-flex items-center bg-gray-100 rounded-lg pl-1 pr-2 py-1">
            <div className="w-7 h-7 mr-1.5">
              {prompt.model === "Claude" ? (
                <div className="w-7 h-7 bg-[#db8848] rounded-md flex items-center justify-center overflow-hidden">
                  <img src="/claude_anthropic_ai.png" alt="Claude" className="w-5 h-5 object-contain" />
                </div>
              ) : prompt.model === "ChatGPT" ? (
                <div className="w-7 h-7 bg-[#FFFFFF] rounded-md flex items-center justify-center overflow-hidden border border-gray-200">
                  <img src="/chatgpt-logo.png" alt="ChatGPT" className="w-5 h-5 object-contain" />
                </div>
              ) : (
                <div className="w-7 h-7 bg-[#383640] rounded-md flex items-center justify-center overflow-hidden">
                  <img src="/abstract-geometric-landscape.png" alt="Midjourney" className="w-5 h-5 object-contain" />
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
        <h3 className="font-medium text-base mb-1 group-hover:text-blue-700 transition-colors duration-300">
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

// 이미지 업로드 함수
const uploadImage = async (file: File, path: string): Promise<string | null> => {
  if (!file) return null

  try {
    const bucketName = path === "avatars" ? "avatars" : "backgrounds"

    // Ensure we have a valid image file
    if (!file.type.startsWith("image/")) {
      toast({
        title: "이미지 업로드 실패",
        description: "유효한 이미지 파일만 업로드할 수 있습니다.",
        variant: "destructive",
      })
      return null
    }

    // Create a unique filename with the original extension
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}.${fileExt}`

    console.log(`Uploading to bucket: ${bucketName}, filename: ${fileName}, type: ${file.type}`)

    // Upload the file with the correct content type
    const { data, error } = await supabaseClient.storage.from(bucketName).upload(fileName, file, {
      contentType: file.type, // Explicitly set the content type
      cacheControl: "3600",
      upsert: true,
    })

    if (error) {
      console.error(`Image upload error (${bucketName}):`, error)
      toast({
        title: "이미지 업로드 실패",
        description: `이미지 업로드에 실패했습니다. ${error.message}`,
        variant: "destructive",
      })
      return null
    }

    // Get the public URL of the uploaded image
    const { data: urlData } = supabaseClient.storage.from(bucketName).getPublicUrl(fileName)
    console.log(`Image upload success: ${urlData.publicUrl}`)
    return urlData.publicUrl
  } catch (error) {
    console.error(`Exception during image upload (${path}):`, error)
    toast({
      title: "이미지 업로드 실패",
      description: "이미지 업로드 중 오류가 발생했습니다.",
      variant: "destructive",
    })
    return null
  }
}

export default function ProfilePage() {
  const router = useRouter()
  const [showLeftButton, setShowLeftButton] = useState(false)
  const [showRightButton, setShowRightButton] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [coinBalance, setCoinBalance] = useState(1250) // Default coin balance
  const { user, isLoading: authLoading } = useAuth()
  const [profileData, setProfileData] = useState({
    name: "사용자 이름",
    handle: "username",
    bio: "안녕하세요! 저는 프롬프트 엔지니어링과 AI에 관심이 많은 사용자입니다. 다양한 AI 모델을 활용한 프롬프트를 만들고 공유하는 것을 좋아합니다.",
    profileImage: "/abstract-profile.png",
    backgroundImage: "/abstract-gradient.png", // 로컬 이미지로 변경
  })

  const [plaintext, setPlaintext] = useState<string | null>(null)
  const [editedPlaintext, setEditedPlaintext] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const [backgroundImageFile, setBackgroundImageFile] = useState<File | null>(null)
  const [currentUserData, setCurrentUserData] = useState<UserData | null>(null)
  const [sessionData, setSessionData] = useState<any | null>(null)
  const [handleAvailable, setHandleAvailable] = useState<boolean | null>(null)
  const [followingCount, setFollowingCount] = useState<number>(0)
  const [followerCount, setFollowerCount] = useState<number>(0)
  const [isFollowModalOpen, setIsFollowModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"following" | "followers">("following")

  // Sample data for followers and following
  const [followingUsers, setFollowingUsers] = useState([
    { id: 1, name: "김철수", handle: "chulsoo", avatar: "/abstract-profile.png" },
    { id: 2, name: "이영희", handle: "younghee", avatar: "/abstract-profile.png" },
    { id: 3, name: "박지민", handle: "jimin", avatar: "/abstract-profile.png" },
  ])

  const [followerUsers, setFollowerUsers] = useState([
    { id: 4, name: "정민수", handle: "minsu", avatar: "/abstract-profile.png" },
    { id: 5, name: "한소희", handle: "sohee", avatar: "/abstract-profile.png" },
    { id: 6, name: "강동원", handle: "dongwon", avatar: "/abstract-profile.png" },
    { id: 7, name: "송혜교", handle: "hyekyo", avatar: "/abstract-profile.png" },
  ])

  const profileImageInputRef = useRef<HTMLInputElement>(null)
  const backgroundImageInputRef = useRef<HTMLInputElement>(null)

  // const supabase = createClientComponentClient()
  // Supabase 세션 가져오기
  useEffect(() => {
    const checkSession = async () => {
      try {
        // 세션 확인
        const { data, error } = await supabaseClient.auth.getSession()

        if (error) {
          console.error("세션 가져오기 오류:", error)
          return
        }

        console.log("세션 확인:", data.session)

        if (data.session) {
          console.log("로그인된 사용자 ID:", data.session.user.id)
          console.log("로그인된 사용자 이메일:", data.session.user.email)
          setSessionData(data.session)
        } else {
          console.log("로그인된 세션이 없습니다. 로그인이 필요합니다.")
        }
      } catch (err) {
        console.error("세션 확인 중 오류 발생:", err)
      }
    }

    checkSession()

    // 세션 변경 이벤트 리스너 추가
    const { data: authListener } = supabaseClient.auth.onAuthStateChange((event, session) => {
      console.log("인증 상태 변경:", event)
      console.log("새 세션:", session)

      if (event === "SIGNED_IN") {
        console.log("사용자가 로그인했습니다!")
        setSessionData(session)
      } else if (event === "SIGNED_OUT") {
        console.log("사용자가 로그아웃했습니다!")
        setSessionData(null)
      }
    })

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 파일 크기 검사 (500KB = 512000 bytes)
    if (file.size > 512000) {
      setFileError("프로필 이미지는 500KB 이하여야 합니다.")
      return
    }

    setFileError(null)
    setProfileImageFile(file)
    const imageUrl = URL.createObjectURL(file)
    setProfileData({ ...profileData, profileImage: imageUrl })
  }

  const handleBackgroundImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 파일 크기 검사 (500KB = 512000 bytes)
    if (file.size > 512000) {
      setFileError("배경 이미지는 500KB 이하여야 합니다.")
      return
    }

    setFileError(null)
    setBackgroundImageFile(file)
    const imageUrl = URL.createObjectURL(file)
    setProfileData({ ...profileData, backgroundImage: imageUrl })
  }

  // 이미지를 PNG로 변환하는 함수
  const convertToPng = async (file: File): Promise<Blob | null> => {
    return new Promise((resolve) => {
      try {
        const img = new Image()
        img.onload = () => {
          // 캔버스 생성
          const canvas = document.createElement("canvas")
          canvas.width = img.width
          canvas.height = img.height

          // 이미지 그리기
          const ctx = canvas.getContext("2d")
          if (!ctx) {
            resolve(null)
            return
          }

          ctx.drawImage(img, 0, 0)

          // PNG로 변환
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob)
            } else {
              resolve(null)
            }
          }, "image/png")
        }

        img.onerror = () => {
          console.error("이미지 로드 실패")
          resolve(null)
        }

        // 파일을 URL로 변환하여 이미지 로드
        img.src = URL.createObjectURL(file)
      } catch (error) {
        console.error("이미지 변환 중 오류:", error)
        resolve(null)
      }
    })
  }

  // 프로필 저장 함수
  const saveProfile = async () => {
    console.log("saveProfile 함수 실행 시")
    setIsSaving(true)

    try {
      console.log("인증 정보 확인 중...")
      // 1. Supabase의 인증 세션을 기반으로 사용자 정보 가져오기
      const { data, error: authError } = await supabaseClient.auth.getSession()

      console.log("세션 확인:", data.session)

      // 2. 사용자가 로그인되어 있지 않으면 오류 메시지 표시
      if (!data.session || !data.session.user) {
        toast({
          title: "인증 오류",
          description: "로그인 세션이 유효하지 않습니다. 다시 로그인해주세요.",
          variant: "destructive",
        })
        setIsSaving(false)
        return
      }
      const userId = data.session.user.id
      console.log("현재 로그인한 사용자 ID:", userId)

      // 이미지 업로드 및 URL 업데이트
      let avatarUrl = null
      let backgroundUrl = null

      // 프로필 이미지 업로드
      if (profileImageFile) {
        avatarUrl = await uploadImage(profileImageFile, "avatars")
        if (!avatarUrl) {
          toast({
            title: "이미지 업로드 실패",
            description: "프로필 이미지 업로드에 실패했습니다.",
            variant: "destructive",
          })
        }
      }

      // 배경 이미지 업로드
      if (backgroundImageFile) {
        backgroundUrl = await uploadImage(backgroundImageFile, "backgrounds")
        if (!backgroundUrl) {
          toast({
            title: "이미지 업로드 실패",
            description: "배경 이미지 업로드에 실패했습니다.",
            variant: "destructive",
          })
        }
      }

      // 3. 사용자 ID를 기준으로 'users' 테이블 업데이트
      // 4. 업데이트할 필드: name, handle, bio, avatar_url, bg_url
      const updates = {
        username: profileData.name,
        handle: profileData.handle,
        plaintext: editedPlaintext,
        ...(avatarUrl && { avatar_url: avatarUrl }),
        ...(backgroundUrl && { bg_url: backgroundUrl }),
      }

      console.log("업데이트할 데이터:", updates)

      // 사용자 존재 여부 확인
      const { data: existingUser, error: checkError } = await supabaseClient
        .from("users")
        .select("id")
        .eq("id", userId)
        .single()

      let result

      if (checkError && checkError.code === "PGRST116") {
        // 사용자가 존재하지 않으면 새로 생성
        console.log("사용자 정보가 없어 새로 생성합니다.")
        result = await supabaseClient
          .from("users")
          .insert({
            id: userId,
            email: data.session.user.email,
            ...updates,
          })
          .select()
      } else {
        // 사용자가 존재하면 업데이트
        console.log("기존 사용자 정보를 업데이트합니다.")
        result = await supabaseClient
          .from("users")
          .update(updates)
          .eq("id", userId) // 현재 로그인한 사용자의 ID와 일치하는 row만 수정
          .select()
      }

      if (result.error) {
        throw result.error
      }

      console.log("프로필 업데이트 성공:", result.data)

      // 상태 업데이트
      if (updates.plaintext) {
        setPlaintext(updates.plaintext)
      }

      if (avatarUrl) {
        setProfileData((prev) => ({ ...prev, profileImage: avatarUrl }))
      }

      if (backgroundUrl) {
        setProfileData((prev) => ({ ...prev, backgroundImage: backgroundUrl }))
      }

      // 파일 상태 초기화
      setProfileImageFile(null)
      setBackgroundImageFile(null)

      // 성공 메시지
      toast({
        title: "프로필 업데이트 성공",
        description: "프로필 정보가 성공적으로 업데이트되었습니다.",
      })

      // 편집 모드 종료
      setIsEditing(false)
    } catch (error: any) {
      console.error("프로필 저장 오류 상세 정보:", error)
      if (error.message) {
        console.error("오류 메시지:", error.message)
      }
      if (error.stack) {
        console.error("오류 스택:", error.stack)
      }

      toast({
        title: "프로필 업데이트 실패",
        description: error.message || "알 수 없는 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // 사용자 데이터가 로드되면 프로필 데이터 업데이트
  useEffect(() => {
    if (user && !authLoading) {
      // Supabase에서 사용자 데이터 가져오기
      const fetchUserData = async () => {
        try {
          const { data, error } = await supabaseClient
            .from("users")
            .select("username, handle, plaintext, avatar_url, bg_url, following_num, followers_num")
            .eq("id", user.id)
            .single()

          if (error) {
            console.error("사용자 데이터 가져오기 오류:", error)
            return
          }

          if (data) {
            console.log("사용자 데이터 로드:", data)
            setCurrentUserData(data)
            setProfileData((prevData) => ({
              ...prevData,
              name: data.username || user.user_metadata?.name || prevData.name,
              handle: data.handle || user.user_metadata?.handle || prevData.handle,
              bio: data.plaintext || user.user_metadata?.bio || prevData.bio,
              profileImage: data.avatar_url || user.user_metadata?.avatar_url || prevData.profileImage,
              backgroundImage: data.bg_url || user.user_metadata?.bg_url || prevData.backgroundImage,
            }))

            setPlaintext(data.plaintext)
            setEditedPlaintext(data.plaintext || "")

            // 팔로잉, 팔로워 수 설정
            setFollowingCount(data.following_num || 0)
            setFollowerCount(data.followers_num || 0)
          }
        } catch (error) {
          console.error("사용자 데이터 가져오기 실패:", error)
        }
      }

      fetchUserData()
    }
  }, [user, authLoading, supabaseClient])

  return (
    <div className="flex h-screen">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={profileImageInputRef}
        onChange={handleProfileImageChange}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={backgroundImageInputRef}
        onChange={handleBackgroundImageChange}
        accept="image/*"
        className="hidden"
      />

      {/* Sidebar */}
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-48 border-r bg-white">
        <div className="p-4 py-6">
          <div className="h-10 flex items-center justify-center">
            <img
              src="https://birzont.github.io/BirzontArchive/res/birzont_black.png"
              alt="Birzont Logo"
              className="h-7 w-32 object-contain"
              onError={(e) => {
                e.currentTarget.src = "/birzont.png"
              }}
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
            <Link href="/agent">
              <Sparkles className="h-4 w-4" />
              Agent
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2" asChild>
            <Link href="/explore">
              <Compass className="h-4 w-4" />
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
        {/* Top Navigation */}
        <header className="flex items-center justify-between py-2 px-4 bg-[#F6F7FB]">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
          <div
            className="md:hidden h-8 w-20 border flex items-center justify-center font-bold"
            style={{ borderRadius: "24px" }}
          >
            Logo
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <div
              className="flex items-center gap-1 px-3 py-1.5 text-gray-700 font-medium"
              style={{ borderRadius: "16px", backgroundColor: "#f0f5ed" }}
            >
              <img
                src="https://static.vecteezy.com/system/resources/previews/023/286/077/non_2x/gold-coin-sign-symbol-icon-png.png"
                alt="Coin"
                className="h-4 w-4"
              />
              <span>{user?.coins || coinBalance}</span>
            </div>
            <div className="relative group">
              <Button
                variant="ghost"
                size="icon"
                className="bg-[#f0f5ed] p-0 overflow-hidden"
                style={{ borderRadius: "16px" }}
              >
                {profileData.profileImage ? (
                  <img
                    src={profileData.profileImage || "/placeholder.svg"}
                    alt="Profile"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/abstract-profile.png"
                      e.currentTarget.onerror = null
                      e.currentTarget.style.display = "none"
                      e.currentTarget.parentElement?.classList.add("flex", "items-center", "justify-center")
                      const parent = e.currentTarget.parentElement
                      if (parent) {
                        const userIcon = document.createElement("div")
                        userIcon.innerHTML =
                          '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="h-5 w-5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>'
                        parent.appendChild(userIcon)
                      }
                    }}
                  />
                ) : (
                  <User className="h-5 w-5" />
                )}
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
                        className="h-10 w-10 bg-gray-200 flex items-center justify-center overflow-hidden"
                        style={{ borderRadius: "24px" }}
                      >
                        {profileData.profileImage ? (
                          <img
                            src={profileData.profileImage || "/placeholder.svg"}
                            alt="Profile"
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/abstract-profile.png"
                            }}
                          />
                        ) : (
                          <User className="h-6 w-6 text-gray-500" />
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">{user ? user.username : "사용자 이름"}</p>
                        <p className="text-xs text-gray-500">{user ? user.email : "user@example.com"}</p>
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

        {/* Profile content */}
        <div className="flex-1 overflow-auto p-2">
          <div className="w-full mx-auto">
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-3 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div
                    className="h-32 relative bg-gray-100"
                    style={{
                      backgroundImage: `url(${profileData.backgroundImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {isEditing && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <Button
                          variant="outline"
                          className="bg-white flex items-center gap-2"
                          onClick={() => backgroundImageInputRef.current?.click()}
                        >
                          <Upload className="h-4 w-4" />
                          배경 이미지 업로드 (최대 500KB)
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="px-6 py-4 flex flex-col md:flex-row md:items-start gap-4 relative">
                    <div className="flex-shrink-0 -mt-16">
                      <div className="bg-white p-1 rounded-full inline-block ring-4 ring-white relative">
                        <div
                          className="bg-gray-200 rounded-full overflow-hidden"
                          style={{
                            width: "96px",
                            height: "96px",
                            position: "relative",
                          }}
                        >
                          {profileData.profileImage ? (
                            <img
                              src={profileData.profileImage || "/placeholder.svg"}
                              alt="Profile"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/abstract-profile.png"
                              }}
                            />
                          ) : (
                            <User className="h-24 w-24 text-gray-600 p-6" />
                          )}

                          {isEditing && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 text-white hover:text-white hover:bg-black/40"
                                onClick={() => profileImageInputRef.current?.click()}
                              >
                                <Upload className="h-6 w-6" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      {fileError && (
                        <div className="mt-2 text-red-500 text-xs flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {fileError}
                        </div>
                      )}
                    </div>
                    {isEditing ? (
                      <div className="flex-1">
                        <div className="space-y-3">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                              이름
                            </label>
                            <Input
                              id="name"
                              value={profileData.name}
                              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                              className="max-w-md"
                              style={{ borderRadius: "12px" }}
                            />
                          </div>
                          <div>
                            <label htmlFor="handle" className="block text-sm font-medium text-gray-700 mb-1">
                              핸들 (@username)
                            </label>
                            <div className="flex items-center max-w-md">
                              <div className="flex-grow-0 flex items-center bg-gray-100 px-3 py-2 rounded-l-md">@</div>
                              <Input
                                id="handle"
                                value={profileData.handle}
                                onChange={(e) => setProfileData({ ...profileData, handle: e.target.value })}
                                className="flex-1 rounded-l-none"
                                style={{ borderRadius: "0 12px 12px 0" }}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                className="ml-2"
                                onClick={async () => {
                                  // Handle availability check logic
                                  if (!profileData.handle.trim()) {
                                    setFileError("핸들을 입력해주세요.")
                                    setHandleAvailable(null)
                                    return
                                  }

                                  try {
                                    setIsSaving(true)
                                    const { data, error } = await supabaseClient
                                      .from("users")
                                      .select("id")
                                      .eq("handle", profileData.handle)
                                      .neq("id", user?.id || "")
                                      .limit(1)

                                    if (error) {
                                      throw error
                                    }

                                    if (data && data.length > 0) {
                                      setFileError("이미 사용 중인 핸들입니다.")
                                      setHandleAvailable(false)
                                    } else {
                                      setFileError(null)
                                      setHandleAvailable(true)
                                      toast({
                                        title: "핸들 확인 완료",
                                        description: "사용 가능한 핸들입니다.",
                                      })
                                    }
                                  } catch (error) {
                                    console.error("핸들 중복 확인 오류:", error)
                                    setFileError("핸들 확인 중 오류가 발생했습니다.")
                                    setHandleAvailable(null)
                                  } finally {
                                    setIsSaving(false)
                                  }
                                }}
                              >
                                중복체크
                              </Button>
                            </div>
                            {fileError && fileError.includes("핸들") && (
                              <div className="mt-2 text-red-500 text-xs flex items-center">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {fileError}
                              </div>
                            )}
                            {handleAvailable === true && !fileError && (
                              <div className="mt-2 text-green-500 text-xs flex items-center">
                                <div className="h-3 w-3 mr-1 rounded-full bg-green-500 flex items-center justify-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-2 w-2 text-white"
                                  >
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                  </svg>
                                </div>
                                사용 가능한 핸들입니다.
                              </div>
                            )}
                          </div>
                          <div>
                            <label htmlFor="plaintext" className="block text-sm font-medium text-gray-700 mb-1">
                              소개
                            </label>
                            <textarea
                              id="plaintext"
                              value={editedPlaintext}
                              onChange={(e) => setEditedPlaintext(e.target.value)}
                              className="w-full rounded-md border border-gray-300 p-2 min-h-[100px]"
                              style={{ borderRadius: "12px" }}
                              placeholder="자기소개를 입력하세요..."
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1">
                        <h1 className="text-2xl font-bold">
                          {user ? user.user_metadata?.name || user.username || "사용자 이름" : "로딩 중..."}
                        </h1>
                        <p className="text-gray-500">
                          @{user ? user.user_metadata?.handle || user.handle || profileData.handle : "로딩 중..."}
                        </p>
                        <p className="text-gray-600 mt-2">
                          {plaintext !== null
                            ? plaintext
                            : user
                              ? user.user_metadata?.bio || profileData.bio
                              : "로딩 중..."}
                        </p>
                        <div className="flex items-center mt-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <span className="font-medium">가입일:</span>
                            <span className="ml-1">2023년 10월 15일</span>
                          </div>
                        </div>
                        <div className="flex items-center mt-2 space-x-4 text-sm">
                          <button
                            onClick={() => {
                              setActiveTab("following")
                              setIsFollowModalOpen(true)
                            }}
                            className="flex items-center hover:text-blue-600 transition-colors"
                          >
                            <span className="font-medium text-gray-700">{followingCount}</span>
                            <span className="ml-1 text-gray-500">팔로잉</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveTab("followers")
                              setIsFollowModalOpen(true)
                            }}
                            className="flex items-center hover:text-blue-600 transition-colors"
                          >
                            <span className="font-medium text-gray-700">{followerCount}</span>
                            <span className="ml-1 text-gray-500">팔로워</span>
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 flex gap-2">
                      {isEditing ? (
                        <>
                          <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                            취소
                          </Button>
                          <Button
                            onClick={() => {
                              console.log("저장 버튼 클릭됨")
                              saveProfile()
                            }}
                            disabled={isSaving}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            {isSaving ? "저장 중..." : "저장"}
                          </Button>
                        </>
                      ) : (
                        <Button variant="outline" onClick={() => setIsEditing(true)}>
                          프로필 편집
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">내 번들</h2>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {}}
                        className={`h-8 w-8 rounded-full ${!showLeftButton ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={!showLeftButton}
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {}}
                        className={`h-8 w-8 rounded-full ${!showRightButton ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={!showRightButton}
                      >
                        <ArrowLeft className="h-4 w-4 rotate-180" />
                      </Button>
                    </div>
                  </div>
                  {myBundles.length > 0 ? (
                    <div className="flex overflow-x-auto pb-4 scrollbar-hide">
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
                        {myBundles.map((bundle) => (
                          <div key={bundle.id} className="min-w-[90px] sm:min-w-[110px] aspect-[3/4]">
                            <BundleCard bundle={bundle} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">아직 생성한 번들이 없습니다.</p>
                  )}
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold mb-4">내 프롬프트</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {myPrompts.map((prompt) => (
                      <PromptCard key={prompt.id} prompt={prompt} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold mb-4">통계</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">작성한 프롬프트</span>
                      <span className="font-medium">24</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-gray-600">저장한 프롬프트</span>
                      <span className="font-medium">42</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="relative">
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      Ads
                    </div>
                    <div className="aspect-[1/1] w-full overflow-hidden">
                      <img
                        src="/impactful-advertisement.png"
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
        {/* Following/Followers Modal */}
        {isFollowModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[80vh] flex flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">{activeTab === "following" ? "팔로잉" : "팔로워"}</h3>
                <button onClick={() => setIsFollowModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <div className="flex border-b">
                <button
                  className={`flex-1 py-3 font-medium text-center ${activeTab === "following" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                  onClick={() => setActiveTab("following")}
                >
                  팔로잉
                </button>
                <button
                  className={`flex-1 py-3 font-medium text-center ${activeTab === "followers" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                  onClick={() => setActiveTab("followers")}
                >
                  팔로워
                </button>
              </div>

              <div className="overflow-y-auto flex-1 p-2">
                {activeTab === "following" ? (
                  followingUsers.length > 0 ? (
                    <div className="space-y-2">
                      {followingUsers.map((user) => (
                        <div key={user.id} className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
                          <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 mr-3">
                            <img
                              src={user.avatar || "/placeholder.svg"}
                              alt={user.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-500">@{user.handle}</p>
                          </div>
                          <button className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-100">
                            팔로잉
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">팔로잉하는 사용자가 없습니다.</div>
                  )
                ) : followerUsers.length > 0 ? (
                  <div className="space-y-2">
                    {followerUsers.map((user) => (
                      <div key={user.id} className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 mr-3">
                          <img
                            src={user.avatar || "/placeholder.svg"}
                            alt={user.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">@{user.handle}</p>
                        </div>
                        <button className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-100">
                          팔로우
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">팔로워가 없습니다.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
