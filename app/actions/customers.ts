"use server"

import { createServerSupabaseClient } from "@/lib/supabase"

// 得意先一覧を取得
export async function getCustomers() {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("customers").select("*").order("code")

  if (error) {
    console.error("Error fetching customers:", error)
    throw new Error("得意先データの取得に失敗しました")
  }

  return data
}

// 得意先コードから得意先情報を取得
export async function getCustomerByCode(code: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("customers").select("*").eq("code", code).single()

  if (error) {
    console.error("Error fetching customer:", error)
    return null
  }

  return data
}

// 得意先名で検索
export async function searchCustomers(searchTerm: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .or(`code.ilike.%${searchTerm}%,name.ilike.%${searchTerm}%`)
    .order("code")

  if (error) {
    console.error("Error searching customers:", error)
    throw new Error("得意先の検索に失敗しました")
  }

  return data
}
