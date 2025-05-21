"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  ArrowUp,
  Search,
  PlusCircle,
  Bookmark,
  Bot,
  HelpCircle,
  Upload,
  X,
  Bell,
  User,
  Menu,
  Check,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"
import { useAuth } from "@/context/auth-context"
import { cn } from "@/lib/utils"

export default function CreatePage() {
  const router = useRouter()
  const { user } = useAuth()
  const promptRef = useRef<HTMLTextAreaElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    tags: "",
    generationType: "Normal Prompt", // 기본값 설정
    model: "", // 빈 문자열로 변경
    prompt: "", // 프롬프트 필드 추가
    result: "",
    language: "Korean", // 언어 필드 추가
  })
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  // 단일 previewImage 대신 이미지 배열과 선택된 이미지 인덱스 사용
  const [images, setImages] = useState<string[]>([])
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0)
  const [activeTab, setActiveTab] = useState("prompt")
  const [categories, setCategories] = useState<any[]>([])
  const [subcategories, setSubcategories] = useState<any[]>([])
  const [categoryGroup, setCategoryGroup] = useState<string>("")

  // 커스텀 셀렉션 상태
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [generationTypeOpen, setGenerationTypeOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)
  const [modelOpen, setModelOpen] = useState(false)
  const [selectedCategoryName, setSelectedCategoryName] = useState("")

  // 기존 상태 변수들 아래에 추가
  const [aiModels, setAiModels] = useState<any[]>([])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user && typeof window !== "undefined") {
      router.push("/login")
    }
  }, [user, router])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .order("category_name", { ascending: true })

        if (error) {
          console.error("Error fetching categories:", error)
          return
        }

        if (data) {
          setCategories(data)
        }
      } catch (error) {
        console.error("Error in fetchCategories:", error)
      }
    }

    fetchCategories()
  }, [])

  // 다른 useEffect 아래에 추가
  useEffect(() => {
    const fetchAIModels = async () => {
      try {
        const { data, error } = await supabase.from("aimodels").select("*").order("ranking", { ascending: false }) // ranking 컬럼 기준으로 내림차순 정렬

        if (error) {
          console.error("Error fetching AI models:", error)
          return
        }

        if (data) {
          setAiModels(data)
        }
      } catch (error) {
        console.error("Error in fetchAIModels:", error)
      }
    }

    fetchAIModels()
  }, [])

  // 카테고리가 변경될 때 서브카테고리 가져오기
  useEffect(() => {
    if (formData.category) {
      fetchSubcategoriesByCategory(formData.category)
    }
  }, [formData.category])

  // 선택한 카테고리에 맞는 서브카테고리 가져오기
  const fetchSubcategoriesByCategory = async (categoryName: string) => {
    try {
      // 먼저 선택된 카테고리의 category_group 값을 가져옵니다
      const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .select("category_group")
        .eq("category_name", categoryName)
        .single()

      if (categoryError || !categoryData) {
        console.error("Error fetching category group:", categoryError)
        return
      }

      // 카테고리 그룹 값을 상태에 저장
      setCategoryGroup(categoryData.category_group)

      // 해당 category_group과 일치하는 서브카테고리를 가져옵니다
      const { data, error } = await supabase
        .from("subcategories")
        .select("*")
        .eq("main_category_group", categoryData.category_group)

      if (error) {
        console.error("Error fetching subcategories:", error)
        return
      }

      if (data) {
        setSubcategories(data)
      }
    } catch (error) {
      console.error("Error in fetchSubcategoriesByCategory:", error)
    }
  }

  const insertVariable = (variable: string) => {
    if (promptRef.current) {
      const textarea = promptRef.current
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const text = formData.prompt
      const newText = text.substring(0, start) + variable + text.substring(end)

      setFormData((prev) => ({ ...prev, prompt: newText }))

      // 포커스를 유지하고 커서 위치를 변수 삽입 후로 이동
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + variable.length, start + variable.length)
      }, 0)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleGenerationTypeChange = (value: string) => {
    // formData 업데이트
    setFormData((prev) => ({
      ...prev,
      generationType: value,
      model: "", // 항상 빈 문자열로 설정
    }))

    // Preview Images 초기화
    setImages([])
    setSelectedImageIndex(0)

    // 드롭다운 닫기
    setGenerationTypeOpen(false)
  }

  const handleLanguageChange = (value: string) => {
    setFormData((prev) => ({ ...prev, language: value }))
    setLanguageOpen(false)
  }

  const handleModelChange = (value: string) => {
    setFormData((prev) => ({ ...prev, model: value }))
    setModelOpen(false)
  }

  const handleCategoryChange = (categoryName: string, categoryGroupValue: string) => {
    setFormData((prev) => ({ ...prev, category: categoryName }))
    setCategoryGroup(categoryGroupValue)
    setSelectedCategoryName(categoryName)
    setCategoryOpen(false)
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      // Video 타입일 때는 최대 1개, 그 외에는 최대 3개까지 추가
      const maxFiles = formData.generationType === "Video" ? 1 : 3
      const remainingSlots = maxFiles - images.length
      const filesToProcess = Math.min(files.length, remainingSlots)

      if (remainingSlots <= 0) {
        alert(`최대 ${maxFiles}개의 이미지만 업로드할 수 있습니다.`)
        return
      }

      // 파일 크기 제한 (Video 타입일 때는 10MB, 그 외에는 500KB)
      const MAX_FILE_SIZE = formData.generationType === "Video" ? 10485760 : 512000
      const sizeLabel = formData.generationType === "Video" ? "10MB" : "500KB"

      for (let i = 0; i < filesToProcess; i++) {
        const file = files[i]

        // 파일 크기 검사
        if (file.size > MAX_FILE_SIZE) {
          alert(`파일 '${file.name}'의 크기가 ${sizeLabel}를 초과합니다. 더 작은 파일을 선택해주세요.`)
          continue
        }

        const reader = new FileReader()
        reader.onloadend = () => {
          setImages((prev) => [...prev, reader.result as string])
          // 첫 번째 이미지를 업로드하는 경우 선택된 이미지로 설정
          if (images.length === 0) {
            setSelectedImageIndex(0)
          }
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    // 선택된 이미지가 삭제된 경우 인덱스 조정
    if (selectedImageIndex === index) {
      setSelectedImageIndex(0)
    } else if (selectedImageIndex > index) {
      setSelectedImageIndex((prev) => prev - 1)
    }
  }

  const addTag = () => {
    const newTag = formData.tags.trim()
    if (newTag === "") return

    // 이미 존재하는 태그인지 확인
    if (!selectedTags.includes(newTag)) {
      setSelectedTags([...selectedTags, newTag])
      setFormData((prev) => ({ ...prev, tags: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      alert("로그인이 필요합니다.")
      router.push("/login")
      return
    }

    setIsSubmitting(true)

    try {
      // 1. Upload images to Supabase Storage if any
      const imageUrls: (string | null)[] = [null, null, null]

      if (images.length > 0) {
        for (let i = 0; i < Math.min(images.length, 3); i++) {
          const imageData = images[i]
          if (imageData.startsWith("data:")) {
            // Convert base64 to blob
            const res = await fetch(imageData)
            const blob = await res.blob()

            // Generate a unique filename
            const fileExt = blob.type.split("/")[1]
            const fileName = `${uuidv4()}.${fileExt}`
            const filePath = `${user.id}/${fileName}`

            // Upload to Supabase Storage
            const { data, error } = await supabase.storage.from("prompts").upload(filePath, blob, {
              contentType: blob.type,
              upsert: true,
            })

            if (error) {
              console.error("Error uploading image:", error)
              continue
            }

            // Get public URL
            const {
              data: { publicUrl },
            } = supabase.storage.from("prompts").getPublicUrl(filePath)

            imageUrls[i] = publicUrl
          }
        }
      }

      // 2. Prepare prompt data
      const promptData = {
        prompt_type: formData.generationType,
        prompt_model: formData.model,
        title: formData.title,
        description: formData.description,
        prompt_content: formData.prompt,
        category: categoryGroup, // 카테고리 이름 대신 카테고리 그룹 값 사용
        token_price: Number.parseInt(formData.price) || 0,
        tags: selectedTags,
        res1: imageUrls[0],
        res2: imageUrls[1],
        res3: imageUrls[2],
        result_text: formData.result,
        created_user_id: user.id,
        created_user_handle: user.username,
        copied: 0,
        saved: 0,
        languages: formData.language, // 언어 필드 추가
      }

      // 3. Save to Supabase
      const { data, error } = await supabase.from("prompts").insert([promptData]).select()

      if (error) {
        console.error("Error saving prompt:", error)
        alert("프롬프트 저장 중 오류가 발생했습니다.")
        setIsSubmitting(false)
        return
      }

      alert("프롬프트가 성공적으로 생성되었습니다!")

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        price: "",
        tags: "",
        generationType: "Normal Prompt",
        model: "",
        prompt: "",
        result: "",
        language: "Korean", // 언어 필드 초기화
      })
      setSelectedTags([])
      setImages([])
      setSelectedImageIndex(0)
      setSelectedCategoryName("")
      setCategoryGroup("")

      // Redirect to the created prompt
      if (data && data[0]) {
        router.push(`/prompt/${data[0].id}`)
      }
    } catch (error) {
      console.error("Error in form submission:", error)
      alert("오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // If not authenticated and on client side, show loading or redirect
  if (!user && typeof window !== "undefined") {
    return <div className="flex h-screen items-center justify-center">로그인이 필요합니다. 리디렉션 중...</div>
  }

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
          <Button variant="secondary" className="w-full justify-start gap-2" style={{ borderRadius: "12px" }} asChild>
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
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url || "/placeholder.svg"}
                    alt={user.username}
                    className="h-8 w-8 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/abstract-profile.png"
                    }}
                  />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </Button>
              <div className="absolute right-0 mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out z-50">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {user?.avatar_url ? (
                          <img
                            src={user.avatar_url || "/placeholder.svg"}
                            alt={user.username}
                            className="h-10 w-10 object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/abstract-profile.png"
                            }}
                          />
                        ) : (
                          <User className="h-6 w-6 text-gray-500" />
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">{user?.username || "사용자"}</p>
                        <p className="text-xs text-gray-500">{user?.email || "user@example.com"}</p>
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
                      onClick={async () => {
                        try {
                          await supabase.auth.signOut()
                          router.push("/login")
                        } catch (error) {
                          console.error("로그아웃 오류:", error)
                        }
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
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Create New</h1>

            {/* Tab Navigation */}
            <div className="border-b mb-6">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab("prompt")}
                  className={`pb-2 text-base font-medium ${
                    activeTab === "prompt"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Create Prompt
                </button>
                <button
                  onClick={() => setActiveTab("bundle")}
                  className={`pb-2 text-base font-medium ${
                    activeTab === "bundle"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Create Bundle
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "prompt" && (
              <>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Existing form content remains here */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Generation Type Custom Select */}
                      <div>
                        <Label htmlFor="generationType">Generation Type</Label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setGenerationTypeOpen(!generationTypeOpen)}
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            id="generationType"
                          >
                            <div className="flex items-center">
                              <span>{formData.generationType}</span>
                            </div>
                            <ChevronDown className="h-4 w-4 opacity-50" />
                          </button>
                          {generationTypeOpen && (
                            <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
                              <div className="py-1">
                                {["Normal Prompt", "Image", "Video"].map((type) => (
                                  <button
                                    key={type}
                                    type="button"
                                    className={cn(
                                      "flex w-full items-center px-3 py-2 text-sm",
                                      formData.generationType === type
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700 hover:bg-gray-50",
                                    )}
                                    onClick={() => handleGenerationTypeChange(type)}
                                  >
                                    {formData.generationType === type && (
                                      <Check className="mr-2 h-4 w-4 text-blue-500" />
                                    )}
                                    <span className={formData.generationType === type ? "ml-6" : "ml-8"}>{type}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Language Custom Select */}
                      <div>
                        <Label htmlFor="language">Language</Label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setLanguageOpen(!languageOpen)}
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            id="language"
                          >
                            <div className="flex items-center">
                              <span>{formData.language}</span>
                            </div>
                            <ChevronDown className="h-4 w-4 opacity-50" />
                          </button>
                          {languageOpen && (
                            <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
                              <div className="py-1 max-h-60 overflow-auto">
                                {[
                                  { value: "Korean", label: "한국어 (Korean)" },
                                  { value: "English", label: "영어 (English)" },
                                  { value: "Japanese", label: "일본어 (Japanese)" },
                                  { value: "Chinese", label: "중국어 (Chinese)" },
                                  { value: "Spanish", label: "스페인어 (Spanish)" },
                                  { value: "French", label: "프랑스어 (French)" },
                                  { value: "German", label: "독일어 (German)" },
                                  { value: "Other", label: "기타 (Other)" },
                                ].map((lang) => (
                                  <button
                                    key={lang.value}
                                    type="button"
                                    className={cn(
                                      "flex w-full items-center px-3 py-2 text-sm",
                                      formData.language === lang.value
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700 hover:bg-gray-50",
                                    )}
                                    onClick={() => handleLanguageChange(lang.value)}
                                  >
                                    {formData.language === lang.value && (
                                      <Check className="mr-2 h-4 w-4 text-blue-500" />
                                    )}
                                    <span className={formData.language === lang.value ? "ml-6" : "ml-8"}>
                                      {lang.label}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Model Custom Select */}
                      <div>
                        <Label htmlFor="model">Model</Label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setModelOpen(!modelOpen)}
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            id="model"
                          >
                            <div className="flex items-center">
                              {formData.model ? (
                                <>
                                  {aiModels.find((m) => m.model === formData.model) ? (
                                    <div
                                      className="w-5 h-5 mr-2 flex items-center justify-center rounded-md overflow-hidden"
                                      style={{
                                        backgroundColor:
                                          aiModels.find((m) => m.model === formData.model)?.model_iconbg || "#FFFFFF",
                                        border:
                                          aiModels.find((m) => m.model === formData.model)?.model_iconbg === "#FFFFFF"
                                            ? "1px solid #e5e7eb"
                                            : "none",
                                      }}
                                    >
                                      <img
                                        src={
                                          aiModels.find((m) => m.model === formData.model)?.model_icon ||
                                          "/placeholder.svg" ||
                                          "/placeholder.svg"
                                        }
                                        alt={`${formData.model} icon`}
                                        className="w-3.5 h-3.5 object-contain"
                                      />
                                    </div>
                                  ) : (
                                    <div
                                      className="w-5 h-5 mr-2 flex items-center justify-center rounded-md overflow-hidden"
                                      style={{
                                        backgroundColor:
                                          formData.model === "ChatGPT"
                                            ? "#FFFFFF"
                                            : formData.model === "Claude"
                                              ? "#db8848"
                                              : formData.model === "Perplexity"
                                                ? "#0a6469"
                                                : formData.model === "Grok"
                                                  ? "#000000"
                                                  : formData.model === "Midjourney"
                                                    ? "#383640"
                                                    : formData.model === "Genspark"
                                                      ? "#6366f1"
                                                      : formData.model === "Runway"
                                                        ? "#ff4d4d"
                                                        : formData.model === "VideoGen"
                                                          ? "#4d7eff"
                                                          : "#FFFFFF",
                                        border: formData.model === "ChatGPT" ? "1px solid #e5e7eb" : "none",
                                      }}
                                    >
                                      <img
                                        src={
                                          formData.model === "ChatGPT"
                                            ? "/placeholder.svg?height=20&width=20&query=chatgpt%20logo"
                                            : formData.model === "Claude"
                                              ? "/placeholder.svg?height=20&width=20&query=claude%20ai%20logo"
                                              : formData.model === "Perplexity"
                                                ? "/placeholder.svg?height=20&width=20&query=perplexity%20ai%20logo"
                                                : formData.model === "Grok"
                                                  ? "/placeholder.svg?height=20&width=20&query=grok%20ai%20logo"
                                                  : formData.model === "Midjourney"
                                                    ? "/placeholder.svg?height=20&width=20&query=midjourney%20logo"
                                                    : formData.model === "Genspark"
                                                      ? "/placeholder.svg?height=20&width=20&query=genspark%20logo"
                                                      : formData.model === "Runway"
                                                        ? "/placeholder.svg?height=20&width=20&query=runway%20ai%20logo"
                                                        : formData.model === "VideoGen"
                                                          ? "/placeholder.svg?height=20&width=20&query=videogen%20logo"
                                                          : "/placeholder.svg?height=20&width=20&query=ai%20model%20icon"
                                        }
                                        alt={`${formData.model} icon`}
                                        className="w-3.5 h-3.5 object-contain"
                                      />
                                    </div>
                                  )}
                                  <span>
                                    {aiModels.find((m) => m.model === formData.model)?.model_text || formData.model}
                                  </span>
                                </>
                              ) : (
                                <span>Select</span>
                              )}
                            </div>
                            <ChevronDown className="h-4 w-4 opacity-50" />
                          </button>
                          {modelOpen && (
                            <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
                              <div className="py-1 max-h-60 overflow-auto">
                                {formData.generationType === "Normal Prompt" && (
                                  <>
                                    {aiModels.length > 0 ? (
                                      aiModels.map((model) => (
                                        <button
                                          key={model.id}
                                          type="button"
                                          className={cn(
                                            "flex w-full items-center px-3 py-2 text-sm",
                                            formData.model === model.model
                                              ? "bg-gray-100 text-gray-900"
                                              : "text-gray-700 hover:bg-gray-50",
                                          )}
                                          onClick={() => handleModelChange(model.model)}
                                        >
                                          <div className="flex items-center">
                                            <div
                                              className="w-5 h-5 mr-2 rounded-md flex items-center justify-center overflow-hidden"
                                              style={{
                                                backgroundColor: model.model_iconbg || "#FFFFFF",
                                                border: model.model_iconbg === "#FFFFFF" ? "1px solid #e5e7eb" : "none",
                                              }}
                                            >
                                              <img
                                                src={model.model_icon || "/placeholder.svg"}
                                                alt={model.model_text}
                                                className="w-3.5 h-3.5 object-contain"
                                              />
                                            </div>
                                            <span>{model.model_text}</span>
                                          </div>
                                        </button>
                                      ))
                                    ) : (
                                      <div className="px-3 py-2 text-sm text-gray-500">Loading models...</div>
                                    )}
                                  </>
                                )}

                                {formData.generationType === "Image" && (
                                  <>
                                    {aiModels.filter((model) => model.model_type === "Image" || !model.model_type)
                                      .length > 0 ? (
                                      aiModels
                                        .filter((model) => model.model_type === "Image" || !model.model_type)
                                        .map((model) => (
                                          <button
                                            key={model.id}
                                            type="button"
                                            className={cn(
                                              "flex w-full items-center px-3 py-2 text-sm",
                                              formData.model === model.model
                                                ? "bg-gray-100 text-gray-900"
                                                : "text-gray-700 hover:bg-gray-50",
                                            )}
                                            onClick={() => handleModelChange(model.model)}
                                          >
                                            <div className="flex items-center">
                                              <div
                                                className="w-5 h-5 mr-2 rounded-md flex items-center justify-center overflow-hidden"
                                                style={{
                                                  backgroundColor: model.model_iconbg || "#FFFFFF",
                                                  border:
                                                    model.model_iconbg === "#FFFFFF" ? "1px solid #e5e7eb" : "none",
                                                }}
                                              >
                                                <img
                                                  src={model.model_icon || "/placeholder.svg"}
                                                  alt={model.model_text}
                                                  className="w-3.5 h-3.5 object-contain"
                                                />
                                              </div>
                                              <span>{model.model_text}</span>
                                            </div>
                                          </button>
                                        ))
                                    ) : (
                                      <>
                                        <button
                                          type="button"
                                          className={cn(
                                            "flex w-full items-center px-3 py-2 text-sm",
                                            formData.model === "Midjourney"
                                              ? "bg-gray-100 text-gray-900"
                                              : "text-gray-700 hover:bg-gray-50",
                                          )}
                                          onClick={() => handleModelChange("Midjourney")}
                                        >
                                          <div className="flex items-center">
                                            <div className="w-5 h-5 mr-2 bg-[#383640] rounded-md flex items-center justify-center overflow-hidden">
                                              <img
                                                src="/abstract-geometric-logo.png"
                                                alt="Midjourney"
                                                className="w-3.5 h-3.5 object-contain"
                                              />
                                            </div>
                                            <span>Midjourney</span>
                                          </div>
                                        </button>
                                        <button
                                          type="button"
                                          className={cn(
                                            "flex w-full items-center px-3 py-2 text-sm",
                                            formData.model === "ChatGPT"
                                              ? "bg-gray-100 text-gray-900"
                                              : "text-gray-700 hover:bg-gray-50",
                                          )}
                                          onClick={() => handleModelChange("ChatGPT")}
                                        >
                                          <div className="flex items-center">
                                            <div className="w-5 h-5 mr-2 bg-[#FFFFFF] rounded-md flex items-center justify-center overflow-hidden border border-gray-200">
                                              <img
                                                src="/chatgpt-inspired-abstract.png"
                                                alt="ChatGPT"
                                                className="w-3.5 h-3.5 object-contain"
                                              />
                                            </div>
                                            <span>ChatGPT</span>
                                          </div>
                                        </button>
                                      </>
                                    )}
                                  </>
                                )}

                                {formData.generationType === "Video" && (
                                  <>
                                    {aiModels.filter((model) => model.model_type === "Video" || !model.model_type)
                                      .length > 0 ? (
                                      aiModels
                                        .filter((model) => model.model_type === "Video" || !model.model_type)
                                        .map((model) => (
                                          <button
                                            key={model.id}
                                            type="button"
                                            className={cn(
                                              "flex w-full items-center px-3 py-2 text-sm",
                                              formData.model === model.model
                                                ? "bg-gray-100 text-gray-900"
                                                : "text-gray-700 hover:bg-gray-50",
                                            )}
                                            onClick={() => handleModelChange(model.model)}
                                          >
                                            <div className="flex items-center">
                                              <div
                                                className="w-5 h-5 mr-2 rounded-md flex items-center justify-center overflow-hidden"
                                                style={{
                                                  backgroundColor: model.model_iconbg || "#FFFFFF",
                                                  border:
                                                    model.model_iconbg === "#FFFFFF" ? "1px solid #e5e7eb" : "none",
                                                }}
                                              >
                                                <img
                                                  src={model.model_icon || "/placeholder.svg"}
                                                  alt={model.model_text}
                                                  className="w-3.5 h-3.5 object-contain"
                                                />
                                              </div>
                                              <span>{model.model_text}</span>
                                            </div>
                                          </button>
                                        ))
                                    ) : (
                                      <>
                                        <button
                                          type="button"
                                          className={cn(
                                            "flex w-full items-center px-3 py-2 text-sm",
                                            formData.model === "Runway"
                                              ? "bg-gray-100 text-gray-900"
                                              : "text-gray-700 hover:bg-gray-50",
                                          )}
                                          onClick={() => handleModelChange("Runway")}
                                        >
                                          <div className="flex items-center">
                                            <div className="w-5 h-5 mr-2 bg-[#ff4d4d] rounded-md flex items-center justify-center overflow-hidden">
                                              <img
                                                src="/placeholder.svg?key=6g9nu"
                                                alt="Runway"
                                                className="w-3.5 h-3.5 object-contain"
                                              />
                                            </div>
                                            <span>Runway</span>
                                          </div>
                                        </button>
                                        <button
                                          type="button"
                                          className={cn(
                                            "flex w-full items-center px-3 py-2 text-sm",
                                            formData.model === "VideoGen"
                                              ? "bg-gray-100 text-gray-900"
                                              : "text-gray-700 hover:bg-gray-50",
                                          )}
                                          onClick={() => handleModelChange("VideoGen")}
                                        >
                                          <div className="flex items-center">
                                            <div className="w-5 h-5 mr-2 bg-[#4d7eff] rounded-md flex items-center justify-center overflow-hidden">
                                              <img
                                                src="/placeholder.svg?key=qta9k"
                                                alt="VideoGen"
                                                className="w-3.5 h-3.5 object-contain"
                                              />
                                            </div>
                                            <span>VideoGen</span>
                                          </div>
                                        </button>
                                      </>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="Enter a title for your prompt"
                        value={formData.title}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Describe what your prompt does and how it helps users"
                        value={formData.description}
                        onChange={handleChange}
                        className="min-h-[120px]"
                        required
                      />
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <Label htmlFor="prompt" className="flex items-center text-white">
                        Prompt <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <div className="mt-1 border rounded-lg bg-white overflow-hidden">
                        <Textarea
                          id="prompt"
                          name="prompt"
                          placeholder="Enter your system prompt here..."
                          value={formData.prompt || ""}
                          onChange={handleChange}
                          className="min-h-[200px] border-0 focus-visible:ring-0 resize-none"
                          required
                          ref={promptRef}
                        />
                      </div>
                      <p className="text-sm text-white mt-2">
                        Use{" "}
                        <button
                          type="button"
                          className="bg-gray-600 px-1.5 py-0.5 rounded-md text-white hover:bg-gray-500 transition-colors cursor-pointer inline mr-1"
                          onClick={() => insertVariable("{{target_text}}")}
                        >
                          &#123;&#123;target_text&#125;&#125;
                        </button>{" "}
                        <button
                          type="button"
                          className="bg-green-600 px-1.5 py-0.5 rounded-md text-white hover:bg-green-500 transition-colors cursor-pointer inline mr-1"
                          onClick={() => insertVariable("{{target_one}}")}
                        >
                          &#123;&#123;target_one&#125;&#125;
                        </button>{" "}
                        <button
                          type="button"
                          className="bg-blue-400 px-1.5 py-0.5 rounded-md text-white hover:bg-blue-300 transition-colors cursor-pointer inline mr-1"
                          onClick={() => insertVariable("{{target_two}}")}
                        >
                          &#123;&#123;target_two&#125;&#125;
                        </button>{" "}
                        <button
                          type="button"
                          className="bg-pink-300 px-1.5 py-0.5 rounded-md text-white hover:bg-pink-200 transition-colors cursor-pointer inline"
                          onClick={() => insertVariable("{{target_three}}")}
                        >
                          &#123;&#123;target_three&#125;&#125;
                        </button>{" "}
                        syntax to define customizable variables in any message
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Category Custom Select */}
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setCategoryOpen(!categoryOpen)}
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            id="category"
                          >
                            <div className="flex items-center">
                              {selectedCategoryName ? (
                                <span>{selectedCategoryName}</span>
                              ) : (
                                <span className="text-muted-foreground">Select a category</span>
                              )}
                            </div>
                            <ChevronDown className="h-4 w-4 opacity-50" />
                          </button>
                          {categoryOpen && (
                            <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
                              <div className="py-1 max-h-60 overflow-auto">
                                {categories.length > 0 ? (
                                  categories.map((category) => (
                                    <button
                                      key={category.id}
                                      type="button"
                                      className={cn(
                                        "flex w-full items-center px-3 py-2 text-sm",
                                        selectedCategoryName === category.category_name
                                          ? "bg-gray-100 text-gray-900"
                                          : "text-gray-700 hover:bg-gray-50",
                                      )}
                                      onClick={() =>
                                        handleCategoryChange(category.category_name, category.category_group)
                                      }
                                    >
                                      <div className="flex items-center">
                                        <div
                                          className="w-5 h-5 mr-2 rounded-md flex items-center justify-center overflow-hidden"
                                          style={{ backgroundColor: category.bg_color || "#f3f4f6" }}
                                        >
                                          <img
                                            src={category.category_img || "/placeholder.svg"}
                                            alt={category.category_name}
                                            className="w-3.5 h-3.5 object-contain"
                                            onError={(e) => {
                                              const target = e.target as HTMLImageElement
                                              target.src = "/placeholder.svg"
                                            }}
                                          />
                                        </div>
                                        <span>{category.category_name}</span>
                                      </div>
                                    </button>
                                  ))
                                ) : (
                                  <div className="px-3 py-2 text-sm text-gray-500">Loading categories...</div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="price">Token Price (🪙)</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Set a price for your prompt"
                          value={formData.price}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="tags">Subcategories Tags</Label>

                      {/* 선택된 태그 표시 영역 */}
                      <div className="flex flex-wrap gap-2 mb-2">
                        {selectedTags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-green-100 rounded-md text-base flex items-center text-green-700"
                          >
                            {tag}
                            <button
                              type="button"
                              className="ml-1 text-green-600 hover:text-green-800"
                              onClick={() => {
                                const newTags = selectedTags.filter((_, i) => i !== index)
                                setSelectedTags(newTags)
                              }}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>

                      <div className="flex w-full gap-2">
                        <Input
                          id="tags"
                          name="tags"
                          placeholder="e.g., email, business, professional"
                          value={formData.tags}
                          onChange={handleChange}
                          className="flex-1"
                        />
                        <Button type="button" onClick={addTag}>
                          Add
                        </Button>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {subcategories.length > 0 ? (
                          subcategories.map((subcategory) => (
                            <button
                              key={subcategory.id}
                              type="button"
                              className="px-4 py-2 text-base bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                              onClick={() => {
                                if (!selectedTags.includes(subcategory.subca_name || subcategory.subcategory_name)) {
                                  setSelectedTags([
                                    ...selectedTags,
                                    subcategory.subca_name || subcategory.subcategory_name,
                                  ])
                                }
                              }}
                            >
                              {subcategory.subca_name || subcategory.subcategory_name}
                            </button>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">카테고리를 선택하면 관련 서브카테고리가 표시됩니다.</p>
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <Label htmlFor="image">
                        {formData.generationType === "Normal Prompt"
                          ? "Preview Images (Max 3, Optional)"
                          : formData.generationType === "Video"
                            ? "Preview Images (Max 1)"
                            : "Preview Images (Max 3)"}
                      </Label>
                      <div className="mt-1 space-y-2">
                        {/* 업로드된 이미지 표시 */}
                        <div className="grid grid-cols-3 gap-2">
                          {images.map((image, index) => (
                            <div
                              key={index}
                              className={`relative aspect-video rounded-md overflow-hidden border ${selectedImageIndex === index ? "border-2 border-blue-500" : "border-gray-200"}`}
                            >
                              <img
                                src={image || "/placeholder.svg"}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-2 right-2 flex items-center space-x-2">
                                <button
                                  type="button"
                                  onClick={() => setSelectedImageIndex(index)}
                                  className={`${
                                    selectedImageIndex === index
                                      ? "bg-blue-500 text-white hover:bg-blue-600"
                                      : "bg-white/90 text-gray-700 hover:bg-white"
                                  } rounded-sm px-3 py-1 text-sm font-medium shadow-sm backdrop-blur-sm transition-colors duration-150 border border-gray-100`}
                                >
                                  Main
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="bg-white/90 rounded-sm p-1 shadow-sm hover:bg-white hover:text-red-500 transition-colors duration-150 backdrop-blur-sm border border-gray-100"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}

                          {/* 이미지 업로드 버튼 (최대 개수 미만인 경우에만 표시) */}
                          {images.length < (formData.generationType === "Video" ? 1 : 3) && (
                            <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500">Click to upload</p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {formData.generationType === "Video"
                                    ? "PNG, JPG, GIF up to 10MB"
                                    : "PNG, JPG, GIF up to 500KB"}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {(formData.generationType === "Video" ? 1 : 3) - images.length} remaining
                                </p>
                              </div>
                              <input
                                id="image"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                              />
                            </label>
                          )}
                        </div>
                      </div>

                      <div className="mt-4">
                        <Label htmlFor="result">Result</Label>
                        <Textarea
                          id="result"
                          name="result"
                          placeholder="Enter the expected result or output of your prompt..."
                          className="min-h-[120px] mt-1"
                          value={formData.result || ""}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Prompt"}
                  </Button>
                </form>

                {/* Preview Card */}
                <div className="mt-12">
                  <h2 className="text-xl font-semibold mb-4">Preview</h2>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-1/3 aspect-video rounded-md overflow-hidden bg-gray-100">
                          {images.length > 0 ? (
                            <img
                              src={images[selectedImageIndex] || "/placeholder.svg"}
                              alt="Preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/image-preview-concept.png"
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Upload className="h-10 w-10" />
                            </div>
                          )}
                        </div>
                        <div className="w-full md:w-2/3">
                          <h3 className="text-lg font-medium">{formData.title || "Your Prompt Title"}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {selectedCategoryName || "Category"} • {formData.generationType} •{" "}
                            {formData.model || "Select Model"}
                          </p>
                          <p className="text-sm mt-3">
                            {formData.description || "Your prompt description will appear here."}
                          </p>
                          {formData.prompt && (
                            <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700 max-h-20 overflow-hidden">
                              {formData.prompt.substring(0, 100)}
                              {formData.prompt.length > 100 ? "..." : ""}
                            </div>
                          )}
                          <div className="mt-4 flex justify-between items-center">
                            <span className="font-medium">{formData.price ? `🪙 ${formData.price}` : "🪙 0.00"}</span>
                            <div className="flex gap-1">
                              {selectedTags.map((tag, index) => (
                                <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}

            {activeTab === "bundle" && (
              <div className="space-y-6">
                <form className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="bundleTitle">번들 제목</Label>
                      <Input id="bundleTitle" name="bundleTitle" placeholder="번들의 제목을 입력하세요" required />
                    </div>

                    <div>
                      <Label htmlFor="bundleDescription">번들 설명</Label>
                      <Textarea
                        id="bundleDescription"
                        name="bundleDescription"
                        placeholder="번들에 대한 설명을 입력하세요"
                        className="min-h-[120px]"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="bundlePrice">번들 가격 (🪙)</Label>
                      <Input
                        id="bundlePrice"
                        name="bundlePrice"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="번들의 가격을 입력하세요"
                        required
                      />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <Label className="mb-2 block">번들에 포함할 프롬프트</Label>

                      <div className="space-y-3 max-h-[400px] overflow-y-auto p-2">
                        {/* 샘플 프롬프트 목록 - 실제로는 API에서 사용자의 프롬프트를 가져와야 함 */}
                        {[
                          {
                            id: 1,
                            title: "이메일 작성 도우미",
                            description: "전문적인 이메일을 빠르게 작성할 수 있는 프롬프트",
                            price: 2.5,
                            model: "ChatGPT",
                            modelColor: "#FFFFFF",
                            modelBorder: true,
                            modelIcon: "/chatgpt-inspired-abstract.png",
                            copies: 245,
                            hearts: 58,
                            type: "Normal Prompt",
                          },
                          {
                            id: 2,
                            title: "풍경 이미지 생성",
                            description: "아름다운 자연 풍경 이미지를 생성하는 프롬프트",
                            price: 5.0,
                            model: "Midjourney",
                            modelColor: "#383640",
                            modelIcon: "/abstract-geometric-logo.png",
                            copies: 187,
                            hearts: 42,
                            type: "Image",
                            image: "/beautiful-landscape.png",
                          },
                          {
                            id: 3,
                            title: "코드 리팩토링 도우미",
                            description: "코드를 더 효율적으로 리팩토링하는 프롬프트",
                            price: 3.75,
                            model: "Claude",
                            modelColor: "#db8848",
                            modelIcon: "/claude-ai-logo.png",
                            copies: 132,
                            hearts: 29,
                            type: "Normal Prompt",
                          },
                          {
                            id: 4,
                            title: "제품 광고 영상 컨셉",
                            description: "효과적인 제품 광고 영상 컨셉을 생성하는 프롬프트",
                            price: 7.5,
                            model: "Runway",
                            modelColor: "#ff4d4d",
                            modelIcon: "/placeholder.svg?key=6g9nu",
                            copies: 98,
                            hearts: 36,
                            type: "Video",
                            image: "/modern-product-display.png",
                          },
                          {
                            id: 5,
                            title: "마케팅 전략 수립",
                            description: "효과적인 마케팅 전략을 수립하는 프롬프트",
                            price: 6.25,
                            model: "Perplexity",
                            modelColor: "#0a6469",
                            modelIcon: "/perplexity-ai-logo.png",
                            copies: 156,
                            hearts: 47,
                            type: "Normal Prompt",
                          },
                        ].map((prompt) => (
                          <div key={prompt.id} className="flex items-start space-x-3 p-4 bg-white rounded-lg border">
                            <input
                              type="checkbox"
                              id={`prompt-${prompt.id}`}
                              className="h-5 w-5 mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                  <div className="inline-flex items-center bg-gray-100 rounded-lg pl-1 pr-2 py-1">
                                    <div className="w-7 h-7 mr-1.5">
                                      <div
                                        className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-md overflow-hidden"
                                        style={{
                                          backgroundColor: prompt.modelColor,
                                          border: prompt.modelBorder ? "1px solid #e5e7eb" : "none",
                                        }}
                                      >
                                        <img
                                          src={prompt.modelIcon || "/placeholder.svg"}
                                          alt={`${prompt.model} icon`}
                                          className="w-5 h-5 object-contain"
                                        />
                                      </div>
                                    </div>
                                    <span className="text-base font-medium">{prompt.model}</span>
                                  </div>
                                  <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                                    {prompt.type}
                                  </span>
                                </div>
                                <label
                                  htmlFor={`prompt-${prompt.id}`}
                                  className="font-medium text-gray-900 cursor-pointer truncate"
                                >
                                  {prompt.title}
                                </label>
                              </div>

                              <p className="text-sm text-gray-500 mt-1 truncate">{prompt.description}</p>
                              <div className="flex items-center gap-3 mt-2">
                                <div className="flex items-center text-xs text-gray-500">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3.5 w-3.5 mr-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                    />
                                  </svg>
                                  {prompt.copies}
                                </div>
                                <div className="flex items-center text-xs text-gray-500">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3.5 w-3.5 mr-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                  </svg>
                                  {prompt.hearts}
                                </div>
                              </div>
                            </div>
                            {(prompt.type === "Image" || prompt.type === "Video") && (
                              <div className="w-20 h-14 rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
                                <img
                                  src={prompt.image || "/placeholder.svg"}
                                  alt={prompt.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="text-sm font-medium text-gray-900 whitespace-nowrap">
                              🪙 {prompt.price.toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        선택한 프롬프트들이 번들에 포함됩니다. 번들 가격은 개별 프롬프트 가격의 합계보다 저렴하게
                        설정하는 것이 좋습니다.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button type="submit" className="w-full">
                      번들 생성하기
                    </Button>
                  </div>
                </form>

                {/* 번들 미리보기 */}
                <div className="mt-12">
                  <h2 className="text-xl font-semibold mb-4">미리보기</h2>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-4">
                        <div>
                          <h3 className="text-lg font-medium">번들 제목이 여기에 표시됩니다</h3>
                          <p className="text-sm text-gray-500 mt-1">포함된 프롬프트: 5개</p>
                        </div>
                        <p className="text-sm">번들 설명이 여기에 표시됩니다.</p>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <h4 className="font-medium mb-2">포함된 프롬프트</h4>
                          <ul className="text-sm space-y-1">
                            <li>• 샘플 프롬프트 1</li>
                            <li>• 샘플 프롬프트 2</li>
                            <li>• 샘플 프롬프트 3</li>
                            <li className="text-gray-400">• 그 외 2개...</li>
                          </ul>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">🪙 12.50</span>
                          <span className="text-sm text-green-600">30% 할인</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
