import { OidcIssuerConfigurator } from "@/components/oidc-issuer-configurator"

export const metadata = {
  title: "Oidc Issuer Configurator",
  description: "Oidc Issuer Configurator",
}

export default function Page() {
  return (
    <main className="min-h-svh bg-background">
      <OidcIssuerConfigurator />
    </main>
  )
}
