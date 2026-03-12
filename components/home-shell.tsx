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
import { Badge } from "@/components/ui/badge"
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
import { cn } from "@/lib/utils"

const businesses = [
  {
    id: "paldo-1",
    name: "Konrad Mini Mart",
    type: "Retail",
    location: "Quezon City",
    active: true,
  },
  {
    id: "paldo-2",
    name: "Southside Water Refilling",
    type: "Services",
    location: "Paranaque",
    active: false,
  },
  {
    id: "paldo-3",
    name: "Vallejos Trading",
    type: "Wholesale",
    location: "Makati",
    active: false,
  },
]

// Dashboard sections kept here for later re-enable.
/*
const overviewCards = [
  {
    label: "Today sales",
    value: "PHP 18,420",
    helper: "+12.4% vs Mar 11",
    icon: CircleDollarSign,
  },
  {
    label: "Low stock",
    value: "4 items",
    helper: "2 need restock today",
    icon: Package2,
  },
  {
    label: "Outstanding utang",
    value: "PHP 9,350",
    helper: "7 customers open",
    icon: HandCoins,
  },
  {
    label: "Next payroll",
    value: "5 days",
    helper: "Cutoff on Mar 17",
    icon: Wallet,
  },
]

const quickActions = [
  {
    label: "Add product",
    description: "Create a new inventory item",
    icon: Plus,
  },
  {
    label: "Start sale",
    description: "Open a dummy POS checkout",
    icon: CreditCard,
  },
  {
    label: "Record utang",
    description: "Log a customer balance",
    icon: Receipt,
  },
  {
    label: "Add employee",
    description: "Prepare payroll setup",
    icon: Users,
  },
]

const recentTransactions = [
  {
    id: "TXN-1032",
    customer: "Walk-in",
    amount: "PHP 740",
    method: "Cash",
    time: "10:24 AM",
  },
  {
    id: "TXN-1031",
    customer: "Ana R.",
    amount: "PHP 1,250",
    method: "Utang",
    time: "9:52 AM",
  },
  {
    id: "TXN-1030",
    customer: "GCash buyer",
    amount: "PHP 320",
    method: "GCash",
    time: "9:10 AM",
  },
]
*/

const navItems = [
  { label: "Home", icon: LayoutGrid, active: true },
  { label: "Inventory", icon: Package2, active: false },
  { label: "POS", icon: CreditCard, active: false },
  { label: "Utang", icon: HandCoins, active: false },
  { label: "Payroll", icon: Wallet, active: false },
]

type BusinessSelectorProps = {
  selectedBusinessId: string
  onSelect: (id: string) => void
}

function BusinessSelectorLabel({
  business,
}: {
  business: (typeof businesses)[number]
}) {
  return (
    <div className="min-w-0">
      <p className="truncate text-sm font-medium">{business.name}</p>
      <p className="text-xs text-muted-foreground">
        {business.type} • {business.location}
      </p>
    </div>
  )
}

function BusinessSelectorTrigger({
  business,
  className,
  ...props
}: {
  business: (typeof businesses)[number]
  className?: string
} & React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant="outline"
      className={cn("h-auto justify-between px-3 py-2", className)}
      type="button"
      {...props}
    >
      <div className="flex w-full min-w-0 items-center justify-between gap-3 text-left">
        <BusinessSelectorLabel business={business} />
        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </div>
    </Button>
  )
}

function MobileBusinessSwitcher({
  selectedBusinessId,
  onSelect,
}: BusinessSelectorProps) {
  const activeBusiness =
    businesses.find((business) => business.id === selectedBusinessId) ??
    businesses[0]

  return (
    <Sheet>
      <SheetTrigger
        render={
          <BusinessSelectorTrigger
            business={activeBusiness}
            className="w-full sm:w-88 xl:w-[24rem]"
          />
        }
      />
      <SheetContent side="bottom" className="max-h-[85svh] gap-0 border-t">
        <SheetHeader className="border-b">
          <SheetTitle>Businesses</SheetTitle>
          <SheetDescription>
            Dummy switcher for Phase 0 frontend. Session wiring comes later.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-3 p-4">
          {businesses.map((business) => (
            <SheetClose
              key={business.id}
              render={<button type="button" className="text-left" />}
              onClick={() => onSelect(business.id)}
            >
              <Card
                className={cn(
                  "gap-0 p-4",
                  business.id === selectedBusinessId &&
                    "border-primary bg-primary/5"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{business.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {business.type} • {business.location}
                    </p>
                  </div>
                  <Badge
                    variant={
                      business.id === selectedBusinessId ? "success" : "outline"
                    }
                  >
                    {business.id === selectedBusinessId ? "Active" : "Switch"}
                  </Badge>
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
  const activeBusiness =
    businesses.find((business) => business.id === selectedBusinessId) ??
    businesses[0]

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
        business={activeBusiness}
        className="w-88 xl:w-[24rem]"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      />
      {open ? (
        <div className="absolute top-full left-0 z-20 mt-2 w-88 border border-border bg-popover shadow-sm xl:w-[24rem]">
          <div className="grid gap-2 p-2">
            {businesses.map((business) => (
              <button
                key={business.id}
                type="button"
                onClick={() => {
                  onSelect(business.id)
                  setOpen(false)
                }}
                className={cn(
                  "text-left transition-colors hover:bg-muted",
                  business.id === selectedBusinessId && "bg-primary/5"
                )}
              >
                <Card
                  className={cn(
                    "gap-0 p-4",
                    business.id === selectedBusinessId && "border-primary"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{business.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {business.type} • {business.location}
                      </p>
                    </div>
                    <Badge
                      variant={
                        business.id === selectedBusinessId
                          ? "success"
                          : "outline"
                      }
                    >
                      {business.id === selectedBusinessId ? "Active" : "Switch"}
                    </Badge>
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
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 backdrop-blur md:hidden">
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
    businesses[0].id
  )

  return (
    <div className="min-h-svh bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="px-4 py-4 md:px-6 lg:px-8">
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

      <main className="min-h-[calc(100svh-8rem)] w-full px-4 py-4 pb-24 md:px-6 md:pb-8 lg:px-8" />

      <MobileBottomNav />
    </div>
  )
}
