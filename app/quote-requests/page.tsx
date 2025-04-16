"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowUpDown,
  Calendar,
  FileText,
  User,
  Clock,
  Tag,
  Info,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Search,
  Building,
  ChevronDown,
  ChevronRight,
  Truck,
  X,
  Upload,
  Mail,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// サンプルデータ - 実際のアプリではデータベースから取得
const quoteRequests = [
  {
    id: "REQ-001",
    customer: "株式会社山田製作所",
    contact: "山田太郎",
    contactEmail: "yamada@example.com",
    contactPhone: "03-1234-5678",
    requestDate: "2023-04-01",
    dueDate: "2023-04-10",
    deliveryDate: "2023-04-20",
    status: "新規",
    notes: "至急対応お願いします。サンプル品が必要です。",
    items: [
      {
        id: 1,
        categoryCode: "A",
        productCode: "A001",
        productName: "高密度ポリエチレンシート",
        drawingNumber: "DRW-001",
        size: "300x400x2mm",
        unit: "枚",
        unitPrice: "",
        quantity: "100",
        notes: "耐熱性必要",
        suppliers: [],
      },
      {
        id: 2,
        categoryCode: "A",
        productCode: "A002",
        productName: "ABS樹脂板",
        drawingNumber: "DRW-002",
        size: "500x600x3mm",
        unit: "枚",
        unitPrice: "",
        quantity: "50",
        notes: "黒色",
        suppliers: [],
      },
    ],
  },
  {
    id: "REQ-002",
    customer: "鈴木工業株式会社",
    contact: "鈴木一郎",
    contactEmail: "suzuki@example.com",
    contactPhone: "06-2345-6789",
    requestDate: "2023-04-02",
    dueDate: "2023-04-12",
    deliveryDate: "2023-04-25",
    status: "仕入先依頼中",
    notes: "既存品と同じ仕様でお願いします。",
    items: [
      {
        id: 1,
        categoryCode: "B",
        productCode: "B001",
        productName: "ウレタンスポンジ",
        drawingNumber: "DRW-003",
        size: "200x300x10mm",
        unit: "個",
        unitPrice: "",
        quantity: "200",
        notes: "難燃性",
        suppliers: [{ id: "SUP-002", name: "大阪スポンジ株式会社" }],
      },
      {
        id: 2,
        categoryCode: "B",
        productCode: "B002",
        productName: "EVAスポンジ",
        drawingNumber: "DRW-004",
        size: "100x100x5mm",
        unit: "個",
        unitPrice: "",
        quantity: "300",
        notes: "白色",
        suppliers: [{ id: "SUP-002", name: "大阪スポンジ株式会社" }],
      },
      {
        id: 3,
        categoryCode: "C",
        productCode: "C001",
        productName: "シリコンゴムシート",
        drawingNumber: "DRW-005",
        size: "400x400x1mm",
        unit: "枚",
        unitPrice: "",
        quantity: "80",
        notes: "透明",
        suppliers: [{ id: "SUP-003", name: "名古屋プラスチック" }],
      },
    ],
    supplierQuotes: [
      {
        id: "SQ-001",
        supplierId: "SUP-002",
        supplierName: "大阪スポンジ株式会社",
        sentDate: "2023-04-03",
        dueDate: "2023-04-08",
        status: "回答待ち",
        items: [1, 2], // 明細IDの参照
      },
      {
        id: "SQ-002",
        supplierId: "SUP-003",
        supplierName: "名古屋プラスチック",
        sentDate: "2023-04-03",
        dueDate: "2023-04-08",
        status: "回答済み",
        responseDate: "2023-04-07",
        items: [3], // 明細IDの参照
      },
    ],
  },
  {
    id: "REQ-003",
    customer: "佐藤産業",
    contact: "佐藤花子",
    contactEmail: "sato@example.com",
    contactPhone: "052-3456-7890",
    requestDate: "2023-04-03",
    dueDate: "2023-04-15",
    deliveryDate: "2023-04-30",
    status: "仕入先回答待ち",
    notes: "図面通りの加工をお願いします。",
    items: [
      {
        id: 1,
        categoryCode: "D",
        productCode: "D001",
        productName: "PVCフィルム",
        drawingNumber: "DRW-006",
        size: "1000x1000x0.5mm",
        unit: "m",
        unitPrice: "",
        quantity: "50",
        notes: "透明、粘着なし",
        suppliers: [{ id: "SUP-004", name: "福岡素材工業" }],
      },
      {
        id: 2,
        categoryCode: "D",
        productCode: "D002",
        productName: "PETフィルム",
        drawingNumber: "DRW-007",
        size: "500x500x0.3mm",
        unit: "m",
        unitPrice: "",
        quantity: "100",
        notes: "マット仕上げ",
        suppliers: [{ id: "SUP-004", name: "福岡素材工業" }],
      },
    ],
    supplierQuotes: [
      {
        id: "SQ-003",
        supplierId: "SUP-004",
        supplierName: "福岡素材工業",
        sentDate: "2023-04-04",
        dueDate: "2023-04-10",
        status: "回答待ち",
        items: [1, 2], // 明細IDの参照
      },
    ],
  },
  {
    id: "REQ-004",
    customer: "田中エンジニアリング",
    contact: "田中次郎",
    contactEmail: "tanaka@example.com",
    contactPhone: "011-4567-8901",
    requestDate: "2023-04-05",
    dueDate: "2023-04-20",
    deliveryDate: "2023-05-05",
    status: "見積作成中",
    notes: "試作品の製作をお願いします。",
    items: [
      {
        id: 1,
        categoryCode: "E",
        productCode: "E001",
        productName: "アクリル板",
        drawingNumber: "DRW-008",
        size: "300x300x5mm",
        unit: "枚",
        unitPrice: "",
        quantity: "10",
        notes: "透明、レーザーカット",
        suppliers: [{ id: "SUP-001", name: "東京樹脂工業" }],
      },
      {
        id: 2,
        categoryCode: "E",
        productCode: "E002",
        productName: "ポリカーボネート板",
        drawingNumber: "DRW-009",
        size: "400x400x3mm",
        unit: "枚",
        unitPrice: "",
        quantity: "15",
        notes: "透明、耐衝撃",
        suppliers: [{ id: "SUP-001", name: "東京樹脂工業" }],
      },
    ],
    supplierQuotes: [
      {
        id: "SQ-004",
        supplierId: "SUP-001",
        supplierName: "東京樹脂工業",
        sentDate: "2023-04-06",
        dueDate: "2023-04-12",
        status: "回答済み",
        responseDate: "2023-04-11",
        items: [1, 2], // 明細IDの参照
      },
    ],
  },
  {
    id: "REQ-005",
    customer: "伊藤商事株式会社",
    contact: "伊藤三郎",
    contactEmail: "ito@example.com",
    contactPhone: "092-5678-9012",
    requestDate: "2023-04-08",
    dueDate: "2023-04-18",
    deliveryDate: "2023-05-01",
    status: "完了",
    notes: "納期厳守でお願いします。",
    items: [
      {
        id: 1,
        categoryCode: "F",
        productCode: "F001",
        productName: "ゴムシート",
        drawingNumber: "DRW-010",
        size: "500x500x2mm",
        unit: "枚",
        unitPrice: "",
        quantity: "30",
        notes: "黒色、耐油性",
        suppliers: [{ id: "SUP-005", name: "札幌加工センター" }],
      },
      {
        id: 2,
        categoryCode: "F",
        productCode: "F002",
        productName: "NBRゴム",
        drawingNumber: "DRW-011",
        size: "300x300x3mm",
        unit: "枚",
        unitPrice: "",
        quantity: "40",
        notes: "耐熱性",
        suppliers: [{ id: "SUP-005", name: "札幌加工センター" }],
      },
      {
        id: 3,
        categoryCode: "G",
        productCode: "G001",
        productName: "シリコンチューブ",
        drawingNumber: "DRW-012",
        size: "φ10x2mm",
        unit: "m",
        unitPrice: "",
        quantity: "100",
        notes: "透明、医療用",
        suppliers: [{ id: "SUP-003", name: "名古屋プラスチック" }],
      },
      {
        id: 4,
        categoryCode: "G",
        productCode: "G002",
        productName: "フッ素チューブ",
        drawingNumber: "DRW-013",
        size: "φ8x1mm",
        unit: "m",
        unitPrice: "",
        quantity: "150",
        notes: "耐薬品性",
        suppliers: [{ id: "SUP-003", name: "名古屋プラスチック" }],
      },
    ],
    supplierQuotes: [
      {
        id: "SQ-005",
        supplierId: "SUP-005",
        supplierName: "札幌加工センター",
        sentDate: "2023-04-09",
        dueDate: "2023-04-15",
        status: "回答済み",
        responseDate: "2023-04-14",
        items: [1, 2], // 明細IDの参照
      },
      {
        id: "SQ-006",
        supplierId: "SUP-003",
        supplierName: "名古屋プラスチック",
        sentDate: "2023-04-09",
        dueDate: "2023-04-15",
        status: "回答済み",
        responseDate: "2023-04-13",
        items: [3, 4], // 明細IDの参照
      },
    ],
  },
]

