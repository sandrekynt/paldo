"use client"

import * as React from "react"

import { useInventoryFilters } from "@/hooks/use-inventory-filters"
import { useInventoryModalState } from "@/hooks/use-inventory-modal-state"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  demoBusinesses,
  getInventoryDemo,
  type DemoCategory,
  type DemoProduct,
  type DemoRestock,
  type DemoStockMovement,
  type DemoUnitRecord,
} from "@/lib/dummy-data"
import {
  createCategoryRecord,
  createEmptyAddProductDraft,
  createEmptyAdjustmentDraft,
  createEmptyRestockDraft,
  createInventoryStamp,
  createUnitRecord,
  getProductStatus,
  getSignedAdjustmentQuantity,
  normalizeOptionValues,
  type AddProductDraft,
  type AdjustmentDraft,
  type FieldErrors,
  type OptionField,
  type ProductFormDraft,
  type RestockDraft,
} from "@/lib/inventory"
import {
  resolveProductRelations,
  validateAdjustmentDraft,
  validateProductDraft,
  validateRestockDraft,
} from "@/lib/inventory-validation"

const PRODUCTS_PER_PAGE = 5

export function useInventoryView(selectedBusinessId: string) {
  const isMobile = useIsMobile()
  const business =
    demoBusinesses.find((entry) => entry.id === selectedBusinessId) ??
    demoBusinesses[0]
  const inventory = getInventoryDemo(business.id)

  const [products, setProducts] = React.useState<DemoProduct[]>(
    inventory.products
  )
  const [, setRestockEntries] = React.useState<DemoRestock[]>(
    inventory.restocks
  )
  const [stockMovements, setStockMovements] = React.useState<
    DemoStockMovement[]
  >(inventory.stockMovements)
  const [categories, setCategories] = React.useState<DemoCategory[]>(
    inventory.categories
  )
  const [units, setUnits] = React.useState<DemoUnitRecord[]>(inventory.units)
  const filterState = useInventoryFilters({
    categoryOptions: categories.map((category) => category.name),
    products,
    productsPerPage: PRODUCTS_PER_PAGE,
    selectedBusinessId,
  })
  const modalState = useInventoryModalState()
  const {
    availableCategories,
    clearFilters,
    currentPage,
    filteredProducts,
    filtersOpen,
    filtersRef,
    mobileFiltersOpen,
    pageStart,
    paginatedProducts,
    searchQuery,
    selectedCategories,
    selectedStatuses,
    setFiltersOpen,
    setMobileFiltersOpen,
    setPage,
    setSearchQuery,
    setSelectedCategories,
    setSelectedStatuses,
    toggleCategoryFilter,
    toggleStatus,
    totalPages,
    totalSelectedFilters,
  } = filterState
  const {
    addDraft,
    addErrors,
    addProductOpen,
    adjustmentDraft,
    adjustmentErrors,
    adjustmentProductId,
    archiveProductOpen,
    closeAdjustmentModal,
    closeEditModal,
    closeOptionDialog,
    closeRestockModal,
    closeStockHistoryModal,
    closeViewModal,
    editDraft,
    editErrors,
    editingProductId,
    handleAddProductOpenChange,
    openAdjustmentModal,
    openEditModal,
    openOptionDialog,
    openRestockModal,
    openStockHistoryModal,
    openViewModal,
    optionDialog,
    optionDialogError,
    optionDialogValue,
    restockDraft,
    restockErrors,
    restockProductId,
    setAddDraft,
    setAddErrors,
    setAddProductOpen,
    setAdjustmentDraft,
    setAdjustmentErrors,
    setAdjustmentProductId,
    setArchiveProductOpen,
    setEditDraft,
    setEditErrors,
    setEditingProductId,
    setOptionDialog,
    setOptionDialogError,
    setOptionDialogValue,
    setOptionDialogValueWithReset,
    setRestockDraft,
    setRestockErrors,
    setRestockProductId,
    setStockHistoryProductId,
    setViewingProductId,
    stockHistoryProductId,
    viewingProductId,
  } = modalState
  const viewSheetScrollRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    setSelectedStatuses([])
    setSelectedCategories([])
    setSearchQuery("")
    setPage(1)
    setAddProductOpen(false)
    setAddDraft(createEmptyAddProductDraft())
    setAddErrors({})
    setProducts(inventory.products)
    setRestockEntries(inventory.restocks)
    setStockMovements(inventory.stockMovements)
    setCategories(inventory.categories)
    setUnits(inventory.units)
    setOptionDialog(null)
    setOptionDialogValue("")
    setOptionDialogError("")
    setViewingProductId(null)
    setStockHistoryProductId(null)
    setEditDraft(null)
    setEditErrors({})
    setEditingProductId(null)
    setRestockProductId(null)
    setRestockDraft(createEmptyRestockDraft())
    setRestockErrors({})
    setAdjustmentProductId(null)
    setAdjustmentDraft(createEmptyAdjustmentDraft())
    setAdjustmentErrors({})
    setArchiveProductOpen(false)
  }, [
    inventory,
    setAddDraft,
    setAddErrors,
    setAddProductOpen,
    setAdjustmentDraft,
    setAdjustmentErrors,
    setAdjustmentProductId,
    setArchiveProductOpen,
    setEditDraft,
    setEditErrors,
    setEditingProductId,
    setOptionDialog,
    setOptionDialogError,
    setOptionDialogValue,
    setPage,
    setRestockDraft,
    setRestockErrors,
    setRestockProductId,
    setStockHistoryProductId,
    setSearchQuery,
    setSelectedCategories,
    setSelectedStatuses,
    setViewingProductId,
  ])

  const categoryOptions = React.useMemo(
    () => categories.map((category) => category.name),
    [categories]
  )
  const unitOptions = React.useMemo(
    () => units.map((unit) => unit.name),
    [units]
  )
  const activeProducts = products.filter((product) => product.isActive)
  const activeProductsCount = activeProducts.length
  const lowStockCount = activeProducts.filter(
    (product) => getProductStatus(product) === "low"
  ).length
  const outOfStockCount = activeProducts.filter(
    (product) => getProductStatus(product) === "out"
  ).length
  const editingProduct =
    editingProductId !== null
      ? (products.find((product) => product.id === editingProductId) ?? null)
      : null
  const viewingProduct =
    viewingProductId !== null
      ? (products.find((product) => product.id === viewingProductId) ?? null)
      : null
  const restockProduct =
    restockProductId !== null
      ? (products.find((product) => product.id === restockProductId) ?? null)
      : null
  const stockHistoryProduct =
    stockHistoryProductId !== null
      ? (products.find((product) => product.id === stockHistoryProductId) ?? null)
      : null
  const adjustmentProduct =
    adjustmentProductId !== null
      ? (products.find((product) => product.id === adjustmentProductId) ?? null)
      : null
  const isEditingArchivedProduct = editingProduct
    ? !editingProduct.isActive
    : false
  const stockHistoryMovements = stockMovements
    .filter((movement) => movement.productId === stockHistoryProductId)
    .sort(
      (first, second) =>
        new Date(second.createdAt).getTime() -
        new Date(first.createdAt).getTime()
    )

  React.useLayoutEffect(() => {
    if (!isMobile || !viewingProduct) {
      return
    }

    viewSheetScrollRef.current?.scrollTo({ top: 0, behavior: "auto" })
  }, [isMobile, viewingProduct])

  function clearFieldError(
    field: string,
    setter: React.Dispatch<React.SetStateAction<FieldErrors>>
  ) {
    setter((current) => {
      if (!current[field]) {
        return current
      }

      const next = { ...current }
      delete next[field]
      return next
    })
  }

  function saveAddProduct() {
    const errors = validateProductDraft(addDraft, "add")
    const relationResolution = resolveProductRelations(
      addDraft,
      categories,
      units
    )
    Object.assign(errors, relationResolution.errors)
    setAddErrors(errors)

    if (Object.keys(errors).length > 0) {
      return
    }

    if (!relationResolution.categoryRecord || !relationResolution.unitRecord) {
      return
    }

    const { categoryRecord, unitRecord } = relationResolution
    const { createdAt, idSuffix } = createInventoryStamp()

    setProducts((current) => [
      {
        id: `prod-${idSuffix}`,
        businessId: business.id,
        name: addDraft.name.trim(),
        sku: addDraft.sku.trim(),
        categoryId: categoryRecord.id,
        categoryName: categoryRecord.name,
        unitId: unitRecord.id,
        unitName: unitRecord.name,
        buyingPrice: Number(addDraft.buyingPrice),
        sellingPrice: Number(addDraft.sellingPrice),
        currentStock: Number(addDraft.openingStock),
        lowStockThreshold: Number(addDraft.lowStockThreshold),
        isActive: true,
        createdAt,
        updatedAt: createdAt,
      },
      ...current,
    ])
    setAddProductOpen(false)
    setAddDraft(createEmptyAddProductDraft())
    setAddErrors({})
  }

  function saveEditProduct() {
    if (!editingProduct || !editDraft) {
      return
    }

    const errors = validateProductDraft(editDraft, "edit")
    const relationResolution = resolveProductRelations(
      editDraft,
      categories,
      units
    )
    Object.assign(errors, relationResolution.errors)
    setEditErrors(errors)

    if (Object.keys(errors).length > 0) {
      return
    }

    if (!relationResolution.categoryRecord || !relationResolution.unitRecord) {
      return
    }

    const { categoryRecord, unitRecord } = relationResolution
    const updatedAt = new Date().toISOString()

    setProducts((current) =>
      current.map((product) =>
        product.id === editingProduct.id
          ? {
              ...product,
              name: editDraft.name.trim(),
              sku: editDraft.sku.trim(),
              categoryId: categoryRecord.id,
              categoryName: categoryRecord.name,
              unitId: unitRecord.id,
              unitName: unitRecord.name,
              buyingPrice: Number(editDraft.buyingPrice),
              sellingPrice: Number(editDraft.sellingPrice),
              lowStockThreshold: Number(editDraft.lowStockThreshold),
              updatedAt,
            }
          : product
      )
    )
    closeEditModal()
  }

  function applyRestock() {
    if (!restockProduct) {
      return
    }

    const errors = validateRestockDraft(restockDraft)
    setRestockErrors(errors)

    if (Object.keys(errors).length > 0) {
      return
    }

    const quantityAdded = Number(restockDraft.quantityAdded)
    const totalCostValue = restockDraft.totalCost.trim()
    const totalCost = totalCostValue.length === 0 ? 0 : Number(totalCostValue)
    const notes = restockDraft.notes.trim()

    if (
      !Number.isFinite(quantityAdded) ||
      quantityAdded <= 0 ||
      !Number.isFinite(totalCost) ||
      totalCost < 0
    ) {
      return
    }

    const { createdAt, idSuffix } = createInventoryStamp()
    const stockBefore = restockProduct.currentStock
    const stockAfter = stockBefore + quantityAdded
    const movementId = `move-${idSuffix}`
    const costPerUnit = totalCost > 0 ? totalCost / quantityAdded : 0

    setProducts((current) =>
      current.map((product) =>
        product.id === restockProduct.id
          ? {
              ...product,
              currentStock: stockAfter,
              updatedAt: createdAt,
            }
          : product
      )
    )
    setStockMovements((current) => [
      {
        id: movementId,
        productId: restockProduct.id,
        businessId: business.id,
        type: "restock",
        quantityChange: quantityAdded,
        stockBefore,
        stockAfter,
        referenceId: `restock-${idSuffix}`,
        notes: notes.length > 0 ? notes : "Restocked inventory.",
        createdAt,
      },
      ...current,
    ])
    setRestockEntries((current) => [
      {
        id: `restock-${idSuffix}`,
        productId: restockProduct.id,
        businessId: business.id,
        quantityAdded,
        costPerUnit,
        totalCost,
        notes,
        createdAt,
      },
      ...current,
    ])
    closeRestockModal()
  }

  function applyAdjustment() {
    if (!adjustmentProduct) {
      return
    }

    const errors = validateAdjustmentDraft(adjustmentDraft, adjustmentProduct)
    setAdjustmentErrors(errors)

    if (Object.keys(errors).length > 0) {
      return
    }

    const quantityChange = getSignedAdjustmentQuantity(
      adjustmentDraft.direction,
      adjustmentDraft.quantityChange
    )
    const notes = adjustmentDraft.notes.trim()

    if (
      !Number.isFinite(quantityChange) ||
      quantityChange === 0 ||
      notes.length === 0
    ) {
      return
    }

    const stockBefore = adjustmentProduct.currentStock
    const stockAfter = stockBefore + quantityChange

    if (stockAfter < 0) {
      return
    }

    const { createdAt, idSuffix } = createInventoryStamp()

    setProducts((current) =>
      current.map((product) =>
        product.id === adjustmentProduct.id
          ? {
              ...product,
              currentStock: stockAfter,
              updatedAt: createdAt,
            }
          : product
      )
    )
    setStockMovements((current) => [
      {
        id: `move-${idSuffix}`,
        productId: adjustmentProduct.id,
        businessId: business.id,
        type: "adjustment",
        quantityChange,
        stockBefore,
        stockAfter,
        referenceId: `adj-${idSuffix}`,
        notes,
        createdAt,
      },
      ...current,
    ])
    closeAdjustmentModal()
  }

  function updateFieldOptions(field: OptionField, values: string[]) {
    const normalizedValues = normalizeOptionValues(values)

    if (field === "category") {
      setCategories((current) => {
        const existingByName = new Map(
          current.map((category) => [category.name.toLowerCase(), category])
        )

        return normalizedValues.map(
          (value) =>
            existingByName.get(value.toLowerCase()) ??
            createCategoryRecord(value, business.id)
        )
      })
      return
    }

    setUnits((current) => {
      const existingByName = new Map(
        current.map((unit) => [unit.name.toLowerCase(), unit])
      )

      return normalizedValues.map(
        (value) =>
          existingByName.get(value.toLowerCase()) ?? createUnitRecord(value)
      )
    })
  }

  function updateDraftFieldValue(
    field: OptionField,
    nextValue: string,
    previousValue: string
  ) {
    setAddDraft((current) =>
      field in current &&
      current[field as keyof AddProductDraft] === previousValue
        ? { ...current, [field]: nextValue }
        : current
    )
    setEditDraft((current) =>
      current &&
      field in current &&
      current[field as keyof ProductFormDraft] === previousValue
        ? { ...current, [field]: nextValue }
        : current
    )
  }

  function applyOptionDialog() {
    if (!optionDialog) {
      return
    }

    const trimmed = optionDialogValue.trim()

    if (optionDialog.action === "edit") {
      if (!trimmed || trimmed === optionDialog.value) {
        closeOptionDialog()
        return
      }

      const lowerTrimmed = trimmed.toLowerCase()
      const hasDuplicate =
        optionDialog.field === "category"
          ? categories.some(
              (category) =>
                category.name.toLowerCase() === lowerTrimmed &&
                category.name !== optionDialog.value
            )
          : units.some(
              (unit) =>
                unit.name.toLowerCase() === lowerTrimmed &&
                unit.name !== optionDialog.value
            )

      if (hasDuplicate) {
        setOptionDialogError(
          `A ${optionDialog.field} with this name already exists.`
        )
        return
      }

      if (optionDialog.field === "category") {
        const currentCategory = categories.find(
          (category) => category.name === optionDialog.value
        )

        if (!currentCategory) {
          closeOptionDialog()
          return
        }

        setCategories((current) =>
          current.map((category) =>
            category.id === currentCategory.id
              ? { ...category, name: trimmed }
              : category
          )
        )
        setProducts((current) =>
          current.map((product) =>
            product.categoryId === currentCategory.id
              ? { ...product, categoryName: trimmed }
              : product
          )
        )
        setSelectedCategories((current) =>
          current.map((category) =>
            category === optionDialog.value ? trimmed : category
          )
        )
      } else {
        const currentUnit = units.find(
          (unit) => unit.name === optionDialog.value
        )

        if (!currentUnit) {
          closeOptionDialog()
          return
        }

        setUnits((current) =>
          current.map((unit) =>
            unit.id === currentUnit.id ? { ...unit, name: trimmed } : unit
          )
        )
        setProducts((current) =>
          current.map((product) =>
            product.unitId === currentUnit.id
              ? { ...product, unitName: trimmed }
              : product
          )
        )
      }

      updateDraftFieldValue(optionDialog.field, trimmed, optionDialog.value)
      closeOptionDialog()
      return
    }

    if (optionDialog.field === "category") {
      const currentCategory = categories.find(
        (category) => category.name === optionDialog.value
      )

      if (!currentCategory) {
        closeOptionDialog()
        return
      }

      if (
        products.some((product) => product.categoryId === currentCategory.id)
      ) {
        setOptionDialogError("This category is used by existing products.")
        return
      }

      setCategories((current) =>
        current.filter((category) => category.id !== currentCategory.id)
      )
      setSelectedCategories((current) =>
        current.filter((category) => category !== optionDialog.value)
      )
    } else {
      const currentUnit = units.find((unit) => unit.name === optionDialog.value)

      if (!currentUnit) {
        closeOptionDialog()
        return
      }

      if (products.some((product) => product.unitId === currentUnit.id)) {
        setOptionDialogError("This unit is used by existing products.")
        return
      }

      setUnits((current) =>
        current.filter((unit) => unit.id !== currentUnit.id)
      )
    }

    updateDraftFieldValue(optionDialog.field, "", optionDialog.value)
    closeOptionDialog()
  }

  return {
    isMobile,
    business,
    filtersRef,
    viewSheetScrollRef,
    searchQuery,
    setSearchQuery,
    filtersOpen,
    setFiltersOpen,
    mobileFiltersOpen,
    setMobileFiltersOpen,
    totalSelectedFilters,
    availableCategories,
    selectedCategories,
    selectedStatuses,
    paginatedProducts,
    filteredProducts,
    pageStart,
    currentPage,
    totalPages,
    productsPerPage: PRODUCTS_PER_PAGE,
    activeProductsCount,
    lowStockCount,
    outOfStockCount,
    addProductOpen,
    addDraft,
    addErrors,
    categoryOptions,
    unitOptions,
    viewingProduct,
    viewingProductId,
    stockHistoryProduct,
    stockHistoryMovements,
    restockProduct,
    restockDraft,
    restockErrors,
    adjustmentProduct,
    adjustmentDraft,
    adjustmentErrors,
    editingProduct,
    editDraft,
    editErrors,
    isEditingArchivedProduct,
    archiveProductOpen,
    optionDialog,
    optionDialogValue,
    optionDialogError,
    setPage,
    toggleStatus,
    openViewModal,
    openEditModal,
    openRestockModal,
    openStockHistoryModal,
    openAdjustmentModal,
    closeViewModal,
    closeRestockModal,
    closeStockHistoryModal,
    closeAdjustmentModal,
    closeEditModal,
    handleAddProductOpenChange,
    onAddDraftChange: (field: string, value: string) => {
      setAddDraft((current) => ({ ...current, [field]: value }))
      clearFieldError(field, setAddErrors)
    },
    onEditDraftChange: (field: string, value: string) => {
      setEditDraft((current) =>
        current ? { ...current, [field]: value } : current
      )
      clearFieldError(field, setEditErrors)
    },
    onRestockDraftChange: (field: keyof RestockDraft, value: string) => {
      setRestockDraft((current) => ({
        ...current,
        [field]: value,
      }))
      clearFieldError(field, setRestockErrors)
    },
    onAdjustmentDraftChange: (field: keyof AdjustmentDraft, value: string) => {
      setAdjustmentDraft((current) => ({
        ...current,
        [field]: value,
      }))
      clearFieldError(field, setAdjustmentErrors)
    },
    onCategoryOptionsChange: (values: string[]) =>
      updateFieldOptions("category", values),
    onUnitOptionsChange: (values: string[]) =>
      updateFieldOptions("unit", values),
    openOptionDialog,
    closeOptionDialog,
    setArchiveProductOpen,
    setOptionDialogValue: setOptionDialogValueWithReset,
    saveAddProduct,
    saveEditProduct,
    applyRestock,
    applyAdjustment,
    toggleCategoryFilter,
    clearFilters,
    confirmArchiveProduct: () => {
      if (!editingProductId || !editingProduct) {
        return
      }

      setProducts((current) =>
        current.map((product) =>
          product.id === editingProductId
            ? {
                ...product,
                isActive: !product.isActive,
                updatedAt: new Date().toISOString(),
              }
            : product
        )
      )
      closeEditModal()
    },
    applyOptionDialog,
  }
}
