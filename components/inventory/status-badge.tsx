"use client"

import { Badge } from "@/components/ui/badge"
import type { DemoProduct } from "@/lib/dummy-data"
import { getProductStatus } from "@/lib/inventory"

export function InventoryStatusBadge({ product }: { product: DemoProduct }) {
  const status = getProductStatus(product)

  if (status === "archived") {
    return (
      <Badge variant="outline" className="border-dashed text-muted-foreground">
        Archived
      </Badge>
    )
  }

  if (status === "low") {
    return (
      <Badge className="border-transparent bg-amber-100 text-amber-700">
        Low stock
      </Badge>
    )
  }

  if (status === "out") {
    return (
      <Badge className="border-transparent bg-red-100 text-red-700">
        Out of stock
      </Badge>
    )
  }

  return (
    <Badge className="border-transparent bg-green-100 text-green-700">
      Healthy
    </Badge>
  )
}
