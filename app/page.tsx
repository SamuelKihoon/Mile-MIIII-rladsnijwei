"use client"
import {
  Search,
  User,
  ArrowUp,
  Menu,
  ChevronRight,
  Monitor,
  TrendingUp,
  Music,
  Palette,
  FileText,
  Video,
  Cpu,
  Briefcase,
  MessageSquare,
  Compass,
  PlusCircle,
  Bookmark,
  Bot,
  HelpCircle,
  Sparkles,
  CircleDollarSign,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

// Type definition for category data
type Category = {
  id: number
  icon: string
  text: string
  group: string
  beforeHoverBGColor: string
  hoverBGColor: string
  iconBgColor: string
}

// Default categories to use when Supabase fetch fails
const defaultCategories: Category[] = [
  {
    id: 1,
    icon: "Monitor",
    text: "Programming & Tech",
    group: "tech",
    beforeHoverBGColor: "bg-white",
    hoverBGColor: "bg-gray-100",
    iconBgColor: "bg-blue-100",
  },
  {
    id: 2,
    icon: "Palette",
    text: "Graphics & Design",
    group: "design",
    beforeHoverBGColor: "bg-white",
    hoverBGColor: "bg-gray-100",
    iconBgColor: "bg-purple-100",
  },
  {
    id: 3,
    icon: "TrendingUp",
    text: "Digital Marketing",
    group: "marketing",
    beforeHoverBGColor: "bg-white",
    hoverBGColor: "bg-gray-100",
    iconBgColor: "bg-green-100",
  },
  {
    id: 4,
    icon: "FileText",
    text: "Writing & Translation",
    group: "writing",
    beforeHoverBGColor: "bg-white",
    hoverBGColor: "bg-gray-100",
    iconBgColor: "bg-yellow-100",
  },
  {
    id: 5,
    icon: "Video",
    text: "Video & Animation",
    group: "video",
    beforeHoverBGColor: "bg-white",
    hoverBGColor: "bg-gray-100",
    iconBgColor: "bg-red-100",
  },
  {
    id: 6,
    icon: "Cpu",
    text: "AI Services",
    group: "ai",
    beforeHoverBGColor: "bg-white",
    hoverBGColor: "bg-gray-100",
    iconBgColor: "bg-cyan-100",
  },
  {
    id: 7,
    icon: "Music",
    text: "Music & Audio",
    group: "music",
    beforeHoverBGColor: "bg-white",
    hoverBGColor: "bg-gray-100",
    iconBgColor: "bg-pink-100",
  },
  {
    id: 8,
    icon: "Briefcase",
    text: "Business",
    group: "business",
    beforeHoverBGColor: "bg-white",
    hoverBGColor: "bg-gray-100",
    iconBgColor: "bg-orange-100",
  },
  {
    id: 9,
    icon: "MessageSquare",
    text: "Consulting",
    group: "consulting",
    beforeHoverBGColor: "bg-white",
    hoverBGColor: "bg-gray-100",
    iconBgColor: "bg-teal-100",
  },
]

// CategoryCard component
const CategoryCard = ({ category, onClick }: { category: Category; onClick: () => void }) => {
  const [isHovered, setIsHovered] = React.useState(false)

  const IconComponent = ({ icon }: { icon: string }) => {
    switch (icon) {
      case "Monitor":
        return <Monitor className="h-6 w-6" />
      case "TrendingUp":
        return <TrendingUp className="h-6 w-6" />
      case "Music":
        return <Music className="h-6 w-6" />
      case "Palette":
        return <Palette className="h-6 w-6" />
      case "FileText":
        return <FileText className="h-6 w-6" />
      case "Video":
        return <Video className="h-6 w-6" />
      case "Cpu":
        return <Cpu className="h-6 w-6" />
      case "Briefcase":
        return <Briefcase className="h-6 w-6" />
      case "MessageSquare":
        return <MessageSquare className="h-6 w-6" />
      default:
        return <Monitor className="h-6 w-6" /> // Default icon
    }
  }

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`flex flex-col items-center justify-between p-4 shadow-sm w-[120px] h-[120px] aspect-square transition-colors duration-200 ${
        isHovered ? category.hoverBGColor : category.beforeHoverBGColor
      }`}
      style={{
        borderRadius: "24px",
        border: "2px solid #cad9ce",
      }}
    >
      <div
        className={`flex items-center justify-center ${category.iconBgColor} p-2.5`}
        style={{ borderRadius: "24px" }}
      >
        <IconComponent icon={category.icon} />
      </div>
      <span className="text-sm font-medium text-center h-10 flex items-center">{category.text}</span>
    </button>
  )
}

