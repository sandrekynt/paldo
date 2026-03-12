"use client"

import * as React from "react"
import { PackagePlus, Search } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  demoBusinesses,
  getInventoryDemo,
  inventoryUnitOptions,
  type DemoProduct,
} from "@/lib/dummy-data"
import { cn } from "@/lib/utils"

type InventoryWorkspaceProps = {
  selectedBusinessId: string
}

type StockFilter = "all" | "low" | "healthy" | "archived"

type ProductDraft = {
  name: string
  category: string
  unit: string
  buyingPrice: string
  sellingPrice: string
  currentStock: string
  lowStockThreshold: string
}

const PRODUCTS_PER_PAGE = 5

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value)
}

function getStatusBadge(product: DemoProduct) {
  if (!product.isActive) {
    return (
      <Badge variant="outline" className="border-dashed text-muted-foreground">
        Archived
      </Badge>
    )
  }

  if (product.currentStock <= product.lowStockThreshold) {
    return (
      <Badge className="border-transparent bg-red-100 text-red-700">
        Low stock
      </Badge>
    )
  }

  return <Badge variant="success">Healthy</Badge>
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <label className="grid gap-2 text-xs">
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium text-foreground">{label}</span>
        {hint ? <span className="text-muted-foreground">{hint}</span> : null}
      </div>
      {children}
    </label>
  )
}

