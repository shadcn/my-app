"use client"

import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuthenticationEventsPanel } from "@/components/workload-identity/authentication-events-panel"
import { FederationRuleDialog } from "@/components/workload-identity/federation-rule-dialog"
import { IssuerRegisterDialog } from "@/components/workload-identity/issuer-register-dialog"
import { IssuerRegistryCard } from "@/components/workload-identity/issuer-registry-card"
import { RuleRegistryCard } from "@/components/workload-identity/rule-registry-card"
import type { Issuer, Rule } from "@/components/workload-identity/types"

function OidcIssuerConfigurator() {
  const [issuers, setIssuers] = React.useState<Issuer[]>([])
  const [rules, setRules] = React.useState<Rule[]>([])
  const [issuerDialogOpen, setIssuerDialogOpen] = React.useState(false)
  const [ruleDialogOpen, setRuleDialogOpen] = React.useState(false)

  const activeIssuers = issuers.filter((issuer) => issuer.status === "active")
  const archivedIssuers = issuers.filter(
    (issuer) => issuer.status === "archived"
  )

  function handleRegisterIssuer(values: {
    name: string
    issuerUrl: string
    jwksSource: string
  }) {
    const now = new Date()

    setIssuers((currentIssuers) => [
      ...currentIssuers,
      {
        id: `iss_${String(currentIssuers.length + 1).padStart(3, "0")}`,
        name: values.name,
        issuerUrl: values.issuerUrl,
        jwksSource: values.jwksSource,
        rules: 0,
        createdAt: now.toLocaleDateString("en", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        status: "active",
      },
    ])
    setIssuerDialogOpen(false)
  }

  function handleCreateRule(values: {
    name: string
    issuerName: string
    subjectPattern: string
    serviceAccount: string
    workspaceScope: string
  }) {
    setRules((currentRules) => [
      ...currentRules,
      {
        id: `rule_${String(currentRules.length + 1).padStart(3, "0")}`,
        name: values.name,
        issuerName: values.issuerName,
        subjectPattern: values.subjectPattern,
        serviceAccount: values.serviceAccount,
        workspaceScope: values.workspaceScope,
      },
    ])
    setIssuers((currentIssuers) =>
      currentIssuers.map((issuer) => {
        if (issuer.name === values.issuerName) {
          return {
            ...issuer,
            rules: issuer.rules + 1,
          }
        }

        return issuer
      })
    )
    setRuleDialogOpen(false)
  }

  return (
    <main className="min-h-svh bg-background">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-12">
        <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex max-w-3xl flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-2xl font-semibold tracking-tight">
                Workload identity federation
              </h1>
            </div>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Register OIDC issuers you trust, then create rules that map their
              tokens to API access.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <FederationRuleDialog
              issuers={activeIssuers}
              open={ruleDialogOpen}
              onOpenChange={setRuleDialogOpen}
              onCreateRule={handleCreateRule}
            />
            <IssuerRegisterDialog
              open={issuerDialogOpen}
              onOpenChange={setIssuerDialogOpen}
              onRegisterIssuer={handleRegisterIssuer}
            />
          </div>
        </section>

        <Tabs defaultValue="issuers" className="gap-6">
          <div className="overflow-x-auto">
            <TabsList variant="line" className="min-w-max">
              <TabsTrigger value="issuers">Issuers</TabsTrigger>
              <TabsTrigger value="rules">Rules</TabsTrigger>
              <TabsTrigger value="events">Authentication events</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="issuers" className="flex flex-col gap-4">
            <Tabs defaultValue="active" className="gap-4">
              <TabsList>
                <TabsTrigger value="active">
                  Active
                  {activeIssuers.length > 0 ? (
                    <Badge variant="secondary">{activeIssuers.length}</Badge>
                  ) : null}
                </TabsTrigger>
                <TabsTrigger value="archived">
                  Archived
                  {archivedIssuers.length > 0 ? (
                    <Badge variant="secondary">{archivedIssuers.length}</Badge>
                  ) : null}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="active">
                <IssuerRegistryCard issuers={activeIssuers} />
              </TabsContent>
              <TabsContent value="archived">
                <IssuerRegistryCard issuers={archivedIssuers} archived />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="rules">
            <RuleRegistryCard rules={rules} />
          </TabsContent>

          <TabsContent value="events">
            <AuthenticationEventsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

export { OidcIssuerConfigurator }
