import { supabase } from "./supabase"
import type { Database } from "../types/database.types"

type Bundle = Database["public"]["Tables"]["bundles"]["Row"]
type Prompt = Database["public"]["Tables"]["prompts"]["Row"]
type User = Database["public"]["Tables"]["users"]["Row"]

// Bundle APIs
export async function getBundles() {
  const { data, error } = await supabase.from("bundles").select("*").order("created_at", { ascending: false })

  if (error) throw error
  return data as Bundle[]
}

export async function getBundleById(id: string) {
  const { data, error } = await supabase.from("bundles").select("*, prompts(*)").eq("id", id).single()

  if (error) throw error
  return data as Bundle & { prompts: Prompt[] }
}

export async function createBundle(bundle: Database["public"]["Tables"]["bundles"]["Insert"]) {
  const { data, error } = await supabase.from("bundles").insert([bundle]).select()

  if (error) throw error
  return data[0] as Bundle
}

// Prompt APIs
export async function getPrompts() {
  const { data, error } = await supabase.from("prompts").select("*").order("created_at", { ascending: false })

  if (error) throw error
  return data as Prompt[]
}

export async function getPromptById(id: string) {
  const { data, error } = await supabase.from("prompts").select("*").eq("id", id).single()

  if (error) throw error
  return data as Prompt
}

export async function createPrompt(prompt: Database["public"]["Tables"]["prompts"]["Insert"]) {
  const { data, error } = await supabase.from("prompts").insert([prompt]).select()

  if (error) throw error
  return data[0] as Prompt
}

// User APIs
export async function getUserById(id: string) {
  const { data, error } = await supabase.from("users").select("*").eq("id", id).single()

  if (error) throw error
  return data as User
}

export async function updateUserCoins(userId: string, coins: number) {
  const { data, error } = await supabase.from("users").update({ coins }).eq("id", userId).select()

  if (error) throw error
  return data[0] as User
}
