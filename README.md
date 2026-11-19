# MontirGo Admin Panel

Panel operasional MontirGo untuk memverifikasi montir dan memantau transaksi.
Dibangun dengan **Next.js 16 (App Router)**, **Tailwind CSS 4**, **shadcn/ui**,
**Supabase**, dan **lucide-react**.

Repo ini adalah repo kedua dari arsitektur 2-repo:

| Repo | Isi |
| --- | --- |
| `montirGo_app` | Aplikasi mobile (Expo) untuk client & montir |
| `montirgo-admin` | Panel admin web (repo ini) |

---

## 1. Menjalankan project

```bash
npm install
cp .env.example .env.local   # Windows: copy .env.example .env.local
npm run dev
```

Buka `http://localhost:3000`. Jika env belum diisi, aplikasi otomatis
mengarahkan ke halaman `/setup` berisi panduan.

### Environment variables

| Variable | Wajib | Keterangan |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | ya | URL project Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ya | Hanya untuk Supabase Auth (login) |
| `SUPABASE_SERVICE_ROLE_KEY` | ya | **Server-only**, membypass RLS |
| `ADMIN_EMAILS` | tidak | Allowlist email admin, dipisah koma |

Panel ini juga membaca nama `EXPO_PUBLIC_SUPABASE_URL` dan
`EXPO_PUBLIC_SUPABASE_ANON_KEY` sebagai fallback, sehingga `.env.local`
yang disalin dari repo mobile bisa langsung dipakai.

> **Jangan pernah** memberi prefix `NEXT_PUBLIC_` pada service role key.
> Key tersebut hanya dibaca oleh modul yang mengimpor `server-only`.

### Membuat akun admin pertama

Role admin adalah role database (`public.app_role` = `client | mechanic |
admin`) dan **tidak bisa dibuat dari aplikasi mobile**. Signup mobile hanya
menerima `client`/`mechanic`.

1. Jalankan migration `supabase/migrations/20261119000000_admin_role.sql`
   (dari repo `montirGo_app`).
2. Buat user di Supabase Dashboard → Authentication → Users.
3. Tambahkan emailnya ke `ADMIN_EMAILS`. Saat login pertama, panel otomatis
   mempromosikan user tersebut menjadi `profiles.role = 'admin'`.
4. Alternatif lewat Supabase SQL Editor:
   `update public.profiles set role = 'admin' where id = '<user-id>';`
   RPC `public.set_user_role('<user-id>', 'admin')` juga tersedia, tetapi hanya
   untuk sesi `service_role` atau admin yang sudah login (bukan SQL Editor).
5. Login di `/login`. Akun `client`/`mechanic` ditolak oleh proxy dan login.

---

## 2. Struktur file

```
app/
├── layout.tsx                  # Root layout: font, TooltipProvider, Toaster
├── globals.css                 # Tailwind 4 + token tema shadcn
├── login/
│   ├── page.tsx                # Halaman login (split screen)
│   └── login-form.tsx          # Client form + useActionState
├── setup/page.tsx              # Panduan env jika belum dikonfigurasi
├── unauthorized/page.tsx       # Akun login tapi bukan admin
└── (dashboard)/                # Route group: semua halaman ber-sidebar
    ├── layout.tsx              # SidebarProvider + AppSidebar + TopBar
    ├── page.tsx                # Dashboard statistik
    ├── montir/
    │   ├── page.tsx            # Tabel montir + filter + pagination
    │   ├── actions.ts          # Server Action verifikasi montir
    │   └── verify-mechanic-button.tsx
    ├── transaksi/
    │   ├── page.tsx            # Tabel transaksi
    │   ├── status-options.ts
    │   └── transaction-detail-dialog.tsx  # Invoice terperinci
    └── sengketa/page.tsx       # Placeholder modul sengketa

components/
├── layout/
│   ├── app-sidebar.tsx         # Navigasi (Dashboard, Montir, Transaksi, Sengketa)
│   ├── top-bar.tsx             # Header + trigger sidebar
│   └── user-menu.tsx           # Menu akun + logout
├── data-table/
│   ├── data-table.tsx          # Tabel generik berbasis shadcn Table
│   ├── empty-state.tsx
│   ├── filter-bar.tsx          # Pencarian + filter status (server-driven)
│   └── table-pagination.tsx
├── ui/                         # Komponen shadcn/ui
└── page-header.tsx

lib/
├── supabase/
│   ├── admin.ts                # SERVICE ROLE client (server-only)
│   ├── server.ts               # ANON client + cookie (auth)
│   └── database.types.ts       # Tipe tabel yang dipakai admin
├── queries/
│   ├── dashboard.ts            # Agregat statistik
│   ├── mechanics.ts            # Query daftar montir
│   └── transactions.ts         # Query transaksi + invoice
├── actions/
│   └── auth.ts                 # signIn / signOut
├── auth.ts                     # requireAdmin() guard
├── env.ts                      # Validasi environment
├── format.ts                   # Rupiah, tanggal WIB, telepon, dll.
├── status.ts                   # Label & warna status
├── types.ts                    # Tipe domain (Mechanic, Transaction, …)
└── constants.ts

types/
└── database.types.ts           # HASIL GENERATE dari Supabase (source of truth)

proxy.ts                        # Next.js 16 Proxy (dulu middleware)
```

