export type Issuer = {
  id: string
  name: string
  issuerUrl: string
  jwksSource: string
  rules: number
  createdAt: string
  status: "active" | "archived"
}

export type Rule = {
  id: string
  name: string
  issuerName: string
  subjectPattern: string
  serviceAccount: string
  workspaceScope: string
}

export type ClaimCondition = {
  id: string
  key: string
  value: string
}

export const SERVICE_ACCOUNTS = [
  "ci-deploy@production",
  "research-runner@default",
  "preview-bot@staging",
] as const

export const WORKSPACES = ["Default", "Research", "Production"] as const
