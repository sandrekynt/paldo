"use client"

import { PackagePlus, Search } from "lucide-react"

import { InventoryFilters } from "@/components/inventory/filters"
import {
  AddProductSheet,
  AdjustmentSheet,
  ArchiveProductSheet,
  EditProductSheet,
  OptionDialogSheet,
  RestockSheet,
  ViewProductSheet,
} from "@/components/inventory/modals"
import {
  InventoryProductCards,
  InventoryProductTable,
} from "@/components/inventory/product-list"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useInventoryView } from "@/hooks/use-inventory-view"

type InventoryViewProps = {
  selectedBusinessId: string
}

export function InventoryView({
  selectedBusinessId,
}: InventoryViewProps) {
  const {
    activeProductsCount,
    addDraft,
    addErrors,
    addProductOpen,
    adjustmentDraft,
    adjustmentErrors,
    adjustmentProduct,
    applyAdjustment,
    applyOptionDialog,
    applyRestock,
    archiveProductOpen,
    availableCategories,
    business,
    categoryOptions,
    clearFilters,
    closeAdjustmentModal,
    closeEditModal,
    closeOptionDialog,
    closeRestockModal,
    closeViewModal,
    confirmArchiveProduct,
    currentPage,
    editDraft,
    editErrors,
    editingProduct,
    filteredProducts,
    filtersOpen,
    filtersRef,
    handleAddProductOpenChange,
    isEditingArchivedProduct,
    isMobile,
    lowStockCount,
    mobileFiltersOpen,
    onAddDraftChange,
    onAdjustmentDraftChange,
    onCategoryOptionsChange,
    onEditDraftChange,
    onRestockDraftChange,
    onUnitOptionsChange,
    openAdjustmentModal,
    openEditModal,
    openOptionDialog,
    openRestockModal,
    openViewModal,
    optionDialog,
    optionDialogError,
    optionDialogValue,
    outOfStockCount,
    pageStart,
    paginatedProducts,
    productsPerPage,
    restockDraft,
    restockErrors,
    restockProduct,
    saveAddProduct,
    saveEditProduct,
    searchQuery,
    selectedCategories,
    selectedStatuses,
    setArchiveProductOpen,
    setFiltersOpen,
    setMobileFiltersOpen,
    setOptionDialogValue,
    setPage,
    setSearchQuery,
    toggleCategoryFilter,
    toggleStatus,
    totalPages,
    totalSelectedFilters,
    unitOptions,
    viewingProduct,
    viewingProductId,
    viewingProductMovements,
    viewSheetScrollRef,
  } = useInventoryView(selectedBusinessId)

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="grid gap-1">
              <CardTitle>Product list</CardTitle>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>All stock: {activeProductsCount}</span>
                <span>&bull;</span>
                <span>Low stock: {lowStockCount}</span>
                <span>&bull;</span>
                <span>No stock: {outOfStockCount}</span>
              </div>
            </div>
            <AddProductSheet
              isMobile={isMobile}
              open={addProductOpen}
              trigger={
                <Button>
                  <PackagePlus className="size-4" />
                  Add product
                </Button>
              }
              draft={addDraft}
              categoryOptions={categoryOptions}
              unitOptions={unitOptions}
              errors={addErrors}
              onOpenChange={handleAddProductOpenChange}
              onDraftChange={onAddDraftChange}
              onCategoryOptionsChange={onCategoryOptionsChange}
              onUnitOptionsChange={onUnitOptionsChange}
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
              onSave={saveAddProduct}
            />
            <ViewProductSheet
              isMobile={isMobile}
              open={viewingProduct !== null}
              product={viewingProduct}
              productKey={viewingProductId ?? "product-details-body"}
              movements={viewingProductMovements}
              currency={business.currency}
              scrollRef={viewSheetScrollRef}
              onOpenChange={(open) => {
                if (!open) {
                  closeViewModal()
                }
              }}
              onRestock={() =>
                viewingProduct && openRestockModal(viewingProduct.id)
              }
              onAdjustment={() =>
                viewingProduct && openAdjustmentModal(viewingProduct.id)
              }
            />
            <RestockSheet
              isMobile={isMobile}
              open={restockProduct !== null}
              product={restockProduct}
              draft={restockDraft}
              errors={restockErrors}
              onOpenChange={(open) => {
                if (!open) {
                  closeRestockModal()
                }
              }}
              onDraftChange={onRestockDraftChange}
              onSave={applyRestock}
            />
            <AdjustmentSheet
              isMobile={isMobile}
              open={adjustmentProduct !== null}
              product={adjustmentProduct}
              draft={adjustmentDraft}
              errors={adjustmentErrors}
              onOpenChange={(open) => {
                if (!open) {
                  closeAdjustmentModal()
                }
              }}
              onDraftChange={onAdjustmentDraftChange}
              onSave={applyAdjustment}
            />
            <EditProductSheet
              isMobile={isMobile}
              open={editingProduct !== null}
              product={editingProduct}
              draft={editDraft}
              categoryOptions={categoryOptions}
              unitOptions={unitOptions}
              errors={editErrors}
              isArchived={isEditingArchivedProduct}
              onOpenChange={(open) => {
                if (!open) {
                  closeEditModal()
                }
              }}
              onDraftChange={onEditDraftChange}
              onCategoryOptionsChange={onCategoryOptionsChange}
              onUnitOptionsChange={onUnitOptionsChange}
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
              onArchiveClick={() => setArchiveProductOpen(true)}
              onSave={saveEditProduct}
            />
            <ArchiveProductSheet
              isMobile={isMobile}
              open={archiveProductOpen}
              productName={editingProduct?.name ?? "this product"}
              isArchived={isEditingArchivedProduct}
              onOpenChange={setArchiveProductOpen}
              onConfirm={confirmArchiveProduct}
            />
            <OptionDialogSheet
              isMobile={isMobile}
              open={optionDialog !== null}
              dialog={optionDialog}
              value={optionDialogValue}
              error={optionDialogError}
              onOpenChange={(open) => {
                if (!open) {
                  closeOptionDialog()
                }
              }}
              onValueChange={setOptionDialogValue}
              onSave={applyOptionDialog}
            />
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search product, category, or SKU"
                className="pl-8"
              />
            </div>
            <InventoryFilters
              filtersRef={filtersRef}
              filtersOpen={filtersOpen}
              mobileFiltersOpen={mobileFiltersOpen}
              totalSelectedFilters={totalSelectedFilters}
              availableCategories={availableCategories}
              selectedCategories={selectedCategories}
              selectedStatuses={selectedStatuses}
              onFiltersOpenChange={setFiltersOpen}
              onMobileFiltersOpenChange={setMobileFiltersOpen}
              onToggleCategoryFilter={toggleCategoryFilter}
              onToggleStatus={toggleStatus}
              onClearFilters={clearFilters}
            />
          </div>
          <InventoryProductTable
            products={paginatedProducts}
            currency={business.currency}
            onView={openViewModal}
            onEdit={openEditModal}
          />
          <InventoryProductCards
            products={paginatedProducts}
            currency={business.currency}
            onView={openViewModal}
            onEdit={openEditModal}
          />
          {filteredProducts.length === 0 ? (
            <div className="border border-border bg-muted/20 p-6 text-center text-xs text-muted-foreground">
              No products match this filter.
            </div>
          ) : null}
        </CardContent>
        <CardFooter className="justify-between border-t pt-4 text-xs text-muted-foreground">
          <div>
            {filteredProducts.length === 0
              ? "0 results"
              : `${pageStart + 1}-${Math.min(
                  pageStart + productsPerPage,
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
