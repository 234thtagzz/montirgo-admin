import { Suspense } from "react"

import { AppSidebar } from "@/components/layout/app-sidebar"
import { TopBar } from "@/components/layout/top-bar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { requireAdmin } from "@/lib/auth"

/**
 * Guard level layout. Dengan Cache Components, session read harus berada di
 * dalam <Suspense> (tidak boleh top-level await di layout), jadi pengecekan
 * admin dibungkus AdminGate. Proxy tetap menjadi gerbang pertama di edge.
 */
async function AdminGate({ children }: { children: React.ReactNode }) {
  await requireAdmin()
  return <>{children}</>
}

function DashboardFallback() {
  return (
    <div className="flex min-h-svh items-center justify-center text-sm text-muted-foreground">
      Memeriksa akses admin…
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <Suspense fallback={<DashboardFallback />}>
        <AdminGate>
          <AppSidebar />
          <SidebarInset className="bg-muted/30">
            <TopBar />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
              {children}
            </main>
          </SidebarInset>
        </AdminGate>
      </Suspense>
    </SidebarProvider>
  )
}
