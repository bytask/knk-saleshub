"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Trash2, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"

import { getCustomers, searchCustomers, getCustomerByCode } from "@/app/actions/customers"
import { getCategories } from "@/app/actions/categories"
import { searchProducts, getProductByCode } from "@/app/actions/products"
import { createQuoteRequest } from "@/app/actions/quote-requests"

export default function NewQuoteRequestPage() {
  const router = useRouter()
  const [customerCode, setCustomerCode] = useState("")
  const [customerInfo, setCustomerInfo] = useState(null)
  const [customerSearchTerm, setCustomerSearchTerm] = useState("")
  const [filteredCustomers, setFilteredCustomers] = useState([])
  const [showCustomerSearch, setShowCustomerSearch] = useState(false)
  const [requestDate, setRequestDate] = useState(new Date().toISOString().split("T")[0])
  const [dueDate, setDueDate] = useState("")
  const [notes, setNotes] = useState("")
  const [items, setItems] = useState([
    {
      id: 1,
      categoryCode: "",
      productCode: "",
      productName: "",
      drawingNumber: "",
      size: "",
      unit: "個",
      unitPrice: "",
      quantity: "",
      notes: "",
    },
  ])

  // 商品検索機能を強化するために、以下の変更を行います
  const [productSearchTerm, setProductSearchTerm] = useState("")
  const [filteredProducts, setFilteredProducts] = useState([])
  // 検索項目を選択するための状態を追加
  const [searchType, setSearchType] = useState("all")
  // 現在選択中の商品明細ID
  const [currentItemId, setCurrentItemId] = useState(null)

  // カテゴリーデータを取得
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 初期データの取得
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true)
        const categoriesData = await getCategories()
        setCategories(categoriesData)
      } catch (error) {
        console.error("Error fetching initial data:", error)
        toast({
          title: "エラー",
          description: "初期データの取得に失敗しました",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchInitialData()
  }, [])

  // 得意先コードが変更されたときに得意先情報を取得
  useEffect(() => {
    const fetchCustomerInfo = async () => {
      if (customerCode) {
        try {
          const customer = await getCustomerByCode(customerCode)
          if (customer) {
            setCustomerInfo(customer)
            setShowCustomerSearch(false)
          } else {
            setCustomerInfo(null)
          }
        } catch (error) {
          console.error("Error fetching customer info:", error)
          toast({
            title: "エラー",
            description: "得意先情報の取得に失敗しました",
            variant: "destructive",
          })
        }
      } else {
        setCustomerInfo(null)
      }
    }

    fetchCustomerInfo()
  }, [customerCode])

  // 得意先検索
  useEffect(() => {
    const fetchCustomers = async () => {
      if (customerSearchTerm) {
        try {
          const data = await searchCustomers(customerSearchTerm)
          setFilteredCustomers(data)
        } catch (error) {
          console.error("Error searching customers:", error)
          toast({
            title: "エラー",
            description: "得意先の検索に失敗しました",
            variant: "destructive",
          })
        }
      } else {
        const data = await getCustomers()
        setFilteredCustomers(data)
      }
    }

    fetchCustomers()
  }, [customerSearchTerm])

  // 商品検索
  useEffect(() => {
    const fetchProducts = async () => {
      if (productSearchTerm) {
        try {
          const data = await searchProducts(productSearchTerm, searchType)
          setFilteredProducts(data)
        } catch (error) {
          console.error("Error searching products:", error)
          toast({
            title: "エラー",
            description: "商品の検索に失敗しました",
            variant: "destructive",
          })
        }
      } else {
        setFilteredProducts([])
      }
    }

    fetchProducts()
  }, [productSearchTerm, searchType])

  // 商品コードが変更されたときに商品情報を取得
  const handleProductCodeChange = async (id, code) => {
    try {
      const product = await getProductByCode(code)
      if (product) {
        setItems(
          items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  productCode: product.code,
                  categoryCode: product.category_code,
                  productName: product.name,
                  drawingNumber: product.drawing_number,
                  size: product.size,
                  unit: product.unit,
                  unitPrice: product.standard_price?.toString() || "",
                }
              : item,
          ),
        )
      }
    } catch (error) {
      console.error("Error fetching product info:", error)
    }
  }

  // 検索タイプに基づいてプレースホルダーテキストを取得
  const getSearchPlaceholder = () => {
    switch (searchType) {
      case "code":
        return "商品コードで検索..."
      case "name":
        return "商品名で検索..."
      case "drawing":
        return "図面番号で検索..."
      case "size":
        return "サイズで検索..."
      case "all":
      default:
        return "すべての項目で検索..."
    }
  }

  const addItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1
    setItems([
      ...items,
      {
        id: newId,
        categoryCode: "",
        productCode: "",
        productName: "",
        drawingNumber: "",
        size: "",
        unit: "個",
        unitPrice: "",
        quantity: "",
        notes: "",
      },
    ])
  }

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id))
    }
  }

  const updateItem = (id, field, value) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!customerInfo) {
      toast({
        title: "エラー",
        description: "得意先情報を入力してください",
        variant: "destructive",
      })
      return
    }

    // 必須項目のバリデーション
    const requiredFieldsMissing = items.some((item) => !item.productName || !item.quantity)

    if (requiredFieldsMissing) {
      toast({
        title: "エラー",
        description: "商品名と数量は必須項目です",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const quoteRequestData = {
        customerCode: customerInfo.code,
        requestDate,
        dueDate: dueDate || null,
        notes,
      }

      const result = await createQuoteRequest(quoteRequestData, items)

      toast({
        title: "成功",
        description: "見積依頼を登録しました",
      })

      // 送信後は見積依頼一覧に戻る
      router.push("/quote-requests")
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "エラー",
        description: error.message || "見積依頼の登録に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 商品検索ポップオーバーを開く
  const openProductSearch = (itemId) => {
    setCurrentItemId(itemId)
    setProductSearchTerm("")
    setFilteredProducts([])
  }

  // 商品を選択して適用
  const selectProduct = (product) => {
    if (currentItemId) {
      setItems(
        items.map((item) =>
          item.id === currentItemId
            ? {
                ...item,
                productCode: product.code,
                categoryCode: product.category_code,
                productName: product.name,
                drawingNumber: product.drawing_number,
                size: product.size,
                unit: product.unit,
                unitPrice: product.standard_price?.toString() || "",
              }
            : item,
        ),
      )
      setProductSearchTerm("")
      setCurrentItemId(null)
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">読み込み中...</div>
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">新規見積依頼登録</h1>
        <Link href="/quote-requests">
          <Button variant="outline">キャンセル</Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>得意先情報</CardTitle>
              <CardDescription>得意先コードを入力して得意先情報を取得してください。</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="customerCode">得意先コード</Label>
                  <div className="flex gap-2">
                    <Input
                      id="customerCode"
                      value={customerCode}
                      onChange={(e) => setCustomerCode(e.target.value)}
                      placeholder="得意先コード"
                    />
                    <Popover open={showCustomerSearch} onOpenChange={setShowCustomerSearch}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" type="button">
                          <Search className="h-4 w-4 mr-1" />
                          検索
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-0" align="start">
                        <div className="p-2 border-b">
                          <Input
                            placeholder="得意先を検索..."
                            value={customerSearchTerm}
                            onChange={(e) => setCustomerSearchTerm(e.target.value)}
                          />
                        </div>
                        <div className="max-h-[300px] overflow-auto">
                          {filteredCustomers.length > 0 ? (
                            filteredCustomers.map((customer) => (
                              <div
                                key={customer.code}
                                className="p-2 hover:bg-muted cursor-pointer border-b"
                                onClick={() => {
                                  setCustomerCode(customer.code)
                                  setShowCustomerSearch(false)
                                }}
                              >
                                <div className="font-medium">{customer.name}</div>
                                <div className="text-sm text-muted-foreground">{customer.code}</div>
                              </div>
                            ))
                          ) : (
                            <div className="p-3 text-center text-muted-foreground">検索結果がありません</div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              {customerInfo && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="customerName">得意先名</Label>
                    <Input id="customerName" value={customerInfo.name} disabled />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="contact">担当者</Label>
                    <Input id="contact" value={customerInfo.contact} disabled />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="contactEmail">メールアドレス</Label>
                    <Input id="contactEmail" value={customerInfo.contact_email} disabled />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="contactPhone">電話番号</Label>
                    <Input id="contactPhone" value={customerInfo.contact_phone} disabled />
                  </div>
                  <div className="grid gap-2 md:col-span-2">
                    <Label htmlFor="address">住所</Label>
                    <Input id="address" value={customerInfo.address} disabled />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="requestDate">依頼日</Label>
                  <Input
                    id="requestDate"
                    type="date"
                    value={requestDate}
                    onChange={(e) => setRequestDate(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dueDate">納期</Label>
                  <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="requestNumber">依頼番号</Label>
                  <Input id="requestNumber" placeholder="自動採番" disabled />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">備考</Label>
                <Textarea
                  id="notes"
                  placeholder="備考があれば入力してください"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>明細情報</CardTitle>
              <CardDescription>
                見積依頼の明細情報を入力してください。商品コードを入力すると商品情報が自動入力されます。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">分類</TableHead>
                      <TableHead className="w-[120px]">商品コード</TableHead>
                      <TableHead className="w-[200px]">商品名</TableHead>
                      <TableHead className="w-[120px]">図面番号</TableHead>
                      <TableHead className="w-[120px]">サイズ</TableHead>
                      <TableHead className="w-[80px]">単位</TableHead>
                      <TableHead className="w-[100px]">単価</TableHead>
                      <TableHead className="w-[80px]">数量</TableHead>
                      <TableHead>備考</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Select
                            value={item.categoryCode}
                            onValueChange={(value) => updateItem(item.id, "categoryCode", value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="分類" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.code} value={category.code}>
                                  {category.code}: {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Input
                              value={item.productCode}
                              onChange={(e) => {
                                updateItem(item.id, "productCode", e.target.value)
                                if (e.target.value.length >= 4) {
                                  handleProductCodeChange(item.id, e.target.value)
                                }
                              }}
                              placeholder="商品コード"
                            />
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  type="button"
                                  className="h-9 w-9 p-0"
                                  onClick={() => openProductSearch(item.id)}
                                >
                                  <Search className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-96 p-0" align="start">
                                <div className="p-3 border-b">
                                  <Tabs
                                    defaultValue="all"
                                    value={searchType}
                                    onValueChange={setSearchType}
                                    className="w-full"
                                  >
                                    <TabsList className="grid grid-cols-5 mb-2">
                                      <TabsTrigger value="all">すべて</TabsTrigger>
                                      <TabsTrigger value="code">コード</TabsTrigger>
                                      <TabsTrigger value="name">商品名</TabsTrigger>
                                      <TabsTrigger value="drawing">図面番号</TabsTrigger>
                                      <TabsTrigger value="size">サイズ</TabsTrigger>
                                    </TabsList>
                                    <Input
                                      placeholder={getSearchPlaceholder()}
                                      value={productSearchTerm}
                                      onChange={(e) => setProductSearchTerm(e.target.value)}
                                    />
                                  </Tabs>
                                </div>
                                <div className="max-h-[300px] overflow-auto">
                                  {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => (
                                      <div
                                        key={product.code}
                                        className="p-2 hover:bg-muted cursor-pointer border-b"
                                        onClick={() => selectProduct(product)}
                                      >
                                        <div className="font-medium">
                                          {product.code}: {product.name}
                                        </div>
                                        <div className="flex gap-2 text-sm text-muted-foreground">
                                          <span>図面: {product.drawing_number}</span>
                                          <span>サイズ: {product.size}</span>
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="p-3 text-center text-muted-foreground">検索結果がありません</div>
                                  )}
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.productName}
                            onChange={(e) => updateItem(item.id, "productName", e.target.value)}
                            placeholder="商品名"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.drawingNumber}
                            onChange={(e) => updateItem(item.id, "drawingNumber", e.target.value)}
                            placeholder="図面番号"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.size}
                            onChange={(e) => updateItem(item.id, "size", e.target.value)}
                            placeholder="サイズ"
                          />
                        </TableCell>
                        <TableCell>
                          <Select value={item.unit} onValueChange={(value) => updateItem(item.id, "unit", value)}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="単位" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="個">個</SelectItem>
                              <SelectItem value="枚">枚</SelectItem>
                              <SelectItem value="セット">セット</SelectItem>
                              <SelectItem value="m">m</SelectItem>
                              <SelectItem value="kg">kg</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.unitPrice}
                            onChange={(e) => updateItem(item.id, "unitPrice", e.target.value)}
                            placeholder="単価"
                            type="number"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                            placeholder="数量"
                            type="number"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.notes}
                            onChange={(e) => updateItem(item.id, "notes", e.target.value)}
                            placeholder="備考"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            disabled={items.length <= 1}
                            type="button"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Button type="button" variant="outline" size="sm" className="mt-4" onClick={addItem}>
                <Plus className="mr-2 h-4 w-4" />
                明細を追加
              </Button>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.push("/quote-requests")}>
                キャンセル
              </Button>
              <Button type="submit" disabled={!customerInfo || isSubmitting}>
                {isSubmitting ? "登録中..." : "登録して次へ"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  )
}
