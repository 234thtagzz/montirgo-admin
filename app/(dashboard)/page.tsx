import { Suspense } from "react"
import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CircleDollarSign,
  ClipboardCheck,
  ReceiptText,
  TrendingUp,
  Users,
  Wifi,
} from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { requireAdmin } from "@/lib/auth"
import { formatDate, formatIDR } from "@/lib/format"
import { getDashboardStats } from "@/lib/queries/dashboard"

export const metadata = {
  title: "Dashboard",
}

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Ringkasan operasional MontirGo. Data diperbarui langsung dari Supabase."
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/transaksi">
              <ReceiptText />
              Lihat transaksi
            </Link>
          </Button>
        }
      />

      <Suspense fallback={<StatsSkeleton />}>
        <StatsSection />
      </Suspense>

      <QuickActions />
    </>
  )
}

async function StatsSection() {
  await requireAdmin()
  const stats = await getDashboardStats()

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Diperbarui {formatDate(new Date().toISOString())} · WIB
      </p>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Pendapatan"
          value={formatIDR(stats.totalRevenue)}
          hint={`${formatIDR(stats.todayRevenue)} masuk hari ini`}
          icon={CircleDollarSign}
          tone="emerald"
        />
        <StatCard
          title="Montir Aktif"
          value={stats.activeMechanics.toLocaleString("id-ID")}
          hint={
            stats.onlineMechanics > 0
              ? `${stats.onlineMechanics} sedang online`
              : "Belum ada montir online"
          }
          icon={Users}
          tone="sky"
          badge={
            stats.onlineMechanics > 0 ? (
              <Badge variant="secondary" className="gap-1 text-[10px]">
                <Wifi className="size-2.5" />
                Live
              </Badge>
            ) : null
          }
        />
        <StatCard
          title="Transaksi Hari Ini"
          value={stats.todayTransactions.toLocaleString("id-ID")}
          hint="Order dibuat sejak 00.00 WIB"
          icon={TrendingUp}
          tone="violet"
        />
        <StatCard
          title="Menunggu Verifikasi"
          value={stats.pendingMechanics.toLocaleString("id-ID")}
          hint={
            stats.pendingMechanics > 0
              ? "Perlu ditinjau oleh admin"
              : "Semua montir sudah ditinjau"
          }
          icon={ClipboardCheck}
          tone={stats.pendingMechanics > 0 ? "amber" : "emerald"}
          href={stats.pendingMechanics > 0 ? "/montir?status=pending" : undefined}
        />
      </div>

      {stats.pendingMechanics > 0 ? (
        <PendingVerificationBanner count={stats.pendingMechanics} />
      ) : null}
    </div>
  )
}

function PendingVerificationBanner({ count }: { count: number }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-amber-500/25 bg-amber-500/5 p-4 sm:flex-row sm:items-center">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-400">
        <BadgeCheck className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">
          {count} montir menunggu verifikasi
        </p>
        <p className="text-xs text-muted-foreground">
          Tinjau kelengkapan profil sebelum montir dapat menerima order.
        </p>
      </div>
      <Button asChild size="sm" variant="outline">
        <Link href="/montir?status=pending">
          Tinjau sekarang
          <ArrowRight />
        </Link>
      </Button>
    </div>
  )
}

const tones = {
  emerald: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  sky: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
  violet: "bg-violet-500/10 text-violet-700 dark:text-violet-400",
  amber: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
} as const

function StatCard({
  title,
  value,
  hint,
  icon: Icon,
  tone,
  badge,
  href,
}: {
  title: string
  value: string
  hint: string
  icon: React.ComponentType<{ className?: string }>
  tone: keyof typeof tones
  badge?: React.ReactNode
  href?: string
}) {
  const content = (
    <Card className="h-full transition-colors hover:border-foreground/20">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="space-y-1">
          <CardDescription className="text-xs font-medium tracking-wide uppercase">
            {title}
          </CardDescription>
          <div className="flex items-baseline gap-2">
            <CardTitle className="text-2xl font-semibold tracking-tight tabular-nums">
              {value}
            </CardTitle>
            {badge}
          </div>
        </div>
        <div className={`flex size-9 items-center justify-center rounded-lg ${tones[tone]}`}>
          <Icon className="size-4" />
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">{hint}</p>
        {href ? <ArrowUpRight className="size-3.5 text-muted-foreground" /> : null}
      </CardContent>
    </Card>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }
  return content
}

function StatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-28" />
            </div>
            <Skeleton className="size-9 rounded-lg" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function QuickActions() {
  const actions = [
    {
      href: "/montir",
      title: "Manajemen montir",
      description: "Verifikasi montir baru dan pantau status online.",
      icon: Users,
    },
    {
      href: "/transaksi",
      title: "Pemantauan transaksi",
      description: "Buka invoice terperinci dan cek kewajaran harga.",
      icon: ReceiptText,
    },
  ]

  return (
    <section className="grid gap-4 md:grid-cols-2">
      {actions.map((action) => (
        <Link key={action.href} href={action.href} className="group">
          <Card className="h-full transition-colors group-hover:border-foreground/20">
            <CardContent className="flex items-start gap-4 p-5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <action.icon className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{action.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {action.description}
                </p>
              </div>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </CardContent>
          </Card>
        </Link>
      ))}
    </section>
  )
}
