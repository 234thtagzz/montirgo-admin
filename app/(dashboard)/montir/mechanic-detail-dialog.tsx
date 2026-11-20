/* eslint-disable @next/next/no-img-element */
"use client"

import { useState } from "react"
import {
  Award,
  BadgeCheck,
  Briefcase,
  CalendarDays,
  Clock,
  ExternalLink,
  Eye,
  IdCard,
  Images,
  Mail,
  MapPin,
  Phone,
  ShieldQuestion,
  Star,
  Store,
  UserRound,
  Wrench,
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
import { Separator } from "@/components/ui/separator"
import {
  formatDate,
  formatDateTime,
  formatPhone,
  getInitials,
} from "@/lib/format"
import { getSpecializationLabel } from "@/lib/mechanic"
import { getMechanicStatusMeta } from "@/lib/status"
import type { Mechanic } from "@/lib/types"

import { VerifyMechanicForm } from "./verify-mechanic-button"

export function MechanicDetailDialog({ mechanic }: { mechanic: Mechanic }) {
  const [open, setOpen] = useState(false)
  const status = getMechanicStatusMeta(mechanic.status)
  const mapsUrl = mechanic.coordinate
    ? `https://www.google.com/maps?q=${encodeURIComponent(mechanic.coordinate)}`
    : null

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
              {mechanic.avatarUrl ? (
                <AvatarImage
                  src={mechanic.avatarUrl}
                  alt={mechanic.fullName}
                  className="size-12"
                />
              ) : null}
              <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                {getInitials(mechanic.fullName)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <DialogTitle className="text-base">
                  {mechanic.fullName}
                </DialogTitle>
                <Badge variant="secondary" className={status.className}>
                  {status.label}
                </Badge>
                <Badge
                  variant="secondary"
                  className={
                    mechanic.isOnline
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "bg-muted text-muted-foreground"
                  }
                >
                  {mechanic.isOnline ? "Online" : "Offline"}
                </Badge>
              </div>
              <DialogDescription>
                {mechanic.workshopName ?? "Montir panggilan"} · Bergabung{" "}
                {formatDate(mechanic.joinedAt)}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5">
          <section className="space-y-2">
            <h3 className="text-sm font-medium">Identitas &amp; kontak</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoRow
                icon={UserRound}
                label="Nama lengkap"
                value={mechanic.fullName}
              />
              <InfoRow
                icon={IdCard}
                label="Nomor identitas (KTP)"
                value={mechanic.identityNumber ?? "Belum diisi"}
                tone={mechanic.identityNumber ? "default" : "warning"}
              />
              <InfoRow
                icon={Mail}
                label="Email"
                value={mechanic.email ?? "—"}
              />
              <InfoRow
                icon={Phone}
                label="Telepon"
                value={formatPhone(mechanic.phone)}
              />
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-medium">Status &amp; lokasi</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoRow
                icon={Wrench}
                label="Ketersediaan"
                value={mechanic.isAvailable ? "Menerima order" : "Tidak menerima order"}
                detail={mechanic.isOnline ? "Sedang online" : "Sedang offline"}
              />
              <InfoRow
                icon={MapPin}
                label="Lokasi terakhir"
                value={mechanic.coordinate ?? "Belum tersedia"}
                detail={
                  mechanic.lastLocationAt
                    ? formatDateTime(mechanic.lastLocationAt)
                    : "Belum ada pembaruan lokasi"
                }
              />
              <InfoRow
                icon={Clock}
                label="Terakhir diperbarui"
                value={formatDateTime(mechanic.updatedAt)}
              />
              <InfoRow
                icon={CalendarDays}
                label="Bergabung"
                value={formatDate(mechanic.joinedAt)}
              />
            </div>

            {mapsUrl ? (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary underline-offset-4 hover:underline"
              >
                Buka lokasi di Google Maps
                <ExternalLink className="size-3" />
              </a>
            ) : null}
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-medium">Bengkel</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoRow
                icon={Store}
                label="Nama bengkel"
                value={mechanic.workshopName ?? "Belum diisi"}
              />
              <InfoRow
                icon={MapPin}
                label="Alamat bengkel"
                value={mechanic.workshopAddress ?? "Belum diisi"}
              />
            </div>

            {mechanic.bio ? (
              <p className="rounded-lg border bg-muted/30 p-3 text-sm whitespace-pre-wrap">
                {mechanic.bio}
              </p>
            ) : (
              <p className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
                Montir belum menulis deskripsi singkat.
              </p>
            )}

            <div className="flex items-center justify-between pt-1">
              <h4 className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Images className="size-3.5" />
                Foto bengkel
              </h4>
              <Badge variant="outline">
                {mechanic.workshopPhotoUrls.length} foto
              </Badge>
            </div>

            {mechanic.workshopPhotoUrls.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {mechanic.workshopPhotoUrls.map((url, index) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
                  >
                    <img
                      src={url}
                      alt={`Foto bengkel ${index + 1}`}
                      className="size-full object-cover transition group-hover:scale-105"
                    />
                  </a>
                ))}
              </div>
            ) : (
              <p className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
                Belum ada foto bengkel yang diunggah.
              </p>
            )}
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-medium">Kompetensi</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoRow
                icon={Briefcase}
                label="Pengalaman"
                value={
                  mechanic.experienceYears !== null
                    ? `${mechanic.experienceYears} tahun`
                    : "Belum diisi"
                }
                tone={
                  mechanic.experienceYears !== null ? "default" : "warning"
                }
              />
              <InfoRow
                icon={Star}
                label="Rating"
                value={
                  mechanic.rating > 0
                    ? `${mechanic.rating.toFixed(1)} / 5`
                    : "Belum ada rating"
                }
                detail={`${mechanic.ratingCount} ulasan · ${mechanic.totalJobs} order selesai`}
              />
            </div>

            <ChipList label="Keahlian" values={mechanic.skills} />
            <ChipList
              label="Spesialisasi kendaraan"
              values={mechanic.specializations.map(getSpecializationLabel)}
            />

            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">
                Sertifikasi
              </p>
              {mechanic.certifications.length > 0 ? (
                <div className="space-y-1">
                  {mechanic.certifications.map((certification) => (
                    <p
                      key={certification}
                      className="flex items-start gap-1.5 text-sm"
                    >
                      <Award className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                      <span>{certification}</span>
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Belum diisi.</p>
              )}
            </div>
          </section>

          <Separator />

          {mechanic.status === "ACTIVE" ? (
            <div className="flex items-start gap-2.5 rounded-lg border border-emerald-500/25 bg-emerald-500/5 p-3">
              <BadgeCheck className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-emerald-800 dark:text-emerald-300">
                  Montir sudah terverifikasi
                </p>
                <p className="text-xs text-muted-foreground">
                  {mechanic.verifiedAt
                    ? `Diverifikasi pada ${formatDateTime(mechanic.verifiedAt)}.`
                    : "Tanggal verifikasi tidak tercatat."}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2.5 rounded-lg border border-amber-500/25 bg-amber-500/5 p-3">
              <ShieldQuestion className="mt-0.5 size-4 shrink-0 text-amber-600" />
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
                  Menunggu verifikasi admin
                </p>
                <p className="text-xs text-muted-foreground">
                  Periksa identitas, alamat bengkel, foto, dan kompetensi di atas
                  sebelum mengaktifkan montir.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" size="sm">
              Tutup
            </Button>
          </DialogClose>

          {mechanic.status === "PENDING" ? (
            <VerifyMechanicForm
              mechanicId={mechanic.id}
              onSuccess={() => setOpen(false)}
              label="Verifikasi montir"
            />
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
  detail,
  tone = "default",
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  detail?: string
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
      {detail ? (
        <p className="mt-0.5 text-xs text-muted-foreground">{detail}</p>
      ) : null}
    </div>
  )
}

function ChipList({ label, values }: { label: string; values: string[] }) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      {values.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {values.map((value) => (
            <span
              key={value}
              className="rounded-full border px-2 py-0.5 text-xs"
            >
              {value}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">Belum diisi.</p>
      )}
    </div>
  )
}
