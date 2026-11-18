import { Suspense } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { requireAdmin } from "@/lib/auth"

import { UserMenu } from "./user-menu"

async function AccountMenu() {
  const admin = await requireAdmin()
  return <UserMenu name={admin.name} email={admin.email} />
}

export function TopBar() {
  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-md md:px-6">
      <SidebarTrigger />
      <Separator orientation="vertical" className="!h-4" />
      <p className="hidden text-sm text-muted-foreground sm:block">
        Panel Operasional
      </p>

      <div className="ml-auto flex items-center gap-2">
        <Suspense fallback={<Skeleton className="h-8 w-36 rounded-lg" />}>
          <AccountMenu />
        </Suspense>
      </div>
    </header>
  )
}
