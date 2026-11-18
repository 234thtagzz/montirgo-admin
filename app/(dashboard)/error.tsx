"use client"

import { AlertTriangle, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-[60svh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="size-6" />
        </div>
        <h1 className="text-lg font-semibold">Gagal memuat data</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Terjadi kesalahan saat mengambil data dari Supabase. Periksa koneksi
          dan konfigurasi environment, lalu coba lagi.
        </p>
        {error.digest ? (
          <p className="mt-2 font-mono text-[11px] text-muted-foreground">
            Digest: {error.digest}
          </p>
        ) : null}
        <Button onClick={reset} variant="outline" className="mt-6 w-full">
          <RotateCcw />
          Coba lagi
        </Button>
      </div>
    </div>
  )
}