// 仕入先データ
const suppliers = [
  { id: "SUP-001", name: "東京樹脂工業" },
  { id: "SUP-002", name: "大阪スポンジ株式会社" },
  { id: "SUP-003", name: "名古屋プラスチック" },
  { id: "SUP-004", name: "福岡素材工業" },
  { id: "SUP-005", name: "札幌加工センター" },
]

export default function QuoteRequestsPage() {
  const router = useRouter()
  const [selectedRequestId, setSelectedRequestId] = useState(quoteRequests[0].id)
  const [selectedItems, setSelectedItems] = useState([])
  const [showBulkSupplierUI, setShowBulkSupplierUI] = useState(false)
  const [bulkSelectedSupplier, setBulkSelectedSupplier] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [expandedItemId, setExpandedItemId] = useState(null)
  const [expandedSupplierId, setExpandedSupplierId] = useState(null)
  const [selectedSupplier, setSelectedSupplier] = useState("")
  const [activeTab, setActiveTab] = useState("details")

  // ディープコピーを作成して状態を管理
  const [requests, setRequests] = useState(JSON.parse(JSON.stringify(quoteRequests)))

  const selectedRequest = requests.find((req) => req.id === selectedRequestId)

  const filteredRequests = requests.filter(
    (req) =>
      req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // 選択された見積依頼に関連する仕入先を取得
  const getRelatedSuppliers = () => {
    if (!selectedRequest) return []

    // 明細に紐づく仕入先を取得
    const supplierIds = new Set()
    selectedRequest.items.forEach((item) => {
      item.suppliers.forEach((supplier) => {
        supplierIds.add(supplier.id)
      })
    })

    // 仕入先見積依頼がある場合はそれも含める
    if (selectedRequest.supplierQuotes) {
      selectedRequest.supplierQuotes.forEach((quote) => {
        supplierIds.add(quote.supplierId)
      })
    }

    // 仕入先情報を取得
    return Array.from(supplierIds).map((id) => {
      const supplier = suppliers.find((s) => s.id === id)
      const supplierQuote = selectedRequest.supplierQuotes?.find((q) => q.supplierId === id)

      return {
        ...supplier,
        quote: supplierQuote,
        // 仕入先に紐づく明細を取得
        items: selectedRequest.items.filter((item) => item.suppliers.some((s) => s.id === id)),
      }
    })
  }

  const relatedSuppliers = getRelatedSuppliers()

  const getStatusBadge = (status) => {
    switch (status) {
      case "新規":
        return <Badge variant="default">{status}</Badge>
      case "仕入先依頼中":
        return <Badge variant="secondary">{status}</Badge>
      case "仕入先回答待ち":
        return <Badge variant="outline">{status}</Badge>
      case "見積作成中":
        return (
          <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            {status}
          </Badge>
        )
      case "完了":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
            {status}
          </Badge>
        )
      case "回答待ち":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-800 hover:bg-blue-50">
            {status}
          </Badge>
        )
      case "回答済み":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
            {status}
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleNewRequest = () => {
    router.push("/quote-requests/new")
  }

  const handleEditRequest = () => {
    router.push(`/quote-requests/${selectedRequestId}/edit`)
  }

  const handleDeleteRequest = () => {
    // 実際のアプリではここでデータベースから削除する処理を実装
    console.log(`削除: ${selectedRequestId}`)
    setShowDeleteDialog(false)

    // 削除後、リストの最初の項目を選択
    if (filteredRequests.length > 1) {
      const nextRequest = filteredRequests.find((req) => req.id !== selectedRequestId)
      if (nextRequest) {
        setSelectedRequestId(nextRequest.id)
      }
    }
  }

  const toggleItemExpand = (itemId) => {
    setExpandedItemId(expandedItemId === itemId ? null : itemId)
    setSelectedSupplier("")
  }

  const toggleSupplierExpand = (supplierId) => {
    setExpandedSupplierId(expandedSupplierId === supplierId ? null : supplierId)
  }

  const addSupplier = (itemId) => {
    if (!selectedSupplier) return

    const updatedRequests = requests.map((req) => {
      if (req.id === selectedRequestId) {
        const updatedItems = req.items.map((item) => {
          if (item.id === itemId) {
            // 既に追加されている仕入先は追加しない
            if (!item.suppliers.some((s) => s.id === selectedSupplier)) {
              const supplier = suppliers.find((s) => s.id === selectedSupplier)
              return {
                ...item,
                suppliers: [...item.suppliers, supplier],
              }
            }
          }
          return item
        })
        return { ...req, items: updatedItems }
      }
      return req
    })

    setRequests(updatedRequests)
    setSelectedSupplier("")
  }

  const removeSupplier = (itemId, supplierId) => {
    const updatedRequests = requests.map((req) => {
      if (req.id === selectedRequestId) {
        const updatedItems = req.items.map((item) => {
          if (item.id === itemId) {
            return {
              ...item,
              suppliers: item.suppliers.filter((s) => s.id !== supplierId),
            }
          }
          return item
        })
        return { ...req, items: updatedItems }
      }
      return req
    })

    setRequests(updatedRequests)
  }

  const toggleItemSelection = (itemId, e) => {
    e.stopPropagation()
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId))
    } else {
      setSelectedItems([...selectedItems, itemId])
    }
  }

  const selectAllItems = (e) => {
    if (selectedItems.length === selectedRequest.items.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(selectedRequest.items.map((item) => item.id))
    }
  }

  const addBulkSupplier = () => {
    if (!bulkSelectedSupplier || selectedItems.length === 0) return

    const updatedRequests = requests.map((req) => {
      if (req.id === selectedRequestId) {
        const updatedItems = req.items.map((item) => {
          if (selectedItems.includes(item.id)) {
            // 既に追加されている仕入先は追加しない
            if (!item.suppliers.some((s) => s.id === bulkSelectedSupplier)) {
              const supplier = suppliers.find((s) => s.id === bulkSelectedSupplier)
              return {
                ...item,
                suppliers: [...item.suppliers, supplier],
              }
            }
          }
          return item
        })
        return { ...req, items: updatedItems }
      }
      return req
    })

    setRequests(updatedRequests)
    setBulkSelectedSupplier("")
    setShowBulkSupplierUI(false)
    setSelectedItems([])
  }

  const createSupplierQuote = (supplierId) => {
    // 実際のアプリではここで仕入先見積依頼を作成する処理を実装
    console.log(`仕入先見積依頼作成: ${supplierId}`)
  }

  const registerSupplierResponse = (quoteId) => {
    // 実際のアプリではここで仕入先見積回答を登録する処理を実装
    console.log(`仕入先見積回答登録: ${quoteId}`)
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] overflow-hidden">
      {/* 左側：見積依頼一覧 */}
      <div className="w-full md:w-1/3 lg:w-1/4 border-r overflow-hidden flex flex-col min-w-[300px]">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">見積依頼一覧</h2>
            <Button onClick={handleNewRequest} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              新規作成
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <div className="overflow-auto flex-1">
          <div className="divide-y">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className={`p-4 cursor-pointer hover:bg-muted transition-colors ${
                  selectedRequestId === request.id ? "bg-muted" : ""
                }`}
                onClick={() => setSelectedRequestId(request.id)}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium">{request.id}</span>
                  {getStatusBadge(request.status)}
                </div>
                <div className="text-sm text-muted-foreground mb-1 truncate">{request.customer}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span>{request.requestDate}</span>
                  <span className="mx-2">→</span>
                  <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span>{request.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 右側：見積依頼詳細 */}
      {selectedRequest && (
        <div className="w-full md:w-2/3 lg:w-3/4 overflow-auto flex flex-col">
          {/* ヘッダー部分 */}
          <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-background z-10">
            <div className="flex items-center">
              <h1 className="text-xl font-bold mr-2">{selectedRequest.id}</h1>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-1" />
                PDF
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>アクション</DropdownMenuLabel>
                  <DropdownMenuItem onClick={handleEditRequest}>
                    <Edit className="h-4 w-4 mr-2" />
                    編集
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    削除
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4">
            {/* 上段：見積依頼のプロパティ（カードデザイン） */}
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">見積依頼情報</CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{selectedRequest.id}</span>
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5">
                <div className="grid gap-6">
                  {/* 得意先情報 */}
                  <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                    <div className="flex items-center gap-2 min-w-[200px]">
                      <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div>
                        <div className="text-xs text-muted-foreground">得意先</div>
                        <div className="font-medium">{selectedRequest.customer}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div>
                        <div className="text-xs text-muted-foreground">担当者</div>
                        <div>{selectedRequest.contact}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div>
                        <div className="text-xs text-muted-foreground">連絡先</div>
                        <div className="text-sm">{selectedRequest.contactEmail}</div>
                        <div className="text-sm">{selectedRequest.contactPhone}</div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* 見積情報 */}
                  <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div>
                        <div className="text-xs text-muted-foreground">依頼日</div>
                        <div>{selectedRequest.requestDate}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div>
                        <div className="text-xs text-muted-foreground">納期</div>
                        <div>{selectedRequest.dueDate}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div>
                        <div className="text-xs text-muted-foreground">納品予定日</div>
                        <div>{selectedRequest.deliveryDate}</div>
                      </div>
                    </div>
                  </div>

                  {selectedRequest.notes && (
                    <>
                      <Separator />
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">備考</div>
                        <div className="text-sm bg-muted/50 p-3 rounded-md">{selectedRequest.notes}</div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* タブ切り替え */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList>
                <TabsTrigger value="details">明細情報</TabsTrigger>
                <TabsTrigger value="suppliers">仕入先見積依頼</TabsTrigger>
              </TabsList>

              {/* 明細情報タブ */}
              <TabsContent value="details">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">明細情報</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <div className="min-w-[800px]">
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[40px]">
                                  <Checkbox
                                    checked={
                                      selectedItems.length === selectedRequest.items.length &&
                                      selectedRequest.items.length > 0
                                    }
                                    onCheckedChange={selectAllItems}
                                    className="ml-1"
                                  />
                                </TableHead>
                                <TableHead className="w-[40px]"></TableHead>
                                <TableHead className="w-[80px]">
                                  <div className="flex items-center space-x-1">
                                    <span>分類</span>
                                    <ArrowUpDown className="h-3 w-3" />
                                  </div>
                                </TableHead>
                                <TableHead className="w-[100px]">商品コード</TableHead>
                                <TableHead className="w-[200px]">
                                  <div className="flex items-center space-x-1">
                                    <span>商品名</span>
                                    <ArrowUpDown className="h-3 w-3" />
                                  </div>
                                </TableHead>
                                <TableHead className="w-[120px]">図面番号</TableHead>
                                <TableHead className="w-[120px]">サイズ</TableHead>
                                <TableHead className="w-[80px]">単位</TableHead>
                                <TableHead className="w-[80px]">数量</TableHead>
                                <TableHead className="w-[150px]">仕入先</TableHead>
                                <TableHead className="w-[200px]">備考</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedRequest.items.map((item) => (
                                <>
                                  <TableRow
                                    key={item.id}
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => toggleItemExpand(item.id)}
                                  >
                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                      <Checkbox
                                        checked={selectedItems.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                          if (checked) {
                                            setSelectedItems([...selectedItems, item.id])
                                          } else {
                                            setSelectedItems(selectedItems.filter((id) => id !== item.id))
                                          }
                                        }}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      {expandedItemId === item.id ? (
                                        <ChevronDown className="h-4 w-4" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4" />
                                      )}
                                    </TableCell>
                                    <TableCell>{item.categoryCode}</TableCell>
                                    <TableCell>{item.productCode}</TableCell>
                                    <TableCell>{item.productName}</TableCell>
                                    <TableCell>{item.drawingNumber}</TableCell>
                                    <TableCell>{item.size}</TableCell>
                                    <TableCell>{item.unit}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>
                                      {item.suppliers.length > 0 ? (
                                        <Popover>
                                          <PopoverTrigger asChild>
                                            <Button variant="outline" size="sm" className="h-7">
                                              <Truck className="h-3.5 w-3.5 mr-1" />
                                              {item.suppliers.length}社
                                            </Button>
                                          </PopoverTrigger>
                                          <PopoverContent className="w-80 p-0" align="start">
                                            <div className="p-2 font-medium border-b">仕入先一覧</div>
                                            <ScrollArea className="h-[200px]">
                                              <div className="p-2 space-y-2">
                                                {item.suppliers.map((supplier) => (
                                                  <div
                                                    key={supplier.id}
                                                    className="flex items-center justify-between p-2 bg-muted/30 rounded-md"
                                                  >
                                                    <div className="flex items-center">
                                                      <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                                                      <span>{supplier.name}</span>
                                                    </div>
                                                    <Button
                                                      variant="ghost"
                                                      size="icon"
                                                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                                      onClick={(e) => {
                                                        e.stopPropagation()
                                                        removeSupplier(item.id, supplier.id)
                                                      }}
                                                    >
                                                      <X className="h-4 w-4" />
                                                    </Button>
                                                  </div>
                                                ))}
                                              </div>
                                            </ScrollArea>
                                          </PopoverContent>
                                        </Popover>
                                      ) : (
                                        <span className="text-muted-foreground text-sm">未設定</span>
                                      )}
                                    </TableCell>
                                    <TableCell>{item.notes}</TableCell>
                                  </TableRow>

                                  {/* 展開時の仕入先設定UI */}
                                  {expandedItemId === item.id && (
                                    <TableRow>
                                      <TableCell colSpan={11} className="bg-muted/30 p-4">
                                        <div className="space-y-4">
                                          <div className="text-sm font-medium">仕入先設定</div>

                                          {/* 仕入先追加UI */}
                                          <div className="flex items-center gap-2">
                                            <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                                              <SelectTrigger className="w-[250px]">
                                                <SelectValue placeholder="仕入先を選択" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {suppliers.map((supplier) => (
                                                  <SelectItem key={supplier.id} value={supplier.id}>
                                                    {supplier.name}
                                                  </SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                            <Button
                                              size="sm"
                                              onClick={() => addSupplier(item.id)}
                                              disabled={!selectedSupplier}
                                            >
                                              <Plus className="h-4 w-4 mr-1" />
                                              追加
                                            </Button>
                                          </div>

                                          {/* 選択済み仕入先リスト */}
                                          {item.suppliers.length > 0 ? (
                                            <div className="space-y-2">
                                              <div className="text-xs text-muted-foreground">選択済み仕入先</div>
                                              <div className="space-y-2">
                                                {item.suppliers.map((supplier) => (
                                                  <div
                                                    key={supplier.id}
                                                    className="flex items-center justify-between bg-background p-2 rounded-md"
                                                  >
                                                    <div className="flex items-center">
                                                      <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                                                      <span>{supplier.name}</span>
                                                    </div>
                                                    <Button
                                                      variant="ghost"
                                                      size="icon"
                                                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                                      onClick={(e) => {
                                                        e.stopPropagation()
                                                        removeSupplier(item.id, supplier.id)
                                                      }}
                                                    >
                                                      <X className="h-4 w-4" />
                                                    </Button>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="text-sm text-muted-foreground">
                                              仕入先が設定されていません
                                            </div>
                                          )}
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>
                    {selectedItems.length > 0 && (
                      <div className="mt-4 p-3 border rounded-md bg-muted/30 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{selectedItems.length}件の明細を選択中</span>
                          {!showBulkSupplierUI && (
                            <Button size="sm" variant="outline" onClick={() => setShowBulkSupplierUI(true)}>
                              <Truck className="h-4 w-4 mr-1" />
                              一括仕入先設定
                            </Button>
                          )}
                        </div>

                        {showBulkSupplierUI && (
                          <div className="flex items-center gap-2">
                            <Select value={bulkSelectedSupplier} onValueChange={setBulkSelectedSupplier}>
                              <SelectTrigger className="w-[250px]">
                                <SelectValue placeholder="仕入先を選択" />
                              </SelectTrigger>
                              <SelectContent>
                                {suppliers.map((supplier) => (
                                  <SelectItem key={supplier.id} value={supplier.id}>
                                    {supplier.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button size="sm" onClick={addBulkSupplier} disabled={!bulkSelectedSupplier}>
                              <Plus className="h-4 w-4 mr-1" />
                              追加
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setShowBulkSupplierUI(false)
                                setBulkSelectedSupplier("")
                              }}
                            >
                              キャンセル
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 仕入先見積依頼タブ */}
              <TabsContent value="suppliers">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">仕入先見積依頼</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {relatedSuppliers.length > 0 ? (
                      <div className="space-y-4">
                        {relatedSuppliers.map((supplier) => (
                          <div key={supplier.id} className="border rounded-md overflow-hidden">
                            <div
                              className="flex items-center justify-between p-3 bg-muted/30 cursor-pointer"
                              onClick={() => toggleSupplierExpand(supplier.id)}
                            >
                              <div className="flex items-center">
                                {expandedSupplierId === supplier.id ? (
                                  <ChevronDown className="h-4 w-4 mr-2" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 mr-2" />
                                )}
                                <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span className="font-medium">{supplier.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {supplier.quote ? (
                                  <>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                      <Calendar className="h-3.5 w-3.5" />
                                      <span>{supplier.quote.sentDate}</span>
                                    </div>
                                    <div>{getStatusBadge(supplier.quote.status)}</div>
                                    {supplier.quote.status === "回答待ち" ? (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => registerSupplierResponse(supplier.quote.id)}
                                      >
                                        <Upload className="h-4 w-4 mr-1" />
                                        回答登録
                                      </Button>
                                    ) : (
                                      <Button size="sm" variant="outline">
                                        <FileText className="h-4 w-4 mr-1" />
                                        詳細
                                      </Button>
                                    )}
                                  </>
                                ) : (
                                  <Button size="sm" onClick={() => createSupplierQuote(supplier.id)}>
                                    <Mail className="h-4 w-4 mr-1" />
                                    見積依頼作成
                                  </Button>
                                )}
                              </div>
                            </div>

                            {/* 展開時の明細表示 */}
                            {expandedSupplierId === supplier.id && (
                              <div className="p-3 border-t">
                                <div className="text-sm font-medium mb-2">紐づく明細</div>
                                <div className="rounded-md border">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead className="w-[80px]">分類</TableHead>
                                        <TableHead className="w-[100px]">商品コード</TableHead>
                                        <TableHead className="w-[200px]">商品名</TableHead>
                                        <TableHead className="w-[120px]">サイズ</TableHead>
                                        <TableHead className="w-[80px]">単位</TableHead>
                                        <TableHead className="w-[80px]">数量</TableHead>
                                        <TableHead>備考</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {supplier.items.map((item) => (
                                        <TableRow key={item.id}>
                                          <TableCell>{item.categoryCode}</TableCell>
                                          <TableCell>{item.productCode}</TableCell>
                                          <TableCell>{item.productName}</TableCell>
                                          <TableCell>{item.size}</TableCell>
                                          <TableCell>{item.unit}</TableCell>
                                          <TableCell>{item.quantity}</TableCell>
                                          <TableCell>{item.notes}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>

                                {supplier.quote && (
                                  <div className="mt-4">
                                    <div className="text-sm font-medium mb-2">見積依頼情報</div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-muted/20 rounded-md">
                                      <div>
                                        <div className="text-xs text-muted-foreground">依頼番号</div>
                                        <div className="text-sm">{supplier.quote.id}</div>
                                      </div>
                                      <div>
                                        <div className="text-xs text-muted-foreground">送信日</div>
                                        <div className="text-sm">{supplier.quote.sentDate}</div>
                                      </div>
                                      <div>
                                        <div className="text-xs text-muted-foreground">回答期限</div>
                                        <div className="text-sm">{supplier.quote.dueDate}</div>
                                      </div>
                                      <div>
                                        <div className="text-xs text-muted-foreground">ステータス</div>
                                        <div className="text-sm">{getStatusBadge(supplier.quote.status)}</div>
                                      </div>
                                      {supplier.quote.responseDate && (
                                        <div>
                                          <div className="text-xs text-muted-foreground">回答日</div>
                                          <div className="text-sm">{supplier.quote.responseDate}</div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        仕入先が設定されていません。明細情報タブで仕入先を設定してください。
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}

      {/* 削除確認ダイアログ */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>見積依頼の削除</AlertDialogTitle>
            <AlertDialogDescription>
              見積依頼「{selectedRequest?.id}」を削除してもよろしいですか？ この操作は元に戻せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRequest} className="bg-destructive text-destructive-foreground">
              削除する
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
