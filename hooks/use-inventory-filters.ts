"use client"

import * as React from "react"

import { useClickOutside } from "@/hooks/use-click-outside"
import type { DemoProduct } from "@/lib/dummy-data"
import { getProductStatus, type ProductStatus } from "@/lib/inventory"

type UseInventoryFiltersParams = {
  categoryOptions: string[]
  products: DemoProduct[]
  productsPerPage: number
  selectedBusinessId: string
}

const defaultStatuses: ProductStatus[] = []

export function useInventoryFilters({
  categoryOptions,
  products,
  productsPerPage,
  selectedBusinessId,
}: UseInventoryFiltersParams) {
  const [selectedStatuses, setSelectedStatuses] =
    React.useState<ProductStatus[]>(defaultStatuses)
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    []
  )
  const [searchQuery, setSearchQuery] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [filtersOpen, setFiltersOpen] = React.useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false)
  const filtersRef = React.useRef<HTMLDivElement>(null)

  useClickOutside(filtersRef, () => setFiltersOpen(false), filtersOpen)

  const availableCategories = React.useMemo(
    () =>
      [...categoryOptions].sort((first, second) => first.localeCompare(second)),
    [categoryOptions]
  )

  const filteredProducts = React.useMemo(
    () =>
      products.filter((product) => {
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
      }),
    [products, searchQuery, selectedCategories, selectedStatuses]
  )

  React.useEffect(() => {
    setPage(1)
  }, [searchQuery, selectedStatuses, selectedCategories, selectedBusinessId])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / productsPerPage)
  )
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * productsPerPage
  const paginatedProducts = filteredProducts.slice(
    pageStart,
    pageStart + productsPerPage
  )
  const totalSelectedFilters =
    selectedStatuses.length + selectedCategories.length

  function toggleStatus(status: ProductStatus) {
    setSelectedStatuses((current) =>
      current.includes(status)
        ? current.filter((value) => value !== status)
        : [...current, status]
    )
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

  return {
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
  }
}
