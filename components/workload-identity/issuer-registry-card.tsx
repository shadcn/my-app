"use client"

import { ArchiveIcon, KeyRoundIcon } from "lucide-react"

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import type { Issuer } from "@/components/workload-identity/types"

function IssuerEmptyState({ archived }: { archived: boolean }) {
  return (
    <Empty className="min-h-72 border-0">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          {archived ? <ArchiveIcon /> : <KeyRoundIcon />}
        </EmptyMedia>
        <EmptyTitle>
          {archived ? "No archived issuers" : "No issuers registered"}
        </EmptyTitle>
        <EmptyDescription>
          {archived
            ? "Issuers you archive will move here without deleting audit history."
            : "Register an OIDC identity provider to begin configuring federation rules."}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

function IssuerRegistryCard({
  issuers,
  archived = false,
}: {
  issuers: Issuer[]
  archived?: boolean
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {archived ? "Archived issuers" : "Trusted issuers"}
        </CardTitle>
        <CardDescription>
          {archived
            ? "Archived issuers remain visible for audit history."
            : "OIDC providers allowed to present workload identity tokens."}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">ID</TableHead>
                <TableHead>Issuer</TableHead>
                <TableHead>Issuer URL</TableHead>
                <TableHead>JWKS source</TableHead>
                <TableHead>Rules</TableHead>
                <TableHead className="pr-4">Created at</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {issuers.length > 0 ? (
                issuers.map((issuer) => (
                  <TableRow key={issuer.id}>
                    <TableCell className="pl-4 font-mono text-xs text-muted-foreground">
                      {issuer.id}
                    </TableCell>
                    <TableCell className="font-medium">{issuer.name}</TableCell>
                    <TableCell className="max-w-96 truncate font-mono text-xs">
                      {issuer.issuerUrl}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{issuer.jwksSource}</Badge>
                    </TableCell>
                    <TableCell>{issuer.rules}</TableCell>
                    <TableCell className="pr-4 text-muted-foreground">
                      {issuer.createdAt}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-80">
                    <IssuerEmptyState archived={archived} />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-3 p-4 md:hidden">
          {issuers.length > 0 ? (
            issuers.map((issuer) => (
              <Card key={issuer.id} size="sm">
                <CardHeader>
                  <CardTitle>{issuer.name}</CardTitle>
                  <CardDescription className="font-mono">
                    {issuer.issuerUrl}
                  </CardDescription>
                  <CardAction>
                    <Badge variant="outline">{issuer.jwksSource}</Badge>
                  </CardAction>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">ID</span>
                    <span className="font-mono text-xs">{issuer.id}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">Rules</span>
                    <span>{issuer.rules}</span>
                  </div>
                  <div className="col-span-2 flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">
                      Created at
                    </span>
                    <span>{issuer.createdAt}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <IssuerEmptyState archived={archived} />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export { IssuerRegistryCard }
