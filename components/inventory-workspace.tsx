"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import {
  ChevronDown,
  PackagePlus,
  PencilLine,
  Search,
  SlidersHorizontal,
  Trash2,
} from "lucide-react"

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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  demoBusinesses,
  getInventoryDemo,
  inventoryUnitOptions,
  type DemoProduct,
} from "@/lib/dummy-data"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

type InventoryWorkspaceProps = {
  selectedBusinessId: string
}

type ProductStatus = "low" | "healthy" | "archived"
type OptionField = "category" | "unit"
type OptionDialogState = {
  action: "edit" | "delete"
  field: OptionField
  value: string
}

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

function getDraftFromProduct(product: DemoProduct): ProductDraft {
  return {
    name: product.name,
    category: product.category,
    unit: product.unit,
    buyingPrice: product.buyingPrice.toFixed(2),
    sellingPrice: product.sellingPrice.toFixed(2),
    currentStock: String(product.currentStock),
    lowStockThreshold: String(product.lowStockThreshold),
  }
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

function SearchableOptionSelect({
  value,
  options,
  placeholder,
  onChange,
  onOptionsChange,
  onRequestEdit,
  onRequestDelete,
}: {
  value: string
  options: string[]
  placeholder: string
  onChange: (value: string) => void
  onOptionsChange: (values: string[]) => void
  onRequestEdit: (value: string) => void
  onRequestDelete: (value: string) => void
}) {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  const normalizedQuery = query.trim().toLowerCase()
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(normalizedQuery)
  )
  const exactMatch = options.find(
    (option) => option.toLowerCase() === normalizedQuery
  )

  function closeMenu() {
    setOpen(false)
    setQuery("")
  }

  function saveOption() {
    const trimmed = query.trim()

    if (!trimmed) {
      return
    }

    if (exactMatch) {
      onChange(exactMatch)
      closeMenu()
      return
    }

    onOptionsChange([...options, trimmed])
    onChange(trimmed)
    closeMenu()
  }

  const visibleOptions = normalizedQuery.length === 0 ? options : filteredOptions

  const optionList = (
    <div className="grid gap-3">
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              saveOption()
            }
          }}
          placeholder={`Search or add ${placeholder.toLowerCase()}`}
        />
        <Button
          type="button"
          variant="outline"
          className="h-8"
          disabled={query.trim().length === 0}
          onClick={saveOption}
        >
          Add
        </Button>
      </div>

      <div className="grid max-h-[min(15rem,var(--available-height))] gap-2 overflow-y-auto">
        {visibleOptions.map((option) => (
          <div
            key={option}
            className={cn(
              "flex items-stretch justify-between gap-2 border border-border",
              value === option && "border-primary bg-primary/10"
            )}
          >
            <button
              type="button"
              className="min-w-0 flex-1 px-2 py-2 text-left text-xs"
              onClick={() => {
                onChange(option)
                closeMenu()
              }}
            >
              <span className="block truncate">{option}</span>
            </button>
            <div className="flex items-center gap-1 p-1">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      onClick={(event) => {
                        event.stopPropagation()
                        closeMenu()
                        onRequestEdit(option)
                      }}
                    />
                  }
                >
                  <PencilLine className="size-3.5" />
                </TooltipTrigger>
                <TooltipContent>Edit</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon-sm"
                      onClick={(event) => {
                        event.stopPropagation()
                        closeMenu()
                        onRequestDelete(option)
                      }}
                    />
                  }
                >
                  <Trash2 className="size-3.5" />
                </TooltipTrigger>
                <TooltipContent>Delete</TooltipContent>
              </Tooltip>
            </div>
          </div>
        ))}

        {visibleOptions.length === 0 ? (
          <div className="border border-border p-3 text-xs text-muted-foreground">
            No matches yet.
          </div>
        ) : null}
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <Sheet
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen)

          if (!nextOpen) {
            setQuery("")
          }
        }}
      >
        <SheetTrigger
          render={
            <Button
              type="button"
              variant="outline"
              className={cn("h-8 w-full justify-between", open && "border-primary")}
            />
          }
        >
          <span className={cn("truncate", !value && "text-muted-foreground")}>
            {value || placeholder}
          </span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </SheetTrigger>
        <SheetContent side="bottom" className="max-h-[85svh] gap-0 border-t">
          <SheetHeader className="border-b">
            <SheetTitle>{placeholder}</SheetTitle>
          </SheetHeader>
          <div className="overflow-y-auto p-4">{optionList}</div>
          <SheetFooter className="border-t">
            <SheetClose render={<Button variant="ghost" />}>Done</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <PopoverPrimitive.Root
      modal={false}
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)

        if (!nextOpen) {
          setQuery("")
        }
      }}
    >
      <PopoverPrimitive.Trigger
        render={
          <Button
            type="button"
            variant="outline"
            className={cn("h-8 w-full justify-between", open && "border-primary")}
          />
        }
      >
        <span className={cn("truncate", !value && "text-muted-foreground")}>
          {value || placeholder}
        </span>
        <ChevronDown className="size-4 text-muted-foreground" />
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner
          side="bottom"
          align="start"
          sideOffset={8}
          collisionPadding={8}
          className="z-[70]"
        >
          <PopoverPrimitive.Popup
            initialFocus={inputRef}
            finalFocus={false}
            className="w-[var(--anchor-width)] border border-border bg-popover p-4 shadow-sm outline-none"
          >
            {optionList}
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

