import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

import { getPublicSupabaseConfig } from "@/lib/env"

const PUBLIC_PATHS = ["/login", "/setup", "/unauthorized"]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const { supabaseUrl, supabaseAnonKey, isConfigured } = getPublicSupabaseConfig()

  if (!isConfigured) {
    if (pathname === "/setup") return NextResponse.next()
    return NextResponse.redirect(new URL("/setup", request.url))
  }

  if (pathname === "/setup") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  let response = NextResponse.next({ request })

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value)
        })
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  // getUser() memvalidasi JWT ke Supabase Auth (bukan hanya membaca cookie).
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isPublicPath = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )

  if (!user && !isPublicPath) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (user && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
