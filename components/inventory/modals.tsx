"use client"

import * as React from "react"

import {
  AdjustmentForm,
  ProductForm,
  RestockForm,
} from "@/components/inventory/forms"
import {
  InventoryProductDetailsContent,
  ProductActionSummary,
  StockMovementHistoryContent,
} from "@/components/inventory/product-details"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import type { DemoProduct, DemoStockMovement } from "@/lib/dummy-data"
import {
  type AddProductDraft,
  type AdjustmentDraft,
  type FieldErrors,
  type OptionField,
  type ProductFormDraft,
  type RestockDraft,
} from "@/lib/inventory"
import { cn } from "@/lib/utils"

type OptionDialogState = {
  action: "edit" | "delete"
  field: OptionField
  value: string
}

function getSheetClassName(
  isMobile: boolean,
  desktopClassName = "rounded-none"
) {
  return cn(
    desktopClassName,
    "max-h-[80dvh] overflow-hidden",
    isMobile && "gap-0 border-t"
  )
}

export function AddProductSheet({
  isMobile,
  open,
  triggerId,
  trigger,
  draft,
  categoryOptions,
  unitOptions,
  errors,
  onOpenChange,
  onDraftChange,
  onCategoryOptionsChange,
  onUnitOptionsChange,
  onRequestCategoryEdit,
  onRequestCategoryDelete,
  onRequestUnitEdit,
  onRequestUnitDelete,
  onSave,
}: {
  isMobile: boolean
  open: boolean
  triggerId?: string
  trigger: React.ReactElement
  draft: AddProductDraft
  categoryOptions: string[]
  unitOptions: string[]
  errors: FieldErrors
  onOpenChange: (open: boolean) => void
  onDraftChange: (field: string, value: string) => void
  onCategoryOptionsChange: (values: string[]) => void
  onUnitOptionsChange: (values: string[]) => void
  onRequestCategoryEdit: (value: string) => void
  onRequestCategoryDelete: (value: string) => void
  onRequestUnitEdit: (value: string) => void
  onRequestUnitDelete: (value: string) => void
  onSave: () => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger id={triggerId} render={trigger} />
      <SheetContent
        side={isMobile ? "bottom" : "center"}
        className={getSheetClassName(
          isMobile,
          "rounded-none data-[side=center]:max-w-3xl"
        )}
      >
        <SheetHeader className="border-b">
          <SheetTitle>Add product</SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto p-4">
          <ProductForm
            mode="add"
            draft={draft}
            categoryOptions={categoryOptions}
            unitOptions={unitOptions}
            errors={errors}
            onChange={onDraftChange}
            onCategoryOptionsChange={onCategoryOptionsChange}
            onUnitOptionsChange={onUnitOptionsChange}
            onRequestCategoryEdit={onRequestCategoryEdit}
            onRequestCategoryDelete={onRequestCategoryDelete}
            onRequestUnitEdit={onRequestUnitEdit}
            onRequestUnitDelete={onRequestUnitDelete}
          />
        </div>
        <SheetFooter className="flex-row justify-end border-t">
          <Button onClick={onSave}>Save new product</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function ViewProductSheet({
  isMobile,
  open,
  product,
  productKey,
  currency,
  scrollRef,
  onOpenChange,
  onRestock,
  onViewHistory,
  onAdjustment,
}: {
  isMobile: boolean
  open: boolean
  product: DemoProduct | null
  productKey: string
  currency: string
  scrollRef: React.RefObject<HTMLDivElement | null>
  onOpenChange: (open: boolean) => void
  onRestock: () => void
  onViewHistory: () => void
  onAdjustment: () => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? "bottom" : "center"}
        className={getSheetClassName(isMobile)}
      >
        <SheetHeader className="border-b">
          <SheetTitle>Product details</SheetTitle>
        </SheetHeader>
        <div
          ref={scrollRef}
          key={productKey}
          className="grid gap-4 overflow-y-auto p-4"
        >
          {product ? (
            <InventoryProductDetailsContent
              product={product}
              isMobile={isMobile}
              currency={currency}
              onRestock={onRestock}
              onViewHistory={onViewHistory}
              onAdjustment={onAdjustment}
            />
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function StockMovementHistorySheet({
  isMobile,
  open,
  product,
  movements,
  onOpenChange,
}: {
  isMobile: boolean
  open: boolean
  product: Pick<DemoProduct, "name" | "currentStock" | "unitName"> | null
  movements: DemoStockMovement[]
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? "bottom" : "center"}
        overlayClassName="z-70 bg-black/15 supports-backdrop-filter:backdrop-blur-sm"
        className={getSheetClassName(
          isMobile,
          "z-80 rounded-none data-[side=center]:max-w-3xl"
        )}
      >
        <SheetHeader className="border-b">
          <SheetTitle>Stock movement history</SheetTitle>
          {product ? (
            <SheetDescription>
              {product.name} · {product.currentStock} {product.unitName}
            </SheetDescription>
          ) : null}
        </SheetHeader>
        <div className="overflow-y-auto p-4">
          <StockMovementHistoryContent
            movements={movements}
            isMobile={isMobile}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function RestockSheet({
  isMobile,
  open,
  product,
  draft,
  errors,
  onOpenChange,
  onDraftChange,
  onSave,
}: {
  isMobile: boolean
  open: boolean
  product: Pick<DemoProduct, "name" | "currentStock" | "unitName"> | null
  draft: RestockDraft
  errors: FieldErrors
  onOpenChange: (open: boolean) => void
  onDraftChange: (field: keyof RestockDraft, value: string) => void
  onSave: () => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? "bottom" : "center"}
        className={getSheetClassName(
          isMobile,
          "rounded-none data-[side=center]:max-w-3xl"
        )}
      >
        <SheetHeader className="border-b">
          <SheetTitle>Restock</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 overflow-y-auto p-4">
          {product ? (
            <>
              <ProductActionSummary product={product} />
              <RestockForm
                draft={draft}
                errors={errors}
                onChange={onDraftChange}
              />
            </>
          ) : null}
        </div>
        <SheetFooter className="flex-row justify-end border-t">
          <Button onClick={onSave}>Save restock</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function AdjustmentSheet({
  isMobile,
  open,
  product,
  draft,
  errors,
  onOpenChange,
  onDraftChange,
  onSave,
}: {
  isMobile: boolean
  open: boolean
  product: Pick<DemoProduct, "name" | "currentStock" | "unitName"> | null
  draft: AdjustmentDraft
  errors: FieldErrors
  onOpenChange: (open: boolean) => void
  onDraftChange: (field: keyof AdjustmentDraft, value: string) => void
  onSave: () => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? "bottom" : "center"}
        className={getSheetClassName(isMobile)}
      >
        <SheetHeader className="border-b">
          <SheetTitle>Adjust stock</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 p-4">
          {product ? (
            <>
              <ProductActionSummary product={product} />
              <AdjustmentForm
                draft={draft}
                errors={errors}
                onChange={onDraftChange}
              />
            </>
          ) : null}
        </div>
        <SheetFooter className="flex-row justify-end border-t">
          <Button onClick={onSave}>Save adjustment</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function EditProductSheet({
  isMobile,
  open,
  product,
  draft,
  categoryOptions,
  unitOptions,
  errors,
  isArchived,
  onOpenChange,
  onDraftChange,
  onCategoryOptionsChange,
  onUnitOptionsChange,
  onRequestCategoryEdit,
  onRequestCategoryDelete,
  onRequestUnitEdit,
  onRequestUnitDelete,
  onArchiveClick,
  onSave,
}: {
  isMobile: boolean
  open: boolean
  product: DemoProduct | null
  draft: ProductFormDraft | null
  categoryOptions: string[]
  unitOptions: string[]
  errors: FieldErrors
  isArchived: boolean
  onOpenChange: (open: boolean) => void
  onDraftChange: (field: string, value: string) => void
  onCategoryOptionsChange: (values: string[]) => void
  onUnitOptionsChange: (values: string[]) => void
  onRequestCategoryEdit: (value: string) => void
  onRequestCategoryDelete: (value: string) => void
  onRequestUnitEdit: (value: string) => void
  onRequestUnitDelete: (value: string) => void
  onArchiveClick: () => void
  onSave: () => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? "bottom" : "center"}
        className={getSheetClassName(isMobile)}
      >
        <SheetHeader className="border-b">
          <SheetTitle>Edit product</SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto p-4">
          {product && draft ? (
            <ProductForm
              mode="edit"
              draft={draft}
              categoryOptions={categoryOptions}
              unitOptions={unitOptions}
              errors={errors}
              onChange={onDraftChange}
              onCategoryOptionsChange={onCategoryOptionsChange}
              onUnitOptionsChange={onUnitOptionsChange}
              onRequestCategoryEdit={onRequestCategoryEdit}
              onRequestCategoryDelete={onRequestCategoryDelete}
              onRequestUnitEdit={onRequestUnitEdit}
              onRequestUnitDelete={onRequestUnitDelete}
            />
          ) : null}
        </div>
        <SheetFooter
          className={cn(
            "border-t",
            isMobile
              ? "grid grid-cols-[7rem_minmax(0,1fr)] items-center gap-2"
              : "flex-row justify-between"
          )}
        >
          {isMobile ? (
            <>
              <Button variant="outline" onClick={onArchiveClick}>
                {isArchived ? "Restore" : "Archive"}
              </Button>
              <Button className="w-full" onClick={onSave}>
                Save changes
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={onArchiveClick}>
                {isArchived ? "Restore" : "Archive"}
              </Button>
              <Button onClick={onSave}>Save changes</Button>
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function ArchiveProductSheet({
  isMobile,
  open,
  productName,
  isArchived,
  onOpenChange,
  onConfirm,
}: {
  isMobile: boolean
  open: boolean
  productName: string
  isArchived: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? "bottom" : "center"}
        className={getSheetClassName(isMobile)}
      >
        <SheetHeader className="border-b">
          <SheetTitle>
            {isArchived ? "Restore product" : "Archive product"}
          </SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 overflow-y-auto p-4">
          <p className="text-xs text-muted-foreground">
            {isArchived ? "Restore" : "Archive"}{" "}
            <span className="font-medium text-foreground">{productName}</span>?
          </p>
        </div>
        <SheetFooter className="flex-row justify-end border-t">
          <div className="flex items-center gap-2">
            <SheetClose render={<Button variant="secondary" />}>
              Cancel
            </SheetClose>
            <Button variant={isArchived ? "default" : "outline"} onClick={onConfirm}>
              {isArchived ? "Restore" : "Archive"}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function OptionDialogSheet({
  isMobile,
  open,
  dialog,
  value,
  error,
  onOpenChange,
  onValueChange,
  onSave,
}: {
  isMobile: boolean
  open: boolean
  dialog: OptionDialogState | null
  value: string
  error: string
  onOpenChange: (open: boolean) => void
  onValueChange: (value: string) => void
  onSave: () => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? "bottom" : "center"}
        className={getSheetClassName(isMobile)}
      >
        <SheetHeader className="border-b">
          <SheetTitle>
            {dialog?.action === "edit" ? "Edit" : "Delete"} {dialog?.field}
          </SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 overflow-y-auto p-4">
          {dialog?.action === "edit" ? (
            <label className="grid gap-2 text-xs">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium text-foreground">
                  {dialog.field === "category" ? "Category" : "Unit"}
                </span>
              </div>
              <Input
                value={value}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  onValueChange(event.target.value)
                }
              />
            </label>
          ) : (
            <p className="text-xs text-muted-foreground">
              Delete{" "}
              <span className="font-medium text-foreground">
                {dialog?.value ?? `this ${dialog?.field ?? "option"}`}
              </span>
              ?
            </p>
          )}
          {error ? <p className="text-[11px] text-red-600">{error}</p> : null}
        </div>
        <SheetFooter className="flex-row justify-end border-t">
          <div className="flex items-center gap-2">
            <SheetClose render={<Button variant="secondary" />}>
              Cancel
            </SheetClose>
            {dialog?.action === "edit" ? (
              <Button onClick={onSave}>Save</Button>
            ) : dialog?.action === "delete" ? (
              <Button variant="destructive" onClick={onSave}>
                Delete
              </Button>
            ) : null}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
