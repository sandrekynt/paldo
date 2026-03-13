export const inventoryUnitOptions = [
  "piece",
  "kilo",
  "gram",
  "pack",
  "bottle",
  "box",
  "liter",
  "sack",
  "dozen",
  "other",
] as const

export type InventoryUnit = (typeof inventoryUnitOptions)[number]

export type DemoBusiness = {
  id: string
  name: string
  type: string
  country: string
  currency: string
  address: string
  logoUrl: string | null
  isActive: boolean
  createdAt: string
}

export type DemoProduct = {
  id: string
  businessId: string
  name: string
  sku: string
  category: string
  unit: InventoryUnit
  buyingPrice: number
  sellingPrice: number
  currentStock: number
  lowStockThreshold: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type DemoStockMovement = {
  id: string
  productId: string
  businessId: string
  type: "restock" | "sale" | "adjustment" | "void"
  quantityChange: number
  stockBefore: number
  stockAfter: number
  referenceId: string
  notes: string
  createdAt: string
}

export type DemoRestock = {
  id: string
  productId: string
  businessId: string
  quantityAdded: number
  costPerUnit: number
  totalCost: number
  notes: string
  createdAt: string
}

export type DemoImportField =
  | "sku"
  | "name"
  | "category"
  | "unit"
  | "buying_price"
  | "selling_price"
  | "current_stock"
  | "low_stock_threshold"

export type DemoImportMapping = {
  sourceColumn: string
  matchedField: DemoImportField
  confidence: "high" | "medium" | "manual"
  sampleValue: string
}

export type DemoImportPreviewRow = {
  id: string
  status: "ready" | "warning"
  issue: string | null
  values: Record<DemoImportField, string>
}

export type DemoInventoryImportSession = {
  fileName: string
  sourceType: "csv" | "xlsx"
  uploadedAt: string
  totalRows: number
  readyRows: number
  warningRows: number
  mappings: DemoImportMapping[]
  previewRows: DemoImportPreviewRow[]
}

export type DemoInventoryDrafts = {
  addProduct: {
    name: string
    sku: string
    category: string
    unit: InventoryUnit
    buyingPrice: string
    sellingPrice: string
    openingStock: string
    lowStockThreshold: string
  }
  restock: {
    quantityAdded: string
    totalCost: string
    notes: string
  }
  adjustment: {
    direction: "add" | "subtract"
    quantityChange: string
    notes: string
  }
}

export type DemoInventoryBusinessData = {
  headline: string
  focusProductId: string
  suggestedCategories: string[]
  products: DemoProduct[]
  stockMovements: DemoStockMovement[]
  restocks: DemoRestock[]
  importSession: DemoInventoryImportSession
  drafts: DemoInventoryDrafts
}

export const demoBusinesses: DemoBusiness[] = [
  {
    id: "paldo-1",
    name: "Konrad Mini Mart",
    type: "Retail",
    country: "PH",
    currency: "PHP",
    address: "Batasan Hills, Quezon City",
    logoUrl: null,
    isActive: true,
    createdAt: "2026-01-05T08:00:00+08:00",
  },
  {
    id: "paldo-2",
    name: "Southside Water Refilling",
    type: "Services",
    country: "PH",
    currency: "PHP",
    address: "BF Homes, Paranaque",
    logoUrl: null,
    isActive: false,
    createdAt: "2026-01-12T10:15:00+08:00",
  },
  {
    id: "paldo-3",
    name: "Vallejos Trading",
    type: "Wholesale",
    country: "PH",
    currency: "PHP",
    address: "Bangkal, Makati",
    logoUrl: null,
    isActive: false,
    createdAt: "2026-01-19T07:45:00+08:00",
  },
]

const inventoryDemoByBusiness: Record<string, DemoInventoryBusinessData> = {
  "paldo-1": {
    headline: "Fast-moving grocery items with frequent low-stock checks and small-batch restocks.",
    focusProductId: "mm-prod-2",
    suggestedCategories: ["Grocery", "Beverages", "Household", "Frozen"],
    products: [
      {
        id: "mm-prod-1",
        businessId: "paldo-1",
        name: "Lucky Me Pancit Canton",
        sku: "KMM-GRO-001",
        category: "Grocery",
        unit: "pack",
        buyingPrice: 12.5,
        sellingPrice: 18,
        currentStock: 42,
        lowStockThreshold: 12,
        isActive: true,
        createdAt: "2026-02-01T08:00:00+08:00",
        updatedAt: "2026-03-11T15:10:00+08:00",
      },
      {
        id: "mm-prod-2",
        businessId: "paldo-1",
        name: "Summit Drinking Water 500ml",
        sku: "KMM-BEV-002",
        category: "Beverages",
        unit: "bottle",
        buyingPrice: 8,
        sellingPrice: 12,
        currentStock: 7,
        lowStockThreshold: 10,
        isActive: true,
        createdAt: "2026-02-01T08:15:00+08:00",
        updatedAt: "2026-03-12T09:05:00+08:00",
      },
      {
        id: "mm-prod-3",
        businessId: "paldo-1",
        name: "Surf Powder Sachet",
        sku: "KMM-HOU-003",
        category: "Household",
        unit: "piece",
        buyingPrice: 6.2,
        sellingPrice: 9,
        currentStock: 18,
        lowStockThreshold: 8,
        isActive: true,
        createdAt: "2026-02-03T11:20:00+08:00",
        updatedAt: "2026-03-10T14:40:00+08:00",
      },
      {
        id: "mm-prod-4",
        businessId: "paldo-1",
        name: "555 Sardines Hot",
        sku: "KMM-GRO-004",
        category: "Grocery",
        unit: "piece",
        buyingPrice: 21,
        sellingPrice: 28,
        currentStock: 0,
        lowStockThreshold: 12,
        isActive: true,
        createdAt: "2026-02-05T13:00:00+08:00",
        updatedAt: "2026-03-12T10:55:00+08:00",
      },
      {
        id: "mm-prod-5",
        businessId: "paldo-1",
        name: "Well-Milled Rice",
        sku: "KMM-GRO-005",
        category: "Grocery",
        unit: "kilo",
        buyingPrice: 43,
        sellingPrice: 52,
        currentStock: 86,
        lowStockThreshold: 20,
        isActive: true,
        createdAt: "2026-02-07T06:45:00+08:00",
        updatedAt: "2026-03-12T08:30:00+08:00",
      },
      {
        id: "mm-prod-6",
        businessId: "paldo-1",
        name: "3-in-1 Coffee Twin Pack",
        sku: "KMM-GRO-006",
        category: "Grocery",
        unit: "box",
        buyingPrice: 94,
        sellingPrice: 120,
        currentStock: 0,
        lowStockThreshold: 6,
        isActive: false,
        createdAt: "2026-02-10T09:00:00+08:00",
        updatedAt: "2026-03-01T12:00:00+08:00",
      },
    ],
    stockMovements: [
      {
        id: "mm-move-1",
        productId: "mm-prod-2",
        businessId: "paldo-1",
        type: "sale",
        quantityChange: -12,
        stockBefore: 19,
        stockAfter: 7,
        referenceId: "txn-4401",
        notes: "Morning POS sales for bottled drinks.",
        createdAt: "2026-03-12T09:05:00+08:00",
      },
      {
        id: "mm-move-2",
        productId: "mm-prod-2",
        businessId: "paldo-1",
        type: "restock",
        quantityChange: 24,
        stockBefore: 11,
        stockAfter: 35,
        referenceId: "restock-1004",
        notes: "Delivered by Northstar Beverage Supply.",
        createdAt: "2026-03-10T15:30:00+08:00",
      },
      {
        id: "mm-move-3",
        productId: "mm-prod-2",
        businessId: "paldo-1",
        type: "adjustment",
        quantityChange: -1,
        stockBefore: 36,
        stockAfter: 35,
        referenceId: "adj-1002",
        notes: "Damaged bottle removed from chiller.",
        createdAt: "2026-03-10T16:10:00+08:00",
      },
      {
        id: "mm-move-4",
        productId: "mm-prod-1",
        businessId: "paldo-1",
        type: "sale",
        quantityChange: -8,
        stockBefore: 50,
        stockAfter: 42,
        referenceId: "txn-4393",
        notes: "Afternoon merienda rush.",
        createdAt: "2026-03-11T17:42:00+08:00",
      },
      {
        id: "mm-move-5",
        productId: "mm-prod-4",
        businessId: "paldo-1",
        type: "void",
        quantityChange: 2,
        stockBefore: 11,
        stockAfter: 13,
        referenceId: "txn-4388",
        notes: "Voided sale after duplicate scan.",
        createdAt: "2026-03-11T12:20:00+08:00",
      },
      {
        id: "mm-move-6",
        productId: "mm-prod-4",
        businessId: "paldo-1",
        type: "sale",
        quantityChange: -13,
        stockBefore: 13,
        stockAfter: 0,
        referenceId: "txn-4412",
        notes: "Lunch-hour canned goods rush emptied the shelf.",
        createdAt: "2026-03-12T10:55:00+08:00",
      },
    ],
    restocks: [
      {
        id: "restock-1004",
        productId: "mm-prod-2",
        businessId: "paldo-1",
        quantityAdded: 24,
        costPerUnit: 7.8,
        totalCost: 187.2,
        notes: "Two plastic crates received.",
        createdAt: "2026-03-10T15:30:00+08:00",
      },
      {
        id: "restock-1001",
        productId: "mm-prod-5",
        businessId: "paldo-1",
        quantityAdded: 50,
        costPerUnit: 42,
        totalCost: 2100,
        notes: "Restocked after weekend market day.",
        createdAt: "2026-03-08T06:40:00+08:00",
      },
      {
        id: "restock-0998",
        productId: "mm-prod-3",
        businessId: "paldo-1",
        quantityAdded: 20,
        costPerUnit: 6,
        totalCost: 120,
        notes: "Free one pack bundle included.",
        createdAt: "2026-03-05T13:25:00+08:00",
      },
    ],
    importSession: {
      fileName: "konrad-minimart-march.csv",
      sourceType: "csv",
      uploadedAt: "2026-03-12T08:40:00+08:00",
      totalRows: 4,
      readyRows: 3,
      warningRows: 1,
      mappings: [
        {
          sourceColumn: "SKU",
          matchedField: "sku",
          confidence: "high",
          sampleValue: "KMM-DRY-007",
        },
        {
          sourceColumn: "Product Name",
          matchedField: "name",
          confidence: "high",
          sampleValue: "Bear Brand 33g",
        },
        {
          sourceColumn: "Category Group",
          matchedField: "category",
          confidence: "medium",
          sampleValue: "Dairy",
        },
        {
          sourceColumn: "Unit Type",
          matchedField: "unit",
          confidence: "high",
          sampleValue: "piece",
        },
        {
          sourceColumn: "Landed Cost",
          matchedField: "buying_price",
          confidence: "high",
          sampleValue: "14.50",
        },
        {
          sourceColumn: "Retail Price",
          matchedField: "selling_price",
          confidence: "high",
          sampleValue: "18.00",
        },
        {
          sourceColumn: "On Hand",
          matchedField: "current_stock",
          confidence: "high",
          sampleValue: "30",
        },
        {
          sourceColumn: "Reorder Point",
          matchedField: "low_stock_threshold",
          confidence: "manual",
          sampleValue: "8",
        },
      ],
      previewRows: [
        {
          id: "row-1",
          status: "ready",
          issue: null,
          values: {
            sku: "KMM-DRY-007",
            name: "Bear Brand 33g",
            category: "Dairy",
            unit: "piece",
            buying_price: "14.50",
            selling_price: "18.00",
            current_stock: "30",
            low_stock_threshold: "8",
          },
        },
        {
          id: "row-2",
          status: "ready",
          issue: null,
          values: {
            sku: "KMM-BEV-008",
            name: "Coke Mismo",
            category: "Beverages",
            unit: "bottle",
            buying_price: "17.00",
            selling_price: "22.00",
            current_stock: "16",
            low_stock_threshold: "10",
          },
        },
        {
          id: "row-3",
          status: "warning",
          issue: "Unit 'can' needs manual review before import.",
          values: {
            sku: "KMM-GRO-009",
            name: "Argentina Corned Beef",
            category: "Grocery",
            unit: "other",
            buying_price: "31.00",
            selling_price: "40.00",
            current_stock: "12",
            low_stock_threshold: "6",
          },
        },
        {
          id: "row-4",
          status: "ready",
          issue: null,
          values: {
            sku: "KMM-HOU-010",
            name: "Joy Dishwashing 250ml",
            category: "Household",
            unit: "bottle",
            buying_price: "41.00",
            selling_price: "54.00",
            current_stock: "9",
            low_stock_threshold: "4",
          },
        },
      ],
    },
    drafts: {
      addProduct: {
        name: "Zonrox Bleach 500ml",
        sku: "KMM-HOU-011",
        category: "Household",
        unit: "bottle",
        buyingPrice: "28.00",
        sellingPrice: "35.00",
        openingStock: "12",
        lowStockThreshold: "5",
      },
      restock: {
        quantityAdded: "36",
        totalCost: "273.60",
        notes: "Prep for weekend foot traffic and school dismissal rush.",
      },
      adjustment: {
        direction: "subtract",
        quantityChange: "2",
        notes: "Two bottles leaked inside the ice chest. Adjustment note required.",
      },
    },
  },
  "paldo-2": {
    headline: "Service-based inventory with reusable containers, consumables, and refill capacity checks.",
    focusProductId: "wr-prod-1",
    suggestedCategories: ["Refill Service", "Containers", "Consumables", "Equipment"],
    products: [
      {
        id: "wr-prod-1",
        businessId: "paldo-2",
        name: "Purified Water 5-Gallon Refill",
        sku: "SWR-SVC-001",
        category: "Refill Service",
        unit: "piece",
        buyingPrice: 18,
        sellingPrice: 35,
        currentStock: 19,
        lowStockThreshold: 25,
        isActive: true,
        createdAt: "2026-02-02T08:30:00+08:00",
        updatedAt: "2026-03-12T07:55:00+08:00",
      },
      {
        id: "wr-prod-2",
        businessId: "paldo-2",
        name: "Alkaline Refill 5-Gallon",
        sku: "SWR-SVC-002",
        category: "Refill Service",
        unit: "piece",
        buyingPrice: 25,
        sellingPrice: 45,
        currentStock: 11,
        lowStockThreshold: 12,
        isActive: true,
        createdAt: "2026-02-04T09:45:00+08:00",
        updatedAt: "2026-03-11T17:00:00+08:00",
      },
      {
        id: "wr-prod-3",
        businessId: "paldo-2",
        name: "Sealed Cup 350ml",
        sku: "SWR-CON-003",
        category: "Containers",
        unit: "bottle",
        buyingPrice: 4.5,
        sellingPrice: 10,
        currentStock: 78,
        lowStockThreshold: 30,
        isActive: true,
        createdAt: "2026-02-05T11:10:00+08:00",
        updatedAt: "2026-03-12T10:20:00+08:00",
      },
      {
        id: "wr-prod-4",
        businessId: "paldo-2",
        name: "Blue Jug Deposit",
        sku: "SWR-CON-004",
        category: "Containers",
        unit: "piece",
        buyingPrice: 120,
        sellingPrice: 180,
        currentStock: 0,
        lowStockThreshold: 8,
        isActive: true,
        createdAt: "2026-02-06T14:00:00+08:00",
        updatedAt: "2026-03-12T10:05:00+08:00",
      },
      {
        id: "wr-prod-5",
        businessId: "paldo-2",
        name: "Shrink Cap Roll",
        sku: "SWR-CNS-005",
        category: "Consumables",
        unit: "pack",
        buyingPrice: 65,
        sellingPrice: 98,
        currentStock: 4,
        lowStockThreshold: 6,
        isActive: true,
        createdAt: "2026-02-07T15:10:00+08:00",
        updatedAt: "2026-03-11T11:22:00+08:00",
      },
      {
        id: "wr-prod-6",
        businessId: "paldo-2",
        name: "UV Lamp Replacement",
        sku: "SWR-EQP-006",
        category: "Equipment",
        unit: "other",
        buyingPrice: 850,
        sellingPrice: 1100,
        currentStock: 0,
        lowStockThreshold: 1,
        isActive: false,
        createdAt: "2026-02-08T09:30:00+08:00",
        updatedAt: "2026-03-02T13:15:00+08:00",
      },
    ],
    stockMovements: [
      {
        id: "wr-move-1",
        productId: "wr-prod-1",
        businessId: "paldo-2",
        type: "sale",
        quantityChange: -14,
        stockBefore: 33,
        stockAfter: 19,
        referenceId: "txn-8802",
        notes: "Route deliveries completed before lunch.",
        createdAt: "2026-03-12T07:55:00+08:00",
      },
      {
        id: "wr-move-2",
        productId: "wr-prod-1",
        businessId: "paldo-2",
        type: "restock",
        quantityChange: 20,
        stockBefore: 13,
        stockAfter: 33,
        referenceId: "restock-2004",
        notes: "Fresh processed batch released to dispatch.",
        createdAt: "2026-03-11T18:40:00+08:00",
      },
      {
        id: "wr-move-3",
        productId: "wr-prod-4",
        businessId: "paldo-2",
        type: "adjustment",
        quantityChange: -1,
        stockBefore: 7,
        stockAfter: 6,
        referenceId: "adj-2001",
        notes: "One jug pulled for cracked handle inspection.",
        createdAt: "2026-03-10T16:10:00+08:00",
      },
      {
        id: "wr-move-4",
        productId: "wr-prod-5",
        businessId: "paldo-2",
        type: "sale",
        quantityChange: -2,
        stockBefore: 6,
        stockAfter: 4,
        referenceId: "txn-8781",
        notes: "Used during rush sealing operations.",
        createdAt: "2026-03-11T11:22:00+08:00",
      },
      {
        id: "wr-move-5",
        productId: "wr-prod-2",
        businessId: "paldo-2",
        type: "void",
        quantityChange: 1,
        stockBefore: 10,
        stockAfter: 11,
        referenceId: "txn-8770",
        notes: "Cancelled duplicate booking from phone order.",
        createdAt: "2026-03-10T09:12:00+08:00",
      },
      {
        id: "wr-move-6",
        productId: "wr-prod-4",
        businessId: "paldo-2",
        type: "sale",
        quantityChange: -6,
        stockBefore: 6,
        stockAfter: 0,
        referenceId: "txn-8814",
        notes: "All blue jug deposits were released for route dispatch.",
        createdAt: "2026-03-12T10:05:00+08:00",
      },
    ],
    restocks: [
      {
        id: "restock-2004",
        productId: "wr-prod-1",
        businessId: "paldo-2",
        quantityAdded: 20,
        costPerUnit: 18,
        totalCost: 360,
        notes: "Evening batch for next-day deliveries.",
        createdAt: "2026-03-11T18:40:00+08:00",
      },
      {
        id: "restock-2002",
        productId: "wr-prod-4",
        businessId: "paldo-2",
        quantityAdded: 6,
        costPerUnit: 118,
        totalCost: 708,
        notes: "New jug shells delivered without caps.",
        createdAt: "2026-03-09T10:35:00+08:00",
      },
      {
        id: "restock-1999",
        productId: "wr-prod-5",
        businessId: "paldo-2",
        quantityAdded: 8,
        costPerUnit: 62,
        totalCost: 496,
        notes: "One pack reserved for kiosk unit.",
        createdAt: "2026-03-06T15:45:00+08:00",
      },
    ],
    importSession: {
      fileName: "southside-water-products.xlsx",
      sourceType: "xlsx",
      uploadedAt: "2026-03-11T16:20:00+08:00",
      totalRows: 4,
      readyRows: 4,
      warningRows: 0,
      mappings: [
        {
          sourceColumn: "sku_code",
          matchedField: "sku",
          confidence: "high",
          sampleValue: "SWR-CON-007",
        },
        {
          sourceColumn: "service_name",
          matchedField: "name",
          confidence: "high",
          sampleValue: "Round Bottle 1L",
        },
        {
          sourceColumn: "grouping",
          matchedField: "category",
          confidence: "medium",
          sampleValue: "Containers",
        },
        {
          sourceColumn: "unit",
          matchedField: "unit",
          confidence: "high",
          sampleValue: "bottle",
        },
        {
          sourceColumn: "cost_per_fill",
          matchedField: "buying_price",
          confidence: "high",
          sampleValue: "12.00",
        },
        {
          sourceColumn: "retail_price",
          matchedField: "selling_price",
          confidence: "high",
          sampleValue: "25.00",
        },
        {
          sourceColumn: "current_qty",
          matchedField: "current_stock",
          confidence: "high",
          sampleValue: "40",
        },
        {
          sourceColumn: "low_stock",
          matchedField: "low_stock_threshold",
          confidence: "high",
          sampleValue: "10",
        },
      ],
      previewRows: [
        {
          id: "row-1",
          status: "ready",
          issue: null,
          values: {
            sku: "SWR-CON-007",
            name: "Round Bottle 1L",
            category: "Containers",
            unit: "bottle",
            buying_price: "12.00",
            selling_price: "25.00",
            current_stock: "40",
            low_stock_threshold: "10",
          },
        },
        {
          id: "row-2",
          status: "ready",
          issue: null,
          values: {
            sku: "SWR-CNS-008",
            name: "Water Faucet Spare",
            category: "Consumables",
            unit: "piece",
            buying_price: "18.00",
            selling_price: "35.00",
            current_stock: "9",
            low_stock_threshold: "3",
          },
        },
        {
          id: "row-3",
          status: "ready",
          issue: null,
          values: {
            sku: "SWR-CON-009",
            name: "Slim Cup 250ml",
            category: "Containers",
            unit: "bottle",
            buying_price: "3.80",
            selling_price: "8.00",
            current_stock: "65",
            low_stock_threshold: "20",
          },
        },
        {
          id: "row-4",
          status: "ready",
          issue: null,
          values: {
            sku: "SWR-CNS-010",
            name: "Bottle Seal Roll",
            category: "Consumables",
            unit: "pack",
            buying_price: "58.00",
            selling_price: "95.00",
            current_stock: "7",
            low_stock_threshold: "5",
          },
        },
      ],
    },
    drafts: {
      addProduct: {
        name: "Jug Cap Set",
        sku: "SWR-CNS-011",
        category: "Consumables",
        unit: "pack",
        buyingPrice: "42.00",
        sellingPrice: "65.00",
        openingStock: "10",
        lowStockThreshold: "4",
      },
      restock: {
        quantityAdded: "15",
        totalCost: "262.50",
        notes: "Prepare extra refill capacity before Saturday village rounds.",
      },
      adjustment: {
        direction: "subtract",
        quantityChange: "1",
        notes: "Container returned with cracked neck. Note is required before submit.",
      },
    },
  },
  "paldo-3": {
    headline: "Wholesale stock with higher unit costs, bulk restocks, and reserved archived SKUs.",
    focusProductId: "vt-prod-2",
    suggestedCategories: ["Construction", "Electrical", "Plumbing", "Fasteners"],
    products: [
      {
        id: "vt-prod-1",
        businessId: "paldo-3",
        name: "Portland Cement 40kg",
        sku: "VT-CON-001",
        category: "Construction",
        unit: "sack",
        buyingPrice: 215,
        sellingPrice: 248,
        currentStock: 64,
        lowStockThreshold: 25,
        isActive: true,
        createdAt: "2026-02-01T07:30:00+08:00",
        updatedAt: "2026-03-12T08:12:00+08:00",
      },
      {
        id: "vt-prod-2",
        businessId: "paldo-3",
        name: "GI Tie Wire",
        sku: "VT-CON-002",
        category: "Construction",
        unit: "kilo",
        buyingPrice: 58,
        sellingPrice: 78,
        currentStock: 0,
        lowStockThreshold: 10,
        isActive: true,
        createdAt: "2026-02-02T09:00:00+08:00",
        updatedAt: "2026-03-12T11:15:00+08:00",
      },
      {
        id: "vt-prod-3",
        businessId: "paldo-3",
        name: "PVC Elbow 1/2",
        sku: "VT-PLB-003",
        category: "Plumbing",
        unit: "box",
        buyingPrice: 165,
        sellingPrice: 230,
        currentStock: 14,
        lowStockThreshold: 8,
        isActive: true,
        createdAt: "2026-02-03T10:20:00+08:00",
        updatedAt: "2026-03-11T16:50:00+08:00",
      },
      {
        id: "vt-prod-4",
        businessId: "paldo-3",
        name: "Roofing Screw",
        sku: "VT-FST-004",
        category: "Fasteners",
        unit: "dozen",
        buyingPrice: 42,
        sellingPrice: 60,
        currentStock: 22,
        lowStockThreshold: 12,
        isActive: true,
        createdAt: "2026-02-04T08:40:00+08:00",
        updatedAt: "2026-03-10T13:40:00+08:00",
      },
      {
        id: "vt-prod-5",
        businessId: "paldo-3",
        name: "Electrical Tape Black",
        sku: "VT-ELC-005",
        category: "Electrical",
        unit: "pack",
        buyingPrice: 96,
        sellingPrice: 130,
        currentStock: 9,
        lowStockThreshold: 6,
        isActive: true,
        createdAt: "2026-02-05T11:10:00+08:00",
        updatedAt: "2026-03-12T09:00:00+08:00",
      },
      {
        id: "vt-prod-6",
        businessId: "paldo-3",
        name: "Rebar Cut Length",
        sku: "VT-CON-006",
        category: "Construction",
        unit: "piece",
        buyingPrice: 145,
        sellingPrice: 178,
        currentStock: 0,
        lowStockThreshold: 4,
        isActive: false,
        createdAt: "2026-02-06T13:00:00+08:00",
        updatedAt: "2026-03-03T10:10:00+08:00",
      },
    ],
    stockMovements: [
      {
        id: "vt-move-1",
        productId: "vt-prod-2",
        businessId: "paldo-3",
        type: "sale",
        quantityChange: -6,
        stockBefore: 10,
        stockAfter: 4,
        referenceId: "txn-9904",
        notes: "Contractor pullout for townhouse slab work.",
        createdAt: "2026-03-12T09:40:00+08:00",
      },
      {
        id: "vt-move-2",
        productId: "vt-prod-2",
        businessId: "paldo-3",
        type: "restock",
        quantityChange: 15,
        stockBefore: 5,
        stockAfter: 20,
        referenceId: "restock-3003",
        notes: "Bulk reel split into selling kilos.",
        createdAt: "2026-03-09T14:25:00+08:00",
      },
      {
        id: "vt-move-3",
        productId: "vt-prod-1",
        businessId: "paldo-3",
        type: "sale",
        quantityChange: -18,
        stockBefore: 82,
        stockAfter: 64,
        referenceId: "txn-9891",
        notes: "Warehouse pickup for subdivision project.",
        createdAt: "2026-03-11T08:12:00+08:00",
      },
      {
        id: "vt-move-4",
        productId: "vt-prod-5",
        businessId: "paldo-3",
        type: "adjustment",
        quantityChange: -1,
        stockBefore: 10,
        stockAfter: 9,
        referenceId: "adj-3002",
        notes: "One pack opened for sample matching.",
        createdAt: "2026-03-12T09:00:00+08:00",
      },
      {
        id: "vt-move-5",
        productId: "vt-prod-3",
        businessId: "paldo-3",
        type: "void",
        quantityChange: 3,
        stockBefore: 11,
        stockAfter: 14,
        referenceId: "txn-9877",
        notes: "Cancelled duplicate order from messenger quote.",
        createdAt: "2026-03-10T15:50:00+08:00",
      },
      {
        id: "vt-move-6",
        productId: "vt-prod-2",
        businessId: "paldo-3",
        type: "sale",
        quantityChange: -4,
        stockBefore: 4,
        stockAfter: 0,
        referenceId: "txn-9911",
        notes: "Last tie wire kilos pulled for same-day contractor delivery.",
        createdAt: "2026-03-12T11:15:00+08:00",
      },
    ],
    restocks: [
      {
        id: "restock-3003",
        productId: "vt-prod-2",
        businessId: "paldo-3",
        quantityAdded: 15,
        costPerUnit: 56,
        totalCost: 840,
        notes: "Converted from one warehouse coil.",
        createdAt: "2026-03-09T14:25:00+08:00",
      },
      {
        id: "restock-3001",
        productId: "vt-prod-1",
        businessId: "paldo-3",
        quantityAdded: 40,
        costPerUnit: 212,
        totalCost: 8480,
        notes: "Priority cement delivery before Monday projects.",
        createdAt: "2026-03-08T07:35:00+08:00",
      },
      {
        id: "restock-2998",
        productId: "vt-prod-4",
        businessId: "paldo-3",
        quantityAdded: 12,
        costPerUnit: 40,
        totalCost: 480,
        notes: "Dozen-packed box replenishment.",
        createdAt: "2026-03-05T10:50:00+08:00",
      },
    ],
    importSession: {
      fileName: "vallejos-warehouse-skus.csv",
      sourceType: "csv",
      uploadedAt: "2026-03-10T13:05:00+08:00",
      totalRows: 5,
      readyRows: 4,
      warningRows: 1,
      mappings: [
        {
          sourceColumn: "SKU Code",
          matchedField: "sku",
          confidence: "high",
          sampleValue: "VT-PLB-007",
        },
        {
          sourceColumn: "Item Description",
          matchedField: "name",
          confidence: "high",
          sampleValue: "1/2 PVC Tee",
        },
        {
          sourceColumn: "Dept",
          matchedField: "category",
          confidence: "medium",
          sampleValue: "Plumbing",
        },
        {
          sourceColumn: "Selling Unit",
          matchedField: "unit",
          confidence: "manual",
          sampleValue: "box",
        },
        {
          sourceColumn: "Cost",
          matchedField: "buying_price",
          confidence: "high",
          sampleValue: "145.00",
        },
        {
          sourceColumn: "Markup Price",
          matchedField: "selling_price",
          confidence: "medium",
          sampleValue: "205.00",
        },
        {
          sourceColumn: "Qty Avail",
          matchedField: "current_stock",
          confidence: "high",
          sampleValue: "11",
        },
        {
          sourceColumn: "Min Qty",
          matchedField: "low_stock_threshold",
          confidence: "high",
          sampleValue: "6",
        },
      ],
      previewRows: [
        {
          id: "row-1",
          status: "ready",
          issue: null,
          values: {
            sku: "VT-PLB-007",
            name: "1/2 PVC Tee",
            category: "Plumbing",
            unit: "box",
            buying_price: "145.00",
            selling_price: "205.00",
            current_stock: "11",
            low_stock_threshold: "6",
          },
        },
        {
          id: "row-2",
          status: "ready",
          issue: null,
          values: {
            sku: "VT-FST-008",
            name: "Common Nail 2in",
            category: "Fasteners",
            unit: "box",
            buying_price: "310.00",
            selling_price: "385.00",
            current_stock: "5",
            low_stock_threshold: "3",
          },
        },
        {
          id: "row-3",
          status: "warning",
          issue: "Selling Unit 'roll' needs conversion to an allowed unit.",
          values: {
            sku: "VT-ELC-009",
            name: "Electrical Wire THHN",
            category: "Electrical",
            unit: "other",
            buying_price: "920.00",
            selling_price: "1100.00",
            current_stock: "2",
            low_stock_threshold: "1",
          },
        },
        {
          id: "row-4",
          status: "ready",
          issue: null,
          values: {
            sku: "VT-PLB-010",
            name: "Flexible Hose",
            category: "Plumbing",
            unit: "piece",
            buying_price: "68.00",
            selling_price: "92.00",
            current_stock: "24",
            low_stock_threshold: "8",
          },
        },
        {
          id: "row-5",
          status: "ready",
          issue: null,
          values: {
            sku: "VT-ELC-011",
            name: "Masking Tape",
            category: "Electrical",
            unit: "pack",
            buying_price: "78.00",
            selling_price: "110.00",
            current_stock: "13",
            low_stock_threshold: "5",
          },
        },
      ],
    },
    drafts: {
      addProduct: {
        name: "Tile Adhesive 25kg",
        sku: "VT-CON-012",
        category: "Construction",
        unit: "sack",
        buyingPrice: "178.00",
        sellingPrice: "220.00",
        openingStock: "18",
        lowStockThreshold: "8",
      },
      restock: {
        quantityAdded: "20",
        totalCost: "1110.00",
        notes: "Reserve incoming kilos for two contractor accounts on Friday pickup.",
      },
      adjustment: {
        direction: "subtract",
        quantityChange: "1",
        notes: "One kilo reweighed and removed after moisture exposure. Reason stays mandatory.",
      },
    },
  },
}

export const productImportTemplateColumns: DemoImportField[] = [
  "sku",
  "name",
  "category",
  "unit",
  "buying_price",
  "selling_price",
  "current_stock",
  "low_stock_threshold",
]

export function getInventoryDemo(businessId: string) {
  return inventoryDemoByBusiness[businessId] ?? inventoryDemoByBusiness[demoBusinesses[0].id]
}
