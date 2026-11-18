import { ShieldAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { signOutAction } from "@/lib/actions/auth"

export const metadata = {
  title: "Akses ditolak",
}

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <ShieldAlert className="size-6" />
        </div>
        <h1 className="text-lg font-semibold">Akses admin diperlukan</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Akun ini berhasil masuk, tetapi belum terdaftar sebagai admin
          MontirGo. Minta pemilik platform untuk menambahkan email Anda ke
          allowlist admin atau mengubah role di tabel{" "}
          <code className="font-mono text-xs">profiles</code>.
        </p>
        <form action={signOutAction} className="mt-6">
          <Button type="submit" variant="outline" className="w-full">
            Keluar dan coba akun lain
          </Button>
        </form>
      </div>
    </main>
  )
}
