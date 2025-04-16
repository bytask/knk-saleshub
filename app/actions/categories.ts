"use server"

import { createServerSupabaseClient } from "@/lib/supabase"

// カテゴリー一覧を取得
export async function getCategories() {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("categories").select("*").order("code")

  if (error) {
    console.error("Error fetching categories:", error)
    throw new Error("カテゴリーデータの取得に失敗しました")
  }

  return data
}
