import { EmptyState } from "@/components/data-table/empty-state"
import { PageHeader } from "@/components/page-header"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Scale, ShieldCheck, Timer, UserRoundCheck } from "lucide-react"

export const metadata = {
  title: "Sengketa",
}

const steps = [
  {
    icon: UserRoundCheck,
    title: "Laporan diterima",
    description:
      "Client atau montir mengajukan sengketa lengkap dengan bukti chat, foto, dan invoice.",
  },
  {
    icon: Timer,
    title: "Mediasi 1×24 jam",
    description:
      "Tim operasional meninjau kronologi dan meminta klarifikasi dari kedua pihak.",
  },
  {
    icon: ShieldCheck,
    title: "Keputusan & tindak lanjut",
    description:
      "Refund, pembatalan, atau sanksi montir dicatat dan diteruskan ke tim keuangan.",
  },
]

export default function SengketaPage() {
  return (
    <>
      <PageHeader
        title="Sengketa"
        description="Pusat penanganan laporan client dan montir. Modul ini disiapkan untuk terhubung ke tabel disputes pada fase berikutnya."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {steps.map((step, index) => (
          <Card key={step.title}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <step.icon className="size-4" />
                </div>
                <span className="text-xs font-medium text-muted-foreground tabular-nums">
                  0{index + 1}
                </span>
              </div>
              <div className="space-y-1">
                <CardTitle className="text-sm">{step.title}</CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  {step.description}
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Belum ada sengketa terbuka</CardTitle>
          <CardDescription>
            Ketika tabel disputes tersedia, laporan akan tampil di sini lengkap
            dengan status, bukti, dan riwayat keputusan admin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Scale}
            title="Antrean sengketa kosong"
            description="Integrasi modul sengketa akan ditambahkan setelah skema disputes disepakati bersama tim produk."
          />
        </CardContent>
      </Card>
    </>
  )
}
