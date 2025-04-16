"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpDown, ChevronDown, MoreHorizontal, FileText, Upload } from "lucide-react"

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
    id: "SUP-001",
    supplier: "東京樹脂工業",
    requestId: "REQ-001",
    sentDate: "2023-04-02",
    dueDate: "2023-04-08",
    itemCount: 3,
    status: "回答待ち",
  },
  {
    id: "SUP-002",
    supplier: "大阪スポンジ株式会社",
    requestId: "REQ-001",
    sentDate: "2023-04-02",
    dueDate: "2023-04-08",
    itemCount: 2,
    status: "回答待ち",
  },
  {
    id: "SUP-003",
    supplier: "名古屋プラスチック",
    requestId: "REQ-002",
    sentDate: "2023-04-03",
    dueDate: "2023-04-10",
    itemCount: 3,
    status: "回答済み",
  },
  {
    id: "SUP-004",
    supplier: "福岡素材工業",
    requestId: "REQ-003",
    sentDate: "2023-04-04",
    dueDate: "2023-04-12",
    itemCount: 4,
    status: "回答済み",
  },
  {
    id: "SUP-005",
    supplier: "札幌加工センター",
    requestId: "REQ-003",
    sentDate: "2023-04-04",
    dueDate: "2023-04-12",
    itemCount: 4,
    status: "回答待ち",
  },
]

export function SupplierQuoteTable() {
  const [sorting, setSorting] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})

  const getStatusBadge = (status) => {
    switch (status) {
      case "回答待ち":
        return <Badge variant="outline">{status}</Badge>
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
              依頼番号
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={true} onCheckedChange={() => {}}>
              仕入先
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={true} onCheckedChange={() => {}}>
              得意先依頼番号
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={true} onCheckedChange={() => {}}>
              送信日
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={true} onCheckedChange={() => {}}>
              回答期限
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
                  <span>仕入先</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>得意先依頼番号</TableHead>
              <TableHead>
                <div className="flex items-center space-x-2">
                  <span>送信日</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center space-x-2">
                  <span>回答期限</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="text-center">明細数</TableHead>
              <TableHead>ステータス</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.id}</TableCell>
                <TableCell>{row.supplier}</TableCell>
                <TableCell>{row.requestId}</TableCell>
                <TableCell>{row.sentDate}</TableCell>
                <TableCell>{row.dueDate}</TableCell>
                <TableCell className="text-center">{row.itemCount}</TableCell>
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
                        <Link href={`/supplier-quotes/${row.id}`} className="flex items-center">
                          詳細を表示
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href={`/supplier-quotes/${row.id}/pdf`} className="flex items-center">
                          <FileText className="mr-2 h-4 w-4" />
                          PDFを表示
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href={`/supplier-quotes/${row.id}/response`} className="flex items-center">
                          <Upload className="mr-2 h-4 w-4" />
                          回答を登録
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
