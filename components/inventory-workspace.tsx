"use client"

import * as React from "react"
import { PackagePlus, Search, SlidersHorizontal } from "lucide-react"

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

type ProductStatus = "low" | "healthy" | "archived"

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
const defaultStatuses: ProductStatus[] = ["low", "healthy"]
const statusOptions: { id: ProductStatus; label: string }[] = [
  { id: "low", label: "Low stock" },
  { id: "healthy", label: "Healthy" },
  { id: "archived", label: "Archived" },
]

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value)
}

function getStatusBadge(product: DemoProduct) {
  const status = getProductStatus(product)

  if (status === "archived") {
    return (
      <Badge variant="outline" className="border-dashed text-muted-foreground">
        Archived
      </Badge>
    )
  }

  if (status === "low") {
    return (
      <Badge className="border-transparent bg-red-100 text-red-700">
        Low stock
      </Badge>
    )
  }

  return <Badge variant="success">Healthy</Badge>
}

function getProductStatus(product: DemoProduct): ProductStatus {
  if (!product.isActive) {
    return "archived"
  }

  if (product.currentStock <= product.lowStockThreshold) {
    return "low"
  }

  return "healthy"
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
          <Input
            value={draft.name}
            onChange={(event) => onChange("name", event.target.value)}
          />
        </Field>
        <Field label="Category">
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
            onChange={(event) =>
              onChange("lowStockThreshold", event.target.value)
            }
          />
        </Field>
      </div>

      <Field label="Category suggestions">
        <div className="flex flex-wrap gap-2">
          {suggestedCategories.map((category) => (
            <button
              key={category}
              type="button"
              className="rounded-none border border-border px-2 py-1 text-xs hover:bg-muted"
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
                "rounded-none border border-border px-2 py-1 text-xs capitalize",
                draft.unit === unit &&
                  "border-primary bg-primary/10 text-primary"
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
    <tr className="border-t border-border">
      <td className="px-3 py-3">
        <p className="text-xs font-medium">{product.name}</p>
        <p className="text-[11px] text-muted-foreground">{product.id}</p>
      </td>
      <td className="px-3 py-3 text-xs text-muted-foreground">
        {product.category}
      </td>
      <td className="px-3 py-3 text-xs">
        {formatCurrency(product.buyingPrice, currency)}
      </td>
      <td className="px-3 py-3 text-xs">
        {formatCurrency(product.sellingPrice, currency)}
      </td>
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
  const [selectedStatuses, setSelectedStatuses] =
    React.useState<ProductStatus[]>(defaultStatuses)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [addDraft, setAddDraft] = React.useState(inventory.drafts.addProduct)
  const [filtersOpen, setFiltersOpen] = React.useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false)
  const filtersRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!filtersRef.current?.contains(event.target as Node)) {
        setFiltersOpen(false)
      }
    }

    document.addEventListener("mousedown", handlePointerDown)

    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
    }
  }, [])

  React.useEffect(() => {
    setSelectedStatuses(defaultStatuses)
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

    return (
      selectedStatuses.length === 0 ||
      selectedStatuses.includes(getProductStatus(product))
    )
  })

  React.useEffect(() => {
    setPage(1)
  }, [searchQuery, selectedStatuses, selectedBusinessId])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  )
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * PRODUCTS_PER_PAGE
  const paginatedProducts = filteredProducts.slice(
    pageStart,
    pageStart + PRODUCTS_PER_PAGE
  )

  function toggleStatus(status: ProductStatus) {
    setSelectedStatuses((current) =>
      current.includes(status)
        ? current.filter((value) => value !== status)
        : [...current, status]
    )
  }

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
                <SheetClose render={<Button variant="ghost" />}>
                  Cancel
                </SheetClose>
                <Button>Save new product</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search product, category, or ID"
              className="pl-8"
            />
          </div>
          <div className="justify-self-end">
            <div ref={filtersRef} className="relative hidden md:block">
              <Button
                size="default"
                variant="outline"
                className={cn("h-8", filtersOpen && "border-primary")}
                onClick={() => setFiltersOpen((current) => !current)}
              >
                <SlidersHorizontal className="size-4" />
                Filters
                {selectedStatuses.length > 0
                  ? ` (${selectedStatuses.length})`
                  : ""}
              </Button>
              {filtersOpen ? (
                <div className="absolute top-full right-0 z-20 mt-2 w-44 border border-border bg-popover p-4 shadow-sm">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-xs font-medium">Statuses</p>
                    <button
                      type="button"
                      className="text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => setSelectedStatuses([])}
                    >
                      Clear
                    </button>
                  </div>
                  <div className="grid gap-3 text-xs">
                    {statusOptions.map((item) => {
                      const checked = selectedStatuses.includes(item.id)

                      return (
                        <label
                          key={item.id}
                          className="flex items-center gap-3 text-foreground"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleStatus(item.id)}
                            className="size-4 rounded-none border border-input accent-(--color-primary)"
                          />
                          <span>{item.label}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              ) : null}
            </div>

            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger
                render={
                  <Button
                    size="default"
                    variant="outline"
                    className="h-8 md:hidden"
                  >
                    <SlidersHorizontal className="size-4" />
                    Filters
                    {selectedStatuses.length > 0
                      ? ` (${selectedStatuses.length})`
                      : ""}
                  </Button>
                }
              />
              <SheetContent
                side="bottom"
                className="max-h-[85svh] gap-0 border-t md:hidden"
              >
                <SheetHeader className="border-b">
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="grid gap-4 overflow-y-auto p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-medium">Statuses</p>
                    <button
                      type="button"
                      className="text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => setSelectedStatuses([])}
                    >
                      Clear
                    </button>
                  </div>
                  <div className="grid gap-3 text-xs">
                    {statusOptions.map((item) => {
                      const checked = selectedStatuses.includes(item.id)

                      return (
                        <label
                          key={item.id}
                          className="flex items-center gap-3 text-foreground"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleStatus(item.id)}
                            className="size-4 rounded-none border border-input accent-(--color-primary)"
                          />
                          <span>{item.label}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>
                <SheetFooter className="border-t">
                  <SheetClose render={<Button variant="ghost" />}>
                    Done
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="hidden overflow-x-auto lg:block">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-secondary text-left text-[11px] text-muted-foreground uppercase">
                <th className="px-3 py-3 align-middle">Name</th>
                <th className="px-3 py-3 align-middle">Category</th>
                <th className="px-3 py-3 align-middle">Buying</th>
                <th className="px-3 py-3 align-middle">Selling</th>
                <th className="px-3 py-3 align-middle">Stock qty</th>
                <th className="px-3 py-3 align-middle">Threshold</th>
                <th className="px-3 py-3 align-middle">Status</th>
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
            <div
              key={product.id}
              className="grid gap-3 border border-border p-3 text-left"
            >
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
                <span>
                  Buy {formatCurrency(product.buyingPrice, business.currency)}
                </span>
                <span>
                  Sell {formatCurrency(product.sellingPrice, business.currency)}
                </span>
                <span>Stock {product.currentStock}</span>
                <span>Threshold {product.lowStockThreshold}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="border border-border bg-muted/20 p-6 text-center text-xs text-muted-foreground">
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
          <div className="flex h-8 items-center border border-border px-3">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="default"
            className="h-8"
            disabled={currentPage === totalPages}
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
