import Link from "next/link"
import { CheckCircle2, ExternalLink, KeyRound, Terminal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata = {
  title: "Setup",
}

const envVars = [
  {
    key: "NEXT_PUBLIC_SUPABASE_URL",
    description: "URL project Supabase (Settings → API).",
  },
  {
    key: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    description: "Anon/public key, dipakai untuk login Supabase Auth.",
  },
  {
    key: "SUPABASE_SERVICE_ROLE_KEY",
    description:
      "Service role key. HANYA disimpan di server, jangan pernah diberi prefix NEXT_PUBLIC_.",
  },
  {
    key: "ADMIN_EMAILS",
    description:
      "Opsional. Daftar email admin dipisah koma, untuk bootstrap admin pertama.",
  },
]

export default function SetupPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/30 p-4 sm:p-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Terminal className="size-5" />
          </div>
          <CardTitle>Konfigurasi MontirGo Admin</CardTitle>
          <CardDescription>
            Panel admin belum bisa terhubung ke Supabase. Lengkapi environment
            variable berikut di <code className="font-mono text-xs">.env.local</code>.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="overflow-hidden rounded-lg border">
            {envVars.map((item) => (
              <div
                key={item.key}
                className="flex flex-col gap-1 border-b p-3 last:border-b-0 sm:flex-row sm:items-start sm:gap-4"
              >
                <code className="shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] font-medium sm:w-64">
                  {item.key}
                </code>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2 rounded-lg border bg-muted/40 p-4">
            <p className="flex items-center gap-2 text-sm font-medium">
              <KeyRound className="size-4" />
              Bootstrap akun admin
            </p>
            <ol className="list-decimal space-y-1 pl-5 text-xs text-muted-foreground">
              <li>Buat user di Supabase Dashboard → Authentication → Users.</li>
              <li>
                Tambahkan emailnya ke <code className="font-mono">ADMIN_EMAILS</code>{" "}
                atau set kolom <code className="font-mono">profiles.role</code> ={" "}
                <code className="font-mono">&apos;admin&apos;</code>.
              </li>
              <li>Restart dev server lalu login memakai email tersebut.</li>
            </ol>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button asChild>
              <Link href="https://supabase.com/dashboard" target="_blank" rel="noreferrer">
                Buka Supabase Dashboard
                <ExternalLink />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/login">
                <CheckCircle2 />
                Sudah dikonfigurasi, coba login
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
