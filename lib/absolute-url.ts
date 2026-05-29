// Resolves the site's base URL from the environment, falling back to localhost.
function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  return `http://localhost:${process.env.PORT ?? 3000}`
}

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
