"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { ChevronDown, Minus, PencilLine, Plus, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
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
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  getAdjustmentDirectionMeta,
  type AddProductDraft,
  type AdjustmentDirection,
  type AdjustmentDraft,
  type FieldErrors,
  type ProductFormDraft,
  type RestockDraft,
  type StockInDraft,
} from "@/lib/inventory"
import { cn } from "@/lib/utils"

type SelectOption = {
  id: string
  label: string
  description?: string
}

function Field({
  label,
  hint,
  error,
  className,
  children,
}: {
  label: string
  hint?: string
  error?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <label className={cn("grid gap-2 text-xs", className)}>
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium text-foreground">{label}</span>
        {hint ? <span className="text-muted-foreground">{hint}</span> : null}
      </div>
      {children}
      {error ? <p className="text-[11px] text-red-600">{error}</p> : null}
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
  const rootRef = React.useRef<HTMLDivElement | null>(null)

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

  React.useEffect(() => {
    if (!isMobile) {
      return
    }

    const parentSheet = rootRef.current?.closest('[data-slot="sheet-content"]')

    if (!(parentSheet instanceof HTMLElement)) {
      return
    }

    if (open) {
      parentSheet.style.filter = "blur(3px)"
      parentSheet.style.transition = "filter 150ms ease"
    } else {
      parentSheet.style.filter = ""
      parentSheet.style.transition = ""
    }

    return () => {
      parentSheet.style.filter = ""
      parentSheet.style.transition = ""
    }
  }, [isMobile, open])

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

  const visibleOptions =
    normalizedQuery.length === 0 ? options : filteredOptions

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
              className="min-w-0 flex-1 cursor-pointer px-2 py-2 text-left text-xs"
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
                      size={isMobile ? "sm" : "icon-sm"}
                      onClick={(event) => {
                        event.stopPropagation()
                        closeMenu()
                        onRequestEdit(option)
                      }}
                    />
                  }
                >
                  <PencilLine className="size-3.5" />
                  {isMobile ? "Edit" : null}
                </TooltipTrigger>
                {!isMobile ? <TooltipContent>Edit</TooltipContent> : null}
              </Tooltip>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      type="button"
                      variant="destructive"
                      size={isMobile ? "sm" : "icon-sm"}
                      onClick={(event) => {
                        event.stopPropagation()
                        closeMenu()
                        onRequestDelete(option)
                      }}
                    />
                  }
                >
                  <Trash2 className="size-3.5" />
                  {isMobile ? "Delete" : null}
                </TooltipTrigger>
                {!isMobile ? <TooltipContent>Delete</TooltipContent> : null}
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
      <div ref={rootRef}>
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
                className="h-8 w-full justify-between"
              />
            }
          >
            <span className={cn("truncate", !value && "text-muted-foreground")}>
              {value || placeholder}
            </span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </SheetTrigger>
          <SheetContent
            side="bottom"
            overlayClassName="z-70 bg-black/15 supports-backdrop-filter:backdrop-blur-sm"
            className="z-80 max-h-[80dvh] gap-0 overflow-hidden border-t"
          >
            <SheetHeader className="border-b">
              <SheetTitle>{placeholder}</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto p-4">{optionList}</div>
            <SheetFooter className="border-t">
              <SheetClose render={<Button variant="ghost" />}>Done</SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    )
  }

  return (
    <div ref={rootRef}>
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
              className="h-8 w-full justify-between"
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
            className="z-70"
          >
            <PopoverPrimitive.Popup
              initialFocus={inputRef}
              finalFocus={false}
              className="w-(--anchor-width) border border-border bg-popover p-4 shadow-sm outline-none"
            >
              {optionList}
            </PopoverPrimitive.Popup>
          </PopoverPrimitive.Positioner>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </div>
  )
}

