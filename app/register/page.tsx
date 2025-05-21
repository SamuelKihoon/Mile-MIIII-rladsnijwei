"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { supabase } from "@/lib/supabase"

// 컴포넌트 정의 전에 RPC 함수 생성
const createCheckTableFunction = async () => {
  try {
    await supabase
      .rpc("check_table_exists", { table_name: "test" })
      .then(() => {
        console.log("check_table_exists 함수가 이미 존재합니다.")
      })
      .catch(async () => {
        // 함수가 없으면 생성 시도
        const { error } = await supabase.rpc("create_check_table_function")
        if (error) {
          console.error("함수 생성 오류:", error)
        } else {
          console.log("check_table_exists 함수가 생성되었습니다.")
        }
      })
  } catch (e) {
    console.error("RPC 함수 확인 오류:", e)
  }
}

export default function RegisterPage() {
  const router = useRouter()
  const { signUp, user } = useAuth()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [handle, setHandle] = useState("")
  const [birthdate, setBirthdate] = useState("")
  const [gender, setGender] = useState("")
  const [organization, setOrganization] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isHandleAvailable, setIsHandleAvailable] = useState<boolean | null>(null)
  const [isCheckingHandle, setIsCheckingHandle] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // 이미 로그인한 경우 홈으로 리디렉션
  useEffect(() => {
    if (user) {
      router.push("/")
    } else {
      // 랜덤 핸들 생성
      generateRandomHandle()
    }
  }, [user, router])

  // 이미 로그인한 경우 홈으로 리디렉션하는 useEffect 아래에 추가
  useEffect(() => {
    // RPC 함수 생성 시도
    createCheckTableFunction()
  }, [])

  // 랜덤 핸들 생성 함수
  const generateRandomHandle = async () => {
    const adjectives = ["happy", "smart", "cool", "bright", "clever", "amazing", "brilliant", "creative"]
    const nouns = ["user", "coder", "writer", "thinker", "creator", "maker", "designer", "builder"]

    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)]
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)]
    const randomNumber = Math.floor(Math.random() * 1000)

    const newHandle = `${randomAdjective}${randomNoun}${randomNumber}`
    setHandle(newHandle)
  }

  // 테이블 존재 여부 확인 함수
  const checkTableExists = async (tableName: string) => {
    try {
      const { error } = await supabase.from(tableName).select("id").limit(1)
      return !error || !error.message.includes("relation") // 테이블이 존재하면 true 반환
    } catch (e) {
      console.error(`테이블 확인 오류 (${tableName}):`, e)
      return false
    }
  }

  // 핸들 중복 확인 함수
  const checkHandleAvailability = async () => {
    // 입력값 전처리: 공백 제거 및 소문자 변환
    const cleanedHandle = handle.trim().toLowerCase().replace(/\s+/g, "")

    // 빈 문자열 체크
    if (!cleanedHandle) {
      setError("핸들을 입력해주세요.")
      return
    }

    setIsCheckingHandle(true)
    setIsHandleAvailable(null)
    setError(null)

    try {
      console.log("핸들 중복 확인 시작:", cleanedHandle)

      // 1. 먼저 정확히 일치하는 핸들 확인
      const { data: exactMatch, error: exactError } = await supabase
        .from("users")
        .select("id")
        .eq("handle", cleanedHandle)
        .limit(1)
        .maybeSingle()

      if (exactError) {
        console.error("중복 체크 에러:", exactError.message)
        throw new Error(`중복 체크 중 오류가 발생했습니다: ${exactError.message}`)
      }

      // 2. 대소문자 무시하고 비슷한 핸들 확인 (ilike 사용)
      const { data: similarMatches, error: similarError } = await supabase
        .from("users")
        .select("id, handle")
        .ilike("handle", cleanedHandle)
        .limit(5)

      if (similarError) {
        console.error("유사 핸들 체크 에러:", similarError.message)
        throw new Error(`유사 핸들 체크 중 오류가 발생했습니다: ${similarError.message}`)
      }

      // 3. 결과 처리: 정확히 일치하거나 공백 제거 후 소문자로 변환했을 때 일치하는 경우
      const isDuplicate =
        exactMatch !== null ||
        similarMatches.some((item) => item.handle.toLowerCase().replace(/\s+/g, "") === cleanedHandle)

      console.log("핸들 중복 확인 결과:", {
        exactMatch,
        similarMatches,
        isDuplicate,
      })

      setIsHandleAvailable(!isDuplicate)

      if (isDuplicate) {
        setError(`이미 사용 중인 @handle(${handle})입니다.`)
      }
    } catch (err) {
      console.error("핸들 중복 확인 오류:", err)
      setError(err instanceof Error ? err.message : "핸들 중복 확인 중 오류가 발생했습니다. 다시 시도해주세요.")
      setIsHandleAvailable(false)
    } finally {
      setIsCheckingHandle(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    // 비밀번호 일치 확인
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.")
      setIsLoading(false)
      return
    }

    // 핸들 중복 확인 - 사용 불가능한 경우에만 체크
    if (isHandleAvailable === false) {
      setError("이미 사용 중인 @handle입니다. 다른 핸들을 선택해주세요.")
      setIsLoading(false)
      return
    }

    // 핸들 중복 확인이 수행되지 않은 경우
    if (isHandleAvailable === null) {
      setIsLoading(false)
      setError("핸들 중복 확인이 필요합니다. 중복 체크 버튼을 클릭해주세요.")
      return // 중복 확인 필요
    }

    try {
      // 1. Supabase Auth에 사용자 생성
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) throw authError

      if (!authData.user) {
        throw new Error("사용자 생성에 실패했습니다.")
      }

      const userId = authData.user.id
      console.log("사용자 생성 성공:", userId)

      // 2. users 테이블에 사용자 정보 저장
      const { error: insertError } = await supabase.from("users").insert({
        id: userId,
        username: username,
        email: email,
        handle: handle,
        birthdate: birthdate || null,
        gender: gender || null,
        organization: organization || null,
        created_at: new Date().toISOString(),
        coins: 500, // 기본 코인
        followers: 0,
        plaintext: "Hello. i am prompter",
        writtenprompts: 0,
        savedprompts: 0,
        bg_url: null,
        avatar_url: null,
      })

      if (insertError) {
        console.error("사용자 정보 저장 오류:", insertError)
        throw new Error("사용자 정보 저장에 실패했습니다: " + insertError.message)
      }

      // 3. 성공 메시지 표시
      setSuccessMessage("회원가입이 완료되었습니다")

      // 4. 3초 후 로그인 페이지로 이동
      setTimeout(() => {
        router.push("/login?registered=true")
      }, 3000)
    } catch (err: any) {
      console.error("회원가입 오류:", err)
      setError(err.message || "회원가입 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <img src="/birzont-logo.png" alt="Birzont Logo" className="h-12" />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-center mb-6">회원가입</h1>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-6">
              {/* 기본 정보 */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="username">사용자 이름</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="사용자 이름 입력"
                    className="mt-1 w-full"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="이메일 주소 입력"
                    className="mt-1 w-full"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="password">비밀번호</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="비밀번호 입력"
                    className="mt-1 w-full"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="비밀번호 다시 입력"
                    className="mt-1 w-full"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* 추가 정보 */}
              <div className="pt-4 border-t border-gray-200 space-y-4">
                <h2 className="text-lg font-medium">추가 정보</h2>

                <div>
                  <Label htmlFor="handle">사용자 핸들 (@handle)</Label>
                  <div className="flex mt-1">
                    <div className="flex-grow flex items-center bg-gray-100 px-3 rounded-l-md">@</div>
                    <Input
                      id="handle"
                      type="text"
                      className="flex-grow rounded-l-none"
                      value={handle}
                      onChange={(e) => {
                        const newHandle = e.target.value
                        setHandle(newHandle)
                        // 핸들이 변경되면 중복 확인 상태 초기화
                        setIsHandleAvailable(null)
                        // 오류 메시지 초기화
                        if (error && error.includes("핸들")) {
                          setError(null)
                        }
                      }}
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="ml-2"
                      onClick={checkHandleAvailability}
                      disabled={isCheckingHandle}
                    >
                      {isCheckingHandle ? "확인 중..." : "중복체크"}
                    </Button>
                  </div>
                  {isHandleAvailable !== null && (
                    <div className={`mt-1 text-sm ${isHandleAvailable ? "text-green-600" : "text-red-600"}`}>
                      {isHandleAvailable ? "✓ 사용 가능한 핸들입니다." : "✗ 이미 사용 중인 핸들입니다."}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="birthdate">생년월일</Label>
                  <Input
                    id="birthdate"
                    type="date"
                    className="mt-1 w-full"
                    value={birthdate}
                    onChange={(e) => setBirthdate(e.target.value)}
                  />
                </div>

                <div>
                  <Label>성별</Label>
                  <div className="mt-1 grid grid-cols-2 gap-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="male"
                        name="gender"
                        value="male"
                        className="h-4 w-4"
                        checked={gender === "male"}
                        onChange={() => setGender("male")}
                      />
                      <label htmlFor="male" className="ml-2">
                        남성
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="female"
                        name="gender"
                        value="female"
                        className="h-4 w-4"
                        checked={gender === "female"}
                        onChange={() => setGender("female")}
                      />
                      <label htmlFor="female" className="ml-2">
                        여성
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="other"
                        name="gender"
                        value="other"
                        className="h-4 w-4"
                        checked={gender === "other"}
                        onChange={() => setGender("other")}
                      />
                      <label htmlFor="other" className="ml-2">
                        기타
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="prefer-not-to-say"
                        name="gender"
                        value="prefer-not-to-say"
                        className="h-4 w-4"
                        checked={gender === "prefer-not-to-say"}
                        onChange={() => setGender("prefer-not-to-say")}
                      />
                      <label htmlFor="prefer-not-to-say" className="ml-2">
                        비공개
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="organization">소속</Label>
                  <Input
                    id="organization"
                    type="text"
                    placeholder="회사/학교/단체명"
                    className="mt-1 w-full"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="terms"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  required
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                  <span>이용약관 및 개인정보 처리방침에 동의합니다</span>
                </label>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading || successMessage !== null}>
                {isLoading ? "가입 중..." : successMessage ? "완료됨" : "회원가입"}
              </Button>
            </form>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-center">
            <p className="text-sm text-gray-600">
              이미 계정이 있으신가요?{" "}
              <Link href="/login" className="font-medium text-blue-600 hover:underline">
                로그인
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
