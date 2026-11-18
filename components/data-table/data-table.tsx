import type { ReactNode } from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "cn"

export type DataTableColumn<T> = {
  id: string
  header: ReactNode
  className?: string
  cell: (row: T) => ReactNode
}

export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  empty,
  label = "Tabel data",
}: {
  columns: DataTableColumn<T>[]
  rows: T[]
  getRowKey: (row: T) => string
  empty?: ReactNode
  label?: string
}) {
  if (rows.length === 0 && empty) {
    return <>{empty}</>
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table label={label}>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            {columns.map((column) => (
              <TableHead key={column.id} className={cn(column.className)}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={getRowKey(row)}>
              {columns.map((column) => (
                <TableCell key={column.id} className={cn(column.className)}>
                  {column.cell(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