function ProductForm({
  draft,
  categoryOptions,
  unitOptions,
  onChange,
  onCategoryOptionsChange,
  onUnitOptionsChange,
  onRequestCategoryEdit,
  onRequestCategoryDelete,
  onRequestUnitEdit,
  onRequestUnitDelete,
}: {
  draft: ProductDraft
  categoryOptions: string[]
  unitOptions: string[]
  onChange: (field: keyof ProductDraft, value: string) => void
  onCategoryOptionsChange: (values: string[]) => void
  onUnitOptionsChange: (values: string[]) => void
  onRequestCategoryEdit: (value: string) => void
  onRequestCategoryDelete: (value: string) => void
  onRequestUnitEdit: (value: string) => void
  onRequestUnitDelete: (value: string) => void
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
          <SearchableOptionSelect
            value={draft.category}
            options={categoryOptions}
            placeholder="Select category"
            onChange={(value) => onChange("category", value)}
            onOptionsChange={onCategoryOptionsChange}
            onRequestEdit={onRequestCategoryEdit}
            onRequestDelete={onRequestCategoryDelete}
          />
        </Field>
        <Field label="Unit">
          <SearchableOptionSelect
            value={draft.unit}
            options={unitOptions}
            placeholder="Select unit"
            onChange={(value) => onChange("unit", value)}
            onOptionsChange={onUnitOptionsChange}
            onRequestEdit={onRequestUnitEdit}
            onRequestDelete={onRequestUnitDelete}
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
    </div>
  )
}

function ProductListRow({
  product,
  currency,
  onEdit,
}: {
  product: DemoProduct
  currency: string
  onEdit: () => void
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
      <td className="px-3 py-3 text-center">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="outline"
                size="icon-sm"
                aria-label={`Edit ${product.name}`}
                onClick={onEdit}
              />
            }
          >
            <PencilLine className="size-3.5" />
          </TooltipTrigger>
          <TooltipContent>Edit</TooltipContent>
        </Tooltip>
      </td>
    </tr>
  )
}

