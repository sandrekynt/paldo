import type {
  DemoCategory,
  DemoProduct,
  DemoStockMovement,
  DemoUnitRecord,
} from "@/lib/dummy-data"

export type ProductStatus = "out" | "low" | "healthy" | "archived"
export type OptionField = "category" | "unit"

export type ProductFormDraft = {
  name: string
  sku: string
  category: string
  unit: string
  buyingPrice: string
  sellingPrice: string
  lowStockThreshold: string
}

export type AddProductDraft = ProductFormDraft & {
  openingStock: string
}

export type RestockDraft = {
  quantityAdded: string
  totalCost: string
  notes: string
}

export type AdjustmentDirection = "add" | "subtract"

export type AdjustmentDraft = {
  direction: AdjustmentDirection
  quantityChange: string
  notes: string
}

export type FieldErrors = Partial<Record<string, string>>

export function createEmptyAddProductDraft(): AddProductDraft {
  return {
    name: "",
    sku: "",
    category: "",
    unit: "",
    buyingPrice: "",
    sellingPrice: "",
    openingStock: "",
    lowStockThreshold: "",
  }
}

export function createEmptyRestockDraft(): RestockDraft {
  return {
    quantityAdded: "",
    totalCost: "",
    notes: "",
  }
}

export function createEmptyAdjustmentDraft(): AdjustmentDraft {
  return {
    direction: "add",
    quantityChange: "",
    notes: "",
  }
}

export function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value)
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value))
}

export function formatMovementType(type: DemoStockMovement["type"]) {
  if (type === "restock") {
    return "Restock"
  }

  if (type === "sale") {
    return "Sale"
  }

  if (type === "adjustment") {
    return "Adjustment"
  }

  return "Void"
}

export function formatQuantityChange(value: number) {
  return value > 0 ? `+${value}` : String(value)
}

export function getAdjustmentDirectionMeta(direction: AdjustmentDirection) {
  return direction === "add"
    ? {
        symbol: "+",
        label: "Add stock",
        className: "text-green-700",
      }
    : {
        symbol: "-",
        label: "Subtract stock",
        className: "text-red-700",
      }
}

export function getSignedAdjustmentQuantity(
  direction: AdjustmentDirection,
  quantityChange: string
) {
  const quantity = Number(quantityChange)

  if (!Number.isFinite(quantity)) {
    return Number.NaN
  }

  return direction === "subtract" ? -quantity : quantity
}

export function normalizeOptionValues(values: string[]) {
  return values.reduce<string[]>((result, value) => {
    const trimmed = value.trim()

    if (
      trimmed.length > 0 &&
      !result.some(
        (existingValue) => existingValue.toLowerCase() === trimmed.toLowerCase()
      )
    ) {
      result.push(trimmed)
    }

    return result
  }, [])
}

export function createInventoryStamp(date = new Date()) {
  const createdAt = date.toISOString()

  return {
    createdAt,
    idSuffix: createdAt.replace(/[-:.TZ]/g, ""),
  }
}

export function createCategoryRecord(
  name: string,
  businessId: string
): DemoCategory {
  const { createdAt, idSuffix } = createInventoryStamp()
  const normalizedName = normalizeIdSegment(name)

  return {
    id: `cat-${businessId}-${idSuffix}-${normalizedName}`,
    businessId,
    name: name.trim(),
    createdAt,
  }
}

export function createUnitRecord(name: string): DemoUnitRecord {
  const { createdAt, idSuffix } = createInventoryStamp()
  const normalizedName = normalizeIdSegment(name)

  return {
    id: `unit-${idSuffix}-${normalizedName}`,
    name: name.trim(),
    createdAt,
  }
}

export function getDraftFromProduct(product: DemoProduct): ProductFormDraft {
  return {
    name: product.name,
    sku: product.sku,
    category: product.categoryName,
    unit: product.unitName,
    buyingPrice: product.buyingPrice.toFixed(2),
    sellingPrice: product.sellingPrice.toFixed(2),
    lowStockThreshold: String(product.lowStockThreshold),
  }
}

export function getProductStatus(product: DemoProduct): ProductStatus {
  if (!product.isActive) {
    return "archived"
  }

  if (product.currentStock === 0) {
    return "out"
  }

  if (product.currentStock <= product.lowStockThreshold) {
    return "low"
  }

  return "healthy"
}

function normalizeIdSegment(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
}
