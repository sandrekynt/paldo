"use client"

import { Eye, PencilLine } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { DemoProduct } from "@/lib/dummy-data"
import { formatCurrency } from "@/lib/inventory"

import { InventoryStatusBadge } from "@/components/inventory/status-badge"

function ProductListRow({
  product,
  currency,
  onView,
  onEdit,
}: {
  product: DemoProduct
  currency: string
  onView: () => void
  onEdit: () => void
}) {
  return (
    <tr className="border-t border-border">
      <td className="px-3 py-3">
        <p className="text-xs font-medium">{product.name}</p>
        <p className="text-[11px] text-muted-foreground">{product.sku}</p>
      </td>
      <td className="px-3 py-3 text-xs text-muted-foreground">
        {product.categoryName}
      </td>
      <td className="px-3 py-3 text-xs">
        {formatCurrency(product.buyingPrice, currency)}
      </td>
      <td className="px-3 py-3 text-xs">
        {formatCurrency(product.sellingPrice, currency)}
      </td>
      <td className="px-3 py-3 text-xs">
        <div className="flex items-center gap-2">
          <span>{product.currentStock}</span>
          <span className="text-muted-foreground">{product.unitName}</span>
        </div>
      </td>
      <td className="px-3 py-3 text-xs">{product.lowStockThreshold}</td>
      <td className="px-3 py-3">
        <InventoryStatusBadge product={product} />
      </td>
      <td className="px-3 py-3 text-center">
        <div className="flex items-center justify-center gap-1">
          <Tooltip>
            <TooltipTrigger
              id={`product-view-trigger-${product.id}`}
              render={
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label={`View ${product.name}`}
                  onClick={onView}
                />
              }
            >
              <Eye className="size-3.5" />
            </TooltipTrigger>
            <TooltipContent>View</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              id={`product-edit-trigger-${product.id}`}
              render={
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label={`Edit ${product.name}`}
                  onClick={onEdit}
                />
              }
            >
              <PencilLine className="size-3.5" />
            </TooltipTrigger>
            <TooltipContent>Edit</TooltipContent>
          </Tooltip>
        </div>
      </td>
    </tr>
  )
}

export function InventoryProductTable({
  products,
  currency,
  onView,
  onEdit,
}: {
  products: DemoProduct[]
  currency: string
  onView: (product: DemoProduct) => void
  onEdit: (product: DemoProduct) => void
}) {
  return (
    <div className="hidden overflow-x-auto lg:block">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-secondary text-left text-[11px] text-muted-foreground uppercase">
            <th className="px-3 py-3 align-middle">Name</th>
            <th className="px-3 py-3 align-middle">Category</th>
            <th className="px-3 py-3 align-middle">Buying</th>
            <th className="px-3 py-3 align-middle">Selling</th>
            <th className="px-3 py-3 align-middle">Stock qty</th>
            <th className="px-3 py-3 align-middle">Threshold</th>
            <th className="px-3 py-3 align-middle">Status</th>
            <th className="px-3 py-3 text-center align-middle">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <ProductListRow
              key={product.id}
              product={product}
              currency={currency}
              onView={() => onView(product)}
              onEdit={() => onEdit(product)}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function InventoryProductCards({
  products,
  currency,
  onView,
  onEdit,
}: {
  products: DemoProduct[]
  currency: string
  onView: (product: DemoProduct) => void
  onEdit: (product: DemoProduct) => void
}) {
  return (
    <div className="grid gap-3 lg:hidden">
      {products.map((product) => (
        <div
          key={product.id}
          className="grid gap-3 border border-border p-3 text-left"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-sm font-medium">{product.name}</p>
              <p className="text-xs text-muted-foreground">
                {product.categoryName} · {product.unitName}
              </p>
            </div>
            <InventoryStatusBadge product={product} />
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <span>Buy {formatCurrency(product.buyingPrice, currency)}</span>
            <span>Sell {formatCurrency(product.sellingPrice, currency)}</span>
            <span>Stock {product.currentStock}</span>
            <span>Threshold {product.lowStockThreshold}</span>
          </div>
          <div className="flex justify-end">
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                aria-label={`View ${product.name}`}
                onClick={() => onView(product)}
              >
                <Eye className="size-3.5" />
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                aria-label={`Edit ${product.name}`}
                onClick={() => onEdit(product)}
              >
                <PencilLine className="size-3.5" />
                Edit
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
