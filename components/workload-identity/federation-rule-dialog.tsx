"use client"

import * as React from "react"
import { PlusIcon } from "lucide-react"

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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import type { ClaimCondition, Issuer } from "@/components/workload-identity/types"
import { SERVICE_ACCOUNTS, WORKSPACES } from "@/components/workload-identity/types"

function FederationRuleDialog({
  issuers,
  open,
  onOpenChange,
  onCreateRule,
}: {
  issuers: Issuer[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateRule: (values: {
    name: string
    issuerName: string
    subjectPattern: string
    serviceAccount: string
    workspaceScope: string
  }) => void
}) {
  const formId = React.useId()
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [issuerName, setIssuerName] = React.useState("")
  const [subjectPattern, setSubjectPattern] = React.useState("")
  const [expectedAudience, setExpectedAudience] = React.useState("")
  const [claimConditions, setClaimConditions] = React.useState<
    ClaimCondition[]
  >([{ id: "claim-1", key: "", value: "" }])
  const [serviceAccount, setServiceAccount] = React.useState("")
  const [allWorkspaces, setAllWorkspaces] = React.useState(false)
  const [workspaceScope, setWorkspaceScope] = React.useState("Default")

  function handleAddClaim() {
    setClaimConditions((currentConditions) => [
      ...currentConditions,
      {
        id: `claim-${currentConditions.length + 1}`,
        key: "",
        value: "",
      },
    ])
  }

  function handleClaimChange(
    id: string,
    field: "key" | "value",
    value: string
  ) {
    setClaimConditions((currentConditions) =>
      currentConditions.map((condition) => {
        if (condition.id === id) {
          return {
            ...condition,
            [field]: value,
          }
        }

        return condition
      })
    )
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!name || !issuerName || !subjectPattern || !serviceAccount) {
      return
    }

    onCreateRule({
      name,
      issuerName,
      subjectPattern,
      serviceAccount,
      workspaceScope: allWorkspaces ? "All workspaces" : workspaceScope,
    })
    setName("")
    setDescription("")
    setIssuerName("")
    setSubjectPattern("")
    setExpectedAudience("")
    setClaimConditions([{ id: "claim-1", key: "", value: "" }])
    setServiceAccount("")
    setAllWorkspaces(false)
    setWorkspaceScope("Default")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusIcon data-icon="inline-start" />
          New rule
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create federation rule</DialogTitle>
          <DialogDescription>
            Match token claims and bind accepted workloads to an API identity.
          </DialogDescription>
        </DialogHeader>

        <form id={formId} onSubmit={handleSubmit}>
          <FieldGroup>
            <FieldSet>
              <FieldTitle>Basic info</FieldTitle>
              <Field>
                <FieldLabel htmlFor={`${formId}-rule-name`}>
                  Rule name
                </FieldLabel>
                <Input
                  id={`${formId}-rule-name`}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. research-jobs"
                  required
                />
                <FieldDescription>
                  Lowercase letters, numbers, and hyphens.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor={`${formId}-description`}>
                  Description
                </FieldLabel>
                <Input
                  id={`${formId}-description`}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="e.g. CI/CD pipeline workloads"
                />
                <FieldDescription>
                  Optional. Helps identify the purpose of this rule.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel>Issuer</FieldLabel>
                <Select
                  value={issuerName}
                  onValueChange={setIssuerName}
                  disabled={issuers.length === 0}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an issuer..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {issuers.map((issuer) => (
                        <SelectItem key={issuer.id} value={issuer.name}>
                          {issuer.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {issuers.length === 0 ? (
                  <FieldDescription>
                    Register an issuer before creating rules.
                  </FieldDescription>
                ) : null}
              </Field>
            </FieldSet>

            <FieldSeparator />

            <FieldSet>
              <FieldTitle>Match configuration</FieldTitle>
              <ToggleGroup
                type="single"
                defaultValue="pattern"
                variant="outline"
                spacing={2}
              >
                <ToggleGroupItem value="pattern">Pattern match</ToggleGroupItem>
                <ToggleGroupItem value="cel">CEL expression</ToggleGroupItem>
              </ToggleGroup>
              <Field>
                <FieldLabel htmlFor={`${formId}-subject-pattern`}>
                  Subject pattern
                </FieldLabel>
                <Input
                  id={`${formId}-subject-pattern`}
                  value={subjectPattern}
                  onChange={(event) => setSubjectPattern(event.target.value)}
                  placeholder="e.g. repo:my-org/my-repo:*"
                  required
                />
                <FieldDescription>
                  Exact match or prefix match if the value ends with a single
                  wildcard.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor={`${formId}-expected-audience`}>
                  Expected audience (optional)
                </FieldLabel>
                <Input
                  id={`${formId}-expected-audience`}
                  value={expectedAudience}
                  onChange={(event) => setExpectedAudience(event.target.value)}
                  placeholder="e.g. https://api.anthropic.com"
                />
                <FieldDescription>
                  The aud claim the JWT must contain.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel>Additional claim conditions (optional)</FieldLabel>
                <div className="grid gap-2">
                  {claimConditions.map((condition) => (
                    <div
                      key={condition.id}
                      className="grid gap-2 sm:grid-cols-2"
                    >
                      <Input
                        value={condition.key}
                        onChange={(event) =>
                          handleClaimChange(
                            condition.id,
                            "key",
                            event.target.value
                          )
                        }
                        placeholder="Claim key"
                      />
                      <Input
                        value={condition.value}
                        onChange={(event) =>
                          handleClaimChange(
                            condition.id,
                            "value",
                            event.target.value
                          )
                        }
                        placeholder="Expected value"
                      />
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-fit"
                  onClick={handleAddClaim}
                >
                  <PlusIcon data-icon="inline-start" />
                  Add claim
                </Button>
                <FieldDescription>
                  Exact-match key-value conditions on JWT claims. For numeric or
                  boolean claims, use a CEL expression.
                </FieldDescription>
              </Field>
            </FieldSet>

            <FieldSeparator />

            <FieldSet>
              <FieldTitle>Target</FieldTitle>
              <Field>
                <FieldLabel>Service account</FieldLabel>
                <Select
                  value={serviceAccount}
                  onValueChange={setServiceAccount}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a service account..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {SERVICE_ACCOUNTS.map((account) => (
                        <SelectItem key={account} value={account}>
                          {account}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </FieldSet>

            <FieldSeparator />

            <FieldSet>
              <FieldLegend variant="label">Authorization</FieldLegend>
              <FieldLabel>
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Enable in all workspaces</FieldTitle>
                    <FieldDescription>
                      Tokens minted by this rule are valid in every workspace,
                      including ones created later.
                    </FieldDescription>
                  </FieldContent>
                  <Switch
                    id={`${formId}-all-workspaces`}
                    checked={allWorkspaces}
                    onCheckedChange={setAllWorkspaces}
                  />
                </Field>
              </FieldLabel>
              <Field data-disabled={allWorkspaces}>
                <FieldLabel>Workspaces</FieldLabel>
                <Select
                  value={workspaceScope}
                  onValueChange={setWorkspaceScope}
                  disabled={allWorkspaces}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a workspace..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {WORKSPACES.map((workspace) => (
                        <SelectItem key={workspace} value={workspace}>
                          {workspace}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldDescription>
                  Choose where tokens minted by this rule can be exchanged.
                </FieldDescription>
              </Field>
            </FieldSet>
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button
            type="submit"
            form={formId}
            disabled={
              !name || !issuerName || !subjectPattern || !serviceAccount
            }
          >
            Create rule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { FederationRuleDialog }
