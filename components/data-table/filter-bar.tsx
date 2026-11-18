import { Search, X } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function FilterBar({
  basePath,
  query,
  status,
  statusOptions,
  placeholder = "Cari…",
  extra,
}: {
  basePath: string
  query: string
  status: string
  statusOptions: { value: string; label: string }[]
  placeholder?: string
  extra?: React.ReactNode
}) {
  const hasFilters = Boolean(query) || status !== "all"

  return (
    <form
      action={basePath}
      method="get"
      className="flex flex-col gap-2 rounded-xl border bg-card p-3 sm:flex-row sm:items-center"
    >
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          key={`q-${query}`}
          name="q"
          defaultValue={query}
          placeholder={placeholder}
          className="h-8 pl-8"
          autoComplete="off"
        />
      </div>

      <Select key={`status-${status}`} name="status" defaultValue={status}>
        <SelectTrigger className="h-8 w-full sm:w-44">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {extra}

      <Button type="submit" size="sm">
        Terapkan
      </Button>

      {hasFilters ? (
        <Button asChild variant="ghost" size="sm">
          <Link href={basePath}>
            <X />
            Reset
          </Link>
        </Button>
      ) : null}
    </form>
  )
}
