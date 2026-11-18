"use client"

import { useState, useTransition } from "react"
import { Loader2, ShieldCheck, ShieldQuestion } from "lucide-react"
import { toast } from "sonner"

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
import { Input } from "@/components/ui/input"
import {
  verifyMechanicAction,
  type VerifyMechanicState,
} from "@/app/(dashboard)/montir/actions"

const initialState: VerifyMechanicState = { status: "idle", message: "" }

export function VerifyMechanicButton({
  mechanicId,
  mechanicName,
}: {
  mechanicId: string
  mechanicName: string
}) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await verifyMechanicAction(initialState, formData)

      if (result.status === "success") {
        toast.success(result.message)
        setOpen(false)
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="default">
          <ShieldCheck />
          Verifikasi
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-1 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ShieldQuestion className="size-4" />
          </div>
          <DialogTitle>Verifikasi montir?</DialogTitle>
          <DialogDescription>
            <strong className="font-medium text-foreground">{mechanicName}</strong>{" "}
            akan diubah dari <span className="font-medium">PENDING</span> menjadi{" "}
            <span className="font-medium text-emerald-600 dark:text-emerald-400">
              ACTIVE
            </span>
            . Pastikan identitas dan kelengkapan profilnya sudah diperiksa.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          Setelah aktif, montir dapat menerima order dari client. Tindakan ini
          dicatat di activity log admin.
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" size="sm" disabled={pending}>
              Batal
            </Button>
          </DialogClose>

          <form action={handleSubmit}>
            <Input type="hidden" name="mechanicId" value={mechanicId} />
            <Button type="submit" size="sm" disabled={pending}>
              {pending ? <Loader2 className="animate-spin" /> : <ShieldCheck />}
              {pending ? "Memverifikasi…" : "Ya, verifikasi"}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