export function SearchableValueSelect({
  value,
  options,
  placeholder,
  searchPlaceholder,
  emptyState = "No matches found.",
  onChange,
}: {
  value: string
  options: SelectOption[]
  placeholder: string
  searchPlaceholder?: string
  emptyState?: string
  onChange: (value: string) => void
}) {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const rootRef = React.useRef<HTMLDivElement | null>(null)

  const selectedOption =
    value.length > 0 ? options.find((option) => option.id === value) : null
  const normalizedQuery = query.trim().toLowerCase()
  const visibleOptions =
    normalizedQuery.length === 0
      ? options
      : options.filter((option) =>
          `${option.label} ${option.description ?? ""}`
            .toLowerCase()
            .includes(normalizedQuery)
        )

  function closeMenu() {
    setOpen(false)
    setQuery("")
  }

  React.useEffect(() => {
    if (!isMobile) {
      return
    }

    const parentSheet = rootRef.current?.closest('[data-slot="sheet-content"]')

    if (!(parentSheet instanceof HTMLElement)) {
      return
    }

    if (open) {
      parentSheet.style.filter = "blur(3px)"
      parentSheet.style.transition = "filter 150ms ease"
    } else {
      parentSheet.style.filter = ""
      parentSheet.style.transition = ""
    }

    return () => {
      parentSheet.style.filter = ""
      parentSheet.style.transition = ""
    }
  }, [isMobile, open])

  const optionList = (
    <div className="grid gap-3">
      <Input
        ref={inputRef}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={searchPlaceholder ?? `Search ${placeholder.toLowerCase()}`}
      />
      <div className="grid max-h-[min(15rem,var(--available-height))] gap-2 overflow-y-auto">
        {visibleOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            className={cn(
              "grid gap-1 border border-border px-2 py-2 text-left text-xs transition-colors hover:bg-muted",
              value === option.id && "border-primary bg-primary/10"
            )}
            onClick={() => {
              onChange(option.id)
              closeMenu()
            }}
          >
            <span className="font-medium">{option.label}</span>
            {option.description ? (
              <span className="text-muted-foreground">
                {option.description}
              </span>
            ) : null}
          </button>
        ))}

        {visibleOptions.length === 0 ? (
          <div className="border border-border p-3 text-xs text-muted-foreground">
            {emptyState}
          </div>
        ) : null}
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <div ref={rootRef}>
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
                className="h-8 w-full justify-between"
              />
            }
          >
            <span
              className={cn(
                "truncate",
                !selectedOption && "text-muted-foreground"
              )}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </SheetTrigger>
          <SheetContent
            side="bottom"
            overlayClassName="z-70 bg-black/15 supports-backdrop-filter:backdrop-blur-sm"
            className="z-80 max-h-[80dvh] gap-0 overflow-hidden border-t"
          >
            <SheetHeader className="border-b">
              <SheetTitle>{placeholder}</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto p-4">{optionList}</div>
            <SheetFooter className="border-t">
              <SheetClose render={<Button variant="ghost" />}>Done</SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    )
  }

  return (
    <div ref={rootRef}>
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
              className="h-8 w-full justify-between"
            />
          }
        >
          <span
            className={cn(
              "truncate",
              !selectedOption && "text-muted-foreground"
            )}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Positioner
            side="bottom"
            align="start"
            sideOffset={8}
            collisionPadding={8}
            className="z-70"
          >
            <PopoverPrimitive.Popup
              initialFocus={inputRef}
              finalFocus={false}
              className="w-(--anchor-width) border border-border bg-popover p-4 shadow-sm outline-none"
            >
              {optionList}
            </PopoverPrimitive.Popup>
          </PopoverPrimitive.Positioner>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </div>
  )
}

