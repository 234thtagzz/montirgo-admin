/**
 * Tipe database Supabase MontirGo.
 *
 * Sumber tunggal ada di `types/database.types.ts`, hasil generate dari project
 * Supabase (lihat `npx supabase gen types typescript`). File ini hanya
 * re-export agar import lama tetap valid.
 */
export type { Database, Json, Tables, TablesInsert, TablesUpdate } from "@/types/database.types"
export { Constants } from "@/types/database.types"
