"use client"

import { ArrowUp, Bell, Bookmark, Bot, HelpCircle, Menu, PlusCircle, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function SettingsPage() {
  const router = useRouter()

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
        {/* Settings content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">설정</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">계정 설정</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">이름</Label>
                    <Input id="name" defaultValue="사용자 이름" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="email">이메일</Label>
                    <Input id="email" type="email" defaultValue="user@example.com" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="bio">소개</Label>
                    <Textarea
                      id="bio"
                      className="mt-1"
                      defaultValue="안녕하세요! 저는 프롬프트 엔지니어링과 AI에 관심이 많은 사용자입니다. 다양한 AI 모델을 활용한 프롬프트를 만들고 공유하는 것을 좋아합니다."
                    />
                  </div>
                  <Button>저장</Button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">비밀번호 변경</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="current-password">현재 비밀번호</Label>
                    <Input id="current-password" type="password" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="new-password">새 비밀번호</Label>
                    <Input id="new-password" type="password" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">비밀번호 확인</Label>
                    <Input id="confirm-password" type="password" className="mt-1" />
                  </div>
                  <Button>비밀번호 변경</Button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">알림 설정</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">이메일 알림</p>
                      <p className="text-sm text-gray-500">새로운 프롬프트 및 업데이트에 대한 이메일 알림</p>
                    </div>
                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                      <span className="absolute h-4 w-4 rounded-full bg-white translate-x-1"></span>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">웹 알림</p>
                      <p className="text-sm text-gray-500">웹사이트 내 알림</p>
                    </div>
                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                      <span className="absolute h-4 w-4 rounded-full bg-white translate-x-6"></span>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">마케팅 이메일</p>
                      <p className="text-sm text-gray-500">프로모션 및 마케팅 이메일</p>
                    </div>
                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                      <span className="absolute h-4 w-4 rounded-full bg-white translate-x-1"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">계정 삭제</h2>
                <p className="text-gray-600 mb-4">
                  계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
                </p>
                <Button variant="destructive">계정 삭제</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
