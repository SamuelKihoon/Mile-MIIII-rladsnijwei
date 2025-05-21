"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { signIn, signOut, signUp, getCurrentUser, createUserProfileIfNeeded } from "@/lib/auth"
import type { Database } from "@/types/database.types"

type User = Database["public"]["Tables"]["users"]["Row"]

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string, username: string) => Promise<any>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signIn: async () => null,
  signUp: async () => null,
  signOut: async () => null,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for current session and set user
    const initializeAuth = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error("Error initializing auth:", error)
        // Continue with null user instead of breaking the app
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id)

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        try {
          if (session?.user) {
            // For OAuth users, we need to create a profile if it doesn't exist
            if (session.user.app_metadata.provider && session.user.app_metadata.provider !== "email") {
              await createUserProfileIfNeeded(session.user.id, session.user.email || "")
            }

            const currentUser = await getCurrentUser()
            setUser(currentUser)
          }
        } catch (error) {
          console.error("Error getting user data:", error)
          // Continue with previous user state
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null)
      }

      setIsLoading(false)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const value = {
    user,
    isLoading,
    signIn: async (email: string, password: string) => {
      try {
        const data = await signIn(email, password)
        const currentUser = await getCurrentUser()
        setUser(currentUser)
        return data
      } catch (error) {
        console.error("Error signing in:", error)
        throw error
      }
    },
    signUp: async (email: string, password: string, username: string) => {
      try {
        const result = await signUp(email, password, username)
        return result
      } catch (error) {
        console.error("Error in auth context signUp:", error)
        throw error
      }
    },
    signOut: async () => {
      try {
        await signOut()
        setUser(null)
      } catch (error) {
        console.error("Error signing out:", error)
        throw error
      }
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
