"use client"

import { CircleDotIcon } from "lucide-react"

import {
  Card,
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

function AuthenticationEventsPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Authentication events</CardTitle>
        <CardDescription>
          Token exchange attempts will appear here after a rule is used.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Empty className="min-h-80 border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CircleDotIcon />
            </EmptyMedia>
            <EmptyTitle>No events recorded</EmptyTitle>
            <EmptyDescription>
              Successful and rejected token exchanges are audit-logged with
              issuer, rule, and workspace details.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </CardContent>
    </Card>
  )
}

export { AuthenticationEventsPanel }
