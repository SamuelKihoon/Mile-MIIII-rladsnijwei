"use client"

import { useState } from "react"
import {
  Bookmark,
  Star,
  Share2,
  ArrowLeft,
  ShoppingCart,
  Bell,
  User,
  Menu,
  ArrowUp,
  Search,
  PlusCircle,
  Bot,
  HelpCircle,
  Copy,
  Heart,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

// Types
type Prompt = {
  id: string
  title: string
  description: string
  category: string
  price: number
  rating: number
  reviews: number
  type: "text" | "image"
  imageUrl?: string
  author?: string
}

// PromptCard 컴포넌트 추가
const PromptCard = ({ prompt }: { prompt: Prompt }) => {
  // 별점 렌더링 함수
  const renderStars = (rating: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star key={i} className={`h-4 w-4 ${i <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />,
      )
    }
    return stars
  }

  // 이미지 프롬프트 카드
  if (prompt.type === "image") {
    return (
      <Card className="aspect-[16/10] flex flex-col overflow-hidden rounded-xl group transition-all duration-300 hover:scale-105">
        <div className="relative h-[65%] overflow-hidden bg-gray-100">
          <img
            src={prompt.imageUrl || "/placeholder.svg"}
            alt={prompt.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute top-2 left-2 z-10">
            <div className="inline-flex items-center bg-gray-100 text-black rounded-lg pl-1 pr-2 py-1">
              <div className="w-7 h-7 mr-1.5">
                <div className="w-7 h-7 bg-[#383640] rounded-md flex items-center justify-center overflow-hidden">
                  <img
                    src="https://companieslogo.com/img/orig/midjourney.D-733962ee.png?t=1720244494"
                    alt="Midjourney"
                    className="w-5 h-5 object-contain"
                  />
                </div>
              </div>
              <span className="text-base font-medium">Midjourney</span>
            </div>
          </div>
          <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
            <div className="flex items-center bg-gray-100 text-black rounded-md px-2 py-1 text-sm">
              <Copy className="h-4 w-4 mr-1.5" />
              <span>{prompt.reviews}</span>
            </div>
            <div className="flex items-center bg-gray-100 text-black rounded-md px-2 py-1 text-sm">
              <Heart className="h-4 w-4 mr-1.5" />
              <span>{Math.floor(prompt.reviews * 0.4)}</span>
            </div>
          </div>
        </div>
        <div className="p-3 flex flex-col h-[35%]">
          <Link href={`/prompt/${prompt.id}`}>
            <h3 className="font-medium text-lg mb-1 group-hover:text-blue-700 transition-colors duration-300 line-clamp-1">
              {prompt.title}
            </h3>
          </Link>
          <div className="flex justify-end items-center text-sm text-gray-600 mt-auto">
            <span className="group-hover:text-blue-700 transition-colors duration-300">
              🪙 {prompt.price.toFixed(2)}
            </span>
          </div>
        </div>
      </Card>
    )
  }

  // 텍스트 프롬프트 카드 (profile/page.tsx 스타일 적용)
  return (
    <Card className="aspect-[16/10] flex flex-col overflow-hidden rounded-xl group transition-all duration-300 hover:scale-105">
      <div className="p-3 flex flex-col h-full">
        {/* Header with model and stats */}
        <div className="relative mb-3">
          <div className="inline-flex items-center bg-gray-100 text-black rounded-lg pl-1 pr-2 py-1">
            <div className="w-7 h-7 mr-1.5">
              {prompt.category === "Writing & Translation" ? (
                <div className="w-7 h-7 bg-[#db8848] rounded-md flex items-center justify-center overflow-hidden">
                  <img
                    src="https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/claude.png"
                    alt="Claude"
                    className="w-5 h-5 object-contain"
                  />
                </div>
              ) : prompt.category === "Business" ? (
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
            <span className="text-base font-medium">
              {prompt.category === "Writing & Translation"
                ? "Claude"
                : prompt.category === "Business"
                  ? "ChatGPT"
                  : "Midjourney"}
            </span>
          </div>

          <div className="absolute top-0 right-0 z-10 flex items-center gap-2">
            <div className="flex items-center bg-white/90 rounded-md px-2 py-1 text-sm shadow-sm group-hover:text-blue-700">
              <Copy className="h-4 w-4 mr-1.5" />
              <span>{prompt.reviews}</span>
            </div>
            <div className="flex items-center bg-white/90 rounded-md px-2 py-1 text-sm shadow-sm group-hover:text-blue-700">
              <Bookmark className="h-4 w-4 mr-1.5" />
              <span>{Math.floor(prompt.reviews * 0.4)}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <Link href={`/prompt/${prompt.id}`}>
          <h3 className="font-medium text-lg mb-1 group-hover:text-blue-700 transition-colors duration-300">
            {prompt.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-700 mb-3 line-clamp-3 group-hover:text-blue-700 transition-colors duration-300">
          {prompt.description}
        </p>
        <div className="flex justify-end items-center text-sm text-gray-600 mt-auto">
          <span className="group-hover:text-blue-700 transition-colors duration-300">🪙 {prompt.price.toFixed(2)}</span>
        </div>
      </div>
    </Card>
  )
}

type Bundle = {
  id: string
  title: string
  description: string
  longDescription: string
  author: {
    name: string
    avatar: string
    rating: number
    totalSales: number
  }
  category: string
  tags: string[]
  price: number
  originalPrice: number
  discount: number
  rating: number
  reviews: number
  sales: number
  createdAt: string
  updatedAt: string
  prompts: Prompt[]
  features: string[]
  faqs: {
    question: string
    answer: string
  }[]
  reviews_list: {
    id: number
    user: string
    avatar: string
    rating: number
    comment: string
    date: string
    helpful: number
  }[]
}

// Sample data
const sampleBundle: Bundle = {
  id: "1",
  title: "Ultimate Business Communication Bundle",
  description: "A comprehensive collection of prompts for all your business communication needs.",
  longDescription:
    "Elevate your professional communication with our Ultimate Business Communication Bundle. This carefully curated collection includes 8 premium prompts designed to help you craft perfect emails and more.",
  author: {
    name: "BusinessPro",
    avatar: "/abstract-geometric-shapes.png",
    rating: 4.9,
    totalSales: 3250,
  },
  category: "Business",
  tags: ["Business", "Communication", "Email", "Reports", "Presentations"],
  price: 20.0,
  originalPrice: 49.99,
  discount: 40,
  rating: 4.8,
  reviews: 186,
  sales: 1420,
  createdAt: "2023-01-10",
  updatedAt: "2023-04-15",
  prompts: [
    {
      id: "101",
      title: "Professional Email Writer",
      description: "Generate professional, well-structured emails for any business situation.",
      category: "Writing & Translation",
      price: 25.99,
      rating: 4.8,
      reviews: 124,
      type: "text",
    },
    {
      id: "102",
      title: "Business Report Generator",
      description: "Create comprehensive business reports with data analysis and recommendations.",
      category: "Business",
      price: 7.99,
      rating: 4.7,
      reviews: 98,
      type: "text",
    },
    {
      id: "103",
      title: "Meeting Minutes Template",
      description: "Structured templates for recording effective meeting minutes and action items.",
      category: "Business",
      price: 4.99,
      rating: 4.5,
      reviews: 76,
      type: "text",
    },
    {
      id: "104",
      title: "Corporate Presentation Visuals",
      description: "Professional visual assets for your business presentations and reports.",
      category: "Design",
      price: 9.99,
      rating: 4.9,
      reviews: 145,
      type: "image",
      imageUrl: "/placeholder.svg?key=oqcf5",
      author: "DesignMaster",
    },
    {
      id: "105",
      title: "Customer Support Email Templates",
      description: "Professional templates for handling customer inquiries, complaints, and support requests.",
      category: "Writing & Translation",
      price: 6.99,
      rating: 4.8,
      reviews: 112,
      type: "text",
    },
    {
      id: "106",
      title: "Sales Pitch Generator",
      description: "Create compelling sales pitches tailored to different products and audiences.",
      category: "Sales & Marketing",
      price: 7.99,
      rating: 4.7,
      reviews: 94,
      type: "text",
    },
    {
      id: "107",
      title: "Business Proposal Writer",
      description: "Generate professional business proposals with customizable sections and persuasive language.",
      category: "Business",
      price: 8.99,
      rating: 4.9,
      reviews: 78,
      type: "text",
    },
    {
      id: "108",
      title: "Brand Identity Visuals",
      description: "Create consistent and professional visual identity for your business brand.",
      category: "Design",
      price: 12.99,
      rating: 4.8,
      reviews: 132,
      type: "image",
      imageUrl: "/placeholder.svg?key=6gq7z",
      author: "BrandPro",
    },
    {
      id: "109",
      title: "Team Communication Templates",
      description: "Templates for effective team announcements, updates, and feedback communications.",
      category: "Business",
      price: 5.99,
      rating: 4.6,
      reviews: 65,
      type: "text",
    },
    {
      id: "110",
      title: "Marketing Campaign Visuals",
      description: "Eye-catching visuals for your marketing campaigns and social media.",
      category: "Marketing",
      price: 10.99,
      rating: 4.7,
      reviews: 108,
      type: "image",
      imageUrl: "/placeholder.svg?key=11zcq",
      author: "MarketingVisuals",
    },
  ],
  features: [
    "10 premium business communication prompts",
    "Save over 40% compared to individual purchases",
    "Lifetime access to all included prompts",
    "Free updates when prompts are enhanced",
    "Compatible with ChatGPT, Claude, and other major AI assistants",
    "Detailed instructions for each prompt",
    "Example outputs for reference",
    "Priority customer support",
  ],
  faqs: [
    {
      question: "Can I use these prompts with any AI assistant?",
      answer:
        "Yes, all prompts in this bundle are designed to work with major AI assistants including ChatGPT, Claude, Bard, and others. Some minor adjustments might be needed depending on the specific AI you're using.",
    },
    {
      question: "Do I get access to future updates?",
      answer:
        "When we improve or update any prompt in this bundle, you'll automatically get access to the latest version at no additional cost.",
    },
    {
      question: "Can I share these prompts with my team?",
      answer:
        "Each purchase is for individual use. If you need team access, please check out our team licensing options which offer significant discounts for multiple users.",
    },
    {
      question: "What if I already own some of these prompts?",
      answer:
        "Unfortunately, we don't currently offer partial bundle purchases. However, the bundle discount is significant enough that it's often still worth purchasing even if you already own 1-2 of the included prompts.",
    },
    {
      question: "What's your refund policy?",
      answer:
        "We offer a 30-day satisfaction guarantee. If you're not happy with the bundle, contact our support team within 30 days of purchase for a full refund.",
    },
  ],
  reviews_list: [
    {
      id: 1,
      user: "MarketingDirector",
      avatar: "/abstract-geometric-shapes.png",
      rating: 5,
      comment:
        "This bundle has transformed our company's communications. The email templates alone have saved our team countless hours, and the consistency in our messaging has improved dramatically. Well worth the investment!",
      date: "2023-04-10",
      helpful: 42,
    },
    {
      id: 2,
      user: "StartupFounder",
      avatar: "/diverse-group-collaborating.png",
      rating: 5,
      comment:
        "As a startup founder wearing multiple hats, this bundle has been invaluable. The business proposal writer helped us secure two major clients, and the sales pitch generator has significantly improved our conversion rate. Highly recommend!",
      date: "2023-03-22",
      helpful: 36,
    },
    {
      id: 3,
      user: "ProjectManager",
      avatar: "/abstract-geometric-shapes.png",
      rating: 4,
      comment:
        "Great collection of prompts that has streamlined our team's communication. The meeting minutes template is particularly useful. Only giving 4 stars because I'd love to see more project management specific templates in the future.",
      date: "2023-03-05",
      helpful: 28,
    },
    {
      id: 4,
      user: "SalesExecutive",
      avatar: "/diverse-group-collaborating.png",
      rating: 5,
      comment:
        "The sales pitch generator in this bundle is exceptional. It's helped me customize pitches for different client types and has definitely contributed to closing more deals. The customer support templates have also been great for follow-ups.",
      date: "2023-02-18",
      helpful: 31,
    },
  ],
}

export default function BundlePage() {
  const params = useParams()
  const router = useRouter()
  const [isSaved, setIsSaved] = useState(false)
  const [expandedReviews, setExpandedReviews] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  // In a real app, you would fetch the bundle data based on the ID
  const bundle = sampleBundle
  const bundleId = params.id

  // Calculate total price of all prompts and savings
  const totalPromptsPrice = bundle.prompts.reduce((total, prompt) => total + prompt.price, 0)
  const savings = totalPromptsPrice - bundle.price

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  // Handle save/bookmark
  const toggleSave = () => {
    setIsSaved(!isSaved)
    // In a real app, you would call an API to save/unsave the bundle
  }

  // Handle add to cart
  const handleAddToCart = () => {
    setAddedToCart(true)
    // In a real app, you would call an API to add the bundle to the cart
    setTimeout(() => {
      setAddedToCart(false)
    }, 2000)
  }

  // Render star rating
  const renderStars = (rating: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star key={i} className={`h-4 w-4 ${i <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />,
      )
    }
    return stars
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
                {/* Bundle Title and Info */}
                <div>
                  <h1 className="text-3xl font-bold mb-2">{bundle.title}</h1>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Category: {bundle.category}</span>
                    <span>•</span>
                    <span>Updated {formatDate(bundle.updatedAt)}</span>
                  </div>
                </div>

                {/* Bundle Description */}
                <div>
                  <p className="text-gray-700">{bundle.longDescription}</p>
                </div>

                {/* Included Prompts Section */}
                <div className="mb-8 border border-black rounded-xl p-6">
                  <h2 className="text-2xl font-bold mb-4">Included Prompts</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {bundle.prompts.map((prompt) => (
                      <PromptCard key={prompt.id} prompt={prompt} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar - Right 1/3 */}
              <div className="space-y-6">
                {/* Purchase Card */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-3xl font-bold">🪙 {bundle.price.toFixed(2)}</div>
                      <div className="text-gray-500 line-through">🪙 {totalPromptsPrice.toFixed(2)}</div>
                    </div>
                    <div className="text-green-600 font-medium mb-4">
                      You save 🪙 {savings.toFixed(2)} with this bundle!
                    </div>
                    <Button className="w-full mb-3" onClick={handleAddToCart}>
                      {addedToCart ? (
                        <>
                          <Check className="mr-2 h-4 w-4" /> Added to Cart
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                        </>
                      )}
                    </Button>
                    <Button variant="outline" className="w-full mb-3" onClick={toggleSave}>
                      {isSaved ? (
                        <>
                          <Check className="mr-2 h-4 w-4" /> Saved
                        </>
                      ) : (
                        <>
                          <Bookmark className="mr-2 h-4 w-4" /> Save for Later
                        </>
                      )}
                    </Button>
                    <Button variant="outline" className="w-full mb-6">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>

                    <div className="text-sm text-gray-500 space-y-2">
                      <div className="flex justify-between">
                        <span>Prompts Included</span>
                        <span>{bundle.prompts.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sales</span>
                        <span>{bundle.sales}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Updated</span>
                        <span>{formatDate(bundle.updatedAt)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {/* Tags Card */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-medium mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {bundle.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="px-3 py-1">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Author Card */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-16 h-16 rounded-full overflow-hidden">
                        <img
                          src={bundle.author.avatar || "/placeholder.svg"}
                          alt={bundle.author.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-lg flex items-center">
                              {bundle.author.name}
                              <div className="ml-1.5 flex items-center">
                                <img
                                  src="https://img.icons8.com/?size=512&id=2sZ0sdlG9kWP&format=png"
                                  alt="Verified"
                                  className="w-4 h-4"
                                  title="Verified User"
                                />
                              </div>
                            </div>
                            <div className="text-sm text-gray-500">@{bundle.author.name.toLowerCase()}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                      <div className="bg-gray-50 rounded-lg p-2">
                        <div className="font-medium">10</div>
                        <div className="text-xs text-gray-500">Followers</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <div className="font-medium">24</div>
                        <div className="text-xs text-gray-500">Prompts</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <div className="font-medium">{bundle.author.totalSales}</div>
                        <div className="text-xs text-gray-500">Sales</div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 mb-4">
                      3D designer and prompt engineer specializing in business communications. Creating professional
                      templates with maximum impact.
                    </div>

                    <Button variant="outline" className="w-full mb-2">
                      View Profile
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200"
                    >
                      Follow
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

// Related Bundle Card Component
function RelatedBundleCard({
  title,
  price,
  originalPrice,
  promptCount,
  rating,
}: {
  title: string
  price: number
  originalPrice: number
  promptCount: number
  rating: number
}) {
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100)

  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-medium text-sm">{title}</div>
            <div className="text-xs text-gray-500">{promptCount} prompts</div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1">
              <div className="font-medium">🪙 {price.toFixed(2)}</div>
              <div className="text-xs text-gray-500 line-through">🪙 {originalPrice.toFixed(2)}</div>
            </div>
            <div className="flex items-center text-xs">
              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-1" />
              <span>{rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