export default function Home() {
  const [isClient, setIsClient] = React.useState(false)
  const [categories, setCategories] = React.useState<Category[]>(defaultCategories)
  const [isLoading, setIsLoading] = React.useState(false) // Changed to false to avoid loading state
  const [coinBalance, setCoinBalance] = React.useState(1250) // Default coin balance
  const router = useRouter()
  const { user, isLoading: authLoading, signOut } = useAuth()

  // We're not fetching from Supabase in this version since the table doesn't exist yet
  // Instead, we'll just use the default categories

  React.useEffect(() => {
    setIsClient(true)

    // Check initial scroll position to set button visibility
    const container = document.getElementById("categories-container")
    const rightButton = document.getElementById("right-nav-button")

    if (container && rightButton) {
      // Check if scrolling is needed at all
      if (container.scrollWidth <= container.clientWidth) {
        rightButton.classList.add("hidden")
      }
    }

    // Check initial scroll position to set button visibility for bundles
    const bundlesContainer = document.getElementById("bundles-container")
    const bundlesRightButton = document.getElementById("bundles-right-nav-button")

    if (bundlesContainer && bundlesRightButton) {
      // Check if scrolling is needed at all
      if (bundlesContainer.scrollWidth <= bundlesContainer.clientWidth) {
        bundlesRightButton.classList.add("hidden")
      }
    }
  }, [])

  // Handle category click
  const handleCategoryClick = (category: Category) => {
    console.log(`Category clicked: ${category.text}`)
    // Here you would typically navigate or filter content based on the category
    alert(`You clicked on: ${category.text}`)
  }

  // Handle logout redirect
  const handleLogoutRedirect = () => {
    // Just redirect to login page without logging out
    router.push("/login")
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-48 bg-white">
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
          <Button variant="secondary" className="w-full justify-start gap-2" style={{ borderRadius: "12px" }} asChild>
            <Link href="/">
              <ArrowUp className="h-4 w-4" />
              Home
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2" style={{ borderRadius: "12px" }} asChild>
            <Link href="/agent">
              <Sparkles className="h-4 w-4" />
              Agent
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2" style={{ borderRadius: "12px" }} asChild>
            <Link href="/explore">
              <Compass className="h-4 w-4" />
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
            {user && (
              <div
                className="flex items-center gap-1 px-3 py-1.5 text-gray-700 font-medium"
                style={{ borderRadius: "16px", backgroundColor: "#f0f5ed" }}
              >
                <CircleDollarSign className="h-4 w-4 text-gray-400" />
                <span>{user?.coins || coinBalance}</span>
              </div>
            )}
            <div className="relative group">
              <Button variant="ghost" size="icon" className="bg-[#f0f5ed]" style={{ borderRadius: "16px" }}>
                <User className="h-5 w-5" />
              </Button>

              {/* Profile dropdown card */}
              <div className="absolute right-0 mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out z-50">
                <div
                  className="bg-white shadow-lg border border-gray-200 overflow-hidden"
                  style={{ borderRadius: "24px" }}
                >
                  {user ? (
                    <>
                      <div className="p-4 border-b">
                        <div className="flex items-center">
                          <div
                            className="h-10 w-10 bg-gray-200 flex items-center justify-center"
                            style={{ borderRadius: "24px" }}
                          >
                            <User className="h-6 w-6 text-gray-500" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium">{user.username}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
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
                          onClick={handleLogoutRedirect}
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-2">
                      <button
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                        style={{ borderRadius: "24px" }}
                        onClick={() => router.push("/login")}
                      >
                        Login
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6 bg-[#f6f7fb]">
          <div className="max-w-5xl mx-auto mt-4">
            {/* Search Section */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold mb-4">Search it. Prompt it.</h2>
              <div className="relative max-w-xl mx-auto">
                <Input
                  type="text"
                  placeholder="Search for prompts, bundles, and more..."
                  className="pr-10 h-12"
                  style={{ borderRadius: "12px" }}
                />
                <Search className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Categories */}
            <div className="mb-10 relative mt-6">
              {/* Left navigation button - initially hidden */}
              <button
                id="left-nav-button"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md p-1 hover:bg-gray-100 hidden"
                style={{ borderRadius: "24px" }}
                onClick={() => {
                  const container = document.getElementById("categories-container")
                  if (container) {
                    container.scrollBy({ left: -200, behavior: "smooth" })
                  }
                }}
              >
                <ChevronRight className="h-5 w-5 rotate-180" />
              </button>

              {/* Categories container with hidden scrollbar */}
              <div
                id="categories-container"
                className="overflow-x-auto pb-1 pl-0 pr-8 scrollbar-hide mt-2"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                onScroll={(e) => {
                  const container = e.currentTarget
                  const leftButton = document.getElementById("left-nav-button")
                  const rightButton = document.getElementById("right-nav-button")

                  // Show/hide left button based on scroll position
                  if (container.scrollLeft > 0) {
                    leftButton?.classList.remove("hidden")
                  } else {
                    leftButton?.classList.add("hidden")
                  }

                  // Show/hide right button based on scroll position
                  const isAtEnd = container.scrollWidth - container.clientWidth <= container.scrollLeft + 1
                  if (isAtEnd) {
                    rightButton?.classList.add("hidden")
                  } else {
                    rightButton?.classList.remove("hidden")
                  }
                }}
              >
                <style jsx global>{`
                  #categories-container::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                <div className="flex [&>*:not(:first-child)]:ml-4" style={{ borderRadius: "24px" }}>
                  {isLoading
                    ? // Show loading skeletons while data is being fetched
                      Array(6)
                        .fill(0)
                        .map((_, index) => (
                          <div
                            key={`skeleton-${index}`}
                            className="flex flex-col items-center justify-center p-4 bg-gray-100 shadow-sm w-[120px] h-[120px] aspect-square animate-pulse"
                            style={{ borderRadius: "24px" }}
                          >
                            <div className="w-6 h-6 bg-gray-200 mb-2" style={{ borderRadius: "24px" }}></div>
                            <div className="w-20 h-4 bg-gray-200" style={{ borderRadius: "24px" }}></div>
                          </div>
                        ))
                    : // Render actual categories once loaded
                      categories.map((category) => (
                        <CategoryCard
                          key={category.id}
                          category={category}
                          onClick={() => handleCategoryClick(category)}
                        />
                      ))}
                </div>
              </div>

              {/* Right navigation button */}
              <button
                id="right-nav-button"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md p-1 hover:bg-gray-100"
                style={{ borderRadius: "24px" }}
                onClick={() => {
                  const container = document.getElementById("categories-container")
                  if (container) {
                    container.scrollBy({ left: 200, behavior: "smooth" })
                  }
                }}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Bundles */}
            <div className="mb-10 relative mt-8">
              {/* Left navigation button - initially hidden */}
              <button
                id="bundles-left-nav-button"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md p-1 hover:bg-gray-100 hidden"
                style={{ borderRadius: "24px" }}
                onClick={() => {
                  const container = document.getElementById("bundles-container")
                  if (container) {
                    container.scrollBy({ left: -300, behavior: "smooth" })
                  }
                }}
              >
                <ChevronRight className="h-5 w-5 rotate-180" />
              </button>

              {/* Bundles container with hidden scrollbar */}
              <div
                id="bundles-container"
                className="overflow-x-auto pb-4 pl-0 pr-8 scrollbar-hide"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                onScroll={(e) => {
                  const container = e.currentTarget
                  const leftButton = document.getElementById("bundles-left-nav-button")
                  const rightButton = document.getElementById("bundles-right-nav-button")

                  // Show/hide left button based on scroll position
                  if (container.scrollLeft > 0) {
                    leftButton?.classList.remove("hidden")
                  } else {
                    leftButton?.classList.add("hidden")
                  }

                  // Show/hide right button based on scroll position
                  const isAtEnd = container.scrollWidth - container.clientWidth <= container.scrollLeft + 1
                  if (isAtEnd) {
                    rightButton?.classList.add("hidden")
                  } else {
                    rightButton?.classList.remove("hidden")
                  }
                }}
              >
                <style jsx global>{`
                  #bundles-container::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                <div className="flex [&>*:not(:first-child)]:ml-4">
                  <div className="min-w-[180px] sm:min-w-[200px] aspect-[3/4]">
                    <BundleCard
                      title="Website Development"
                      color="bg-emerald-900"
                      imageUrl="/website-development-concept.png"
                    />
                  </div>
                  <div className="min-w-[180px] sm:min-w-[200px] aspect-[3/4]">
                    <BundleCard title="Video Editing Bundle" color="bg-rose-900" imageUrl="/video-editor-pink.png" />
                  </div>
                  <div className="min-w-[180px] sm:min-w-[200px] aspect-[3/4]">
                    <BundleCard
                      title="Software Development"
                      color="bg-amber-900"
                      imageUrl="/code-interface-abstract.png"
                    />
                  </div>
                  <div className="min-w-[180px] sm:min-w-[200px] aspect-[3/4]">
                    <BundleCard
                      title="SEO & Google Bundle"
                      color="bg-emerald-800"
                      imageUrl="/seo-analytics-dashboard.png"
                    />
                  </div>
                  <div className="min-w-[180px] sm:min-w-[200px] aspect-[3/4]">
                    <BundleCard
                      title="Architecture & Interior Design"
                      color="bg-pink-900"
                      imageUrl="/modern-living-space.png"
                    />
                  </div>
                </div>
              </div>

              {/* Right navigation button */}
              <button
                id="bundles-right-nav-button"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md p-1 hover:bg-gray-100"
                style={{ borderRadius: "24px" }}
                onClick={() => {
                  const container = document.getElementById("bundles-container")
                  if (container) {
                    container.scrollBy({ left: 300, behavior: "smooth" })
                  }
                }}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function BundleCard({ title, color, imageUrl }: { title: string; color: string; imageUrl: string }) {
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <div
      className={`overflow-hidden border border-gray-200 h-full flex flex-col ${isHovered ? "bg-[#8a6346]" : "bg-[#6e4f37]"} transition-colors duration-200 cursor-pointer`}
      style={{ borderRadius: "24px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4">
        <h3 className="font-medium text-white text-lg leading-tight">{title}</h3>
      </div>
      <div className="p-2 flex-grow flex items-end">
        <div className="aspect-[4/3] overflow-hidden w-full" style={{ borderRadius: "24px" }}>
          <img src={imageUrl || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  )
}
