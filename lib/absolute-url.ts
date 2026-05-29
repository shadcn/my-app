import { getBaseUrl } from "@/lib/base-url"

// Turns any path into an absolute URL based on the site's base URL.
export function absoluteUrl(path: string) {
  // Already absolute, return as-is.
  if (/^https?:\/\//.test(path)) {
    return path
  }

  const base = getBaseUrl().replace(/\/$/, "")
  const normalizedPath = path.startsWith("/") ? path : `/${path}`

  return `${base}${normalizedPath}`
}
