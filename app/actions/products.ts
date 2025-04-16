"use server"

import { createServerSupabaseClient } from "@/lib/supabase"

// 商品一覧を取得
export async function getProducts() {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("products").select("*").order("code")

  if (error) {
    console.error("Error fetching products:", error)
    throw new Error("商品データの取得に失敗しました")
  }

  return data
}

// 商品コードから商品情報を取得
export async function getProductByCode(code: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("products").select("*").eq("code", code).single()

  if (error) {
    console.error("Error fetching product:", error)
    return null
  }

  return data
}

// 商品を検索（コード、名前、図面番号、サイズで検索）
export async function searchProducts(searchTerm: string, searchType = "all") {
  const supabase = createServerSupabaseClient()

  let query = supabase.from("products").select("*")

  // 検索タイプに応じてクエリを変更
  switch (searchType) {
    case "code":
      query = query.ilike("code", `%${searchTerm}%`)
      break
    case "name":
      query = query.ilike("name", `%${searchTerm}%`)
      break
    case "drawing":
      query = query.ilike("drawing_number", `%${searchTerm}%`)
      break
    case "size":
      query = query.ilike("size", `%${searchTerm}%`)
      break
    case "all":
    default:
      query = query.or(
        `code.ilike.%${searchTerm}%,name.ilike.%${searchTerm}%,drawing_number.ilike.%${searchTerm}%,size.ilike.%${searchTerm}%`,
      )
      break
  }

  const { data, error } = await query.order("code")

  if (error) {
    console.error("Error searching products:", error)
    throw new Error("商品の検索に失敗しました")
  }

  return data
}
