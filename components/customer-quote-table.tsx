"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpDown, ChevronDown, MoreHorizontal, FileText, Mail } from "lucide-react"

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

// Sample data - would come from database in real app
const data = [
  {
    id: "QUO-001",
    customer: "株式会社山田製作所",
    requestId: "REQ-001",
    createdDate: "2023-04-05",
    validUntil: "2023-05-05",
    itemCount: 5,
    totalAmount: 125000,
    status: "作成済み",
  },
  {
    id: "QUO-002",
    customer: "鈴木工業株式会社",
    requestId: "REQ-002",
    createdDate: "2023-04-08",
    validUntil: "2023-05-08",
    itemCount: 3,
    totalAmount: 78000,
    status: "送信済み",
  },
  {
    id: "QUO-003",
    customer: "佐藤産業",
    requestId: "REQ-003",
    createdDate: "2023-04-10",
    validUntil: "2023-05-10",
    itemCount: 8,
    totalAmount: 230000,
    status: "承認済み",
  },
  {
    id: "QUO-004",
    customer: "田中エンジニアリング",
    requestId: "REQ-004",
    createdDate: "2023-04-12",
    validUntil: "2023-05-12",
    itemCount: 2,
    totalAmount: 45000,
    status: "却下",
  },
]

export function CustomerQuoteTable() {
  const [sorting, setSorting] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})

  const getStatusBadge = (status) => {
    switch (status) {
      case "作成済み":
        return <Badge variant="outline">{status}</Badge>
      case "送信済み":
        return <Badge variant="secondary">{status}</Badge>
      case "承認済み":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
            {status}
          </Badge>
        )
      case "却下":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">
            {status}
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" }).format(amount)
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4 justify-end">
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
              見積番号
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={true} onCheckedChange={() => {}}>
              得意先
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={true} onCheckedChange={() => {}}>
              依頼番号
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={true} onCheckedChange={() => {}}>
              作成日
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={true} onCheckedChange={() => {}}>
              有効期限
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={true} onCheckedChange={() => {}}>
              明細数
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={true} onCheckedChange={() => {}}>
              合計金額
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
                  <span>見積番号</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center space-x-2">
                  <span>得意先</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>依頼番号</TableHead>
              <TableHead>
                <div className="flex items-center space-x-2">
                  <span>作成日</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center space-x-2">
                  <span>有効期限</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="text-center">明細数</TableHead>
              <TableHead className="text-right">合計金額</TableHead>
              <TableHead>ステータス</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.id}</TableCell>
                <TableCell>{row.customer}</TableCell>
                <TableCell>{row.requestId}</TableCell>
                <TableCell>{row.createdDate}</TableCell>
                <TableCell>{row.validUntil}</TableCell>
                <TableCell className="text-center">{row.itemCount}</TableCell>
                <TableCell className="text-right">{formatCurrency(row.totalAmount)}</TableCell>
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
                        <Link href={`/customer-quotes/${row.id}`} className="flex items-center">
                          詳細を表示
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href={`/customer-quotes/${row.id}/pdf`} className="flex items-center">
                          <FileText className="mr-2 h-4 w-4" />
                          PDFを表示
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href={`/customer-quotes/${row.id}/send`} className="flex items-center">
                          <Mail className="mr-2 h-4 w-4" />
                          メール送信
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>削除</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
