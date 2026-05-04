/** South African locale for consistent SSR/client number and date formatting. */
export const LOCALE = "en-ZA" as const

type NumberFormatOptions = Intl.NumberFormatOptions

export function formatNumber(value: number, options?: NumberFormatOptions): string {
  return new Intl.NumberFormat(LOCALE, {
    maximumFractionDigits: 0,
    ...options,
  }).format(value)
}

export function formatZAR(value: number, options?: NumberFormatOptions): string {
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
    ...options,
  }).format(value)
}
