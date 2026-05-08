"use client"

import { ChevronRightIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

import type { Rule } from "@/components/workload-identity/types"

function RuleMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="truncate text-sm">{value}</span>
    </div>
  )
}

function RuleRegistryCard({ rules }: { rules: Rule[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Federation rules</CardTitle>
        <CardDescription>
          Match trusted token claims and map them to service account access.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {rules.length > 0 ? (
          <div className="grid gap-3">
            {rules.map((rule) => (
              <Card key={rule.id} size="sm">
                <CardHeader>
                  <CardTitle>{rule.name}</CardTitle>
                  <CardDescription>{rule.subjectPattern}</CardDescription>
                  <CardAction>
                    <Badge variant="secondary">{rule.workspaceScope}</Badge>
                  </CardAction>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-3">
                  <RuleMeta label="Issuer" value={rule.issuerName} />
                  <RuleMeta
                    label="Service account"
                    value={rule.serviceAccount}
                  />
                  <RuleMeta label="Rule ID" value={rule.id} />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Empty className="min-h-80 border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ChevronRightIcon />
              </EmptyMedia>
              <EmptyTitle>No federation rules</EmptyTitle>
              <EmptyDescription>
                Create a rule after registering an issuer to grant scoped API
                access to matching workloads.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </CardContent>
    </Card>
  )
}

export { RuleRegistryCard }
