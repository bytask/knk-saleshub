import { createClient } from "@supabase/supabase-js"

// 環境変数から Supabase の URL と匿名キーを取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// クライアント側で使用する Supabase クライアント
export const supabase = createClient(supabaseUrl!, supabaseAnonKey!)

// サーバー側で使用する Supabase クライアント（サーバーアクションなどで使用）
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  return createClient(supabaseUrl!, supabaseServiceKey!)
}
