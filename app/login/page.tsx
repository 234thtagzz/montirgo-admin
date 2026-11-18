import {
  BarChart3,
  ReceiptText,
  ShieldCheck,
  Wrench,
} from "lucide-react"

import { LoginForm } from "@/app/login/login-form"

export const metadata = {
  title: "Masuk",
}

const highlights = [
  {
    icon: Wrench,
    title: "Verifikasi montir",
    description: "Tinjau dan aktifkan montir baru sebelum menerima order.",
  },
  {
    icon: ReceiptText,
    title: "Pantau transaksi",
    description: "Buka invoice terperinci untuk mengawasi kewajaran harga.",
  },
  {
    icon: BarChart3,
    title: "Ringkasan operasional",
    description: "Pendapatan, montir aktif, dan transaksi harian dalam satu layar.",
  },
]

export default function LoginPage() {
  return (
    <main className="grid min-h-svh lg:grid-cols-2">
      <section className="relative hidden flex-col justify-between overflow-hidden bg-zinc-950 p-10 text-white lg:flex">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.18),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.14),transparent_40%)]"
        />
        <div className="relative">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-orange-500 text-white">
              <Wrench className="size-4" />
            </div>
            <div>
              <p className="text-sm font-semibold">MontirGo</p>
              <p className="text-xs text-white/60">Admin Panel</p>
            </div>
          </div>
        </div>

        <div className="relative max-w-md space-y-8">
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight text-balance">
              Kendalikan operasi MontirGo dari satu dashboard.
            </h1>
            <p className="text-sm leading-relaxed text-white/60 text-pretty">
              Panel khusus tim operasional. Semua akses data menggunakan
              kredensial server dan dicatat untuk keamanan.
            </p>
          </div>

          <ul className="space-y-4">
            {highlights.map((item) => (
              <li key={item.title} className="flex gap-3">
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <item.icon className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-white/55">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/40">
          © MontirGo. Internal use only.
        </p>
      </section>

      <section className="flex items-center justify-center bg-muted/30 p-6 sm:p-10">
        <div className="w-full max-w-sm space-y-8">
          <div className="flex items-center gap-2.5 lg:hidden">
            <div className="flex size-9 items-center justify-center rounded-lg bg-orange-500 text-white">
              <Wrench className="size-4" />
            </div>
            <div>
              <p className="text-sm font-semibold">MontirGo</p>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="mb-4 flex size-10 items-center justify-center rounded-xl border bg-background shadow-sm">
              <ShieldCheck className="size-5 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold tracking-tight">
              Masuk ke panel admin
            </h2>
            <p className="text-sm text-muted-foreground">
              Gunakan akun Supabase Auth yang sudah diberi akses admin.
            </p>
          </div>

          <LoginForm />

          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            Dengan masuk, Anda menyetujui kebijakan akses internal MontirGo.
            Aktivitas administrasi dapat dicatat.
          </p>
        </div>
      </section>
    </main>
  )
}
