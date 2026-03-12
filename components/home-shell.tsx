"use client"

import {
  ArrowRight,
  Building2,
  ChevronDown,
  CircleDollarSign,
  CreditCard,
  HandCoins,
  LayoutGrid,
  Package2,
  Plus,
  Receipt,
  Search,
  Users,
  Wallet,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
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

const lowStockItems = [
  { name: "Coke Mismo", stock: "3 bottles", category: "Drinks" },
  { name: "Lucky Me Pancit Canton", stock: "5 packs", category: "Noodles" },
  { name: "555 Sardines", stock: "2 cans", category: "Canned Goods" },
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

const navItems = [
  { label: "Home", icon: LayoutGrid, active: true },
  { label: "Inventory", icon: Package2, active: false },
  { label: "POS", icon: CreditCard, active: false },
  { label: "Utang", icon: HandCoins, active: false },
  { label: "Payroll", icon: Wallet, active: false },
]

function BusinessSwitcher() {
  const activeBusiness = businesses.find((business) => business.active) ?? businesses[0]

  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" className="h-auto px-3 py-2" />}>
        <div className="flex items-center gap-3 text-left">
          <div className="bg-primary/10 text-primary flex size-9 items-center justify-center border border-primary/20">
            <Building2 className="size-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{activeBusiness.name}</p>
            <p className="text-xs text-muted-foreground">
              {activeBusiness.type} • {activeBusiness.location}
            </p>
          </div>
          <ChevronDown className="size-4 text-muted-foreground" />
        </div>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[85svh] gap-0 border-t">
        <SheetHeader className="border-b">
          <SheetTitle>Businesses</SheetTitle>
          <SheetDescription>
            Dummy switcher for Phase 0 frontend. Session wiring comes later.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-3 p-4">
          {businesses.map((business) => (
            <Card
              key={business.id}
              className={cn(
                "gap-0 p-4",
                business.active && "border-primary bg-primary/5"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{business.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {business.type} • {business.location}
                  </p>
                </div>
                <Badge variant={business.active ? "success" : "outline"}>
                  {business.active ? "Active" : "Switch"}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}

function MobileBottomNav() {
  return (
    <div className="border-border bg-background/95 fixed inset-x-0 bottom-0 z-20 border-t backdrop-blur md:hidden">
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
  return (
    <div className="bg-background min-h-svh">
      <header className="bg-background/95 sticky top-0 z-10 border-b backdrop-blur">
        <div className="flex w-full flex-col gap-4 px-4 py-4 md:px-6 lg:px-8">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Paldo
              </p>
              <h1 className="text-lg font-medium">Business at a glance</h1>
            </div>
            <Button size="sm" className="hidden md:inline-flex">
              <Plus className="size-4" />
              Quick add
            </Button>
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <BusinessSwitcher />
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

      <main className="flex w-full flex-col gap-4 px-4 py-4 pb-24 md:px-6 md:pb-8 lg:px-8">
        <Card className="overflow-hidden">
          <CardHeader className="gap-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <Badge variant="secondary" className="w-fit">
                  Phase 0 frontend
                </Badge>
                <CardTitle className="text-base">
                  Home screen only for now
                </CardTitle>
                <CardDescription className="max-w-xl text-pretty">
                  Auth, real business switching, and module navigation are not wired yet.
                  This shell uses dummy data and the current light theme tokens from
                  `globals.css`.
                </CardDescription>
              </div>
              <Button size="sm" className="hidden sm:inline-flex">
                Open POS
                <ArrowRight className="size-4" />
              </Button>
            </div>
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                aria-label="Search"
                placeholder="Search products, employees, or customers"
                className="pl-8"
              />
            </div>
          </CardHeader>
        </Card>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {overviewCards.map((item) => {
            const Icon = item.icon

            return (
              <Card key={item.label}>
                <CardHeader className="gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardDescription>{item.label}</CardDescription>
                      <CardTitle className="mt-1 text-base">{item.value}</CardTitle>
                    </div>
                    <div className="bg-muted flex size-9 items-center justify-center">
                      <Icon className="size-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{item.helper}</p>
                </CardContent>
              </Card>
            )
          })}
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
              <CardDescription>
                Keep the entry points simple on mobile. These can map to real flows later.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 sm:grid-cols-2">
              {quickActions.map((action) => {
                const Icon = action.icon

                return (
                  <Button
                    key={action.label}
                    variant="outline"
                    className="h-auto justify-start px-3 py-3"
                  >
                    <div className="bg-muted flex size-8 items-center justify-center">
                      <Icon className="size-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 text-left">
                      <p className="text-xs font-medium text-foreground">{action.label}</p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </Button>
                )
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Today&apos;s focus</CardTitle>
              <CardDescription>
                Inventory and payroll highlights surfaced on the home screen.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                {lowStockItems.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between gap-3 border px-3 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium">{item.name}</p>
                      <p className="text-[11px] text-muted-foreground">{item.category}</p>
                    </div>
                    <Badge variant="outline">{item.stock}</Badge>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex items-center justify-between gap-3 text-xs">
                <div>
                  <p className="font-medium">Payroll countdown</p>
                  <p className="text-muted-foreground">Draft run scheduled on March 17, 2026</p>
                </div>
                <Badge variant="secondary">5 days</Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Recent transactions</CardTitle>
            <CardDescription>
              Dummy activity feed for the dashboard module preview.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTransactions.map((transaction, index) => (
              <div key={transaction.id}>
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium">
                      {transaction.id} • {transaction.customer}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {transaction.method} • {transaction.time}
                    </p>
                  </div>
                  <p className="text-xs font-medium">{transaction.amount}</p>
                </div>
                {index < recentTransactions.length - 1 ? <Separator className="mt-3" /> : null}
              </div>
            ))}
          </CardContent>
        </Card>
      </main>

      <MobileBottomNav />
    </div>
  )
}
