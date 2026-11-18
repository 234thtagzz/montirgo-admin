"use client"

import {
  AlertTriangle,
  CreditCard,
  Eye,
  MapPin,
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
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  HIGH_ITEM_PRICE,
  HIGH_TRANSACTION_TOTAL,
} from "@/lib/constants"
import {
  formatDateTime,
  formatIDR,
  formatPhone,
  formatShortId,
} from "@/lib/format"
import {
  getPaymentMethodLabel,
  getPaymentStatusLabel,
  getTransactionStatusMeta,
} from "@/lib/status"
import type { Transaction } from "@/lib/types"

export function TransactionDetailDialog({
  transaction,
}: {
  transaction: Transaction
}) {
  const status = getTransactionStatusMeta(transaction.status)
  const flagged =
    transaction.total >= HIGH_TRANSACTION_TOTAL ||
    transaction.items.some((item) => item.amount >= HIGH_ITEM_PRICE)

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
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ReceiptText className="size-4" />
            </div>
            <DialogTitle className="font-mono text-base">
              Invoice {formatShortId(transaction.id)}
            </DialogTitle>
            <Badge variant="secondary" className={status.className}>
              {status.label}
            </Badge>
          </div>
          <DialogDescription>
            Dibuat {formatDateTime(transaction.createdAt)} ·{" "}
            {transaction.clientName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {flagged ? (
            <div className="flex gap-2.5 rounded-lg border border-amber-500/25 bg-amber-500/5 p-3">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" />
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
                  Nilai tagihan perlu ditinjau
                </p>
                <p className="text-xs text-muted-foreground">
                  Total transaksi atau salah satu item melewati ambang pemantauan
                  ({formatIDR(HIGH_TRANSACTION_TOTAL)}). Bandingkan dengan jenis
                  kerusakan dan harga pasar sebelum mengambil tindakan.
                </p>
              </div>
            </div>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <InfoBlock
              icon={UserRound}
              label="Client"
              value={transaction.clientName}
              detail={formatPhone(transaction.clientPhone)}
            />
            <InfoBlock
              icon={Wrench}
              label="Montir"
              value={transaction.mechanicName ?? "Belum ditugaskan"}
              detail={
                transaction.mechanicPhone
                  ? formatPhone(transaction.mechanicPhone)
                  : "—"
              }
            />
            <InfoBlock
              icon={MapPin}
              label="Lokasi layanan"
              value={transaction.address ?? "Alamat tidak tersedia"}
              className="sm:col-span-2"
            />
          </div>

          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Rincian jasa &amp; sparepart</h3>
              <Badge variant="outline">{transaction.items.length} item</Badge>
            </div>

            {transaction.items.length > 0 ? (
              <div className="overflow-hidden rounded-lg border">
                <Table label="Rincian tagihan">
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead className="w-8">#</TableHead>
                      <TableHead>Keterangan</TableHead>
                      <TableHead className="text-right">Harga</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transaction.items.map((item, index) => {
                      const itemFlagged = item.amount >= HIGH_ITEM_PRICE
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="text-xs text-muted-foreground">
                            {index + 1}
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">{item.description}</p>
                            {itemFlagged ? (
                              <p className="mt-0.5 flex items-center gap-1 text-[11px] text-amber-700 dark:text-amber-400">
                                <AlertTriangle className="size-3" />
                                Harga item tinggi
                              </p>
                            ) : null}
                          </TableCell>
                          <TableCell className="text-right text-sm tabular-nums">
                            {formatIDR(item.amount)}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={2} className="text-xs">
                        Total
                      </TableCell>
                      <TableCell className="text-right text-sm font-semibold tabular-nums">
                        {formatIDR(transaction.total)}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-4 text-center">
                <p className="text-sm font-medium">Rincian item belum tersedia</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Montir belum mengirim baris tagihan untuk order ini. Total di
                  bawah mengikuti harga yang tersimpan pada order.
                </p>
              </div>
            )}
          </section>

          <section className="rounded-lg border bg-muted/30 p-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="size-4 text-muted-foreground" />
                <span>Total tagihan</span>
              </div>
              <span className="text-base font-semibold tabular-nums">
                {transaction.total > 0 ? formatIDR(transaction.total) : "—"}
              </span>
            </div>

            <Separator className="my-3" />

            <div className="grid gap-2 text-xs sm:grid-cols-3">
              <div>
                <p className="text-muted-foreground">Status bayar</p>
                <p className="font-medium">
                  {getPaymentStatusLabel(transaction.payment?.status)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Metode</p>
                <p className="font-medium">
                  {getPaymentMethodLabel(transaction.payment?.method)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Dibayar pada</p>
                <p className="font-medium">
                  {transaction.payment?.paidAt
                    ? formatDateTime(transaction.payment.paidAt)
                    : "—"}
                </p>
              </div>
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
