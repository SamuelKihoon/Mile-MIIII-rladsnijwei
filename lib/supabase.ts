import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database.types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fanlqfaphmayjxaavjrh.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhbmxxZmFwaG1heWp4YWF2anJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5NzMzMjgsImV4cCI6MjA2MjU0OTMyOH0.uF25iL8b445XNLRITVhn6Iqf6J8u9KRDI0XTg5djuPE"

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})
