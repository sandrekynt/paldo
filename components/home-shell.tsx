"use client"

import * as React from "react"
import {
  Bell,
  ChevronDown,
  User,
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
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useClickOutside } from "@/hooks/use-click-outside"
import { demoBusinesses } from "@/lib/dummy-data"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Home", icon: LayoutGrid },
  { label: "Inventory", icon: Package2 },
  { label: "POS", icon: CreditCard },
  { label: "Utang", icon: HandCoins },
  { label: "Payroll", icon: Wallet },
] as const

type ModuleLabel = (typeof navItems)[number]["label"]

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
            className="w-full sm:w-80"
          />
        }
      />
      <SheetContent side="bottom" className="max-h-[85svh] gap-0 border-t">
        <SheetHeader className="border-b">
          <SheetTitle>Businesses</SheetTitle>
        </SheetHeader>
        <div className="grid gap-3 p-4">
          {demoBusinesses.map((business) => (
            <SheetClose
              key={business.id}
              render={
                <button type="button" className="cursor-pointer text-left" />
              }
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
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {business.name}
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

  useClickOutside(containerRef, () => setOpen(false), open)

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative hidden md:block">
      <BusinessSelectorTrigger
        businessId={selectedBusinessId}
        className="w-72 xl:w-80"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      />
      {open ? (
        <div className="absolute top-full left-0 z-20 mt-2 w-72 border border-border bg-popover shadow-sm xl:w-80">
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
                  "cursor-pointer text-left transition-colors hover:bg-muted",
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
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {business.name}
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

function ModulePlaceholder({ label }: { label: ModuleLabel }) {
  return (
    <Card className="min-h-[calc(100svh-12rem)] items-center justify-center p-4">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
    </Card>
  )
}

function MobileBottomNav({
  selectedModule,
  onSelect,
}: {
  selectedModule: ModuleLabel
  onSelect: (module: ModuleLabel) => void
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 shadow-sm backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = item.label === selectedModule

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onSelect(item.label)}
              className={cn(
                "flex min-h-16 cursor-pointer flex-col items-center justify-center gap-1 px-2 text-[11px]",
                isActive ? "bg-primary text-white" : "text-muted-foreground"
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
  const [selectedModule, setSelectedModule] =
    React.useState<ModuleLabel>("Inventory")

  return (
    <div className="min-h-svh overflow-x-hidden bg-gray-100">
      <header className="sticky top-0 z-10 border-b bg-background/95 shadow-sm backdrop-blur">
        <div className="p-4">
          <div className="relative md:flex md:items-center md:justify-between">
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
            <div className="hidden md:absolute md:left-1/2 md:flex md:-translate-x-1/2 md:items-center md:gap-2">
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedModule(item.label)}
                  className={cn(
                    "text-xs text-muted-foreground",
                    item.label === selectedModule &&
                      "bg-primary text-white hover:bg-primary hover:text-white"
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Button>
              ))}
            </div>
            <div className="hidden items-center gap-2 md:flex">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                className="rounded-full text-xs text-muted-foreground hover:bg-primary hover:text-white"
                aria-label="Notifications"
              >
                <Bell className="size-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                className="rounded-full text-xs text-muted-foreground hover:bg-primary hover:text-white"
                aria-label="Profile"
              >
                <User className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="min-h-[calc(100svh-8rem)] w-full p-4 pb-24 md:pb-4">
        {selectedModule === "Inventory" ? (
          <InventoryWorkspace selectedBusinessId={selectedBusinessId} />
        ) : (
          <ModulePlaceholder label={selectedModule} />
        )}
      </main>

      <MobileBottomNav
        selectedModule={selectedModule}
        onSelect={setSelectedModule}
      />
    </div>
  )
}
