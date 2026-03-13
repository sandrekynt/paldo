"use client"

import * as React from "react"
import { SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import type { ProductStatus } from "@/lib/inventory"

const statusOptions: { id: ProductStatus; label: string }[] = [
  { id: "out", label: "Out of stock" },
  { id: "low", label: "Low stock" },
  { id: "healthy", label: "Healthy" },
  { id: "archived", label: "Archived" },
]

function FilterSection({
  title,
  items,
  selectedValues,
  onToggle,
}: {
  title: string
  items: { id: string; label: string }[]
  selectedValues: string[]
  onToggle: (value: string) => void
}) {
  return (
    <div className="grid gap-3">
      <p className="font-medium">{title}</p>
      {items.map((item) => {
        const checked = selectedValues.includes(item.id)

        return (
          <label
            key={item.id}
            className="flex cursor-pointer items-center gap-3 text-foreground"
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onToggle(item.id)}
              className="size-4 cursor-pointer rounded-none border border-input accent-(--color-primary)"
            />
            <span>{item.label}</span>
          </label>
        )
      })}
    </div>
  )
}

function FilterPanelContent({
  availableCategories,
  selectedCategories,
  selectedStatuses,
  onToggleCategoryFilter,
  onToggleStatus,
  onClearFilters,
}: {
  availableCategories: string[]
  selectedCategories: string[]
  selectedStatuses: ProductStatus[]
  onToggleCategoryFilter: (category: string) => void
  onToggleStatus: (status: ProductStatus) => void
  onClearFilters: () => void
}) {
  return (
    <div className="relative">
      <button
        type="button"
        className="absolute top-0 right-0 cursor-pointer text-xs text-muted-foreground hover:text-foreground"
        onClick={onClearFilters}
      >
        Clear
      </button>
      <div className="grid gap-4 pr-12 text-xs">
        <FilterSection
          title="Categories"
          items={availableCategories.map((category) => ({
            id: category,
            label: category,
          }))}
          selectedValues={selectedCategories}
          onToggle={onToggleCategoryFilter}
        />
        <FilterSection
          title="Statuses"
          items={statusOptions}
          selectedValues={selectedStatuses}
          onToggle={(status) => onToggleStatus(status as ProductStatus)}
        />
      </div>
    </div>
  )
}

export function InventoryFilters({
  filtersRef,
  filtersOpen,
  mobileFiltersOpen,
  totalSelectedFilters,
  availableCategories,
  selectedCategories,
  selectedStatuses,
  onFiltersOpenChange,
  onMobileFiltersOpenChange,
  onToggleCategoryFilter,
  onToggleStatus,
  onClearFilters,
}: {
  filtersRef: React.RefObject<HTMLDivElement | null>
  filtersOpen: boolean
  mobileFiltersOpen: boolean
  totalSelectedFilters: number
  availableCategories: string[]
  selectedCategories: string[]
  selectedStatuses: ProductStatus[]
  onFiltersOpenChange: (open: boolean) => void
  onMobileFiltersOpenChange: (open: boolean) => void
  onToggleCategoryFilter: (category: string) => void
  onToggleStatus: (status: ProductStatus) => void
  onClearFilters: () => void
}) {
  return (
    <div className="justify-self-end">
      <div ref={filtersRef} className="relative hidden md:block">
        <Button
          id="inventory-desktop-filters-button"
          size="default"
          variant="outline"
          className={cn("h-8", filtersOpen && "border-primary")}
          onClick={() => onFiltersOpenChange(!filtersOpen)}
        >
          <SlidersHorizontal className="size-4" />
          Filters
          {totalSelectedFilters > 0 ? ` (${totalSelectedFilters})` : ""}
        </Button>
        {filtersOpen ? (
          <div className="absolute top-full right-0 z-20 mt-2 w-56 border border-border bg-popover p-4 shadow-sm">
            <FilterPanelContent
              availableCategories={availableCategories}
              selectedCategories={selectedCategories}
              selectedStatuses={selectedStatuses}
              onToggleCategoryFilter={onToggleCategoryFilter}
              onToggleStatus={onToggleStatus}
              onClearFilters={onClearFilters}
            />
          </div>
        ) : null}
      </div>

      <Sheet open={mobileFiltersOpen} onOpenChange={onMobileFiltersOpenChange}>
        <SheetTrigger
          id="inventory-mobile-filters-trigger"
          render={
            <Button size="default" variant="outline" className="h-8 md:hidden">
              <SlidersHorizontal className="size-4" />
              Filters
              {totalSelectedFilters > 0 ? ` (${totalSelectedFilters})` : ""}
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
            <FilterPanelContent
              availableCategories={availableCategories}
              selectedCategories={selectedCategories}
              selectedStatuses={selectedStatuses}
              onToggleCategoryFilter={onToggleCategoryFilter}
              onToggleStatus={onToggleStatus}
              onClearFilters={onClearFilters}
            />
          </div>
          <SheetFooter className="border-t">
            <SheetClose render={<Button variant="ghost" />}>Done</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
