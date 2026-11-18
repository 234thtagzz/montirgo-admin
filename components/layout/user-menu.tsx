"use client"

import { ChevronsUpDown, LogOut, ShieldCheck } from "lucide-react"

import { signOutAction } from "@/lib/actions/auth"
import { getInitials } from "@/lib/format"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UserMenu({ name, email }: { name: string; email: string | null }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg p-1 pr-2 outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring">
        <Avatar className="size-7">
          <AvatarFallback className="bg-primary/10 text-[11px] font-semibold text-primary">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
        <div className="hidden min-w-0 text-left sm:block">
          <p className="max-w-40 truncate text-xs font-medium">{name}</p>
          <p className="max-w-40 truncate text-[11px] text-muted-foreground">
            {email ?? "Administrator"}
          </p>
        </div>
        <ChevronsUpDown className="size-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="flex items-center gap-2 font-normal">
          <ShieldCheck className="size-4 text-emerald-600" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{name}</p>
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          </div>
        </DropdownMenuLabel>
        <div className="px-2 pb-2">
          <Badge variant="secondary" className="text-[10px]">
            Super Admin
          </Badge>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <form action={signOutAction}>
            <DropdownMenuItem asChild variant="destructive">
              <button type="submit" className="w-full cursor-pointer">
                <LogOut />
                Keluar
              </button>
            </DropdownMenuItem>
          </form>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
