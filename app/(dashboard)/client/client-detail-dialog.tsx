// app/(dashboard)/client/client-detail-dialog.tsx
"use client"

import { useState } from "react"
import {
  CalendarDays,
  Eye,
  IdCard,
  Mail,
  Phone,
  ShoppingBag,
  Wallet,
} from "lucide-react"
import { cn } from "cn"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  formatDate,
  formatIDR,
  formatPhone,
  getInitials,
} from "@/lib/format"
import type { Client } from "@/lib/types"

export function ClientDetailDialog({ client }: { client: Client }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye />
          Detail
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <Avatar size="lg" className="size-12">
              {client.avatarUrl ? (
                <AvatarImage
                  src={client.avatarUrl}
                  alt={client.fullName}
                  className="size-12"
                />
              ) : null}
              <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                {getInitials(client.fullName)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1 space-y-1">
              <DialogTitle className="text-base">{client.fullName}</DialogTitle>
              <DialogDescription>
                Bergabung {formatDate(client.joinedAt)}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5">
          {/* Identitas & kontak */}
          <section className="space-y-2">
            <h3 className="text-sm font-medium">Identitas &amp; kontak</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoRow
                icon={IdCard}
                label="Nomor identitas (KTP)"
                value={client.identityNumber ?? "Belum diisi"}
                tone={client.identityNumber ? "default" : "warning"}
              />
              <InfoRow
                icon={Mail}
                label="Email"
                value={client.email ?? "—"}
              />
              <InfoRow
                icon={Phone}
                label="Telepon"
                value={formatPhone(client.phone)}
              />
              <InfoRow
                icon={CalendarDays}
                label="Bergabung"
                value={formatDate(client.joinedAt)}
              />
            </div>
          </section>

          {/* Statistik */}
          <section className="space-y-2">
            <h3 className="text-sm font-medium">Statistik</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoRow
                icon={ShoppingBag}
                label="Total order"
                value={
                  client.totalRequests > 0
                    ? `${client.totalRequests} order`
                    : "Belum ada order"
                }
              />
              <InfoRow
                icon={Wallet}
                label="Total pengeluaran"
                value={
                  client.totalSpent > 0
                    ? formatIDR(client.totalSpent)
                    : "Belum ada transaksi"
                }
              />
            </div>
          </section>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" size="sm">
              Tutup
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
  tone = "default",
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  tone?: "default" | "warning"
}) {
  return (
    <div className="rounded-lg border p-3">
      <p className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
        <Icon className="size-3" />
        {label}
      </p>
      <p
        className={cn(
          "mt-1 text-sm font-medium",
          tone === "warning" && "text-amber-700 dark:text-amber-400"
        )}
      >
        {value}
      </p>
    </div>
  )
}
