"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import type { DemoProduct, DemoStockMovement } from "@/lib/dummy-data"
import {
  formatCurrency,
  formatDateTime,
  formatMovementType,
  formatQuantityChange,
} from "@/lib/inventory"
import { cn } from "@/lib/utils"

import { InventoryStatusBadge } from "@/components/inventory/status-badge"

function ProductDetailItem({
  label,
  value,
  align = "left",
}: {
  label: string
  value: React.ReactNode
  align?: "left" | "right"
}) {
  return (
    <div className={cn("grid gap-1", align === "right" && "text-right")}>
      <p className="text-[11px] text-muted-foreground uppercase">{label}</p>
      <div>{value}</div>
    </div>
  )
}

export function ProductActionSummary({
  product,
}: {
  product: Pick<DemoProduct, "name" | "currentStock" | "unitName">
}) {
  return (
    <div className="grid gap-4 border border-border p-4 md:grid-cols-2">
      <ProductDetailItem
        label="Name"
        value={<p className="text-sm font-medium">{product.name}</p>}
      />
      <ProductDetailItem
        label="Stock qty"
        value={
          <p className="text-sm">
            {product.currentStock} {product.unitName}
          </p>
        }
      />
    </div>
  )
}

export function InventoryProductDetailsContent({
  product,
  movements,
  isMobile,
  currency,
  onRestock,
  onAdjustment,
}: {
  product: DemoProduct
  movements: DemoStockMovement[]
  isMobile: boolean
  currency: string
  onRestock: () => void
  onAdjustment: () => void
}) {
  return (
    <>
      {isMobile ? (
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-6 border border-border p-4">
          <div className="grid content-start gap-4">
            <ProductDetailItem
              label="Name"
              value={<p className="text-sm font-medium">{product.name}</p>}
            />
            <ProductDetailItem
              label="SKU"
              value={<p className="text-sm">{product.sku}</p>}
            />
            <ProductDetailItem
              label="Category"
              value={<p className="text-sm">{product.categoryName}</p>}
            />
            <ProductDetailItem
              label="Buying price"
              value={
                <p className="text-sm">
                  {formatCurrency(product.buyingPrice, currency)}
                </p>
              }
            />
            <ProductDetailItem
              label="Stock qty"
              value={
                <p className="text-sm">
                  {product.currentStock} {product.unitName}
                </p>
              }
            />
          </div>
          <div className="grid content-start gap-4">
            <ProductDetailItem
              label="Status"
              align="right"
              value={<InventoryStatusBadge product={product} />}
            />
            <ProductDetailItem
              label="Unit"
              align="right"
              value={<p className="text-sm">{product.unitName}</p>}
            />
            <ProductDetailItem
              label="Selling price"
              align="right"
              value={
                <p className="text-sm">
                  {formatCurrency(product.sellingPrice, currency)}
                </p>
              }
            />
            <ProductDetailItem
              label="Threshold"
              align="right"
              value={<p className="text-sm">{product.lowStockThreshold}</p>}
            />
          </div>
        </div>
      ) : (
        <div className="grid gap-4 border border-border p-4 md:grid-cols-2">
          <ProductDetailItem
            label="Name"
            value={<p className="text-sm font-medium">{product.name}</p>}
          />
          <ProductDetailItem
            label="Status"
            value={<InventoryStatusBadge product={product} />}
          />
          <ProductDetailItem
            label="SKU"
            value={<p className="text-sm">{product.sku}</p>}
          />
          <ProductDetailItem
            label="Category"
            value={<p className="text-sm">{product.categoryName}</p>}
          />
          <ProductDetailItem
            label="Unit"
            value={<p className="text-sm">{product.unitName}</p>}
          />
          <ProductDetailItem
            label="Buying price"
            value={
              <p className="text-sm">
                {formatCurrency(product.buyingPrice, currency)}
              </p>
            }
          />
          <ProductDetailItem
            label="Selling price"
            value={
              <p className="text-sm">
                {formatCurrency(product.sellingPrice, currency)}
              </p>
            }
          />
          <ProductDetailItem
            label="Stock qty"
            value={
              <p className="text-sm">
                {product.currentStock} {product.unitName}
              </p>
            }
          />
          <ProductDetailItem
            label="Threshold"
            value={<p className="text-sm">{product.lowStockThreshold}</p>}
          />
        </div>
      )}

      <div className="grid gap-2 md:flex md:justify-end">
        <Button variant="outline" onClick={onRestock}>
          Restock
        </Button>
        <Button variant="outline" onClick={onAdjustment}>
          Manual adjustment
        </Button>
      </div>

      <div className="grid gap-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium">Stock movement history</p>
          <p className="text-xs text-muted-foreground">
            {movements.length} records
          </p>
        </div>
        {movements.length > 0 ? (
          <div className="grid gap-2">
            {movements.map((movement) =>
              isMobile ? (
                <div
                  key={movement.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 border border-border p-3"
                >
                  <div className="grid gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xs font-medium">
                        {formatMovementType(movement.type)}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {formatDateTime(movement.createdAt)}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {movement.notes}
                    </p>
                  </div>
                  <div className="grid gap-3 text-right text-xs">
                    <div className="grid gap-1">
                      <p className="text-[11px] text-muted-foreground uppercase">
                        Change
                      </p>
                      <p
                        className={cn(
                          "font-medium",
                          movement.quantityChange > 0 && "text-green-700",
                          movement.quantityChange < 0 && "text-red-700"
                        )}
                      >
                        {formatQuantityChange(movement.quantityChange)}
                      </p>
                    </div>
                    <div className="grid gap-1">
                      <p className="text-[11px] text-muted-foreground uppercase">
                        Stock
                      </p>
                      <p className="font-medium">
                        {movement.stockBefore} to {movement.stockAfter}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  key={movement.id}
                  className="grid gap-3 border border-border p-3 md:grid-cols-[1fr_auto_auto]"
                >
                  <div className="grid gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xs font-medium">
                        {formatMovementType(movement.type)}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {formatDateTime(movement.createdAt)}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {movement.notes}
                    </p>
                  </div>
                  <div className="grid gap-1 text-xs">
                    <p className="text-[11px] text-muted-foreground uppercase">
                      Change
                    </p>
                    <p
                      className={cn(
                        "font-medium",
                        movement.quantityChange > 0 && "text-green-700",
                        movement.quantityChange < 0 && "text-red-700"
                      )}
                    >
                      {formatQuantityChange(movement.quantityChange)}
                    </p>
                  </div>
                  <div className="grid gap-1 text-xs">
                    <p className="text-[11px] text-muted-foreground uppercase">
                      Stock
                    </p>
                    <p className="font-medium">
                      {movement.stockBefore} to {movement.stockAfter}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="border border-border p-4 text-xs text-muted-foreground">
            No stock movement history for this product yet.
          </div>
        )}
      </div>
    </>
  )
}
