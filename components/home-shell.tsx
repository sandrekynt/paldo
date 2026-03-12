"use client"

import * as React from "react"
import {
  ChevronDown,
  CreditCard,
  HandCoins,
  LayoutGrid,
  Package2,
  Wallet,
} from "lucide-react"

import { InventoryWorkspace } from "@/components/inventory-workspace"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { demoBusinesses } from "@/lib/dummy-data"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Home", icon: LayoutGrid, active: false },
  { label: "Inventory", icon: Package2, active: true },
  { label: "POS", icon: CreditCard, active: false },
  { label: "Utang", icon: HandCoins, active: false },
  { label: "Payroll", icon: Wallet, active: false },
]

type BusinessSelectorProps = {
  selectedBusinessId: string
  onSelect: (id: string) => void
}

function BusinessSelectorLabel({ businessId }: { businessId: string }) {
  const business =
    demoBusinesses.find((entry) => entry.id === businessId) ?? demoBusinesses[0]

  return (
    <div className="min-w-0">
      <p className="truncate text-sm font-medium">{business.name}</p>
      <p className="truncate text-xs text-muted-foreground">
        {business.type} • {business.address}
      </p>
    </div>
  )
}

function BusinessSelectorTrigger({
  businessId,
  className,
  ...props
}: {
  businessId: string
  className?: string
} & React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant="outline"
      className={cn("h-auto justify-between p-4", className)}
      type="button"
      {...props}
    >
      <div className="flex w-full min-w-0 items-center justify-between gap-3 text-left">
        <BusinessSelectorLabel businessId={businessId} />
        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </div>
    </Button>
  )
}

function MobileBusinessSwitcher({
  selectedBusinessId,
  onSelect,
}: BusinessSelectorProps) {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <BusinessSelectorTrigger
            businessId={selectedBusinessId}
            className="w-full sm:w-88 xl:w-[24rem]"
          />
        }
      />
      <SheetContent side="bottom" className="max-h-[85svh] gap-0 border-t">
        <SheetHeader className="border-b">
          <SheetTitle>Businesses</SheetTitle>
          <SheetDescription>
            Inventory dummy states switch per business while backend wiring is
            still pending.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-3 p-4">
          {demoBusinesses.map((business) => (
            <SheetClose
              key={business.id}
              render={<button type="button" className="text-left" />}
              onClick={() => onSelect(business.id)}
            >
              <Card
                className={cn(
                  "gap-0 p-4",
                  business.id === selectedBusinessId &&
                    "border-primary bg-primary/10"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{business.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {business.type} • {business.address}
                    </p>
                  </div>
                </div>
              </Card>
            </SheetClose>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}

function DesktopBusinessSwitcher({
  selectedBusinessId,
  onSelect,
}: BusinessSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative hidden md:block">
      <BusinessSelectorTrigger
        businessId={selectedBusinessId}
        className="w-88 xl:w-[24rem]"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      />
      {open ? (
        <div className="absolute top-full left-0 z-20 mt-2 w-88 border border-border bg-popover shadow-sm xl:w-[24rem]">
          <div className="grid gap-2 p-4">
            {demoBusinesses.map((business) => (
              <button
                key={business.id}
                type="button"
                onClick={() => {
                  onSelect(business.id)
                  setOpen(false)
                }}
                className={cn(
                  "text-left transition-colors hover:bg-muted",
                  business.id === selectedBusinessId && "bg-primary/10"
                )}
              >
                <Card
                  className={cn(
                    "gap-0 p-4",
                    business.id === selectedBusinessId &&
                      "border-primary bg-primary/10"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{business.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {business.type} • {business.address}
                      </p>
                    </div>
                  </div>
                </Card>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function MobileBottomNav() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 shadow-sm backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5">
        {navItems.map((item) => {
          const Icon = item.icon

          return (
            <button
              key={item.label}
              type="button"
              className={cn(
                "flex min-h-16 flex-col items-center justify-center gap-1 px-2 text-[11px]",
                item.active ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <Icon className="size-4" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function HomeShell() {
  const [selectedBusinessId, setSelectedBusinessId] = React.useState(
    demoBusinesses[0].id
  )

  return (
    <div className="min-h-svh bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 shadow-sm backdrop-blur">
        <div className="p-4">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:hidden">
              <MobileBusinessSwitcher
                selectedBusinessId={selectedBusinessId}
                onSelect={setSelectedBusinessId}
              />
            </div>
            <DesktopBusinessSwitcher
              selectedBusinessId={selectedBusinessId}
              onSelect={setSelectedBusinessId}
            />
            <div className="hidden items-center gap-2 md:flex">
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  variant={item.active ? "secondary" : "ghost"}
                  size="sm"
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="min-h-[calc(100svh-8rem)] w-full p-4">
        <InventoryWorkspace selectedBusinessId={selectedBusinessId} />
      </main>

      <MobileBottomNav />
    </div>
  )
}
