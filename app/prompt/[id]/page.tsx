"use client"

import { useState, useEffect } from "react"
import {
  ArrowUp,
  Search,
  PlusCircle,
  Bookmark,
  Bot,
  HelpCircle,
  Share2,
  ArrowLeft,
  Bell,
  User,
  Menu,
  Heart,
  Copy,
  Check,
  Play,
  X,
  ArrowUpLeft,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase" // Import the existing Supabase client

// Types
type Prompt = {
  id: string
  title: string
  description: string
  prompt_content: string
  prompt_model: string
  prompt_type: string
  category: string
  tags: string[]
  token_price: number
  copied: number
  saved: number
  liked: number
  created_at: string
  created_user_id: string
  created_user_handle: string
  result_text: string
  res1: string | null
  res2: string | null
  res3: string | null
}

type Author = {
  id: string
  username: string
  avatar_url: string
  plaintext: string
  followers_num: number
  following_num: number
  prompt_count: number
  created_at: string
  avatar_url: string
  email?: string
  handle?: string
}

export default function PromptPage() {
  const params = useParams()
  const router = useRouter()
  // We're now using the imported supabase client instead of creating a new one

  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [author, setAuthor] = useState<Author | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaved, setIsSaved] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [copiedToClipboard, setCopiedToClipboard] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [isPromptVisible, setIsPromptVisible] = useState(false)
  const [titleCopied, setTitleCopied] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [targetText, setTargetText] = useState<string>("")
  const [hasTargetText, setHasTargetText] = useState<boolean>(false)
  const [targetOne, setTargetOne] = useState<string>("")
  const [targetTwo, setTargetTwo] = useState<string>("")
  const [targetThree, setTargetThree] = useState<string>("")
  const [hasTargetOne, setHasTargetOne] = useState<boolean>(false)
  const [hasTargetTwo, setHasTargetTwo] = useState<boolean>(false)
  const [hasTargetThree, setHasTargetThree] = useState<boolean>(false)

  const promptId = params.id as string

  // Fetch prompt data from Supabase
  useEffect(() => {
    async function fetchPromptData() {
      try {
        setLoading(true)

        // Fetch prompt data
        const { data: promptData, error: promptError } = await supabase
          .from("prompts")
          .select("*")
          .eq("id", promptId)
          .single()

        if (promptError) throw promptError
        if (!promptData) throw new Error("Prompt not found")

        setPrompt(promptData)

        // Fetch author data
        const { data: authorData, error: authorError } = await supabase
          .from("users")
          .select(
            "id, username, avatar_url, plaintext, followers_num, following_num, created_at, avatar_url, email, handle",
          )
          .eq("id", promptData.created_user_id)
          .single()

        if (authorError) {
          console.error("Error fetching author:", authorError)
        } else if (authorData) {
          // Get prompt count for author
          const { count: promptCount, error: countError } = await supabase
            .from("prompts")
            .select("id", { count: "exact", head: true })
            .eq("created_user_id", authorData.id)

          setAuthor({
            ...authorData,
            prompt_count: promptCount || 0,
          })
        }

        // Check if user has liked/saved this prompt
        const { data: session } = await supabase.auth.getSession()
        if (session?.session?.user) {
          const userId = session.session.user.id

          // Check if liked
          const { data: likeData } = await supabase
            .from("prompt_likes")
            .select("*")
            .eq("prompt_id", promptId)
            .eq("user_id", userId)
            .maybeSingle()

          setIsLiked(!!likeData)

          // Check if saved
          const { data: saveData } = await supabase
            .from("prompt_saves")
            .select("*")
            .eq("prompt_id", promptId)
            .eq("user_id", userId)
            .maybeSingle()

          setIsSaved(!!saveData)
        }
      } catch (err) {
        console.error("Error fetching prompt:", err)
        setError(err instanceof Error ? err.message : "Failed to load prompt")
      } finally {
        setLoading(false)
      }
    }

    if (promptId) {
      fetchPromptData()
    }
  }, [promptId])

  // Handle copy to clipboard
  const copyToClipboard = async () => {
    if (!prompt) return

    let contentToCopy = prompt.prompt_content

    // 각 변수 대체
    if (hasTargetText && targetText !== "") {
      contentToCopy = contentToCopy.replace(/{{target_text}}/g, targetText)
    }

    if (hasTargetOne && targetOne !== "") {
      contentToCopy = contentToCopy.replace(/{{target_one}}/g, targetOne)
    }

    if (hasTargetTwo && targetTwo !== "") {
      contentToCopy = contentToCopy.replace(/{{target_two}}/g, targetTwo)
    }

    if (hasTargetThree && targetThree !== "") {
      contentToCopy = contentToCopy.replace(/{{target_three}}/g, targetThree)
    }

    navigator.clipboard.writeText(contentToCopy)
    setCopiedToClipboard(true)
    setTimeout(() => setCopiedToClipboard(false), 2000)

    // Update copy count in database
    try {
      const { data: session } = await supabase.auth.getSession()
      if (session?.session?.user) {
        // Record copy action
        await supabase.from("prompt_copies").insert({
          prompt_id: promptId,
          user_id: session.session.user.id,
        })

        // Update copied count
        await supabase.rpc("increment_prompt_copied", { prompt_id: promptId })

        // Update local state
        if (prompt) {
          setPrompt({
            ...prompt,
            copied: (prompt.copied || 0) + 1,
          })
        }
      }
    } catch (err) {
      console.error("Error updating copy count:", err)
    }
  }

  // Handle copy title to clipboard
  const copyTitleToClipboard = () => {
    if (!prompt) return
    navigator.clipboard.writeText(prompt.title)
    setTitleCopied(true)
    setTimeout(() => setTitleCopied(false), 2000)
  }

  // Handle save/bookmark
  const toggleSave = async () => {
    if (!prompt) return

    try {
      const { data: session } = await supabase.auth.getSession()
      if (!session?.session?.user) {
        router.push("/login")
        return
      }

      const userId = session.session.user.id

      if (isSaved) {
        // Remove save
        await supabase.from("prompt_saves").delete().eq("prompt_id", promptId).eq("user_id", userId)

        // Decrement save count
        await supabase.rpc("decrement_prompt_saved", { prompt_id: promptId })

        // Update local state
        setIsSaved(false)
        if (prompt) {
          setPrompt({
            ...prompt,
            saved: Math.max(0, (prompt.saved || 0) - 1),
          })
        }
      } else {
        // Add save
        await supabase.from("prompt_saves").insert({
          prompt_id: promptId,
          user_id: userId,
        })

        // Increment save count
        await supabase.rpc("increment_prompt_saved", { prompt_id: promptId })

        // Update local state
        setIsSaved(true)
        if (prompt) {
          setPrompt({
            ...prompt,
            saved: (prompt.saved || 0) + 1,
          })
        }
      }
    } catch (err) {
      console.error("Error toggling save:", err)
    }
  }

  // Handle like
  const toggleLike = async () => {
    if (!prompt) return

    try {
      const { data: session } = await supabase.auth.getSession()
      if (!session?.session?.user) {
        router.push("/login")
        return
      }

      const userId = session.session.user.id

      if (isLiked) {
        // Remove like
        await supabase.from("prompt_likes").delete().eq("prompt_id", promptId).eq("user_id", userId)

        // Decrement like count
        await supabase.rpc("decrement_prompt_liked", { prompt_id: promptId })

        // Update local state
        setIsLiked(false)
        if (prompt) {
          setPrompt({
            ...prompt,
            liked: Math.max(0, (prompt.liked || 0) - 1),
          })
        }
      } else {
        // Add like
        await supabase.from("prompt_likes").insert({
          prompt_id: promptId,
          user_id: userId,
        })

        // Increment like count
        await supabase.rpc("increment_prompt_liked", { prompt_id: promptId })

        // Update local state
        setIsLiked(true)
        if (prompt) {
          setPrompt({
            ...prompt,
            liked: (prompt.liked || 0) + 1,
          })
        }
      }
    } catch (err) {
      console.error("Error toggling like:", err)
    }
  }

  // Toggle prompt visibility
  const togglePromptVisibility = () => {
    if (!prompt) return

    setIsPromptVisible(!isPromptVisible)

    // 프롬프트가 펼쳐질 때 변수 패턴이 있는지 확인
    if (!isPromptVisible) {
      // {{target_text}} 확인
      const targetTextPattern = /{{target_text}}/g
      if (targetTextPattern.test(prompt.prompt_content)) {
        setHasTargetText(true)
        setTargetText("")
      } else {
        setHasTargetText(false)
      }

      // {{target_one}} 확인
      const targetOnePattern = /{{target_one}}/g
      if (targetOnePattern.test(prompt.prompt_content)) {
        setHasTargetOne(true)
        setTargetOne("")
      } else {
        setHasTargetOne(false)
      }

      // {{target_two}} 확인
      const targetTwoPattern = /{{target_two}}/g
      if (targetTwoPattern.test(prompt.prompt_content)) {
        setHasTargetTwo(true)
        setTargetTwo("")
      } else {
        setHasTargetTwo(false)
      }

      // {{target_three}} 확인
      const targetThreePattern = /{{target_three}}/g
      if (targetThreePattern.test(prompt.prompt_content)) {
        setHasTargetThree(true)
        setTargetThree("")
      } else {
        setHasTargetThree(false)
      }
    }
  }

  // Open image modal
  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl)
  }

  // Close image modal
  const closeImageModal = () => {
    setSelectedImage(null)
  }

  // Truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + "..."
  }

  // 프롬프트 내용에서 변수들을 하이라이트하고 실시간으로 업데트하는 함수
  const renderPromptContent = () => {
    if (!prompt) return ""

    let content = prompt.prompt_content

    // {{target_text}} - 노란색
    if (hasTargetText) {
      if (targetText === "") {
        content = content.replace(
          /{{target_text}}/g,
          '<span class="bg-yellow-300 text-black px-1 rounded">{{target_text}}</span>',
        )
      } else {
        content = content.replace(
          /{{target_text}}/g,
          `<span class="bg-yellow-300 text-black px-1 rounded">${targetText}</span>`,
        )
      }
    }

    // {{target_one}} - 초록색
    if (hasTargetOne) {
      if (targetOne === "") {
        content = content.replace(
          /{{target_one}}/g,
          '<span class="bg-green-300 text-black px-1 rounded">{{target_one}}</span>',
        )
      } else {
        content = content.replace(
          /{{target_one}}/g,
          `<span class="bg-green-300 text-black px-1 rounded">${targetOne}</span>`,
        )
      }
    }

    // {{target_two}} - 밝은 하늘색
    if (hasTargetTwo) {
      if (targetTwo === "") {
        content = content.replace(
          /{{target_two}}/g,
          '<span class="bg-sky-300 text-black px-1 rounded">{{target_two}}</span>',
        )
      } else {
        content = content.replace(
          /{{target_two}}/g,
          `<span class="bg-sky-300 text-black px-1 rounded">${targetTwo}</span>`,
        )
      }
    }

    // {{target_three}} - 밝은 핑크색
    if (hasTargetThree) {
      if (targetThree === "") {
        content = content.replace(
          /{{target_three}}/g,
          '<span class="bg-pink-300 text-black px-1 rounded">{{target_three}}</span>',
        )
      } else {
        content = content.replace(
          /{{target_three}}/g,
          `<span class="bg-pink-300 text-black px-1 rounded">${targetThree}</span>`,
        )
      }
    }

    return content
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex h-screen">
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-5xl mx-auto flex flex-col items-center justify-center h-full">
              <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
              <p className="mt-4 text-gray-500">Loading prompt...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  // Show error state
  if (error || !prompt) {
    return (
      <div className="flex h-screen">
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-5xl mx-auto flex flex-col items-center justify-center h-full">
              <div className="text-red-500 mb-4">
                <X className="h-12 w-12 mx-auto" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Error Loading Prompt</h2>
              <p className="text-gray-500">{error || "Prompt not found"}</p>
              <Button variant="outline" className="mt-4" onClick={() => router.back()}>
                Go Back
              </Button>
            </div>
          </main>
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
          <div className="max-w-5xl mx-auto">
            {/* Back button */}
            <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Main Content - Left 2/3 */}
              <div className="md:col-span-2 space-y-6">
                {/* Main Prompt Card */}
                <Card className="overflow-hidden">
                  {/* Header Image */}
                  <div className="w-full h-80 bg-white flex items-center justify-center p-4">
                    <img
                      src={prompt.res1 || "/placeholder.svg?height=400&width=800&query=prompt visualization"}
                      alt={prompt.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  {/* Prompt Title and Stats */}
                  <CardContent className="p-6">
                    <h1 className="text-2xl font-bold mb-2">{prompt.title}</h1>

                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <Link href={`/userprofile/${prompt.created_user_id}`} className="flex items-center gap-1">
                        <span className="bg-gray-100 px-2 py-1 rounded-lg">@{prompt.created_user_handle}</span>
                      </Link>
                      <div className="flex items-center gap-3">
                        <button
                          className="flex items-center gap-1 hover:text-gray-900 transition-colors"
                          onClick={toggleLike}
                        >
                          <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                          <span>{prompt.liked || 0}</span>
                        </button>
                        <button className="flex items-center gap-1 hover:text-gray-900 transition-colors">
                          <Share2 className="h-4 w-4" />
                          <span>0</span>
                        </button>
                        <button
                          className="flex items-center gap-1 hover:text-gray-900 transition-colors"
                          onClick={copyTitleToClipboard}
                        >
                          {titleCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                          <span>{prompt.copied || 0}</span>
                        </button>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Model Badge and Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <div className="inline-flex items-center bg-gray-100 rounded-lg pl-1 pr-2 py-1">
                        <div className="w-7 h-7 mr-1.5">
                          {prompt.prompt_model === "Claude" ? (
                            <div className="w-7 h-7 bg-[#db8848] rounded-md flex items-center justify-center overflow-hidden">
                              <img
                                src="https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/claude.png"
                                alt="Claude"
                                className="w-5 h-5 object-contain"
                              />
                            </div>
                          ) : prompt.prompt_model === "ChatGPT" ? (
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
                        <span className="text-lg font-medium">{prompt.prompt_model}</span>
                      </div>

                      <div className="flex gap-2 ml-auto">
                        <Button variant="outline" size="sm" onClick={toggleLike}>
                          <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                          Like
                        </Button>
                        <Button variant="outline" size="sm">
                          <ArrowUp className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                        <Button variant="outline" size="sm" onClick={toggleSave}>
                          <Bookmark className={`h-4 w-4 mr-1 ${isSaved ? "fill-blue-500 text-blue-500" : ""}`} />
                          Save
                        </Button>
                      </div>
                    </div>

                    {/* Prompt Description */}
                    <div className="mb-6">
                      <p className="text-gray-700">{prompt.description}</p>
                    </div>

                    {/* Get Prompt Button and Prompt Content */}
                    <div className="bg-gray-50 rounded-lg border border-gray-200 mb-6 overflow-hidden transition-all duration-300">
                      {!isPromptVisible ? (
                        <Button
                          className="w-full bg-black hover:bg-gray-900 text-white"
                          onClick={togglePromptVisibility}
                        >
                          Get Prompt
                        </Button>
                      ) : (
                        <div className="p-4 bg-black">
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="font-medium text-white">Prompt</h3>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={copyToClipboard}
                                className="bg-gray-800 text-white border-gray-700 hover:bg-white hover:text-black transition-colors"
                              >
                                {copiedToClipboard ? (
                                  <>
                                    <Check className="h-4 w-4 mr-1" /> Copied
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-4 w-4 mr-1" /> Copy
                                  </>
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-gray-800 text-white border-gray-700 hover:bg-white hover:text-black transition-colors"
                              >
                                <Play className="h-4 w-4 mr-1" /> Run on {prompt.prompt_model}
                              </Button>
                            </div>
                          </div>
                          <div
                            className="bg-gray-900 p-4 rounded-md border border-gray-700 font-mono text-sm whitespace-pre-wrap text-gray-300"
                            dangerouslySetInnerHTML={{ __html: renderPromptContent() }}
                          ></div>
                        </div>
                      )}
                    </div>

                    {/* 변수 편집 UI */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {hasTargetText && (
                        <div className="bg-gray-800 p-3 rounded-md border border-gray-700">
                          <label className="block text-white text-sm mb-2">
                            <span className="inline-block bg-yellow-300 text-black px-2 py-0.5 rounded mr-2">
                              {"{{target_text}}"}
                            </span>
                            편집:
                          </label>
                          <input
                            type="text"
                            value={targetText}
                            onChange={(e) => setTargetText(e.target.value)}
                            placeholder="Enter text to replace {{target_text}}"
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          />
                        </div>
                      )}

                      {hasTargetOne && (
                        <div className="bg-gray-800 p-3 rounded-md border border-gray-700">
                          <label className="block text-white text-sm mb-2">
                            <span className="inline-block bg-green-300 text-black px-2 py-0.5 rounded mr-2">
                              {"{{target_one}}"}
                            </span>
                            편집:
                          </label>
                          <input
                            type="text"
                            value={targetOne}
                            onChange={(e) => setTargetOne(e.target.value)}
                            placeholder="Enter text to replace {{target_one}}"
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                      )}

                      {hasTargetTwo && (
                        <div className="bg-gray-800 p-3 rounded-md border border-gray-700">
                          <label className="block text-white text-sm mb-2">
                            <span className="inline-block bg-sky-300 text-black px-2 py-0.5 rounded mr-2">
                              {"{{target_two}}"}
                            </span>
                            편집:
                          </label>
                          <input
                            type="text"
                            value={targetTwo}
                            onChange={(e) => setTargetTwo(e.target.value)}
                            placeholder="Enter text to replace {{target_two}}"
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                          />
                        </div>
                      )}

                      {hasTargetThree && (
                        <div className="bg-gray-800 p-3 rounded-md border border-gray-700">
                          <label className="block text-white text-sm mb-2">
                            <span className="inline-block bg-pink-300 text-black px-2 py-0.5 rounded mr-2">
                              {"{{target_three}}"}
                            </span>
                            편집:
                          </label>
                          <input
                            type="text"
                            value={targetThree}
                            onChange={(e) => setTargetThree(e.target.value)}
                            placeholder="Enter text to replace {{target_three}}"
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                          />
                        </div>
                      )}
                    </div>

                    {/* Result Section */}
                    <div className="space-y-2">
                      <h3 className="font-medium text-lg">Result</h3>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="text-gray-700 whitespace-pre-wrap">{prompt.result_text}</p>
                        <Separator className="my-4" />
                        <div className="grid grid-cols-3 gap-4 mt-4">
                          {[prompt.res1, prompt.res2, prompt.res3].filter(Boolean).map((image, index) => (
                            <div
                              key={index}
                              className="cursor-pointer transition-transform hover:scale-105"
                              onClick={() => openImageModal(image || "")}
                            >
                              <img
                                src={image || "/placeholder.svg?query=result image"}
                                alt={`Result image ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Prompt Details Section */}
                    <div className="space-y-6">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-6">
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Category</span>
                            <span className="font-medium">{prompt.category}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Price</span>
                            <span className="font-medium">🪙 {prompt.token_price.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Created</span>
                            <span className="font-medium">{new Date(prompt.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="pt-1">
                            <span className="text-xs text-gray-500">Tags:</span>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {prompt.tags &&
                                prompt.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="px-1.5 py-0.5 text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar - Right 1/3 */}
              <div className="space-y-6">
                {/* Author Profile Card */}
                <Card>
                  <CardContent className="p-6">
                    {loading ? (
                      <div className="flex flex-col items-center justify-center py-4">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Loading author information...</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start gap-4 mb-6">
                          <div className="w-16 h-16 rounded-full overflow-hidden">
                            <img
                              src={author?.avatar_url || "/abstract-profile.png"}
                              alt={author?.username || prompt.created_user_handle}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/abstract-profile.png"
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium text-lg flex items-center">
                                  {author?.username || prompt.created_user_handle}
                                  <div className="ml-1.5 flex items-center">
                                    <img
                                      src="https://img.icons8.com/?size=512&id=2sZ0sdlG9kWP&format=png"
                                      alt="Verified"
                                      className="w-4 h-4"
                                      title="Verified User"
                                    />
                                  </div>
                                </div>
                                <div className="text-sm text-gray-500">
                                  @{author?.handle || prompt.created_user_handle}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                          <div className="bg-gray-50 rounded-lg p-2">
                            <div className="font-medium">{author?.followers_num || 0}</div>
                            <div className="text-xs text-gray-500">Followers</div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-2">
                            <div className="font-medium">{author?.prompt_count || 0}</div>
                            <div className="text-xs text-gray-500">Prompts</div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-2">
                            <div className="font-medium">{prompt.copied || 0}</div>
                            <div className="text-xs text-gray-500">Copied</div>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 mb-4">
                          {author?.plaintext || "No plaintext available"}
                        </div>

                        <div className="text-xs text-gray-500 mb-4">
                          Joined: {author?.created_at ? new Date(author.created_at).toLocaleDateString() : "Unknown"}
                        </div>

                        <Button
                          variant="outline"
                          className="w-full mb-2"
                          onClick={() => router.push(`/userprofile/${prompt.created_user_id}`)}
                        >
                          View Profile
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200"
                        >
                          Follow
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Similar Prompts */}
                <div>
                  <Separator className="mb-6" />
                  <h3 className="font-medium mb-3">Recommended Prompts</h3>
                  <div className="space-y-3">
                    <SimilarPromptCard
                      title="3D Product Visualization"
                      model="Claude"
                      price={7.99}
                      author="DesignPro"
                    />
                    <SimilarPromptCard
                      title="Isometric Product Design"
                      model="Midjourney"
                      price={4.99}
                      type="image"
                      image="/abstract-ai-art.png"
                      author="ArtistX"
                    />
                    <SimilarPromptCard
                      title="Minimalist 3D Renders"
                      model="ChatGPT"
                      price={6.99}
                      author="MinimalistAI"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeImageModal}
        >
          <div
            className="relative max-w-3xl w-full aspect-[16/10] mx-auto bg-white rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white hover:bg-opacity-70 z-10"
              onClick={closeImageModal}
            >
              <X className="h-5 w-5" />
            </Button>
            <div className="w-full h-full p-4 flex items-center justify-center">
              <img
                src={selectedImage || "/placeholder.svg"}
                alt="Enlarged view"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Similar Prompt Card Component
function SimilarPromptCard({
  title,
  model,
  price,
  type = "text",
  image,
  author = "Creator",
}: {
  title: string
  model: string
  price: number
  type?: "text" | "image"
  image?: string
  author?: string
}) {
  if (type === "image") {
    return (
      <Card className="aspect-[16/10] flex flex-col overflow-hidden rounded-xl group transition-all duration-300 hover:scale-105">
        <div className="relative">
          {/* Model badge */}
          <div className="absolute top-3 left-3 z-10 flex items-center bg-white rounded-lg pl-1 pr-2 py-1 shadow-sm">
            <div className="w-7 h-7 mr-1.5">
              {model === "Midjourney" ? (
                <div className="w-7 h-7 bg-[#383640] rounded-md flex items-center justify-center overflow-hidden">
                  <img
                    src="https://companieslogo.com/img/orig/midjourney.D-733962ee.png?t=1720244494"
                    alt="Midjourney"
                    className="w-5 h-5 object-contain"
                  />
                </div>
              ) : model === "ChatGPT" ? (
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
            <span className="text-base font-medium">{model}</span>
          </div>

          {/* Stats */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
            <div className="flex items-center bg-white rounded-md px-2 py-1 text-sm shadow-sm group-hover:text-blue-700">
              <Copy className="h-4 w-4 mr-1.5" />
              <span>42</span>
            </div>
            <div className="flex items-center bg-white rounded-md px-2 py-1 text-sm shadow-sm group-hover:text-blue-700">
              <Bookmark className="h-4 w-4 mr-1.5" />
              <span>18</span>
            </div>
          </div>

          {/* Image */}
          <div className="flex-grow w-full">
            <div className="aspect-[21/9] w-full overflow-hidden">
              <img src={image || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
        <CardContent className="p-3">
          <h3 className="font-medium text-lg group-hover:text-blue-700 transition-colors duration-300">{title}</h3>
          <div className="flex justify-between items-center text-sm text-gray-600 -mt-0.5">
            <span className="group-hover:text-blue-700 transition-colors duration-300">by {author}</span>
            <div className="flex items-center">
              <span className="mr-1 group-hover:text-blue-700 transition-colors duration-300">
                🪙 {price.toFixed(2)}
              </span>
              <ArrowUpLeft className="h-3.5 w-3.5 group-hover:text-blue-700 transition-colors duration-300" />
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
              {model === "Claude" ? (
                <div className="w-7 h-7 bg-[#db8848] rounded-md flex items-center justify-center overflow-hidden">
                  <img
                    src="https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/claude.png"
                    alt="Claude"
                    className="w-5 h-5 object-contain"
                  />
                </div>
              ) : model === "ChatGPT" ? (
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
            <span className="text-base font-medium">{model}</span>
          </div>

          <div className="absolute top-0 right-0 z-10 flex items-center gap-2">
            <div className="flex items-center bg-white/90 rounded-md px-2 py-1 text-sm shadow-sm group-hover:text-blue-700">
              <Copy className="h-4 w-4 mr-1.5" />
              <span>42</span>
            </div>
            <div className="flex items-center bg-white/90 rounded-md px-2 py-1 text-sm shadow-sm group-hover:text-blue-700">
              <Bookmark className="h-4 w-4 mr-1.5" />
              <span>18</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <h3 className="font-medium text-lg mb-1 group-hover:text-blue-700 transition-colors duration-300">{title}</h3>
        <p className="text-sm text-gray-700 mb-3 line-clamp-3 group-hover:text-blue-700 transition-colors duration-300">
          Professional prompt for creating detailed and realistic {title.toLowerCase()} with advanced techniques.
        </p>
        <div className="flex justify-between items-center text-sm text-gray-600 mt-auto">
          <span className="group-hover:text-blue-700 transition-colors duration-300">by {author}</span>
          <div className="flex items-center">
            <span className="mr-1 group-hover:text-blue-700 transition-colors duration-300">🪙 {price.toFixed(2)}</span>
            <ArrowUpLeft className="h-3.5 w-3.5 group-hover:text-blue-700 transition-colors duration-300" />
          </div>
        </div>
      </div>
    </Card>
  )
}
