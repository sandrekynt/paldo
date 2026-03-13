"use client"

import * as React from "react"
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
import {
  demoBusinesses,
  getInventoryDemo,
  type DemoCategory,
  type DemoProduct,
  type DemoRestock,
  type DemoStockMovement,
  type DemoUnitRecord,
} from "@/lib/dummy-data"
import { useClickOutside } from "@/hooks/use-click-outside"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  createCategoryRecord,
  createEmptyAddProductDraft,
  createEmptyAdjustmentDraft,
  createEmptyRestockDraft,
  createInventoryStamp,
  createUnitRecord,
  getDraftFromProduct,
  getProductStatus,
  getSignedAdjustmentQuantity,
  normalizeOptionValues,
  type AddProductDraft,
  type AdjustmentDraft,
  type FieldErrors,
  type OptionField,
  type ProductFormDraft,
  type ProductStatus,
  type RestockDraft,
} from "@/lib/inventory"

type InventoryWorkspaceProps = {
  selectedBusinessId: string
}

type OptionDialogState = {
  action: "edit" | "delete"
  field: OptionField
  value: string
}

const PRODUCTS_PER_PAGE = 5
const defaultStatuses: ProductStatus[] = []

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
  const [addProductOpen, setAddProductOpen] = React.useState(false)
  const [addDraft, setAddDraft] = React.useState<AddProductDraft>(
    createEmptyAddProductDraft()
  )
  const [addErrors, setAddErrors] = React.useState<FieldErrors>({})
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
  const [optionDialog, setOptionDialog] =
    React.useState<OptionDialogState | null>(null)
  const [optionDialogValue, setOptionDialogValue] = React.useState("")
  const [optionDialogError, setOptionDialogError] = React.useState("")
  const [viewingProductId, setViewingProductId] = React.useState<string | null>(
    null
  )
  const [editDraft, setEditDraft] = React.useState<ProductFormDraft | null>(
    null
  )
  const [editErrors, setEditErrors] = React.useState<FieldErrors>({})
  const [editingProductId, setEditingProductId] = React.useState<string | null>(
    null
  )
  const [restockProductId, setRestockProductId] = React.useState<string | null>(
    null
  )
  const [restockDraft, setRestockDraft] = React.useState<RestockDraft>(
    createEmptyRestockDraft()
  )
  const [restockErrors, setRestockErrors] = React.useState<FieldErrors>({})
  const [adjustmentProductId, setAdjustmentProductId] = React.useState<
    string | null
  >(null)
  const [adjustmentDraft, setAdjustmentDraft] = React.useState<AdjustmentDraft>(
    createEmptyAdjustmentDraft()
  )
  const [adjustmentErrors, setAdjustmentErrors] = React.useState<FieldErrors>(
    {}
  )
  const [archiveProductOpen, setArchiveProductOpen] = React.useState(false)
  const [filtersOpen, setFiltersOpen] = React.useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false)
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    []
  )
  const filtersRef = React.useRef<HTMLDivElement>(null)
  const viewSheetScrollRef = React.useRef<HTMLDivElement | null>(null)

  useClickOutside(filtersRef, () => setFiltersOpen(false), filtersOpen)

  React.useEffect(() => {
    setSelectedStatuses(defaultStatuses)
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
  }, [inventory])

  const categoryOptions = React.useMemo(
    () => categories.map((category) => category.name),
    [categories]
  )
  const unitOptions = React.useMemo(
    () => units.map((unit) => unit.name),
    [units]
  )
  const availableCategories = React.useMemo(
    () =>
      [...categoryOptions].sort((first, second) => first.localeCompare(second)),
    [categoryOptions]
  )

  const filteredProducts = products.filter((product) => {
    const normalizedQuery = searchQuery.trim().toLowerCase()
    const matchesQuery =
      normalizedQuery.length === 0 ||
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.sku.toLowerCase().includes(normalizedQuery) ||
      product.categoryName.toLowerCase().includes(normalizedQuery)
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.categoryName)

    if (!matchesQuery || !matchesCategory) {
      return false
    }

    return (
      selectedStatuses.length === 0 ||
      selectedStatuses.includes(getProductStatus(product))
    )
  })

  React.useEffect(() => {
    setPage(1)
  }, [searchQuery, selectedStatuses, selectedCategories, selectedBusinessId])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  )
  const activeProducts = products.filter((product) => product.isActive)
  const activeProductsCount = activeProducts.length
  const lowStockCount = activeProducts.filter(
    (product) => getProductStatus(product) === "low"
  ).length
  const outOfStockCount = activeProducts.filter(
    (product) => getProductStatus(product) === "out"
  ).length
  const totalSelectedFilters =
    selectedStatuses.length + selectedCategories.length
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * PRODUCTS_PER_PAGE
  const paginatedProducts = filteredProducts.slice(
    pageStart,
    pageStart + PRODUCTS_PER_PAGE
  )
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
  const adjustmentProduct =
    adjustmentProductId !== null
      ? (products.find((product) => product.id === adjustmentProductId) ?? null)
      : null
  const isEditingArchivedProduct = editingProduct
    ? !editingProduct.isActive
    : false
  const viewingProductMovements = stockMovements
    .filter((movement) => movement.productId === viewingProductId)
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
    setEditErrors({})
  }

  function openViewModal(product: DemoProduct) {
    setViewingProductId(product.id)
  }

  function openRestockModal(productId: string) {
    setRestockProductId(productId)
    setRestockDraft(createEmptyRestockDraft())
    setRestockErrors({})
  }

  function closeRestockModal() {
    setRestockProductId(null)
    setRestockDraft(createEmptyRestockDraft())
    setRestockErrors({})
  }

  function openAdjustmentModal(productId: string) {
    setAdjustmentProductId(productId)
    setAdjustmentDraft(createEmptyAdjustmentDraft())
    setAdjustmentErrors({})
  }

  function closeAdjustmentModal() {
    setAdjustmentProductId(null)
    setAdjustmentDraft(createEmptyAdjustmentDraft())
    setAdjustmentErrors({})
  }

  function handleAddProductOpenChange(open: boolean) {
    setAddProductOpen(open)
    setAddDraft(createEmptyAddProductDraft())
    setAddErrors({})
  }

  function closeEditModal() {
    setEditingProductId(null)
    setEditDraft(null)
    setEditErrors({})
    setArchiveProductOpen(false)
  }

  function closeViewModal() {
    setViewingProductId(null)
  }

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

  function validateRequiredText(
    errors: FieldErrors,
    field: string,
    value: string
  ) {
    if (value.trim().length === 0) {
      errors[field] = "Required"
    }
  }

  function validateNonNegativeNumber(
    errors: FieldErrors,
    field: string,
    value: string,
    label: "amount" | "price" | "quantity"
  ) {
    if (value.trim().length === 0) {
      errors[field] = "Required"
      return
    }

    const parsedValue = Number(value)

    if (!Number.isFinite(parsedValue) || parsedValue < 0) {
      errors[field] =
        label === "quantity"
          ? "Enter a valid quantity"
          : label === "amount"
            ? "Enter a valid amount"
            : "Enter a valid price"
    }
  }

  function validatePositiveNumber(
    errors: FieldErrors,
    field: string,
    value: string
  ) {
    if (value.trim().length === 0) {
      errors[field] = "Required"
      return
    }

    const parsedValue = Number(value)

    if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
      errors[field] = "Enter a quantity greater than 0"
    }
  }

  function validateProductDraft(
    draft: ProductFormDraft | AddProductDraft,
    mode: "add" | "edit"
  ) {
    const errors: FieldErrors = {}

    validateRequiredText(errors, "name", draft.name)
    validateRequiredText(errors, "sku", draft.sku)
    validateRequiredText(errors, "category", draft.category)
    validateRequiredText(errors, "unit", draft.unit)
    validateNonNegativeNumber(errors, "buyingPrice", draft.buyingPrice, "price")
    validateNonNegativeNumber(
      errors,
      "sellingPrice",
      draft.sellingPrice,
      "price"
    )
    validateNonNegativeNumber(
      errors,
      "lowStockThreshold",
      draft.lowStockThreshold,
      "quantity"
    )

    if (mode === "add" && "openingStock" in draft) {
      validateNonNegativeNumber(
        errors,
        "openingStock",
        draft.openingStock,
        "quantity"
      )
    }

    return errors
  }

  function validateRestockDraft(draft: RestockDraft) {
    const errors: FieldErrors = {}

    validatePositiveNumber(errors, "quantityAdded", draft.quantityAdded)

    if (draft.totalCost.trim().length > 0) {
      const totalCost = Number(draft.totalCost)

      if (!Number.isFinite(totalCost) || totalCost < 0) {
        errors.totalCost = "Enter a valid amount"
      }
    }

    return errors
  }

  function validateAdjustmentDraft(
    draft: AdjustmentDraft,
    product: DemoProduct | null
  ) {
    const errors: FieldErrors = {}
    const rawQuantity = draft.quantityChange.trim()

    if (rawQuantity.length === 0) {
      errors.quantityChange = "Required"
    } else {
      const parsedQuantity = Number(rawQuantity)

      if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
        errors.quantityChange = "Enter a quantity greater than 0"
      } else if (
        draft.direction === "subtract" &&
        product &&
        product.currentStock - parsedQuantity < 0
      ) {
        errors.quantityChange = "Cannot reduce below zero"
      }
    }

    validateRequiredText(errors, "notes", draft.notes)

    return errors
  }

  function resolveProductRelations(draft: ProductFormDraft | AddProductDraft) {
    const categoryName = draft.category.trim()
    const unitName = draft.unit.trim()
    const errors: FieldErrors = {}

    const categoryRecord = categories.find(
      (category) => category.name === categoryName
    )
    const unitRecord = units.find((unit) => unit.name === unitName)

    if (!categoryRecord) {
      errors.category = "Select a valid category"
    }

    if (!unitRecord) {
      errors.unit = "Select a valid unit"
    }

    return { categoryRecord, unitRecord, errors }
  }

  function saveAddProduct() {
    const errors = validateProductDraft(addDraft, "add")
    const relationResolution = resolveProductRelations(addDraft)
    Object.assign(errors, relationResolution.errors)
    setAddErrors(errors)

    if (Object.keys(errors).length > 0) {
      return
    }

    if (!relationResolution.categoryRecord || !relationResolution.unitRecord) {
      return
    }

    const categoryRecord = relationResolution.categoryRecord
    const unitRecord = relationResolution.unitRecord

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
    handleAddProductOpenChange(false)
  }

  function saveEditProduct() {
    if (!editingProduct || !editDraft) {
      return
    }

    const errors = validateProductDraft(editDraft, "edit")
    const relationResolution = resolveProductRelations(editDraft)
    Object.assign(errors, relationResolution.errors)
    setEditErrors(errors)

    if (Object.keys(errors).length > 0) {
      return
    }

    if (!relationResolution.categoryRecord || !relationResolution.unitRecord) {
      return
    }

    const categoryRecord = relationResolution.categoryRecord
    const unitRecord = relationResolution.unitRecord

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

  function toggleCategoryFilter(category: string) {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((value) => value !== category)
        : [...current, category]
    )
  }

  function clearFilters() {
    setSelectedStatuses([])
    setSelectedCategories([])
  }

  function confirmArchiveProduct() {
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
  }

  function openOptionDialog(
    field: OptionField,
    action: "edit" | "delete",
    value: string
  ) {
    setOptionDialog({ field, action, value })
    setOptionDialogValue(value)
    setOptionDialogError("")
  }

  function closeOptionDialog() {
    setOptionDialog(null)
    setOptionDialogValue("")
    setOptionDialogError("")
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
              onDraftChange={(field, value) => {
                setAddDraft((current) => ({ ...current, [field]: value }))
                clearFieldError(field, setAddErrors)
              }}
              onCategoryOptionsChange={(values) =>
                updateFieldOptions("category", values)
              }
              onUnitOptionsChange={(values) =>
                updateFieldOptions("unit", values)
              }
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
              onDraftChange={(field, value) => {
                setRestockDraft((current) => ({
                  ...current,
                  [field]: value,
                }))
                clearFieldError(field, setRestockErrors)
              }}
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
              onDraftChange={(field, value) => {
                setAdjustmentDraft((current) => ({
                  ...current,
                  [field]: value,
                }))
                clearFieldError(field, setAdjustmentErrors)
              }}
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
              onDraftChange={(field, value) => {
                setEditDraft((current) =>
                  current ? { ...current, [field]: value } : current
                )
                clearFieldError(field, setEditErrors)
              }}
              onCategoryOptionsChange={(values) =>
                updateFieldOptions("category", values)
              }
              onUnitOptionsChange={(values) =>
                updateFieldOptions("unit", values)
              }
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
              onValueChange={(value) => {
                setOptionDialogValue(value)
                setOptionDialogError("")
              }}
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