export function InventoryWorkspace({
  selectedBusinessId,
}: InventoryWorkspaceProps) {
  const isMobile = useIsMobile()
  const business =
    demoBusinesses.find((entry) => entry.id === selectedBusinessId) ??
    demoBusinesses[0]
  const inventory = getInventoryDemo(business.id)
  const [selectedStatuses, setSelectedStatuses] =
    React.useState<ProductStatus[]>(defaultStatuses)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [addDraft, setAddDraft] = React.useState(inventory.drafts.addProduct)
  const [categoryOptions, setCategoryOptions] = React.useState<string[]>(
    inventory.suggestedCategories
  )
  const [unitOptions, setUnitOptions] = React.useState<string[]>(
    Array.from(inventoryUnitOptions)
  )
  const [optionDialog, setOptionDialog] =
    React.useState<OptionDialogState | null>(null)
  const [optionDialogValue, setOptionDialogValue] = React.useState("")
  const [editDraft, setEditDraft] = React.useState<ProductDraft | null>(null)
  const [editingProductId, setEditingProductId] = React.useState<string | null>(
    null
  )
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
    setCategoryOptions(inventory.suggestedCategories)
    setUnitOptions(Array.from(inventoryUnitOptions))
    setOptionDialog(null)
    setOptionDialogValue("")
    setEditDraft(null)
    setEditingProductId(null)
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
  const editingProduct =
    editingProductId !== null
      ? (inventory.products.find(
          (product) => product.id === editingProductId
        ) ?? null)
      : null

  function toggleStatus(status: ProductStatus) {
    setSelectedStatuses((current) =>
      current.includes(status)
        ? current.filter((value) => value !== status)
        : [...current, status]
    )
  }

  function openEditModal(product: DemoProduct) {
    setEditingProductId(product.id)
    setEditDraft(getDraftFromProduct(product))
  }

  function openOptionDialog(
    field: OptionField,
    action: "edit" | "delete",
    value: string
  ) {
    setOptionDialog({ field, action, value })
    setOptionDialogValue(value)
  }

  function closeOptionDialog() {
    setOptionDialog(null)
    setOptionDialogValue("")
  }

  function updateFieldOptions(field: OptionField, values: string[]) {
    if (field === "category") {
      setCategoryOptions(values)
      return
    }

    setUnitOptions(values)
  }

  function updateDraftFieldValue(
    field: OptionField,
    nextValue: string,
    previousValue: string
  ) {
    setAddDraft((current) =>
      current[field] === previousValue
        ? { ...current, [field]: nextValue }
        : current
    )
    setEditDraft((current) =>
      current && current[field] === previousValue
        ? { ...current, [field]: nextValue }
        : current
    )
  }

  function applyOptionDialog() {
    if (!optionDialog) {
      return
    }

    const sourceOptions =
      optionDialog.field === "category" ? categoryOptions : unitOptions

    if (optionDialog.action === "edit") {
      const trimmed = optionDialogValue.trim()

      if (!trimmed || trimmed === optionDialog.value) {
        closeOptionDialog()
        return
      }

      const nextOptions = sourceOptions.reduce<string[]>((result, option) => {
        const nextOption = option === optionDialog.value ? trimmed : option

        if (!result.includes(nextOption)) {
          result.push(nextOption)
        }

        return result
      }, [])

      updateFieldOptions(optionDialog.field, nextOptions)
      updateDraftFieldValue(optionDialog.field, trimmed, optionDialog.value)
      closeOptionDialog()
      return
    }

    const nextOptions = sourceOptions.filter(
      (option) => option !== optionDialog.value
    )

    updateFieldOptions(optionDialog.field, nextOptions)
    updateDraftFieldValue(optionDialog.field, "", optionDialog.value)
    closeOptionDialog()
  }

  return (
    <TooltipProvider>
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
              <SheetContent
                side={isMobile ? "bottom" : "center"}
                className={cn(
                  "rounded-none",
                  isMobile && "max-h-[85svh] gap-0 border-t overflow-y-auto"
                )}
              >
                <SheetHeader className="border-b">
                  <SheetTitle>Add product</SheetTitle>
                </SheetHeader>
                <div className="p-4">
                  <ProductForm
                    draft={addDraft}
                    categoryOptions={categoryOptions}
                    unitOptions={unitOptions}
                    onChange={(field, value) =>
                      setAddDraft((current) => ({ ...current, [field]: value }))
                    }
                    onCategoryOptionsChange={setCategoryOptions}
                    onUnitOptionsChange={setUnitOptions}
                    onRequestCategoryEdit={(value) =>
                      openOptionDialog("category", "edit", value)
                    }
                    onRequestCategoryDelete={(value) =>
                      openOptionDialog("category", "delete", value)
                    }
                    onRequestUnitEdit={(value) =>
                      openOptionDialog("unit", "edit", value)
                    }
                    onRequestUnitDelete={(value) =>
                      openOptionDialog("unit", "delete", value)
                    }
                  />
                </div>
                <SheetFooter className="flex-row justify-end border-t">
                  <SheetClose render={<Button variant="secondary" />}>
                    Cancel
                  </SheetClose>
                  <Button>Save new product</Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>

            <Sheet
              open={editingProduct !== null}
              onOpenChange={(open) => {
                if (!open) {
                  setEditingProductId(null)
                  setEditDraft(null)
                }
              }}
            >
              <SheetContent
                side={isMobile ? "bottom" : "center"}
                className={cn(
                  "rounded-none",
                  isMobile && "max-h-[85svh] gap-0 border-t overflow-y-auto"
                )}
              >
                <SheetHeader className="border-b">
                  <SheetTitle>Edit product</SheetTitle>
                </SheetHeader>
                <div className="p-4">
                  {editingProduct && editDraft ? (
                    <ProductForm
                      draft={editDraft}
                      categoryOptions={categoryOptions}
                      unitOptions={unitOptions}
                      onChange={(field, value) =>
                        setEditDraft((current) =>
                          current ? { ...current, [field]: value } : current
                        )
                      }
                      onCategoryOptionsChange={setCategoryOptions}
                      onUnitOptionsChange={setUnitOptions}
                      onRequestCategoryEdit={(value) =>
                        openOptionDialog("category", "edit", value)
                      }
                      onRequestCategoryDelete={(value) =>
                        openOptionDialog("category", "delete", value)
                      }
                      onRequestUnitEdit={(value) =>
                        openOptionDialog("unit", "edit", value)
                      }
                      onRequestUnitDelete={(value) =>
                        openOptionDialog("unit", "delete", value)
                      }
                    />
                  ) : null}
                </div>
                <SheetFooter className="flex-row justify-between border-t">
                  <Button variant="destructive">Delete</Button>
                  <div className="flex items-center gap-2">
                    <SheetClose render={<Button variant="secondary" />}>
                      Cancel
                    </SheetClose>
                    <Button>Save changes</Button>
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>

            <Sheet
              open={optionDialog !== null}
              onOpenChange={(open) => {
                if (!open) {
                  closeOptionDialog()
                }
              }}
            >
              <SheetContent
                side={isMobile ? "bottom" : "center"}
                className={cn(
                  "rounded-none",
                  isMobile && "max-h-[85svh] gap-0 border-t overflow-y-auto"
                )}
              >
                <SheetHeader className="border-b">
                  <SheetTitle>
                    {optionDialog?.action === "edit" ? "Edit" : "Delete"}{" "}
                    {optionDialog?.field}
                  </SheetTitle>
                </SheetHeader>
                <div className="grid gap-4 p-4">
                  {optionDialog?.action === "edit" ? (
                    <Field
                      label={
                        optionDialog.field === "category" ? "Category" : "Unit"
                      }
                    >
                      <Input
                        value={optionDialogValue}
                        onChange={(event) =>
                          setOptionDialogValue(event.target.value)
                        }
                      />
                    </Field>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Remove &quot;{optionDialog?.value}&quot; from the{" "}
                      {optionDialog?.field} options?
                    </p>
                  )}
                </div>
                <SheetFooter
                  className={cn(
                    "flex-row border-t",
                    optionDialog?.action === "edit"
                      ? "justify-end"
                      : "justify-end"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <SheetClose render={<Button variant="secondary" />}>
                      Cancel
                    </SheetClose>
                    {optionDialog?.action === "edit" ? (
                      <Button onClick={applyOptionDialog}>Save</Button>
                    ) : optionDialog?.action === "delete" ? (
                      <Button variant="destructive" onClick={applyOptionDialog}>
                        Delete
                      </Button>
                    ) : null}
                  </div>
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

              <Sheet
                open={mobileFiltersOpen}
                onOpenChange={setMobileFiltersOpen}
              >
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
                  <th className="px-3 py-3 text-center align-middle">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product) => (
                  <ProductListRow
                    key={product.id}
                    product={product}
                    currency={business.currency}
                    onEdit={() => openEditModal(product)}
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
                    Sell{" "}
                    {formatCurrency(product.sellingPrice, business.currency)}
                  </span>
                  <span>Stock {product.currentStock}</span>
                  <span>Threshold {product.lowStockThreshold}</span>
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    aria-label={`Edit ${product.name}`}
                    onClick={() => openEditModal(product)}
                  >
                    <PencilLine className="size-3.5" />
                  </Button>
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
              onClick={() =>
                setPage((value) => Math.min(totalPages, value + 1))
              }
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </TooltipProvider>
  )
}
