"use client"

import { useState } from "react"
import {
  ArrowUp,
  Search,
  PlusCircle,
  Bookmark,
  Bot,
  HelpCircle,
  Trash2,
  Grid2X2,
  List,
  Bell,
  User,
  Menu,
  Copy,
  ArrowUpLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Types
type SavedItem = {
  id: number
  title: string
  description: string
  type: "prompt" | "bundle" | "image" | "text"
  category: string
  image: string
  dateAdded: string
  price: number
  author: string
  downloads?: number
  saves?: number
  model?: string
}

// Sample data
const sampleSavedItems: SavedItem[] = [
  {
    id: 1,
    title: "Professional Email Writer",
    description: "Generate professional emails for any business situation",
    type: "text",
    category: "Writing & Translation",
    image: "/email-template-concept.png",
    dateAdded: "2023-04-15",
    price: 5.99,
    author: "EmailPro",
    downloads: 310,
    saves: 100,
    model: "Claude",
  },
  {
    id: 2,
    title: "SEO Blog Post Generator",
    description: "Create SEO-optimized blog posts with proper keywords",
    type: "text",
    category: "Digital Marketing",
    image: "/blog-writing-desk.png",
    dateAdded: "2023-04-10",
    price: 7.99,
    author: "SEOMaster",
    downloads: 280,
    saves: 85,
    model: "ChatGPT",
  },
  {
    id: 3,
    title: "Website Development Bundle",
    description: "Complete set of prompts for website development",
    type: "bundle",
    category: "Programming & Tech",
    image: "/website-development-concept.png",
    dateAdded: "2023-04-05",
    price: 19.99,
    author: "CodeMaster",
    downloads: 410,
    saves: 200,
  },
  {
    id: 4,
    title: "Video Editing Bundle",
    description: "Professional video editing prompts collection",
    type: "bundle",
    category: "Video & Animation",
    image: "/video-editor-pink.png",
    dateAdded: "2023-04-01",
    price: 24.99,
    author: "VideoEditor",
    downloads: 290,
    saves: 120,
  },
  {
    id: 5,
    title: "Product Description Creator",
    description: "Compelling product descriptions that convert",
    type: "text",
    category: "Business",
    image: "/product-showcase.png",
    dateAdded: "2023-03-28",
    price: 4.99,
    author: "SalesPro",
    downloads: 310,
    saves: 100,
    model: "Claude",
  },
]

export default function SavedPage() {
  const router = useRouter()
  const [savedItems, setSavedItems] = useState<SavedItem[]>(sampleSavedItems)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [activeTab, setActiveTab] = useState("prompts")

  // Filter items based on search query and active tab
  const filteredItems = savedItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab =
      (activeTab === "prompts" && (item.type === "prompt" || item.type === "text" || item.type === "image")) ||
      (activeTab === "bundles" && item.type === "bundle")
    return matchesSearch && matchesTab
  })

  // Remove item from saved list
  const removeItem = (id: number) => {
    setSavedItems((prev) => prev.filter((item) => item.id !== id))
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
          <Button variant="secondary" className="w-full justify-start gap-2" style={{ borderRadius: "12px" }} asChild>
            <Link href="/saved">
              <Bookmark className="h-4 w-4" />
              Saved
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2" style={{ borderRadius: "12px" }}>
            <Bot className="h-4 w-4" />
            AIs
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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h1 className="text-3xl font-bold">Saved Items</h1>

              <div className="flex items-center gap-2">
                <div className="relative flex-grow">
                  <Input
                    type="text"
                    placeholder="Search saved items..."
                    className="pr-10 h-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>

                <div className="flex border rounded-md overflow-hidden">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="icon"
                    className="rounded-none"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid2X2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="icon"
                    className="rounded-none"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Tabs defaultValue="prompts" className="mb-6" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="prompts">Prompts</TabsTrigger>
                <TabsTrigger value="bundles">Bundles</TabsTrigger>
              </TabsList>

              <TabsContent value="prompts" className="mt-6">
                {/* Content for Prompts tab */}
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item) => (
                      <SavedItemCard key={item.id} item={item} onRemove={removeItem} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredItems.map((item) => (
                      <SavedItemRow key={item.id} item={item} onRemove={removeItem} />
                    ))}
                  </div>
                )}

                {filteredItems.length === 0 && (
                  <div className="text-center py-12">
                    <Bookmark className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700">No saved prompts found</h3>
                    <p className="text-gray-500 mt-2">
                      {searchQuery ? "Try a different search term" : "Browse and save prompts to see them here"}
                    </p>
                    <Button className="mt-6" asChild>
                      <Link href="/explore">Explore Prompts</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="bundles" className="mt-6">
                {/* Content for Bundles tab */}
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item) => (
                      <SavedItemCard key={item.id} item={item} onRemove={removeItem} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredItems.map((item) => (
                      <SavedItemRow key={item.id} item={item} onRemove={removeItem} />
                    ))}
                  </div>
                )}

                {filteredItems.length === 0 && (
                  <div className="text-center py-12">
                    <Bookmark className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700">No saved bundles found</h3>
                    <p className="text-gray-500 mt-2">
                      {searchQuery ? "Try a different search term" : "Browse and save bundles to see them here"}
                    </p>
                    <Button className="mt-6" asChild>
                      <Link href="/explore">Explore Bundles</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}

// Grid view card component
function SavedItemCard({ item, onRemove }: { item: SavedItem; onRemove: (id: number) => void }) {
  if (item.type === "image") {
    return (
      <Card className="aspect-[16/10] flex flex-col overflow-hidden rounded-xl group transition-all duration-300 hover:scale-105">
        <div className="relative">
          {/* Model badge */}
          {item.model && (
            <div className="absolute top-3 left-3 z-10 flex items-center bg-white rounded-lg pl-1 pr-2 py-1 shadow-sm">
              <div className="w-7 h-7 mr-1.5">
                {item.model === "Midjourney" ? (
                  <div className="w-7 h-7 bg-[#383640] rounded-md flex items-center justify-center overflow-hidden">
                    <img
                      src="https://companieslogo.com/img/orig/midjourney.D-733962ee.png?t=1720244494"
                      alt="Midjourney"
                      className="w-5 h-5 object-contain"
                    />
                  </div>
                ) : item.model === "ChatGPT" ? (
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
              <span className="text-base font-medium">{item.model}</span>
            </div>
          )}

          {/* Type badge */}
          {!item.model && (
            <div className="absolute top-3 left-3 z-10">
              <span className="px-2 py-1 bg-black bg-opacity-60 text-white text-xs rounded-full">
                {item.type === "bundle" ? "Bundle" : "Prompt"}
              </span>
            </div>
          )}

          {/* Stats */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
            {item.downloads && (
              <div className="flex items-center bg-white rounded-md px-2 py-1 text-sm shadow-sm group-hover:text-blue-700">
                <Copy className="h-4 w-4 mr-1.5" />
                <span>{item.downloads}</span>
              </div>
            )}
            {item.saves && (
              <div className="flex items-center bg-white rounded-md px-2 py-1 text-sm shadow-sm group-hover:text-blue-700">
                <Bookmark className="h-4 w-4 mr-1.5" />
                <span>{item.saves}</span>
              </div>
            )}
            <Button
              variant="destructive"
              size="icon"
              className="h-8 w-8 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 text-red-500"
              onClick={() => onRemove(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Image */}
          <div className="flex-grow w-full">
            <div className="aspect-[21/9] w-full overflow-hidden">
              <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
        <CardContent className="p-3">
          <h3 className="font-medium text-lg group-hover:text-blue-700 transition-colors duration-300">{item.title}</h3>
          <div className="flex justify-between items-center text-sm text-gray-600 -mt-0.5">
            <span className="group-hover:text-blue-700 transition-colors duration-300">by {item.author}</span>
            <div className="flex items-center">
              <span className="mr-1 group-hover:text-blue-700 transition-colors duration-300">
                {formatDate(item.dateAdded)}
              </span>
              <ArrowUpLeft className="h-3.5 w-3.5 group-hover:text-blue-700 transition-colors duration-300" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Text prompt or bundle card
  return (
    <Card className="aspect-[16/10] flex flex-col overflow-hidden rounded-xl group transition-all duration-300 hover:scale-105">
      <div className="p-3 flex flex-col h-full">
        {/* Header with model and stats */}
        <div className="relative mb-3">
          {item.model ? (
            <div className="inline-flex items-center bg-gray-100 rounded-lg pl-1 pr-2 py-1">
              <div className="w-7 h-7 mr-1.5">
                {item.model === "Claude" ? (
                  <div className="w-7 h-7 bg-[#db8848] rounded-md flex items-center justify-center overflow-hidden">
                    <img
                      src="https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/claude.png"
                      alt="Claude"
                      className="w-5 h-5 object-contain"
                    />
                  </div>
                ) : item.model === "ChatGPT" ? (
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
              <span className="text-base font-medium">{item.model}</span>
            </div>
          ) : (
            <div className="inline-flex items-center bg-gray-100 rounded-lg px-2 py-1">
              <span className="text-base font-medium">{item.type === "bundle" ? "Bundle" : "Prompt"}</span>
            </div>
          )}

          <div className="absolute top-0 right-0 z-10 flex items-center gap-2">
            {item.downloads && (
              <div className="flex items-center bg-white/90 rounded-md px-2 py-1 text-sm shadow-sm group-hover:text-blue-700">
                <Copy className="h-4 w-4 mr-1.5" />
                <span>{item.downloads}</span>
              </div>
            )}
            {item.saves && (
              <div className="flex items-center bg-white/90 rounded-md px-2 py-1 text-sm shadow-sm group-hover:text-blue-700">
                <Bookmark className="h-4 w-4 mr-1.5" />
                <span>{item.saves}</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-700"
              onClick={() => onRemove(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <h3 className="font-medium text-lg mb-1 group-hover:text-blue-700 transition-colors duration-300">
          {item.title}
        </h3>
        <p className="text-sm text-gray-700 mb-3 line-clamp-3 group-hover:text-blue-700 transition-colors duration-300">
          {item.description}
        </p>
        <div className="flex justify-between items-center text-sm text-gray-600 mt-auto">
          <span className="group-hover:text-blue-700 transition-colors duration-300">by {item.author}</span>
          <div className="flex items-center">
            <span className="mr-1 group-hover:text-blue-700 transition-colors duration-300">
              {formatDate(item.dateAdded)}
            </span>
            <ArrowUpLeft className="h-3.5 w-3.5 group-hover:text-blue-700 transition-colors duration-300" />
          </div>
        </div>
      </div>
    </Card>
  )
}

// List view row component
function SavedItemRow({ item, onRemove }: { item: SavedItem; onRemove: (id: number) => void }) {
  return (
    <div className="flex border rounded-lg overflow-hidden bg-white hover:shadow-md transition-all duration-300">
      <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
        <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
      </div>
      <div className="flex-grow p-4 flex flex-col">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {item.model ? (
              <div className="inline-flex items-center bg-gray-100 rounded-lg pl-1 pr-2 py-1">
                <div className="w-5 h-5 mr-1">
                  {item.model === "Claude" ? (
                    <div className="w-5 h-5 bg-[#db8848] rounded-md flex items-center justify-center overflow-hidden">
                      <img
                        src="https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/claude.png"
                        alt="Claude"
                        className="w-4 h-4 object-contain"
                      />
                    </div>
                  ) : item.model === "ChatGPT" ? (
                    <div className="w-5 h-5 bg-[#FFFFFF] rounded-md flex items-center justify-center overflow-hidden border border-gray-200">
                      <img
                        src="https://img.icons8.com/m_rounded/512/chatgpt.png"
                        alt="ChatGPT"
                        className="w-4 h-4 object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-5 h-5 bg-[#383640] rounded-md flex items-center justify-center overflow-hidden">
                      <img
                        src="https://companieslogo.com/img/orig/midjourney.D-733962ee.png?t=1720244494"
                        alt="Midjourney"
                        className="w-4 h-4 object-contain"
                      />
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium">{item.model}</span>
              </div>
            ) : (
              <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                {item.type === "bundle" ? "Bundle" : "Prompt"}
              </span>
            )}
            <h3 className="font-medium">{item.title}</h3>
          </div>
          <div className="flex items-center gap-2">
            {item.downloads && (
              <div className="flex items-center text-sm">
                <Copy className="h-4 w-4 mr-1" />
                <span>{item.downloads}</span>
              </div>
            )}
            {item.saves && (
              <div className="flex items-center text-sm">
                <Bookmark className="h-4 w-4 mr-1" />
                <span>{item.saves}</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-700"
              onClick={() => onRemove(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-700 mt-2 flex-grow">{item.description}</p>
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{item.category}</span>
            <span className="text-sm font-medium">🪙 {item.price.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">by {item.author}</span>
            <span className="text-xs text-gray-500">• {formatDate(item.dateAdded)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}