---

## 3. Pemetaan ke schema Supabase yang ada

Panel ini memakai schema yang sudah dipakai aplikasi mobile, bukan tabel baru:

| Istilah di brief | Tabel/kolom aktual |
| --- | --- |
| `mechanics` + `status` | `profiles` (role = `mechanic`) + `mechanic_profiles.is_verified` |
| Status `PENDING` | `mechanic_profiles.is_verified = false` |
| Status `ACTIVE` | `mechanic_profiles.is_verified = true` |
| `transaction_items` | `order_invoice_items` (`keterangan`, `harga`) |
| Total transaksi | `SUM(order_invoice_items.harga)` atau `service_requests.price_amount` |
| Pembayaran | `payments` |

Verifikasi montir mengisi `is_verified`, `verified_at`, dan `verified_by`,
lalu menulis audit trail ke `activity_logs`.

`mechanic_profiles` punya dua relasi ke `profiles` (`profile_id` dan
`verified_by`), sehingga embed wajib memakai hint
`profiles!mechanic_profiles_profile_id_fkey`. Tanpa hint, PostgREST
mengembalikan error "more than one relationship was found".

Tipe database dibaca dari `types/database.types.ts` (hasil generate).
`lib/supabase/database.types.ts` hanya me-re-export file tersebut agar
import lama tetap valid. Regenerate dengan:

```bash
npx supabase gen types typescript --project-id <project-ref> --schema public > types/database.types.ts
```

> **Catatan agregat:** project Supabase ini menonaktifkan aggregate function
> PostgREST (`amount.sum()` mengembalikan "Use of aggregate functions is not
> allowed"). Karena itu total pendapatan dihitung di server dengan membaca
> `payments.amount` yang berstatus `paid` secara bertahap (pagination 1000
> baris) di `lib/queries/dashboard.ts`.

> **Catatan kategori Jasa/Sparepart:** tabel `order_invoice_items` saat ini
> hanya punya `keterangan` dan `harga` — belum ada kolom kategori. Dialog
> invoice menampilkan keduanya apa adanya agar tidak menebak kategori
> finansial. Jika ingin memisahkan Jasa vs Sparepart, tambahkan kolom
> `item_type` di tabel tersebut, isi dari aplikasi montir, lalu tambahkan
> kolom badge di `transaction-detail-dialog.tsx`.

---

## 4. Model keamanan

1. **Role berasal dari database, bukan session/metadata.**
   Database memiliki enum `public.app_role` dengan tiga nilai:
   `client`, `mechanic`, `admin`. Signup mobile hanya boleh `client`/`mechanic`.
   Pengecekan memakai `public.has_role('admin')`.
2. **Service role hanya di server.**
   `lib/supabase/admin.ts` diawali `import "server-only"`, sehingga build gagal
   jika file tersebut tidak sengaja diimpor Client Component.
3. **Proxy memeriksa role, bukan hanya session.**
   `proxy.ts` memanggil RPC `has_role('admin')`; user login yang bukan admin
   diarahkan ke `/unauthorized`. Ini menutup akses montir/client ke panel.
4. **Guard berlapis.**
   Layout `(dashboard)` memanggil `requireAdmin()` sebelum shell dirender.
   Setiap halaman data, Server Action, dan fungsi di `lib/queries/*` memanggil
   `requireAdmin()` lagi karena `service_role` membypass RLS.
5. **RLS tetap aktif dan admin punya CRUD.**
   Migration admin menambahkan policy `admin_all` (SELECT/INSERT/UPDATE/DELETE)
   pada seluruh tabel data. `ADMIN_EMAILS` hanya untuk bootstrap admin pertama.

---

## 5. Catatan implementasi Next.js 16

- `cacheComponents: true` aktif. Data dinamis di-stream di dalam `<Suspense>`
  (lihat `StatsSection`, `MechanicsSection`, `TransactionsSection`).
- Filter dan pagination dijalankan **server-side** lewat `searchParams`,
  sehingga tabel tetap ringan saat data bertambah.
- Mutasi memakai Server Action + `revalidatePath("/montir")`.
- Middleware Next.js 16 bernama **Proxy** (`proxy.ts`).
- Angka rupiah, tanggal, dan awal hari mengikuti timezone `Asia/Jakarta`.

---

## 6. Scripts

```bash
npm run dev      # development
npm run build    # production build
npm run start    # jalankan hasil build
npm run lint     # ESLint
npx tsc --noEmit # type-check
```

---

## 7. Deploy

1. Set environment variables di platform (Vercel/Netlify/VPS).
2. Pastikan `SUPABASE_SERVICE_ROLE_KEY` hanya tersedia sebagai server env.
3. Deploy, lalu login dengan akun admin.
4. Pertimbangkan menambahkan rate limit / IP allowlist di depan panel admin.
# montirgo-admin
# montirgo-admin
