import type {
  DemoCategory,
  DemoProduct,
  DemoUnitRecord,
} from "@/lib/dummy-data"
import type {
  AddProductDraft,
  AdjustmentDraft,
  FieldErrors,
  ProductFormDraft,
  RestockDraft,
} from "@/lib/inventory"

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

export function validateProductDraft(
  draft: ProductFormDraft | AddProductDraft,
  mode: "add" | "edit"
) {
  const errors: FieldErrors = {}

  validateRequiredText(errors, "name", draft.name)
  validateRequiredText(errors, "sku", draft.sku)
  validateRequiredText(errors, "category", draft.category)
  validateRequiredText(errors, "unit", draft.unit)
  validateNonNegativeNumber(errors, "buyingPrice", draft.buyingPrice, "price")
  validateNonNegativeNumber(errors, "sellingPrice", draft.sellingPrice, "price")
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

export function validateRestockDraft(draft: RestockDraft) {
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

export function validateAdjustmentDraft(
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

export function resolveProductRelations(
  draft: ProductFormDraft | AddProductDraft,
  categories: DemoCategory[],
  units: DemoUnitRecord[]
) {
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
