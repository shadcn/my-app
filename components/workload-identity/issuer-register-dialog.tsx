"use client"

import * as React from "react"
import { AlertTriangleIcon, PlusIcon } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

function IssuerRegisterDialog({
  open,
  onOpenChange,
  onRegisterIssuer,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onRegisterIssuer: (values: {
    name: string
    issuerUrl: string
    jwksSource: string
  }) => void
}) {
  const formId = React.useId()
  const [name, setName] = React.useState("")
  const [issuerUrl, setIssuerUrl] = React.useState(
    "https://token.actions.githubusercontent.com"
  )
  const [jwksSource, setJwksSource] = React.useState("OIDC discovery")
  const [discoveryBaseUrl, setDiscoveryBaseUrl] = React.useState("")
  const [caCertificate, setCaCertificate] = React.useState("")
  const [replayProtection, setReplayProtection] = React.useState(true)
  const [maximumLifetime, setMaximumLifetime] = React.useState("1")

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!name || !issuerUrl) {
      return
    }

    onRegisterIssuer({
      name,
      issuerUrl,
      jwksSource,
    })
    setName("")
    setIssuerUrl("https://token.actions.githubusercontent.com")
    setJwksSource("OIDC discovery")
    setDiscoveryBaseUrl("")
    setCaCertificate("")
    setReplayProtection(true)
    setMaximumLifetime("1")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon data-icon="inline-start" />
          Register issuer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Register issuer</DialogTitle>
          <DialogDescription>
            Add an OIDC provider and decide how signing keys are discovered.
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <AlertTriangleIcon />
          <AlertDescription>
            Issuer configuration is security-sensitive. The issuer URL and JWKS
            source determine which tokens are accepted. This action will be
            audit-logged.
          </AlertDescription>
        </Alert>

        <form id={formId} onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={`${formId}-name`}>Name</FieldLabel>
              <Input
                id={`${formId}-name`}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. github-actions"
                required
              />
              <FieldDescription>
                Lowercase letters, numbers, and hyphens. Shown in rules and
                audit logs.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor={`${formId}-issuer-url`}>
                Issuer URL (iss claim)
              </FieldLabel>
              <Input
                id={`${formId}-issuer-url`}
                value={issuerUrl}
                onChange={(event) => setIssuerUrl(event.target.value)}
                placeholder="https://token.actions.githubusercontent.com"
                required
              />
              <FieldDescription>
                Must exactly match the issuer field in presented tokens.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel>JWKS source</FieldLabel>
              <Select value={jwksSource} onValueChange={setJwksSource}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select JWKS source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="OIDC discovery">
                      OIDC discovery
                    </SelectItem>
                    <SelectItem value="Static JWKS URL">
                      Static JWKS URL
                    </SelectItem>
                    <SelectItem value="Manual key set">
                      Manual key set
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldDescription>
                How the verifier obtains the issuer&apos;s signing keys.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor={`${formId}-discovery-base-url`}>
                Discovery base URL (optional)
              </FieldLabel>
              <Input
                id={`${formId}-discovery-base-url`}
                value={discoveryBaseUrl}
                onChange={(event) => setDiscoveryBaseUrl(event.target.value)}
                placeholder="Same as issuer URL"
              />
              <FieldDescription>
                Leave blank to use the issuer URL for discovery.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor={`${formId}-ca-certificate`}>
                CA certificate (PEM, optional)
              </FieldLabel>
              <Textarea
                id={`${formId}-ca-certificate`}
                value={caCertificate}
                onChange={(event) => setCaCertificate(event.target.value)}
                placeholder={
                  "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----"
                }
                className="min-h-24 font-mono text-xs"
              />
              <FieldDescription>
                Custom CA for TLS verification when fetching discovery or JWKS
                endpoints.
              </FieldDescription>
            </Field>

            <FieldSeparator />

            <FieldSet>
              <FieldLegend variant="label">Token validation</FieldLegend>
              <FieldLabel>
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>
                      Enforce single-use tokens (JTI replay protection)
                    </FieldTitle>
                    <FieldDescription>
                      Each token&apos;s jti claim can only be exchanged once,
                      preventing replay across workers or requests.
                    </FieldDescription>
                  </FieldContent>
                  <Switch
                    id={`${formId}-replay-protection`}
                    checked={replayProtection}
                    onCheckedChange={setReplayProtection}
                  />
                </Field>
              </FieldLabel>
              <Field>
                <FieldLabel htmlFor={`${formId}-maximum-lifetime`}>
                  Maximum token lifetime (hours)
                </FieldLabel>
                <Input
                  id={`${formId}-maximum-lifetime`}
                  type="number"
                  min="1"
                  max="49"
                  value={maximumLifetime}
                  onChange={(event) => setMaximumLifetime(event.target.value)}
                />
                <FieldDescription>
                  Tokens are rejected if exp - iat exceeds this value.
                  Recommended: 1 hour. Maximum: 49 hours.
                </FieldDescription>
              </Field>
            </FieldSet>
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button type="submit" form={formId} disabled={!name || !issuerUrl}>
            Register
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { IssuerRegisterDialog }
