"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { ChevronDown, PencilLine, Trash2 } from "lucide-react"

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
} from "@/lib/inventory"
import { cn } from "@/lib/utils"

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
            className="z-80 max-h-[85svh] gap-0 border-t"
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

function AdjustmentDirectionSelect({
  value,
  onChange,
}: {
  value: AdjustmentDirection
  onChange: (value: AdjustmentDirection) => void
}) {
  const [open, setOpen] = React.useState(false)
  const selectedDirection = getAdjustmentDirectionMeta(value)

  return (
    <PopoverPrimitive.Root modal={false} open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger
        render={
          <Button
            type="button"
            variant="outline"
            className={cn(
              "h-8 shrink-0 gap-1 px-2",
              selectedDirection.className
            )}
            aria-label={selectedDirection.label}
          />
        }
      >
        <span className="text-sm font-medium">{selectedDirection.symbol}</span>
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
                      <span
                        className={cn("text-sm font-medium", option.className)}
                      >
                        {option.symbol}
                      </span>
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
