"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowUpDown, ChevronDown, MoreHorizontal, FileText, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

import { getQuoteRequests, deleteQuoteRequest } from "@/app/actions/quote-requests"

export function QuoteRequestTable() {
  const [quoteRequests, setQuoteRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [sorting, setSorting] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})

  useEffect(() => {
    const fetchQuoteRequests = async () => {
      try {
        setIsLoading(true)
        const data = await getQuoteRequests()
        setQuoteRequests(data)
      } catch (error) {
        console.error("Error fetching quote requests:", error)
        toast({
          title: "エラー",
          description: "見積依頼データの取得に失敗しました",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuoteRequests()
  }, [])

  const handleDelete = async (id) => {
    if (confirm("この見積依頼を削除してもよろしいですか？")) {
      try {
        await deleteQuoteRequest(id)
        setQuoteRequests(quoteRequests.filter((req) => req.id !== id))
        toast({
          title: "成功",
          description: "見積依頼を削除しました",
        })
      } catch (error) {
        console.error("Error deleting quote request:", error)
        toast({
          title: "エラー",
          description: error.message || "見積依頼の削除に失敗しました",
          variant: "destructive",
        })
      }
    }
  }

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
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading) {
    return <div className="flex justify-center p-4">読み込み中...</div>
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4 justify-between">
        <Link href="/quote-requests/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新規見積依頼
          </Button>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              表示項目 <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>表示する列を選択</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked={true} onCheckedChange={() => {}}>
              依頼番号
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={true} onCheckedChange={() => {}}>
              得意先
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={true} onCheckedChange={() => {}}>
              依頼日
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={true} onCheckedChange={() => {}}>
              納期
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={true} onCheckedChange={() => {}}>
              明細数
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={true} onCheckedChange={() => {}}>
              ステータス
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                <div className="flex items-center space-x-2">
                  <span>依頼番号</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center space-x-2">
                  <span>得意先</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center space-x-2">
                  <span>依頼日</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center space-x-2">
                  <span>納期</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="text-center">明細数</TableHead>
              <TableHead>ステータス</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quoteRequests.length > 0 ? (
              quoteRequests.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.request_number}</TableCell>
                  <TableCell>{row.customers?.name}</TableCell>
                  <TableCell>{new Date(row.request_date).toLocaleDateString("ja-JP")}</TableCell>
                  <TableCell>{row.due_date ? new Date(row.due_date).toLocaleDateString("ja-JP") : "-"}</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell>{getStatusBadge(row.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">メニューを開く</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>アクション</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Link href={`/quote-requests/${row.id}`} className="flex items-center">
                            詳細を表示
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link href={`/quote-requests/${row.id}/pdf`} className="flex items-center">
                            <FileText className="mr-2 h-4 w-4" />
                            PDFを表示
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(row.id)}>削除</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  見積依頼がありません
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