function AdjustmentDirectionSelect({
  value,
  onChange,
}: {
  value: AdjustmentDirection
  onChange: (value: AdjustmentDirection) => void
}) {
  const [open, setOpen] = React.useState(false)
  const selectedDirection = getAdjustmentDirectionMeta(value)
  const SelectedIcon = value === "add" ? Plus : Minus

  return (
    <PopoverPrimitive.Root modal={false} open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger
        render={
          <Button
            type="button"
            variant="outline"
            className="h-8 shrink-0 gap-1 px-2"
            aria-label={selectedDirection.label}
          />
        }
      >
        <SelectedIcon className="size-3.5" />
        <ChevronDown className="size-3 text-muted-foreground" />
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner
          side="bottom"
          align="start"
          sideOffset={8}
          collisionPadding={8}
          className="z-70"
        >
          <PopoverPrimitive.Popup className="w-(--anchor-width) border border-border bg-popover p-1 shadow-sm outline-none">
            <div className="grid gap-1">
              {(["add", "subtract"] as const).map((direction) => {
                const option = getAdjustmentDirectionMeta(direction)
                const OptionIcon = direction === "add" ? Plus : Minus

                return (
                  <Tooltip key={direction}>
                    <TooltipTrigger
                      render={
                        <button
                          type="button"
                          className={cn(
                            "flex w-full cursor-pointer items-center justify-center border border-transparent px-0 py-2 text-left text-xs",
                            direction === value &&
                              "border-primary bg-primary/10"
                          )}
                          onClick={() => {
                            onChange(direction)
                            setOpen(false)
                          }}
                        />
                      }
                    >
                      <OptionIcon className="size-3.5" />
                    </TooltipTrigger>
                    <TooltipContent>{option.label}</TooltipContent>
                  </Tooltip>
                )
              })}
            </div>
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

export function ProductForm({
  mode,
  draft,
  categoryOptions,
  unitOptions,
  errors,
  onChange,
  onCategoryOptionsChange,
  onUnitOptionsChange,
  onRequestCategoryEdit,
  onRequestCategoryDelete,
  onRequestUnitEdit,
  onRequestUnitDelete,
}: {
  mode: "add" | "edit"
  draft: ProductFormDraft | AddProductDraft
  categoryOptions: string[]
  unitOptions: string[]
  errors: FieldErrors
  onChange: (field: string, value: string) => void
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
        <Field label="Name" error={errors.name}>
          <Input
            value={draft.name}
            onChange={(event) => onChange("name", event.target.value)}
          />
        </Field>
        <Field label="SKU" error={errors.sku}>
          <Input
            value={draft.sku}
            onChange={(event) => onChange("sku", event.target.value)}
          />
        </Field>
        <Field label="Category" error={errors.category}>
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
        <Field label="Unit" error={errors.unit}>
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
        <Field label="Buying price" error={errors.buyingPrice}>
          <Input
            value={draft.buyingPrice}
            onChange={(event) => onChange("buyingPrice", event.target.value)}
          />
        </Field>
        <Field label="Selling price" error={errors.sellingPrice}>
          <Input
            value={draft.sellingPrice}
            onChange={(event) => onChange("sellingPrice", event.target.value)}
          />
        </Field>
        {mode === "add" ? (
          <Field label="Opening stock" error={errors.openingStock}>
            <Input
              value={"openingStock" in draft ? draft.openingStock : ""}
              onChange={(event) => onChange("openingStock", event.target.value)}
            />
          </Field>
        ) : null}
        <Field label="Low stock threshold" error={errors.lowStockThreshold}>
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

export function RestockForm({
  draft,
  errors,
  onChange,
}: {
  draft: RestockDraft
  errors: FieldErrors
  onChange: (field: keyof RestockDraft, value: string) => void
}) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Quantity added" error={errors.quantityAdded}>
          <Input
            value={draft.quantityAdded}
            onChange={(event) => onChange("quantityAdded", event.target.value)}
          />
        </Field>
        <Field label="Total cost" hint="Optional" error={errors.totalCost}>
          <Input
            value={draft.totalCost}
            onChange={(event) => onChange("totalCost", event.target.value)}
          />
        </Field>
        <Field
          label="Notes"
          hint="Optional"
          error={errors.notes}
          className="md:col-span-2"
        >
          <Input
            value={draft.notes}
            onChange={(event) => onChange("notes", event.target.value)}
          />
        </Field>
      </div>
    </div>
  )
}

export function StockInForm({
  draft,
  errors,
  currency,
  productOptions,
  onDraftChange,
  onItemChange,
  onAddItem,
  onRemoveItem,
}: {
  draft: StockInDraft
  errors: FieldErrors
  currency: string
  productOptions: SelectOption[]
  onDraftChange: (
    field: "receivedAt" | "supplierName" | "notes",
    value: string
  ) => void
  onItemChange: (
    index: number,
    field: "productId" | "quantityAdded" | "unitCost",
    value: string
  ) => void
  onAddItem: () => void
  onRemoveItem: (index: number) => void
}) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Received date" error={errors.receivedAt}>
          <Input
            type="date"
            value={draft.receivedAt}
            onChange={(event) =>
              onDraftChange("receivedAt", event.target.value)
            }
          />
        </Field>
        <Field label="Supplier" hint="Optional" error={errors.supplierName}>
          <Input
            value={draft.supplierName}
            onChange={(event) =>
              onDraftChange("supplierName", event.target.value)
            }
          />
        </Field>
        <Field
          label="Notes"
          hint="Optional"
          error={errors.notes}
          className="md:col-span-2"
        >
          <Input
            value={draft.notes}
            onChange={(event) => onDraftChange("notes", event.target.value)}
          />
        </Field>
      </div>

      <div className="grid gap-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Items</p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={onAddItem}>
            <Plus className="size-3.5" />
            Add item
          </Button>
        </div>

        {errors.items ? (
          <p className="text-[11px] text-red-600">{errors.items}</p>
        ) : null}

        <div className="grid gap-3">
          {draft.items.map((item, index) => {
            const quantityValue = Number(item.quantityAdded)
            const unitCostValue = Number(item.unitCost)
            const totalValue =
              Number.isFinite(quantityValue) &&
              quantityValue > 0 &&
              Number.isFinite(unitCostValue) &&
              unitCostValue >= 0
                ? quantityValue * unitCostValue
                : null

            return (
              <div
                key={index}
                className="grid gap-3 border border-border p-3 md:grid-cols-[minmax(0,1.5fr)_9rem_9rem_auto]"
              >
                <Field
                  label="Product"
                  error={errors[`items.${index}.productId`]}
                >
                  <SearchableValueSelect
                    value={item.productId}
                    options={productOptions}
                    placeholder="Select product"
                    searchPlaceholder="Search product"
                    onChange={(value) =>
                      onItemChange(index, "productId", value)
                    }
                  />
                </Field>
                <Field
                  label="Qty received"
                  error={errors[`items.${index}.quantityAdded`]}
                >
                  <Input
                    value={item.quantityAdded}
                    onChange={(event) =>
                      onItemChange(index, "quantityAdded", event.target.value)
                    }
                  />
                </Field>
                <Field
                  label="Unit cost"
                  hint="Optional"
                  error={errors[`items.${index}.unitCost`]}
                >
                  <Input
                    value={item.unitCost}
                    onChange={(event) =>
                      onItemChange(index, "unitCost", event.target.value)
                    }
                  />
                </Field>
                <div className="grid gap-2 md:pt-[1.45rem]">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="justify-self-end"
                    onClick={() => onRemoveItem(index)}
                    disabled={draft.items.length === 1}
                    aria-label={`Remove item ${index + 1}`}
                  >
                    <X className="size-4" />
                  </Button>
                  <div className="text-right text-[11px] text-muted-foreground">
                    {totalValue !== null
                      ? `Total ${new Intl.NumberFormat("en-PH", {
                          style: "currency",
                          currency,
                          minimumFractionDigits: 2,
                        }).format(totalValue)}`
                      : "Total pending"}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function AdjustmentForm({
  draft,
  errors,
  onChange,
}: {
  draft: AdjustmentDraft
  errors: FieldErrors
  onChange: (field: keyof AdjustmentDraft, value: string) => void
}) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4">
        <Field label="Quantity change" error={errors.quantityChange}>
          <div className="flex gap-2">
            <AdjustmentDirectionSelect
              value={draft.direction}
              onChange={(value) => onChange("direction", value)}
            />
            <Input
              value={draft.quantityChange}
              onChange={(event) =>
                onChange("quantityChange", event.target.value)
              }
            />
          </div>
        </Field>
        <Field label="Reason" error={errors.notes}>
          <Input
            value={draft.notes}
            onChange={(event) => onChange("notes", event.target.value)}
          />
        </Field>
      </div>
    </div>
  )
}
