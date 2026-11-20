const VEHICLE_SPECIALIZATION_LABELS: Record<string, string> = {
  motor_matic: "Motor Matic",
  motor_manual: "Motor Manual",
  motor_listrik: "Motor Listrik",
  sepeda: "Sepeda",
  mobil_bensin: "Mobil Bensin",
  mobil_diesel: "Mobil Diesel",
  mobil_listrik: "Mobil Listrik",
  truk: "Truk",
  bus: "Bus",
  lainnya: "Lainnya",
}

/** Label ramah dibaca untuk nilai `mechanic_profiles.vehicle_specialization`. */
export function getSpecializationLabel(value: string): string {
  const trimmed = value.trim()
  return (
    VEHICLE_SPECIALIZATION_LABELS[trimmed] ?? trimmed.replace(/_/g, " ")
  )
}

/** Contoh: "Motor Matic · Mobil Bensin". */
export function formatSpecializations(
  values: string[] | null | undefined
): string {
  return (values ?? [])
    .filter(Boolean)
    .map(getSpecializationLabel)
    .join(" · ")
}
