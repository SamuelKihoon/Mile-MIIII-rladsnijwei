"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Upload,
  Type,
  Check,
  X,
  Home,
  Folder,
  FolderTree,
  Save,
  Plus,
  Trash2,
  Edit,
  Eye,
  Search,
  Bookmark,
  Bot,
  HelpCircle,
  User,
  Code,
  TrendingUp,
  Play,
  Pencil,
  Music,
  Smile,
  Menu,
  Bell,
  ArrowUp,
  PlusCircle,
  PenToolIcon as Tool,
  Loader2,
  ArrowUpDown,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import { useAuth } from "@/context/auth-context"
import { toast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase" // Import the existing Supabase client

// 샘플 데이터
const sampleCategories = [
  {
    id: 1,
    icon: "Monitor",
    text: "Programming & Tech",
    group: "tech",
    beforeHoverBGColor: "bg-white",
    hoverBGColor: "bg-gray-100",
    image: "/programming-code-abstract.png",
  },
  {
    id: 2,
    icon: "Palette",
    text: "Graphics & Design",
    group: "design",
    beforeHoverBGColor: "bg-white",
    hoverBGColor: "bg-gray-100",
    image: "/abstract-ai-art.png",
  },
  {
    id: 3,
    icon: "TrendingUp",
    text: "Digital Marketing",
    group: "marketing",
    beforeHoverBGColor: "bg-white",
    hoverBGColor: "bg-gray-100",
    image: "/interconnected-social-media.png",
  },
]

const sampleSubCategories = [
  {
    id: 1,
    text: "Instagram Reels",
    mainCategory: "Digital Marketing",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
    icon: "PlusCircle",
  },
  {
    id: 2,
    text: "TikTok",
    mainCategory: "Digital Marketing",
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
    icon: "ArrowUp",
  },
  {
    id: 3,
    text: "YouTube",
    mainCategory: "Video & Animation",
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
    icon: "Search",
  },
]

const sampleBundles = [
  {
    id: 1,
    title: "Website Development",
    color: "bg-emerald-900",
    imageUrl: "/website-development-concept.png",
    featured: true,
  },
  {
    id: 2,
    title: "Video Editing Bundle",
    color: "bg-rose-900",
    imageUrl: "/video-editor-pink.png",
    featured: true,
  },
  {
    id: 3,
    title: "Software Development",
    color: "bg-amber-900",
    imageUrl: "/code-interface-abstract.png",
    featured: false,
  },
  {
    id: 4,
    title: "SEO & Google Bundle",
    color: "bg-emerald-800",
    imageUrl: "/seo-analytics-dashboard.png",
    featured: true,
  },
  {
    id: 5,
    title: "Architecture & Interior Design",
    color: "bg-pink-900",
    imageUrl: "/modern-living-space.png",
    featured: false,
  },
]

// 색상 옵션
const colorOptions = [
  { name: "White", value: "bg-white", textColor: "text-gray-900" },
  { name: "Gray", value: "bg-gray-100", textColor: "text-gray-900" },
  { name: "Red", value: "bg-red-100", textColor: "text-red-600" },
  { name: "Orange", value: "bg-orange-100", textColor: "text-orange-600" },
  { name: "Amber", value: "bg-amber-100", textColor: "text-amber-600" },
  { name: "Yellow", value: "bg-yellow-100", textColor: "text-yellow-600" },
  { name: "Lime", value: "bg-lime-100", textColor: "text-lime-600" },
  { name: "Green", value: "bg-green-100", textColor: "text-green-600" },
  { name: "Emerald", value: "bg-emerald-100", textColor: "text-emerald-600" },
  { name: "Teal", value: "bg-teal-100", textColor: "text-teal-600" },
  { name: "Cyan", value: "bg-cyan-100", textColor: "text-cyan-600" },
  { name: "Sky", value: "bg-sky-100", textColor: "text-sky-600" },
  { name: "Blue", value: "bg-blue-100", textColor: "text-blue-600" },
  { name: "Indigo", value: "bg-indigo-100", textColor: "text-indigo-600" },
  { name: "Violet", value: "bg-violet-100", textColor: "text-violet-600" },
  { name: "Purple", value: "bg-purple-100", textColor: "text-purple-600" },
  { name: "Fuchsia", value: "bg-fuchsia-100", textColor: "text-fuchsia-600" },
  { name: "Pink", value: "bg-pink-100", textColor: "text-pink-600" },
  { name: "Rose", value: "bg-rose-100", textColor: "text-rose-600" },
]

// AI 모델 옵션
const sampleAIModels = [
  {
    id: 1,
    name: "ChatGPT",
    bgColor: "bg-white border border-gray-200",
    iconUrl: "https://img.icons8.com/m_rounded/512/chatgpt.png",
  },
  {
    id: 2,
    name: "Claude",
    bgColor: "bg-[#db8848]",
    iconUrl: "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/claude.png",
  },
  {
    id: 3,
    name: "Midjourney",
    bgColor: "bg-[#383640]",
    iconUrl: "https://companieslogo.com/img/orig/midjourney.D-733962ee.png?t=1720244494",
  },
  {
    id: 4,
    name: "Perplexity",
    bgColor: "bg-[#0a6469]",
    iconUrl: "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/perplexity.png",
  },
  {
    id: 5,
    name: "Grok",
    bgColor: "bg-[#000000]",
    iconUrl: "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/grok.png",
  },
]

// 아이콘 옵션
const iconOptions = [
  "PlusCircle",
  "ArrowUp",
  "Search",
  "Bookmark",
  "Bot",
  "HelpCircle",
  "User",
  "Code",
  "TrendingUp",
  "Play",
  "Pencil",
  "Music",
  "Smile",
]

// 아이콘 이미지 업로드 컴포넌트
const IconImageUploader = ({
  value,
  onChange,
  bgColor,
}: {
  value: string | null
  onChange: (value: string | null) => void
  bgColor: string
}) => {
  const iconFileInputRef = useRef<HTMLInputElement>(null)

  const handleIconImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      // 실제 구현에서는 파일을 서버에 업로드하고 URL을 받아와야 합니다.
      // 여기서는 임시로 로컬 URL을 생성합니다.
      const imageUrl = URL.createObjectURL(file)
      onChange(imageUrl)
    }
  }

  return (
    <div className="space-y-2">
      <Label>아이콘 이미지 업로드</Label>
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors ${bgColor}`}
        onClick={() => iconFileInputRef.current?.click()}
      >
        {value ? (
          <div className="relative">
            <img src={value || "/placeholder.svg"} alt="Icon Preview" className="mx-auto h-20 w-20 object-contain" />
            <button
              type="button"
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
              onClick={(e) => {
                e.stopPropagation()
                onChange(null)
                if (iconFileInputRef.current) {
                  iconFileInputRef.current.value = ""
                }
              }}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="py-4">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">이미지를 업로드하려면 클릭하세요</p>
          </div>
        )}
        <input
          ref={iconFileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleIconImageChange}
        />
      </div>
    </div>
  )
}

export default function AdminEditPage() {
  const router = useRouter()

  // 인증 상태
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 상태 관리
  const [activeTab, setActiveTab] = useState("categories")
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(true)

  // Categories 편집기 상태
  const [categories, setCategories] = useState(sampleCategories)
  const [categoryImage, setCategoryImage] = useState<File | null>(null)
  const [categoryImagePreview, setCategoryImagePreview] = useState<string | null>(null)
  const [categoryText, setCategoryText] = useState("")
  const [categoryGroup, setCategoryGroup] = useState("")
  const [categoryBgColor, setCategoryBgColor] = useState("bg-[#ffffff]")
  const [categoryHoverColor, setCategoryHoverColor] = useState("bg-[#f3f4f6]")
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null)
  const [categoryLanguage, setCategoryLanguage] = useState("ko")

  // Sub Categories 편집기 상태
  const [subCategories, setSubCategories] = useState(sampleSubCategories)
  const [subCategoryText, setSubCategoryText] = useState("")
  const [subCategoryMainCategory, setSubCategoryMainCategory] = useState("")
  const [subCategoryBgColor, setSubCategoryBgColor] = useState("bg-[#dbeafe]")
  const [subCategoryIconColor, setSubCategoryIconColor] = useState("text-[#2563eb]")
  const [subCategoryIcon, setSubCategoryIcon] = useState("PlusCircle")
  const [editingSubCategoryId, setEditingSubCategoryId] = useState<number | null>(null)
  const [subCategoryIconImage, setSubCategoryIconImage] = useState<string | null>(null)
  const [subCategoryLanguage, setSubCategoryLanguage] = useState("ko")

  // 번들 선택기 상태
  const [bundles, setBundles] = useState(sampleBundles)

  // AI 모델 편집기 상태
  const [aiModels, setAiModels] = useState<any[]>([])
  const [aiModelName, setAiModelName] = useState("")
  const [aiModelValue, setAiModelValue] = useState("")
  const [aiModelBgColor, setAiModelBgColor] = useState("bg-[#ffffff]")
  const [aiModelIcon, setAiModelIcon] = useState<File | null>(null)
  const [aiModelIconPreview, setAiModelIconPreview] = useState<string | null>(null)
  const [editingAiModelId, setEditingAiModelId] = useState<number | null>(null)
  const [aiModelRanking, setAiModelRanking] = useState<number>(0)

  // 파일 입력 참조
  const categoryFileInputRef = useRef<HTMLInputElement>(null)
  const subCategoryFileInputRef = useRef<HTMLInputElement>(null)
  const aiModelFileInputRef = useRef<HTMLInputElement>(null)

  // 이미지 업로드 핸들러 (Categories)
  const handleCategoryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setCategoryImage(file)
      setCategoryImagePreview(URL.createObjectURL(file))
    }
  }

  // Supabase에서 카테고리 목록 가져오기
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from("categories").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("카테고리 목록 가져오기 오류:", error)
        return
      }

      if (data) {
        // Supabase 데이터 형식을 UI 형식으로 변환
        const formattedCategories = data.map((cat) => ({
          id: cat.id,
          text: cat.category_name,
          group: cat.category_group,
          beforeHoverBGColor: cat.bg_color,
          hoverBGColor: cat.bg_hoover,
          image: cat.category_img,
          languages: cat.languages,
        }))

        setCategories(formattedCategories)
      }
    } catch (error) {
      console.error("카테고리 목록 가져오기 오류:", error)
    }
  }

  // Supabase에서 서브 카테고리 목록 가져오기
  const fetchSubCategories = async () => {
    try {
      const { data, error } = await supabase.from("subcategories").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("서브 카테고리 목록 가져오기 오류:", error)
        return
      }

      if (data) {
        // Supabase 데이터 형식을 UI 형식으로 변환
        const formattedSubCategories = data.map((subCat) => ({
          id: subCat.id,
          text: subCat.subca_name,
          mainCategory: subCat.main_category_group,
          bgColor: subCat.bg_color,
          iconColor: "text-gray-600", // 기본값 설정
          icon: "PlusCircle", // 기본값 설정
          iconImage: subCat.subca_img,
          language: subCat.languages,
        }))

        setSubCategories(formattedSubCategories)
      }
    } catch (error) {
      console.error("서브 카테고리 목록 가져오기 오류:", error)
    }
  }

  // Supabase에서 AI 모델 목록 가져오기
  const fetchAiModels = async () => {
    try {
      const { data, error } = await supabase.from("aimodels").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("AI 모델 목록 가져오기 오류:", error)
        return
      }

      if (data) {
        setAiModels(data)
      }
    } catch (error) {
      console.error("AI 모델 목록 가져오기 오류:", error)
    }
  }

  // 컴포넌트 마운트 시 AI 모델 목록 가져오기
  useEffect(() => {
    fetchCategories()
    fetchSubCategories()
    fetchAiModels()
  }, [])

  // 카테고리 추가/수정 핸들러
  const handleCategorySubmit = async () => {
    if (!user) {
      toast({
        title: "로그인이 필요합니다",
        description: "카테고리를 추가하려면 로그인해주세요.",
        variant: "destructive",
      })
      return
    }

    if (!categoryText || !categoryGroup) {
      toast({
        title: "입력 오류",
        description: "카테고리 이름과 그룹을 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      let imageUrl = null

      // 이미지 업로드 처리
      if (categoryImage) {
        const fileExt = categoryImage.name.split(".").pop()
        const fileName = `${uuidv4()}.${fileExt}`
        const filePath = `${user.id}/${fileName}`

        // Supabase Storage에 이미지 업로드
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("categories")
          .upload(filePath, categoryImage)

        if (uploadError) {
          throw new Error(`이미지 업로드 오류: ${uploadError.message}`)
        }

        // 업로드된 이미지의 공개 URL 가져오기
        const {
          data: { publicUrl },
        } = supabase.storage.from("categories").getPublicUrl(filePath)

        imageUrl = publicUrl
      } else if (categoryImagePreview && categoryImagePreview.startsWith("http")) {
        // 기존 이미지 URL 사용
        imageUrl = categoryImagePreview
      }

      if (editingCategoryId !== null) {
        // 기존 카테고리 수정
        const { error } = await supabase
          .from("categories")
          .update({
            category_name: categoryText,
            category_group: categoryGroup,
            bg_color: categoryBgColor,
            bg_hoover: categoryHoverColor,
            category_img: imageUrl,
            languages: categoryLanguage,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingCategoryId)

        if (error) throw new Error(`카테고리 수정 오류: ${error.message}`)

        toast({
          title: "카테고리 수정 완료",
          description: "카테고리가 성공적으로 수정되었습니다.",
        })
      } else {
        // 새 카테고리 추가
        const { error } = await supabase.from("categories").insert({
          category_name: categoryText,
          category_group: categoryGroup,
          bg_color: categoryBgColor,
          bg_hoover: categoryHoverColor,
          category_img: imageUrl,
          languages: categoryLanguage,
          createduser: user.id,
        })

        if (error) throw new Error(`카테고리 추가 오류: ${error.message}`)

        toast({
          title: "카테고리 추가 완료",
          description: "새 카테고리가 성공적으로 추가되었습니다.",
        })
      }

      // 카테고리 목록 새로고침
      await fetchCategories()

      // 폼 초기화
      resetCategoryForm()
    } catch (error: any) {
      console.error("카테고리 저장 오류:", error)
      toast({
        title: "오류 발생",
        description: error.message || "카테고리 저장 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 카테고리 편집 시작
  const handleEditCategory = (category: any) => {
    setCategoryText(category.text)
    setCategoryGroup(category.group)
    setCategoryBgColor(category.beforeHoverBGColor)
    setCategoryHoverColor(category.hoverBGColor)
    setCategoryImagePreview(category.image)
    setCategoryLanguage(category.languages || "ko")
    setEditingCategoryId(category.id)
  }

  // 카테고리 삭제
  const handleDeleteCategory = async (id: number) => {
    if (!user) {
      toast({
        title: "로그인이 필요합니다",
        description: "카테고리를 삭제하려면 로그인해주세요.",
        variant: "destructive",
      })
      return
    }

    if (confirm("이 카테고리를 삭제하시겠습니까?")) {
      try {
        const { error } = await supabase.from("categories").delete().eq("id", id)

        if (error) throw new Error(`카테고리 삭제 오류: ${error.message}`)

        toast({
          title: "카테고리 삭제 완료",
          description: "카테고리가 성공적으로 삭제되었습니다.",
        })

        // 카테고리 목록 새로고침
        await fetchCategories()
      } catch (error: any) {
        console.error("카테고리 삭제 오류:", error)
        toast({
          title: "오류 발생",
          description: error.message || "카테고리 삭제 중 오류가 발생했습니다.",
          variant: "destructive",
        })
      }
    }
  }

  // 카테고리 폼 초기화
  const resetCategoryForm = () => {
    setCategoryText("")
    setCategoryGroup("")
    setCategoryBgColor("bg-[#ffffff]")
    setCategoryHoverColor("bg-[#f3f4f6]")
    setCategoryImage(null)
    setCategoryImagePreview(null)
    setCategoryLanguage("ko")
    setEditingCategoryId(null)

    if (categoryFileInputRef.current) {
      categoryFileInputRef.current.value = ""
    }
  }

  // 서브 카테고리 추가/수정 핸들러
  const handleSubCategorySubmit = async () => {
    if (!user) {
      toast({
        title: "로그인이 필요합니다",
        description: "서브 카테고리를 추가하려면 로그인해주세요.",
        variant: "destructive",
      })
      return
    }

    if (!subCategoryText || !subCategoryMainCategory) {
      toast({
        title: "입력 오류",
        description: "서브 카테고리 이름과 메인 카테고리를 선택해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      let imageUrl = null

      // 이미지 업로드 처리 (아이콘 이미지가 있는 경우)
      if (subCategoryIconImage && subCategoryIconImage.startsWith("blob:")) {
        // Blob URL을 파일로 변환하는 과정이 필요합니다
        const response = await fetch(subCategoryIconImage)
        const blob = await response.blob()
        const file = new File([blob], `subcategory-icon-${Date.now()}.png`, { type: blob.type })

        const fileExt = file.name.split(".").pop()
        const fileName = `${uuidv4()}.${fileExt}`
        const filePath = `subcategories/${user.id}/${fileName}`

        // Supabase Storage에 이미지 업로드
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("subcategories")
          .upload(filePath, file)

        if (uploadError) {
          throw new Error(`이미지 업로드 오류: ${uploadError.message}`)
        }

        // 업로드된 이미지의 공개 URL 가져오기
        const {
          data: { publicUrl },
        } = supabase.storage.from("subcategories").getPublicUrl(filePath)

        imageUrl = publicUrl
      } else if (subCategoryIconImage && subCategoryIconImage.startsWith("http")) {
        // 기존 이미지 URL 사용
        imageUrl = subCategoryIconImage
      }

      if (editingSubCategoryId !== null) {
        // 기존 서브 카테고리 수정
        const { error } = await supabase
          .from("subcategories")
          .update({
            main_category_group: subCategoryMainCategory,
            languages: subCategoryLanguage,
            subca_img: imageUrl,
            subca_name: subCategoryText,
            bg_color: subCategoryBgColor,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingSubCategoryId)

        if (error) throw new Error(`서브 카테고리 수정 오류: ${error.message}`)

        toast({
          title: "서브 카테고리 수정 완료",
          description: "서브 카테고리가 성공적으로 수정되었습니다.",
        })
      } else {
        // 새 서브 카테고리 추가
        const { error } = await supabase.from("subcategories").insert({
          main_category_group: subCategoryMainCategory,
          languages: subCategoryLanguage,
          subca_img: imageUrl,
          subca_name: subCategoryText,
          bg_color: subCategoryBgColor,
          createduser: user.id,
        })

        if (error) throw new Error(`서브 카테고리 추가 오류: ${error.message}`)

        toast({
          title: "서브 카테고리 추가 완료",
          description: "새 서브 카테고리가 성공적으로 추가되었습니다.",
        })
      }

      // 서브 카테고리 목록 새로고침
      await fetchSubCategories()

      // 폼 초기화
      resetSubCategoryForm()
    } catch (error: any) {
      console.error("서브 카테고리 저장 오류:", error)
      toast({
        title: "오류 발생",
        description: error.message || "서브 카테고리 저장 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 서브 카테고리 편집 시작
  const handleEditSubCategory = (subCategory: any) => {
    setSubCategoryText(subCategory.text)
    setSubCategoryMainCategory(subCategory.mainCategory)
    setSubCategoryBgColor(subCategory.bgColor)
    setSubCategoryIconColor(subCategory.iconColor)
    setSubCategoryIcon(subCategory.icon)
    setSubCategoryIconImage(subCategory.iconImage || null)
    setSubCategoryLanguage(subCategory.language || "ko")
    setEditingSubCategoryId(subCategory.id)
  }

  // 서브 카테고리 삭제
  const handleDeleteSubCategory = async (id: number) => {
    if (!user) {
      toast({
        title: "로그인이 필요합니다",
        description: "서브 카테고리를 삭제하려면 로그인해주세요.",
        variant: "destructive",
      })
      return
    }

    if (confirm("이 서브 카테고리를 삭제하시겠습니까?")) {
      try {
        const { error } = await supabase.from("subcategories").delete().eq("id", id)

        if (error) throw new Error(`서브 카테고리 삭제 오류: ${error.message}`)

        toast({
          title: "서브 카테고리 삭제 완료",
          description: "서브 카테고리가 성공적으로 삭제되었습니다.",
        })

        // 서브 카테고리 목록 새로고침
        await fetchSubCategories()
      } catch (error: any) {
        console.error("서브 카테고리 삭제 오류:", error)
        toast({
          title: "오류 발생",
          description: error.message || "서브 카테고리 삭제 중 오류가 발생했습니다.",
          variant: "destructive",
        })
      }
    }
  }

  // 서브 카테고리 폼 초기화
  const resetSubCategoryForm = () => {
    setSubCategoryText("")
    setSubCategoryMainCategory("")
    setSubCategoryBgColor("bg-[#dbeafe]")
    setSubCategoryIconColor("text-[#2563eb]")
    setSubCategoryIcon("PlusCircle")
    setSubCategoryIconImage(null)
    setSubCategoryLanguage("ko")
    setEditingSubCategoryId(null)
  }

  // 번들 피처링 토글
  const toggleBundleFeatured = (id: number) => {
    setBundles(bundles.map((bundle) => (bundle.id === id ? { ...bundle, featured: !bundle.featured } : bundle)))
  }

  // 번들 변경사항 저장
  const saveBundleChanges = () => {
    alert("번들 변경사항이 저장되었습니다.")
    // 여기에 실제 저장 로직 추가
  }

  // AI 모델 아이콘 이미지 변경 핸들러
  const handleAiModelIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setAiModelIcon(file)
      setAiModelIconPreview(URL.createObjectURL(file))
    }
  }

  // AI 모델 추가/수정 핸들러
  const handleAiModelSubmit = async () => {
    if (!user) {
      toast({
        title: "로그인이 필요합니다",
        description: "AI 모델을 추가하려면 로그인해주세요.",
        variant: "destructive",
      })
      return
    }

    if (!aiModelName || !aiModelValue) {
      toast({
        title: "입력 오류",
        description: "AI 모델 이름과 값을 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      let iconUrl = null

      // 이미지 업로드 처리
      if (aiModelIcon) {
        const fileExt = aiModelIcon.name.split(".").pop()
        const fileName = `${uuidv4()}.${fileExt}`
        const filePath = `${user.id}/${fileName}`

        // Supabase Storage에 이미지 업로드
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("aimodels")
          .upload(filePath, aiModelIcon)

        if (uploadError) {
          throw new Error(`이미지 업로드 오류: ${uploadError.message}`)
        }

        // 업로드된 이미지의 공개 URL 가져오기
        const {
          data: { publicUrl },
        } = supabase.storage.from("aimodels").getPublicUrl(filePath)

        iconUrl = publicUrl
      } else if (aiModelIconPreview && aiModelIconPreview.startsWith("http")) {
        // 기존 이미지 URL 사용
        iconUrl = aiModelIconPreview
      }

      if (editingAiModelId !== null) {
        // 기존 AI 모델 수정
        const { error } = await supabase
          .from("aimodels")
          .update({
            model_text: aiModelName,
            model: aiModelValue,
            model_iconbg: aiModelBgColor,
            model_icon: iconUrl,
            ranking: aiModelRanking,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingAiModelId)

        if (error) throw new Error(`AI 모델 수정 오류: ${error.message}`)

        toast({
          title: "AI 모델 수정 완료",
          description: "AI 모델이 성공적으로 수정되었습니다.",
        })
      } else {
        // 새 AI 모델 추가
        const { error } = await supabase.from("aimodels").insert({
          model_text: aiModelName,
          model: aiModelValue,
          model_iconbg: aiModelBgColor,
          model_icon: iconUrl,
          ranking: aiModelRanking,
          createduser: user.id,
        })

        if (error) throw new Error(`AI 모델 추가 오류: ${error.message}`)

        toast({
          title: "AI 모델 추가 완료",
          description: "새 AI 모델이 성공적으로 추가되었습니다.",
        })
      }

      // AI 모델 목록 새로고침
      await fetchAiModels()

      // 폼 초기화
      resetAiModelForm()
    } catch (error: any) {
      console.error("AI 모델 저장 오류:", error)
      toast({
        title: "오류 발생",
        description: error.message || "AI 모델 저장 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // AI 모델 편집 시작
  const handleEditAiModel = (model: any) => {
    setAiModelName(model.model_text || "")
    setAiModelValue(model.model || "")
    setAiModelBgColor(model.model_iconbg || "bg-[#ffffff]")
    setAiModelIconPreview(model.model_icon || null)
    setAiModelRanking(model.ranking || 0)
    setEditingAiModelId(model.id)
  }

  // AI 모델 삭제
  const handleDeleteAiModel = async (id: number) => {
    if (!user) {
      toast({
        title: "로그인이 필요합니다",
        description: "AI 모델을 삭제하려면 로그인해주세요.",
        variant: "destructive",
      })
      return
    }

    if (confirm("이 AI 모델을 삭제하시겠습니까?")) {
      try {
        const { error } = await supabase.from("aimodels").delete().eq("id", id)

        if (error) throw new Error(`AI 모델 삭제 오류: ${error.message}`)

        toast({
          title: "AI 모델 삭제 완료",
          description: "AI 모델이 성공적으로 삭제되었습니다.",
        })

        // AI 모델 목록 새로고침
        await fetchAiModels()
      } catch (error: any) {
        console.error("AI 모델 삭제 오류:", error)
        toast({
          title: "오류 발생",
          description: error.message || "AI 모델 삭제 중 오류가 발생했습니다.",
          variant: "destructive",
        })
      }
    }
  }

  // AI 모델 폼 초기화
  const resetAiModelForm = () => {
    setAiModelName("")
    setAiModelValue("")
    setAiModelBgColor("bg-[#ffffff]")
    setAiModelIcon(null)
    setAiModelIconPreview(null)
    setAiModelRanking(0)
    setEditingAiModelId(null)

    if (aiModelFileInputRef.current) {
      aiModelFileInputRef.current.value = ""
    }
  }

  // 색상 선택 컴포넌트
  const ColorSelector = ({
    label,
    value,
    onChange,
  }: {
    label: string
    value: string
    onChange: (value: string) => void
  }) => {
    // Extract color from Tailwind class or use default
    const extractColor = (bgClass: string) => {
      if (bgClass.startsWith("bg-[")) {
        return bgClass.match(/bg-\[(.*?)\]/)?.[1] || "#ffffff"
      }
      // Default colors for common Tailwind classes
      if (bgClass === "bg-white") return "#ffffff"
      if (bgClass === "bg-black") return "#000000"
      if (bgClass.includes("bg-red")) return "#ef4444"
      if (bgClass.includes("bg-blue")) return "#3b82f6"
      if (bgClass.includes("bg-green")) return "#22c55e"
      if (bgClass.includes("bg-yellow")) return "#eab308"
      if (bgClass.includes("bg-purple")) return "#a855f7"
      if (bgClass.includes("bg-pink")) return "#ec4899"
      if (bgClass.includes("bg-gray")) return "#9ca3af"
      return "#ffffff"
    }

    // Convert hex color to Tailwind bg class
    const colorToBgClass = (color: string) => {
      return `bg-[${color}]`
    }

    const currentColor = extractColor(value)
    const [hexValue, setHexValue] = useState(currentColor)

    // Update hex input when color picker changes
    useEffect(() => {
      setHexValue(extractColor(value))
    }, [value])

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newColor = e.target.value
      setHexValue(newColor)
      onChange(colorToBgClass(newColor))
    }

    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newHex = e.target.value
      setHexValue(newHex)

      // Only update the actual color if it's a valid hex
      if (/^#([0-9A-F]{3}){1,2}$/i.test(newHex)) {
        onChange(colorToBgClass(newHex))
      }
    }

    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="flex items-center gap-3">
          <div
            className={`h-10 w-10 rounded-md border ${value}`}
            style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.1)" }}
          ></div>
          <div className="flex-1 flex gap-2">
            <input
              type="color"
              value={currentColor}
              onChange={handleColorChange}
              onInput={(e) => {
                // Update color in real-time during selection
                const newColor = (e.target as HTMLInputElement).value
                setHexValue(newColor)
                onChange(colorToBgClass(newColor))
              }}
              className="h-10 w-16 cursor-pointer appearance-none overflow-hidden rounded-md border border-input bg-transparent"
            />
            <div className="relative flex-1">
              <input
                type="text"
                value={hexValue}
                onChange={handleHexChange}
                className="h-10 w-full px-3 py-2 border rounded-md"
                placeholder="#FFFFFF"
                maxLength={7}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 아이콘 선택 컴포넌트
  const IconSelector = ({
    value,
    onChange,
    bgColor,
    iconColor,
  }: {
    value: string
    onChange: (value: string) => void
    bgColor: string
    iconColor: string
  }) => {
    // 아이콘 렌더링 함수
    const renderIcon = (iconName: string) => {
      switch (iconName) {
        case "PlusCircle":
          return <Plus className="h-5 w-5" />
        case "ArrowUp":
          return <Home className="h-5 w-5" />
        case "Search":
          return <Search className="h-5 w-5" />
        case "Bookmark":
          return <Bookmark className="h-5 w-5" />
        case "Bot":
          return <Bot className="h-5 w-5" />
        case "HelpCircle":
          return <HelpCircle className="h-5 w-5" />
        case "User":
          return <User className="h-5 w-5" />
        case "Code":
          return <Code className="h-5 w-5" />
        case "TrendingUp":
          return <TrendingUp className="h-5 w-5" />
        case "Play":
          return <Play className="h-5 w-5" />
        case "Pencil":
          return <Pencil className="h-5 w-5" />
        case "Music":
          return <Music className="h-5 w-5" />
        case "Smile":
          return <Smile className="h-5 w-5" />
        default:
          return <Plus className="h-5 w-5" />
      }
    }

    return (
      <div className="space-y-2">
        <Label>아이콘 선택</Label>
        <div className="grid grid-cols-6 gap-2">
          {iconOptions.map((iconName) => (
            <button
              key={iconName}
              type="button"
              className={`h-10 w-10 rounded-lg flex items-center justify-center ${value === iconName ? "ring-2 ring-blue-500" : "border"}`}
              onClick={() => onChange(iconName)}
              title={iconName}
            >
              <div className={`h-8 w-8 ${bgColor} rounded-lg flex items-center justify-center`}>
                <div className={iconColor}>{renderIcon(iconName)}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
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
          <Button variant="secondary" className="w-full justify-start gap-2" style={{ borderRadius: "12px" }} asChild>
            <Link href="/adminedit">
              <Edit className="h-4 w-4" />
              Admin Edit
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="flex items-center justify-between p-4 bg-gray-50">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
            <div className="md:hidden h-8 w-20 border rounded-md flex items-center justify-center font-bold">Logo</div>
            <div className="relative hidden md:block w-64">
              <Input type="text" placeholder="Search..." className="pr-10 h-10" />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
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
            <h1 className="text-3xl font-bold mb-6">관리자 편집 페이지</h1>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="categories">
                  <Folder className="mr-2 h-4 w-4" />
                  Categories 편집
                </TabsTrigger>
                <TabsTrigger value="subcategories">
                  <FolderTree className="mr-2 h-4 w-4" />
                  Sub Categories 편집
                </TabsTrigger>
                <TabsTrigger value="bundles">
                  <Home className="mr-2 h-4 w-4" />
                  홈페이지 번들 관리
                </TabsTrigger>
                <TabsTrigger value="aimodels">
                  <Tool className="mr-2 h-4 w-4" />
                  도구 목록 편집
                </TabsTrigger>
              </TabsList>

              {/* Categories 편집 탭 */}
              <TabsContent value="categories" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* 왼쪽: 카테고리 추가/편집 폼 */}
                  <Card className="md:col-span-1">
                    <CardHeader>
                      <CardTitle>{editingCategoryId !== null ? "카테고리 수정" : "새 카테고리 추가"}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* 이미지 업로드 영역 */}
                      <div className="space-y-2">
                        <Label>카테고리 아이콘 이미지 업로드</Label>
                        <div
                          className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => categoryFileInputRef.current?.click()}
                        >
                          {categoryImagePreview ? (
                            <div className="relative">
                              <img
                                src={categoryImagePreview || "/placeholder.svg"}
                                alt="Preview"
                                className="mx-auto h-40 object-contain"
                              />
                              <button
                                type="button"
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setCategoryImage(null)
                                  setCategoryImagePreview(null)
                                  if (categoryFileInputRef.current) {
                                    categoryFileInputRef.current.value = ""
                                  }
                                }}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="py-4">
                              <Upload className="mx-auto h-12 w-12 text-gray-400" />
                              <p className="mt-2 text-sm text-gray-500">이미지를 업로드하려면 클릭하세요</p>
                            </div>
                          )}
                          <input
                            ref={categoryFileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleCategoryImageChange}
                          />
                        </div>
                      </div>

                      {/* 텍스트 입력 */}
                      <div className="space-y-2">
                        <Label>카테고리 이름</Label>
                        <div className="flex items-center border rounded-md px-3 py-2">
                          <Type className="h-5 w-5 text-gray-400 mr-2" />
                          <Input
                            type="text"
                            placeholder="예: Programming & Tech"
                            value={categoryText}
                            onChange={(e) => setCategoryText(e.target.value)}
                            className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          />
                        </div>
                      </div>

                      {/* 그룹 입력 */}
                      <div className="space-y-2">
                        <Label>카테고리 그룹</Label>
                        <div className="flex items-center border rounded-md px-3 py-2">
                          <Folder className="h-5 w-5 text-gray-400 mr-2" />
                          <Input
                            type="text"
                            placeholder="예: tech"
                            value={categoryGroup}
                            onChange={(e) => setCategoryGroup(e.target.value)}
                            className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          />
                        </div>
                      </div>

                      {/* 언어 선택 */}
                      <div className="space-y-2">
                        <Label>언어</Label>
                        <Select value={categoryLanguage} onValueChange={setCategoryLanguage}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="언어 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ko">한국어</SelectItem>
                            <SelectItem value="en">영어</SelectItem>
                            <SelectItem value="ja">일본어</SelectItem>
                            <SelectItem value="zh">중국어</SelectItem>
                            <SelectItem value="es">스페인어</SelectItem>
                            <SelectItem value="fr">프랑스어</SelectItem>
                            <SelectItem value="de">독일어</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* 색상 선택기 */}
                      <ColorSelector label="배경 색상" value={categoryBgColor} onChange={setCategoryBgColor} />

                      <ColorSelector label="호버 색상" value={categoryHoverColor} onChange={setCategoryHoverColor} />

                      {/* 버튼 */}
                      <div className="flex gap-2 pt-2">
                        <Button type="button" className="flex-1" onClick={handleCategorySubmit} disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              저장 중...
                            </>
                          ) : (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              {editingCategoryId !== null ? "수정 완료" : "카테고리 추가"}
                            </>
                          )}
                        </Button>

                        {editingCategoryId !== null && (
                          <Button type="button" variant="outline" onClick={resetCategoryForm}>
                            <X className="mr-2 h-4 w-4" />
                            취소
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* 오른쪽: 카테고리 목록 */}
                  <Card className="md:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>카테고리 목록</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative">
                        <div className={`flex flex-wrap gap-[15px] items-center`}>
                          {categories.length === 0 ? (
                            <p className="text-center py-8 text-gray-500 w-full">등록된 카테고리가 없습니다.</p>
                          ) : (
                            categories.map((category) => (
                              <Card
                                key={category.id}
                                className="aspect-square flex flex-col p-2.5 hover:bg-gray-100 cursor-pointer w-[120px] rounded-2xl relative group"
                              >
                                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleEditCategory(category)
                                    }}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleDeleteCategory(category.id)
                                    }}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                                <div className="flex items-start">
                                  <div
                                    className={`h-12 w-12 ${category.beforeHoverBGColor} rounded-lg flex items-center justify-center overflow-hidden`}
                                  >
                                    <img
                                      src={category.image || "/placeholder.svg"}
                                      alt={category.text}
                                      className="w-8 h-8 object-contain"
                                    />
                                  </div>
                                </div>
                                <p className="text-base font-medium mt-auto">{category.text}</p>
                                <p className="text-xs text-gray-500">그룹: {category.group}</p>
                              </Card>
                            ))
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Sub Categories 편집 탭 */}
              <TabsContent value="subcategories" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* 왼쪽: 서브 카테고리 추가/편집 폼 */}
                  <Card className="md:col-span-1">
                    <CardHeader>
                      <CardTitle>
                        {editingSubCategoryId !== null ? "서브 카테고리 수정" : "새 서브 카테고리 추가"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* 아이콘 이미지 업로드 */}
                      <IconImageUploader
                        value={subCategoryIconImage}
                        onChange={setSubCategoryIconImage}
                        bgColor={subCategoryBgColor}
                      />

                      {/* 언어 선택 */}
                      <div className="space-y-2">
                        <Label>언어</Label>
                        <Select value={subCategoryLanguage} onValueChange={setSubCategoryLanguage}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="언어 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ko">한국어</SelectItem>
                            <SelectItem value="en">영어</SelectItem>
                            <SelectItem value="ja">일본어</SelectItem>
                            <SelectItem value="zh">중국어</SelectItem>
                            <SelectItem value="es">스페인어</SelectItem>
                            <SelectItem value="fr">프랑스어</SelectItem>
                            <SelectItem value="de">독일어</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* 텍스트 입력 */}
                      <div className="space-y-2">
                        <Label>서브 카테고리 이름</Label>
                        <div className="flex items-center border rounded-md px-3 py-2">
                          <Type className="h-5 w-5 text-gray-400 mr-2" />
                          <Input
                            type="text"
                            placeholder="예: Instagram Reels"
                            value={subCategoryText}
                            onChange={(e) => setSubCategoryText(e.target.value)}
                            className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          />
                        </div>
                      </div>

                      {/* 메인 카테고리 선택 */}
                      <div className="space-y-2">
                        <Label>메인 카테고리 (선택하면 목록이 필터링됩니다)</Label>
                        <Select value={subCategoryMainCategory} onValueChange={setSubCategoryMainCategory}>
                          <SelectTrigger>
                            <SelectValue placeholder="메인 카테고리 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">모든 카테고리</SelectItem>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.group}>
                                {category.group}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* 색상 선택기 */}
                      <ColorSelector label="배경 색상" value={subCategoryBgColor} onChange={setSubCategoryBgColor} />

                      {/* 버튼 */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          type="button"
                          className="flex-1"
                          onClick={handleSubCategorySubmit}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              저장 중...
                            </>
                          ) : (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              {editingSubCategoryId !== null ? "수정 완료" : "서브 카테고리 추가"}
                            </>
                          )}
                        </Button>

                        {editingSubCategoryId !== null && (
                          <Button type="button" variant="outline" onClick={resetSubCategoryForm}>
                            <X className="mr-2 h-4 w-4" />
                            취소
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* 오른쪽: 서브 카테고리 목록 */}
                  <Card className="md:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>서브 카테고리 목록</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {subCategories.length === 0 ? (
                          <p className="text-center py-8 text-gray-500">등록된 서브 카테고리가 없습니다.</p>
                        ) : (
                          subCategories
                            .filter((subCat) =>
                              subCategoryMainCategory === "all" || subCategoryMainCategory === ""
                                ? true
                                : subCat.mainCategory === subCategoryMainCategory,
                            )
                            .map((subCategory) => (
                              <div
                                key={subCategory.id}
                                className="flex items-center p-3 border rounded-lg hover:bg-gray-50"
                              >
                                <div
                                  className={`flex-shrink-0 mr-4 h-12 w-12 ${subCategory.bgColor} rounded-lg flex items-center justify-center`}
                                >
                                  {subCategory.iconImage ? (
                                    <img
                                      src={subCategory.iconImage || "/placeholder.svg"}
                                      alt="Icon"
                                      className="h-8 w-8 object-contain"
                                    />
                                  ) : (
                                    <div className={subCategory.iconColor}>
                                      {subCategory.icon === "PlusCircle" && <Plus className="h-6 w-6" />}
                                      {subCategory.icon === "ArrowUp" && <Home className="h-6 w-6" />}
                                      {subCategory.icon === "Search" && <Search className="h-6 w-6" />}
                                      {subCategory.icon === "Bookmark" && <Bookmark className="h-6 w-6" />}
                                      {subCategory.icon === "Bot" && <Bot className="h-6 w-6" />}
                                      {subCategory.icon === "HelpCircle" && <HelpCircle className="h-6 w-6" />}
                                      {subCategory.icon === "User" && <User className="h-6 w-6" />}
                                      {subCategory.icon === "Code" && <Code className="h-6 w-6" />}
                                      {subCategory.icon === "TrendingUp" && <TrendingUp className="h-6 w-6" />}
                                      {subCategory.icon === "Play" && <Play className="h-6 w-6" />}
                                      {subCategory.icon === "Pencil" && <Pencil className="h-6 w-6" />}
                                      {subCategory.icon === "Music" && <Music className="h-6 w-6" />}
                                      {subCategory.icon === "Smile" && <Smile className="h-6 w-6" />}
                                    </div>
                                  )}
                                </div>

                                <div className="flex-grow">
                                  <h3 className="font-medium">{subCategory.text}</h3>
                                  <p className="text-sm text-gray-500">메인 카테고리: {subCategory.mainCategory}</p>
                                </div>

                                <div className="flex-shrink-0 flex gap-2">
                                  <Button size="sm" variant="ghost" onClick={() => handleEditSubCategory(subCategory)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>

                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleDeleteSubCategory(subCategory.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* 홈페이지 번들 관리 탭 */}
              <TabsContent value="bundles" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>홈페이지에 표시할 번들 선택</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-500 mb-4">
                        홈페이지에 표시할 번들을 선택하세요. 선택된 번들은 홈페이지의 "Bundles" 섹션에 표시됩니다.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {bundles.map((bundle) => (
                          <div
                            key={bundle.id}
                            className={`border rounded-lg overflow-hidden ${bundle.featured ? "ring-2 ring-blue-500" : ""}`}
                          >
                            <div className="aspect-video relative">
                              <img
                                src={bundle.imageUrl || "/placeholder.svg"}
                                alt={bundle.title}
                                className="w-full h-full object-cover"
                              />
                              <div className={`absolute inset-0 ${bundle.color} opacity-20`}></div>

                              {bundle.featured && (
                                <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                  홈페이지에 표시됨
                                </div>
                              )}
                            </div>

                            <div className="p-3">
                              <h3 className="font-medium">{bundle.title}</h3>

                              <div className="flex justify-between items-center mt-2">
                                <Button
                                  size="sm"
                                  variant={bundle.featured ? "default" : "outline"}
                                  onClick={() => toggleBundleFeatured(bundle.id)}
                                >
                                  {bundle.featured ? (
                                    <>
                                      <Check className="mr-1 h-4 w-4" />
                                      선택됨
                                    </>
                                  ) : (
                                    <>
                                      <Plus className="mr-1 h-4 w-4" />
                                      선택하기
                                    </>
                                  )}
                                </Button>

                                <Button size="sm" variant="ghost">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Separator className="my-6" />

                      <div className="flex justify-end">
                        <Button onClick={saveBundleChanges}>
                          <Save className="mr-2 h-4 w-4" />
                          변경사항 저장
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* AI 모델 편집 탭 */}
              <TabsContent value="aimodels" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* 왼쪽: AI 모델 추가/편집 폼 */}
                  <Card className="md:col-span-1">
                    <CardHeader>
                      <CardTitle>{editingAiModelId !== null ? "AI 모델 수정" : "새 AI 모델 추가"}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* 이미지 업로드 영역 */}
                      <div className="space-y-2">
                        <Label>AI 모델 아이콘 이미지 업로드</Label>
                        <div
                          className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => aiModelFileInputRef.current?.click()}
                        >
                          {aiModelIconPreview ? (
                            <div className="relative">
                              <img
                                src={aiModelIconPreview || "/placeholder.svg"}
                                alt="Preview"
                                className="mx-auto h-40 object-contain"
                              />
                              <button
                                type="button"
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setAiModelIcon(null)
                                  setAiModelIconPreview(null)
                                  if (aiModelFileInputRef.current) {
                                    aiModelFileInputRef.current.value = ""
                                  }
                                }}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="py-4">
                              <Upload className="mx-auto h-12 w-12 text-gray-400" />
                              <p className="mt-2 text-sm text-gray-500">이미지를 업로드하려면 클릭하세요</p>
                            </div>
                          )}
                          <input
                            ref={aiModelFileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAiModelIconChange}
                          />
                        </div>
                      </div>

                      {/* 텍스트 입력 */}
                      <div className="space-y-2">
                        <Label>AI 모델 이름 (표시용)</Label>
                        <div className="flex items-center border rounded-md px-3 py-2">
                          <Type className="h-5 w-5 text-gray-400 mr-2" />
                          <Input
                            type="text"
                            placeholder="예: ChatGPT"
                            value={aiModelName}
                            onChange={(e) => setAiModelName(e.target.value)}
                            className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          />
                        </div>
                      </div>

                      {/* 값 입력 */}
                      <div className="space-y-2">
                        <Label>AI 모델 값 (저장용)</Label>
                        <div className="flex items-center border rounded-md px-3 py-2">
                          <Code className="h-5 w-5 text-gray-400 mr-2" />
                          <Input
                            type="text"
                            placeholder="예: chatgpt"
                            value={aiModelValue}
                            onChange={(e) => setAiModelValue(e.target.value)}
                            className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          />
                        </div>
                      </div>

                      {/* 우선순위 입력 */}
                      <div className="space-y-2">
                        <Label>우선순위 (숫자가 클수록 상위에 표시)</Label>
                        <div className="flex items-center border rounded-md px-3 py-2">
                          <ArrowUpDown className="h-5 w-5 text-gray-400 mr-2" />
                          <Input
                            type="number"
                            min="0"
                            placeholder="예: 10"
                            value={aiModelRanking}
                            onChange={(e) => setAiModelRanking(Number.parseInt(e.target.value) || 0)}
                            className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          />
                        </div>
                      </div>

                      {/* 색상 선택기 */}
                      <ColorSelector label="아이콘 배경 색상" value={aiModelBgColor} onChange={setAiModelBgColor} />

                      {/* 버튼 */}
                      <div className="flex gap-2 pt-2">
                        <Button type="button" className="flex-1" onClick={handleAiModelSubmit} disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              저장 중...
                            </>
                          ) : (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              {editingAiModelId !== null ? "수정 완료" : "AI 모델 추가"}
                            </>
                          )}
                        </Button>

                        {editingAiModelId !== null && (
                          <Button type="button" variant="outline" onClick={resetAiModelForm}>
                            <X className="mr-2 h-4 w-4" />
                            취소
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* 오른쪽: AI 모델 목록 */}
                  <Card className="md:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>현재 존재하는 AI 모델 목록</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {aiModels.length === 0 ? (
                          <p className="text-center py-8 text-gray-500">등록된 AI 모델이 없습니다.</p>
                        ) : (
                          aiModels.map((model) => (
                            <div key={model.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                              <div
                                className={`flex-shrink-0 mr-4 h-12 w-12 ${model.model_iconbg || "bg-white"} rounded-lg flex items-center justify-center overflow-hidden`}
                              >
                                {model.model_icon ? (
                                  <img
                                    src={model.model_icon || "/placeholder.svg"}
                                    alt={model.model_text}
                                    className="h-8 w-8 object-contain"
                                  />
                                ) : (
                                  <Bot className="h-6 w-6 text-gray-500" />
                                )}
                              </div>

                              <div className="flex-grow">
                                <h3 className="font-medium">{model.model_text}</h3>
                                <p className="text-sm text-gray-500">값: {model.model}</p>
                                <p className="text-sm text-gray-500">우선순위: {model.ranking || 0}</p>
                              </div>

                              <div className="flex-shrink-0 flex gap-2">
                                <Button size="sm" variant="ghost" onClick={() => handleEditAiModel(model)}>
                                  <Edit className="h-4 w-4" />
                                </Button>

                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleDeleteAiModel(model.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
