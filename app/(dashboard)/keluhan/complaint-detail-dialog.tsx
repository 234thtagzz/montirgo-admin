/* eslint-disable @next/next/no-img-element */
"use client"

import {
  Eye,
  MessageSquareWarning,
  Paperclip,
  ReceiptText,
  UserRound,
  Wrench,
} from "lucide-react"

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
import { Separator } from "@/components/ui/separator"
import { formatDateTime, formatPhone, formatShortId } from "@/lib/format"
import {
  getComplaintCategoryLabel,
  getComplaintStatusMeta,
  getReporterRoleMeta,
  getTransactionStatusMeta,
} from "@/lib/status"
import type { Complaint, TransactionStatus } from "@/lib/types"

export function ComplaintDetailDialog({ complaint }: { complaint: Complaint }) {
  const status = getComplaintStatusMeta(complaint.status)
  const role = getReporterRoleMeta(complaint.reporterRole)
  const orderStatus = getTransactionStatusMeta(
    complaint.orderStatus as TransactionStatus
  )
  const ReporterIcon = complaint.reporterRole === "mechanic" ? Wrench : UserRound

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye />
          Detail
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MessageSquareWarning className="size-4" />
            </div>
            <DialogTitle className="text-base">{complaint.subject}</DialogTitle>
            <Badge variant="secondary" className={status.className}>
              {status.label}
            </Badge>
          </div>
          <DialogDescription>
            {getComplaintCategoryLabel(complaint.category)} ·{" "}
            {formatShortId(complaint.id)} · Dibuat{" "}
            {formatDateTime(complaint.createdAt)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoBlock
              icon={ReporterIcon}
              label="Pelapor"
              value={complaint.reporterName}
              detail={`${role.label} · ${formatPhone(complaint.reporterPhone)}`}
            />
            <InfoBlock
              icon={ReceiptText}
              label="Transaksi"
              value={formatShortId(complaint.requestId)}
              detail={`Dibuat ${formatDateTime(complaint.orderCreatedAt)}`}
            />
          </div>

          <div className="grid gap-1 text-xs sm:grid-cols-2">
            <div>
              <p className="text-muted-foreground">Email pelapor</p>
              <p className="font-medium break-all">
                {complaint.reporterEmail ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Telepon pelapor</p>
              <p className="font-medium">
                {formatPhone(complaint.reporterPhone)}
              </p>
            </div>
          </div>

          <section className="space-y-2">
            <h3 className="text-sm font-medium">Deskripsi keluhan</h3>
            <p className="rounded-lg border bg-muted/30 p-3 text-sm whitespace-pre-wrap">
              {complaint.description}
            </p>
          </section>

          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-1.5 text-sm font-medium">
                <Paperclip className="size-3.5 text-muted-foreground" />
                Lampiran foto
              </h3>
              <Badge variant="outline">{complaint.photoUrls.length} foto</Badge>
            </div>

            {complaint.photoUrls.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {complaint.photoUrls.map((url, index) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
                  >
                    <img
                      src={url}
                      alt={`Lampiran ${index + 1}`}
                      className="size-full object-cover transition group-hover:scale-105"
                    />
                  </a>
                ))}
              </div>
            ) : (
              <p className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
                Pelapor tidak melampirkan foto.
              </p>
            )}
          </section>

          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Transaksi terkait</h3>
              <Badge variant="secondary" className={orderStatus.className}>
                {orderStatus.label}
              </Badge>
            </div>
            <p className="rounded-lg border p-3 text-sm">
              {complaint.orderIssue}
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-medium">Balasan admin</h3>
            {complaint.adminReply ? (
              <p className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm whitespace-pre-wrap">
                {complaint.adminReply}
              </p>
            ) : (
              <p className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
                Belum ada balasan admin.
              </p>
            )}
          </section>

          {complaint.resolvedAt ? (
            <div className="rounded-lg border bg-muted/30 p-3 text-xs">
              <p className="font-medium text-foreground">
                Diselesaikan {formatDateTime(complaint.resolvedAt)}
              </p>
              <p className="mt-0.5 text-muted-foreground">
                {complaint.resolvedByName
                  ? `Oleh ${complaint.resolvedByName}`
                  : "Oleh admin"}
              </p>
            </div>
          ) : null}

          <Separator />

          <div className="grid gap-2 text-xs sm:grid-cols-2">
            <div>
              <p className="text-muted-foreground">Dibuat</p>
              <p className="font-medium">{formatDateTime(complaint.createdAt)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Terakhir diperbarui</p>
              <p className="font-medium">{formatDateTime(complaint.updatedAt)}</p>
            </div>
          </div>
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

function InfoBlock({
  icon: Icon,
  label,
  value,
  detail,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  detail?: string
  className?: string
}) {
  return (
    <div className={`rounded-lg border p-3 ${className ?? ""}`}>
      <p className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
        <Icon className="size-3" />
        {label}
      </p>
      <p className="mt-1 text-sm font-medium">{value}</p>
      {detail ? (
        <p className="mt-0.5 text-xs text-muted-foreground">{detail}</p>
      ) : null}
    </div>
  )
}
