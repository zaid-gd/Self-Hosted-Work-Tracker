import { createClient } from "@supabase/supabase-js"

function getEnv(name: string) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`${name} is not configured`)
  }
  return value
}

export function getSupabaseAdmin() {
  return createClient(
    getEnv("NEXT_PUBLIC_SUPABASE_URL"),
    getEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

export function getStorageBucket() {
  return process.env.SUPABASE_STORAGE_BUCKET || "project-files"
}
