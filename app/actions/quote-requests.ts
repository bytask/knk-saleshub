"use server"

import { createServerSupabaseClient } from "@/lib/supabase"

// 見積依頼一覧を取得
export async function getQuoteRequests() {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("quote_requests")
    .select(`
      *,
      customers:customer_code (name)
    `)
    .order("request_date", { ascending: false })

  if (error) {
    console.error("Error fetching quote requests:", error)
    throw new Error("見積依頼データの取得に失敗しました")
  }

  return data
}

// 見積依頼IDから見積依頼情報を取得
export async function getQuoteRequestById(id: number) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("quote_requests")
    .select(`
      *,
      customers:customer_code (*)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching quote request:", error)
    return null
  }

  return data
}

// 見積依頼の明細を取得
export async function getQuoteRequestItems(quoteRequestId: number) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("quote_request_items")
    .select("*")
    .eq("quote_request_id", quoteRequestId)
    .order("id")

  if (error) {
    console.error("Error fetching quote request items:", error)
    throw new Error("見積依頼明細の取得に失敗しました")
  }

  return data
}

// 新規見積依頼を作成
export async function createQuoteRequest(quoteRequest: any, items: any[]) {
  const supabase = createServerSupabaseClient()

  // 見積依頼番号を生成（実際のアプリでは、より堅牢な方法で生成する）
  const today = new Date()
  const requestNumber = `REQ-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}-${Math.floor(
    Math.random() * 1000,
  )
    .toString()
    .padStart(3, "0")}`

  // トランザクションを使用して見積依頼と明細を一括で登録
  // Supabaseではトランザクションが直接サポートされていないため、順次処理を行う

  // 1. 見積依頼を登録
  const { data: quoteRequestData, error: quoteRequestError } = await supabase
    .from("quote_requests")
    .insert({
      request_number: requestNumber,
      customer_code: quoteRequest.customerCode,
      request_date: quoteRequest.requestDate,
      due_date: quoteRequest.dueDate,
      status: "新規",
      notes: quoteRequest.notes,
    })
    .select()
    .single()

  if (quoteRequestError) {
    console.error("Error creating quote request:", quoteRequestError)
    throw new Error("見積依頼の作成に失敗しました")
  }

  // 2. 見積依頼明細を登録
  const quoteRequestItems = items.map((item) => ({
    quote_request_id: quoteRequestData.id,
    category_code: item.categoryCode,
    product_code: item.productCode,
    product_name: item.productName,
    drawing_number: item.drawingNumber,
    size: item.size,
    unit: item.unit,
    unit_price: item.unitPrice || null,
    quantity: item.quantity,
    notes: item.notes,
  }))

  const { error: itemsError } = await supabase.from("quote_request_items").insert(quoteRequestItems)

  if (itemsError) {
    console.error("Error creating quote request items:", itemsError)

    // エラーが発生した場合、見積依頼を削除（ロールバック）
    await supabase.from("quote_requests").delete().eq("id", quoteRequestData.id)

    throw new Error("見積依頼明細の作成に失敗しました")
  }

  return quoteRequestData
}

// 見積依頼を更新
export async function updateQuoteRequest(id: number, quoteRequest: any) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("quote_requests")
    .update({
      customer_code: quoteRequest.customerCode,
      request_date: quoteRequest.requestDate,
      due_date: quoteRequest.dueDate,
      status: quoteRequest.status,
      notes: quoteRequest.notes,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating quote request:", error)
    throw new Error("見積依頼の更新に失敗しました")
  }

  return data
}

// 見積依頼を削除
export async function deleteQuoteRequest(id: number) {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.from("quote_requests").delete().eq("id", id)

  if (error) {
    console.error("Error deleting quote request:", error)
    throw new Error("見積依頼の削除に失敗しました")
  }

  return true
}