function ProductForm({
  draft,
  suggestedCategories,
  onChange,
}: {
  draft: ProductDraft
  suggestedCategories: string[]
  onChange: (field: keyof ProductDraft, value: string) => void
}) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Name">
          <Input value={draft.name} onChange={(event) => onChange("name", event.target.value)} />
        </Field>
        <Field label="Category" hint="free text">
          <Input
            value={draft.category}
            onChange={(event) => onChange("category", event.target.value)}
          />
        </Field>
        <Field label="Buying price">
          <Input
            value={draft.buyingPrice}
            onChange={(event) => onChange("buyingPrice", event.target.value)}
          />
        </Field>
        <Field label="Selling price">
          <Input
            value={draft.sellingPrice}
            onChange={(event) => onChange("sellingPrice", event.target.value)}
          />
        </Field>
        <Field label="Current stock">
          <Input
            value={draft.currentStock}
            onChange={(event) => onChange("currentStock", event.target.value)}
          />
        </Field>
        <Field label="Low stock threshold">
          <Input
            value={draft.lowStockThreshold}
            onChange={(event) => onChange("lowStockThreshold", event.target.value)}
          />
        </Field>
      </div>

      <Field label="Category suggestions">
        <div className="flex flex-wrap gap-2">
          {suggestedCategories.map((category) => (
            <button
              key={category}
              type="button"
              className="border-border hover:bg-muted rounded-none border px-2 py-1 text-xs"
              onClick={() => onChange("category", category)}
            >
              {category}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Unit">
        <div className="flex flex-wrap gap-2">
          {inventoryUnitOptions.map((unit) => (
            <button
              key={unit}
              type="button"
              className={cn(
                "border-border rounded-none border px-2 py-1 text-xs capitalize",
                draft.unit === unit && "border-primary bg-primary/10 text-primary"
              )}
              onClick={() => onChange("unit", unit)}
            >
              {unit}
            </button>
          ))}
        </div>
      </Field>
    </div>
  )
}

function ProductListRow({
  product,
  currency,
}: {
  product: DemoProduct
  currency: string
}) {
  return (
    <tr className="border-border border-t">
      <td className="px-3 py-3">
        <p className="text-xs font-medium">{product.name}</p>
        <p className="text-[11px] text-muted-foreground">{product.id}</p>
      </td>
      <td className="px-3 py-3 text-xs text-muted-foreground">{product.category}</td>
      <td className="px-3 py-3 text-xs">{formatCurrency(product.buyingPrice, currency)}</td>
      <td className="px-3 py-3 text-xs">{formatCurrency(product.sellingPrice, currency)}</td>
      <td className="px-3 py-3 text-xs">
        <div className="flex items-center gap-2">
          <span>{product.currentStock}</span>
          <span className="text-muted-foreground">{product.unit}</span>
        </div>
      </td>
      <td className="px-3 py-3 text-xs">{product.lowStockThreshold}</td>
      <td className="px-3 py-3">{getStatusBadge(product)}</td>
    </tr>
  )
}

export function InventoryWorkspace({
  selectedBusinessId,
}: InventoryWorkspaceProps) {
  const business =
    demoBusinesses.find((entry) => entry.id === selectedBusinessId) ??
    demoBusinesses[0]
  const inventory = getInventoryDemo(business.id)
  const [stockFilter, setStockFilter] = React.useState<StockFilter>("all")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [addDraft, setAddDraft] = React.useState(inventory.drafts.addProduct)

  React.useEffect(() => {
    setStockFilter("all")
    setSearchQuery("")
    setPage(1)
    setAddDraft(inventory.drafts.addProduct)
  }, [inventory])

  const filteredProducts = inventory.products.filter((product) => {
    const normalizedQuery = searchQuery.trim().toLowerCase()
    const matchesQuery =
      normalizedQuery.length === 0 ||
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.category.toLowerCase().includes(normalizedQuery) ||
      product.id.toLowerCase().includes(normalizedQuery)

    if (!matchesQuery) {
      return false
    }

    if (stockFilter === "archived") {
      return !product.isActive
    }

    if (!product.isActive) {
      return false
    }

    if (stockFilter === "low") {
      return product.currentStock <= product.lowStockThreshold
    }

    if (stockFilter === "healthy") {
      return product.currentStock > product.lowStockThreshold
    }

    return true
  })

  React.useEffect(() => {
    setPage(1)
  }, [searchQuery, stockFilter, selectedBusinessId])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * PRODUCTS_PER_PAGE
  const paginatedProducts = filteredProducts.slice(
    pageStart,
    pageStart + PRODUCTS_PER_PAGE
  )

  return (
    <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <CardTitle>Product list</CardTitle>
            <Sheet>
              <SheetTrigger
                render={
                  <Button>
                    <PackagePlus className="size-4" />
                    Add product
                  </Button>
                }
              />
              <SheetContent side="center" className="rounded-none">
                <SheetHeader className="border-b">
                  <SheetTitle>Add product</SheetTitle>
                </SheetHeader>
                <div className="p-4">
                  <ProductForm
                    draft={addDraft}
                    suggestedCategories={inventory.suggestedCategories}
                    onChange={(field, value) =>
                      setAddDraft((current) => ({ ...current, [field]: value }))
                    }
                  />
                </div>
                <SheetFooter className="border-t sm:flex-row sm:justify-between">
                  <SheetClose render={<Button variant="ghost" />}>Cancel</SheetClose>
                  <Button>Save new product</Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search product, category, or ID"
              className="pl-8"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "All active" },
              { id: "low", label: "Low stock" },
              { id: "healthy", label: "Healthy" },
              { id: "archived", label: "Archived" },
            ].map((item) => (
              <Button
                key={item.id}
                size="default"
                variant="outline"
                className={cn(
                  "h-8",
                  stockFilter === item.id && "border-primary"
                )}
                onClick={() => setStockFilter(item.id as StockFilter)}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="hidden overflow-x-auto lg:block">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="text-left text-[11px] uppercase text-muted-foreground">
                <th className="px-3 pb-3">Name</th>
                <th className="px-3 pb-3">Category</th>
                <th className="px-3 pb-3">Buying</th>
                <th className="px-3 pb-3">Selling</th>
                <th className="px-3 pb-3">Stock qty</th>
                <th className="px-3 pb-3">Threshold</th>
                <th className="px-3 pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product) => (
                <ProductListRow
                  key={product.id}
                  product={product}
                  currency={business.currency}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid gap-3 lg:hidden">
          {paginatedProducts.map((product) => (
            <div key={product.id} className="border-border grid gap-3 border p-3 text-left">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">{product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {product.category} · {product.unit}
                  </p>
                </div>
                {getStatusBadge(product)}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <span>Buy {formatCurrency(product.buyingPrice, business.currency)}</span>
                <span>Sell {formatCurrency(product.sellingPrice, business.currency)}</span>
                <span>Stock {product.currentStock}</span>
                <span>Threshold {product.lowStockThreshold}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="border-border bg-muted/20 border p-6 text-center text-xs text-muted-foreground">
            No products match this filter yet.
          </div>
        ) : null}
        </CardContent>
        <CardFooter className="justify-between border-t pt-4 text-xs text-muted-foreground">
          <div>
            {filteredProducts.length === 0
              ? "0 results"
              : `${pageStart + 1}-${Math.min(
                  pageStart + PRODUCTS_PER_PAGE,
                  filteredProducts.length
                )} of ${filteredProducts.length}`}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="default"
              className="h-8"
              disabled={currentPage === 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
            >
              Previous
            </Button>
            <div className="border-border flex h-8 items-center border px-3">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="default"
              className="h-8"
              disabled={currentPage === totalPages}
              onClick={() =>
                setPage((value) => Math.min(totalPages, value + 1))
              }
            >
              Next
            </Button>
          </div>
        </CardFooter>
    </Card>
  )
}
