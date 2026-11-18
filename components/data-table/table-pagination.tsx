import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export function TablePagination({
  basePath,
  page,
  pageCount,
  total,
  pageSize,
  params,
}: {
  basePath: string
  page: number
  pageCount: number
  total: number
  pageSize: number
  params: Record<string, string>
}) {
  const firstRow = total === 0 ? 0 : (page - 1) * pageSize + 1
  const lastRow = Math.min(page * pageSize, total)

  const hrefFor = (targetPage: number) => {
    const search = new URLSearchParams(params)
    if (targetPage > 1) search.set("page", String(targetPage))
    else search.delete("page")
    const query = search.toString()
    return query ? `${basePath}?${query}` : basePath
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-muted-foreground">
        Menampilkan{" "}
        <span className="font-medium text-foreground">
          {firstRow}–{lastRow}
        </span>{" "}
        dari <span className="font-medium text-foreground">{total}</span> data
      </p>

      <div className="flex items-center gap-2">
        {page > 1 ? (
          <Button variant="outline" size="sm" asChild>
            <Link href={hrefFor(page - 1)} rel="prev">
              <ChevronLeft />
              Sebelumnya
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            <ChevronLeft />
            Sebelumnya
          </Button>
        )}

        <span className="min-w-16 text-center text-xs text-muted-foreground">
          {page} / {pageCount}
        </span>

        {page < pageCount ? (
          <Button variant="outline" size="sm" asChild>
            <Link href={hrefFor(page + 1)} rel="next">
              Berikutnya
              <ChevronRight />
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            Berikutnya
            <ChevronRight />
          </Button>
        )}
      </div>
    </div>
  )
}
