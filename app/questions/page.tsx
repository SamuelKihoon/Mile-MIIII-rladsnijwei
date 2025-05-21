"use client"

import { useState } from "react"
import {
  ArrowUp,
  Search,
  PlusCircle,
  Bookmark,
  Bot,
  HelpCircle,
  Filter,
  ChevronDown,
  Clock,
  CheckCircle2,
  Bell,
  User,
  Menu,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

// Types
type Question = {
  id: number
  title: string
  content: string
  author: string
  date: string
  category: string
  tags: string[]
  votes: number
  answers: number
  solved: boolean
  views: number
}

// Sample data
const sampleQuestions: Question[] = [
  {
    id: 1,
    title: "How do I create effective prompts for ChatGPT?",
    content:
      "I've been using ChatGPT for a while but I'm not getting the results I want. What are some tips for creating better prompts?",
    author: "promptNewbie",
    date: "2023-04-15T10:30:00",
    category: "Prompt Engineering",
    tags: ["ChatGPT", "Prompts", "Tips"],
    votes: 24,
    answers: 8,
    solved: true,
    views: 342,
  },
  {
    id: 2,
    title: "What's the difference between ChatGPT and Claude?",
    content: "I'm trying to decide which AI to use for my project. What are the main differences between these two?",
    author: "aiExplorer",
    date: "2023-04-12T14:45:00",
    category: "AI Tools",
    tags: ["ChatGPT", "Claude", "Comparison"],
    votes: 18,
    answers: 5,
    solved: true,
    views: 276,
  },
  {
    id: 3,
    title: "How to generate consistent characters with MidJourney?",
    content:
      "I'm trying to create a series of images with the same character, but the appearance keeps changing. Any advice?",
    author: "artCreator",
    date: "2023-04-10T09:15:00",
    category: "Image Generation",
    tags: ["MidJourney", "Characters", "Consistency"],
    votes: 32,
    answers: 12,
    solved: true,
    views: 489,
  },
  {
    id: 4,
    title: "Best AI for writing technical documentation?",
    content: "I need to create technical documentation for my software project. Which AI would be best for this task?",
    author: "techWriter",
    date: "2023-04-08T16:20:00",
    category: "Content Creation",
    tags: ["Technical Writing", "Documentation", "Recommendations"],
    votes: 15,
    answers: 6,
    solved: false,
    views: 203,
  },
  {
    id: 5,
    title: "How to use AI to improve my coding skills?",
    content: "I'm a beginner programmer and want to use AI to help me learn. What's the best approach?",
    author: "codeLearner",
    date: "2023-04-05T11:10:00",
    category: "Coding",
    tags: ["Learning", "Programming", "AI Assistance"],
    votes: 29,
    answers: 10,
    solved: false,
    views: 412,
  },
  {
    id: 6,
    title: "How to create a custom GPT?",
    content: "I want to create a specialized GPT for my business. What's the process and what should I consider?",
    author: "businessAI",
    date: "2023-04-03T13:25:00",
    category: "Custom AI",
    tags: ["GPT", "Customization", "Business"],
    votes: 21,
    answers: 7,
    solved: true,
    views: 318,
  },
]

// Categories
const categories = [
  "All",
  "Prompt Engineering",
  "AI Tools",
  "Image Generation",
  "Content Creation",
  "Coding",
  "Custom AI",
]

export default function QuestionsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("newest")
  const [filterSolved, setFilterSolved] = useState<boolean | null>(null)

  // Filter questions based on search, category, and solved status
  const filteredQuestions = sampleQuestions.filter((question) => {
    const matchesSearch =
      question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "All" || question.category === selectedCategory

    const matchesSolved =
      filterSolved === null ||
      (filterSolved === true && question.solved) ||
      (filterSolved === false && !question.solved)

    return matchesSearch && matchesCategory && matchesSolved
  })

  // Sort questions
  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.date).getTime() - new Date(a.date).getTime()
    if (sortBy === "votes") return b.votes - a.votes
    if (sortBy === "answers") return b.answers - a.answers
    if (sortBy === "views") return b.views - a.views
    return 0
  })

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
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
          <Button variant="secondary" className="w-full justify-start gap-2" style={{ borderRadius: "12px" }} asChild>
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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold">Questions & Answers</h1>
                <p className="text-gray-600 mt-1">Ask questions and get help from the community</p>
              </div>

              <Button className="md:self-start" asChild>
                <Link href="/questions/ask">Ask a Question</Link>
              </Button>
            </div>

            {/* Search and Filter Section */}
            <div className="mb-6 flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Input
                  type="text"
                  placeholder="Search questions..."
                  className="pr-10 h-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>

              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-1">
                      <Filter className="h-4 w-4" />
                      Filter
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setFilterSolved(null)}>All Questions</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterSolved(true)}>Solved Only</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterSolved(false)}>Unsolved Only</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-1">
                      <Clock className="h-4 w-4" />
                      Sort
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSortBy("newest")}>Newest</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("votes")}>Most Votes</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("answers")}>Most Answers</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("views")}>Most Views</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Category Tabs */}
            <Tabs defaultValue="All" className="mb-6" onValueChange={setSelectedCategory}>
              <TabsList className="mb-4">
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value={selectedCategory} className="mt-0">
                {/* Questions List */}
                <div className="space-y-4">
                  {sortedQuestions.map((question) => (
                    <QuestionCard key={question.id} question={question} />
                  ))}

                  {sortedQuestions.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <HelpCircle className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-700">No questions found</h3>
                      <p className="text-gray-500 mt-2">
                        {searchQuery
                          ? "Try adjusting your search or filters"
                          : "Be the first to ask a question in this category"}
                      </p>
                      <Button className="mt-6" asChild>
                        <Link href="/questions/ask">Ask a Question</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* Popular Tags Section */}
            <div className="mt-8 bg-gray-50 p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-4">Popular Tags</h2>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchQuery("ChatGPT")}>
                  ChatGPT
                </Badge>
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchQuery("Prompts")}>
                  Prompts
                </Badge>
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchQuery("MidJourney")}>
                  MidJourney
                </Badge>
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchQuery("Claude")}>
                  Claude
                </Badge>
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchQuery("Programming")}>
                  Programming
                </Badge>
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchQuery("GPT")}>
                  GPT
                </Badge>
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchQuery("DALL-E")}>
                  DALL-E
                </Badge>
                <Badge
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => setSearchQuery("Stable Diffusion")}
                >
                  Stable Diffusion
                </Badge>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

// Question Card Component
function QuestionCard({ question }: { question: Question }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg hover:text-blue-600 transition-colors">
              <Link href={`/questions/${question.id}`}>{question.title}</Link>
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <span>Asked by {question.author}</span>
              <span>•</span>
              <span>{new Date(question.date).toLocaleDateString()}</span>
              {question.solved && (
                <>
                  <span>•</span>
                  <span className="flex items-center text-green-600">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Solved
                  </span>
                </>
              )}
            </CardDescription>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex flex-col items-center">
              <span className="font-medium">{question.votes}</span>
              <span className="text-xs text-gray-500">votes</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-medium">{question.answers}</span>
              <span className="text-xs text-gray-500">answers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-medium">{question.views}</span>
              <span className="text-xs text-gray-500">views</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-gray-700 line-clamp-2">{question.content}</p>
      </CardContent>
      <CardFooter className="pt-2 flex flex-wrap gap-2">
        <Badge variant="outline">{question.category}</Badge>
        {question.tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </CardFooter>
    </Card>
  )
}
