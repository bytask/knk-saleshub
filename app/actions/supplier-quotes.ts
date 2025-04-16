"use server"

import { createServerSupabaseClient } from "@/lib/supabase"

// 仕入先見積依頼一覧を取得
export async function getSupplierQuotes() {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("supplier_quotes")
    .select(`
      *,
      suppliers:supplier_code (name),
      quote_requests:quote_request_id (request_number)
    `)
    .order("sent_date", { ascending: false })

  if (error) {
    console.error("Error fetching supplier quotes:", error)
    throw new Error("仕入先見積依頼データの取得に失敗しました")
  }

  return data
}

// 見積依頼IDに関連する仕入先見積依頼を取得
export async function getSupplierQuotesByRequestId(quoteRequestId: number) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("supplier_quotes")
    .select(`
      *,
      suppliers:supplier_code (*)
    `)
    .eq("quote_request_id", quoteRequestId)
    .order("sent_date")

  if (error) {
    console.error("Error fetching supplier quotes:", error)
    throw new Error("仕入先見積依頼データの取得に失敗しました")
  }

  return data
}

// 仕入先見積依頼の明細を取得
export async function getSupplierQuoteItems(supplierQuoteId: number) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("supplier_quote_items")
    .select(`
      *,
      quote_request_items:quote_request_item_id (*)
    `)
    .eq("supplier_quote_id", supplierQuoteId)
    .order("id")

  if (error) {
    console.error("Error fetching supplier quote items:", error)
    throw new Error("仕入先見積明細の取得に失敗しました")
  }

  return data
}
