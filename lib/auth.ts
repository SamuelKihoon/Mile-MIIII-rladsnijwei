import { supabase } from "./supabase"
import type { Database } from "@/types/database.types"

type User = Database["public"]["Tables"]["users"]["Row"]

// Check if the users table exists
async function checkUsersTableExists() {
  try {
    const { error } = await supabase.from("users").select("id").limit(1)
    return !error || !error.message.includes("relation") // Table exists if no error or error is not about missing relation
  } catch (e) {
    return false
  }
}

export async function signUp(email: string, password: string, username: string) {
  try {
    // First, create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      console.error("Auth error during signup:", authError)
      throw authError
    }

    if (!authData.user) {
      throw new Error("User creation failed")
    }

    // Check if users table exists before trying to insert
    const tableExists = await checkUsersTableExists()
    if (!tableExists) {
      console.warn("Users table does not exist yet. Skipping profile creation.")
      return authData
    }

    // Then create the user profile
    const { error: profileError } = await supabase.from("users").insert([
      {
        id: authData.user.id,
        email,
        username,
        coins: 100, // Default starting coins
      },
    ])

    if (profileError) {
      console.error("Profile creation error:", profileError)
      throw profileError
    }

    return authData
  } catch (error) {
    console.error("Signup error:", error)
    throw error
  }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error("Signin error:", error)
    throw error
  }

  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error("Signout error:", error)
    throw error
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    // Get the current session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return null
    }

    // Check if users table exists
    const tableExists = await checkUsersTableExists()
    if (!tableExists) {
      console.warn("Users table does not exist yet. Returning basic user info.")
      // Return a minimal user object based on auth data
      return {
        id: session.user.id,
        email: session.user.email || "",
        username: session.user.email?.split("@")[0] || "user",
        created_at: new Date().toISOString(),
        coins: 100,
        avatar_url: null,
      } as User
    }

    // Get the user profile data
    const { data, error } = await supabase.from("users").select("*").eq("id", session.user.id).single()

    if (error) {
      console.error("Error fetching user profile:", error)
      // Return a minimal user object based on auth data as fallback
      return {
        id: session.user.id,
        email: session.user.email || "",
        username: session.user.email?.split("@")[0] || "user",
        created_at: new Date().toISOString(),
        coins: 100,
        avatar_url: null,
      } as User
    }

    return data
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// Create user profile for OAuth users if it doesn't exist
export async function createUserProfileIfNeeded(userId: string, email: string) {
  try {
    // Check if user profile already exists
    const { data: existingUser, error: fetchError } = await supabase.from("users").select("*").eq("id", userId).single()

    if (fetchError && !fetchError.message.includes("No rows found")) {
      console.error("Error checking existing user:", fetchError)
      return null
    }

    // If user already exists, return it
    if (existingUser) {
      return existingUser
    }

    // Generate a username from email
    const username = email.split("@")[0]

    // Create new user profile
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          id: userId,
          email,
          username,
          coins: 100,
        },
      ])
      .select()
      .single()

    if (insertError) {
      console.error("Error creating user profile:", insertError)
      return null
    }

    return newUser
  } catch (error) {
    console.error("Error in createUserProfileIfNeeded:", error)
    return null
  }
}
