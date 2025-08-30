/*
 * @Author: Cherie
 * @Date: 2025-07-30 16:20:26
 * @Description:'supabase使用 js 实例'
 */
// import { createClient } from '@supabase/supabase-js'
// Create a single supabase client for interacting with your database
// const supabase = createClient('https://xyzcompany.supabase.co', 'public-anon-key')

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a single supabase client for interacting with your database
let supabaseClient: ReturnType<typeof createClient> | null = null

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseClient
}
