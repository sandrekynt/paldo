"use client"

import * as React from "react"

import type { DemoProduct } from "@/lib/dummy-data"
import {
  createEmptyAddProductDraft,
  createEmptyAdjustmentDraft,
  createEmptyRestockDraft,
  getDraftFromProduct,
  type AddProductDraft,
  type AdjustmentDraft,
  type FieldErrors,
  type OptionField,
  type ProductFormDraft,
  type RestockDraft,
} from "@/lib/inventory"

type OptionDialogState = {
  action: "edit" | "delete"
  field: OptionField
  value: string
}

export function useInventoryModalState() {
  const [addProductOpen, setAddProductOpen] = React.useState(false)
  const [addDraft, setAddDraft] = React.useState<AddProductDraft>(
    createEmptyAddProductDraft()
  )
  const [addErrors, setAddErrors] = React.useState<FieldErrors>({})
  const [optionDialog, setOptionDialog] =
    React.useState<OptionDialogState | null>(null)
  const [optionDialogValue, setOptionDialogValue] = React.useState("")
  const [optionDialogError, setOptionDialogError] = React.useState("")
  const [viewingProductId, setViewingProductId] = React.useState<string | null>(
    null
  )
  const [stockHistoryProductId, setStockHistoryProductId] = React.useState<
    string | null
  >(null)
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

  function closeViewModal() {
    setViewingProductId(null)
  }

  function closeStockHistoryModal() {
    setStockHistoryProductId(null)
  }

  function closeRestockModal() {
    setRestockProductId(null)
    setRestockDraft(createEmptyRestockDraft())
    setRestockErrors({})
  }

  function closeAdjustmentModal() {
    setAdjustmentProductId(null)
    setAdjustmentDraft(createEmptyAdjustmentDraft())
    setAdjustmentErrors({})
  }

  function closeEditModal() {
    setEditingProductId(null)
    setEditDraft(null)
    setEditErrors({})
    setArchiveProductOpen(false)
  }

  function closeOptionDialog() {
    setOptionDialog(null)
    setOptionDialogValue("")
    setOptionDialogError("")
  }

  function handleAddProductOpenChange(open: boolean) {
    setAddProductOpen(open)
    setAddDraft(createEmptyAddProductDraft())
    setAddErrors({})
  }

  function openViewModal(product: DemoProduct) {
    setViewingProductId(product.id)
  }

  function openStockHistoryModal(productId: string) {
    setStockHistoryProductId(productId)
  }

  function openEditModal(product: DemoProduct) {
    setEditingProductId(product.id)
    setEditDraft(getDraftFromProduct(product))
    setEditErrors({})
  }

  function openRestockModal(productId: string) {
    setRestockProductId(productId)
    setRestockDraft(createEmptyRestockDraft())
    setRestockErrors({})
  }

  function openAdjustmentModal(productId: string) {
    setAdjustmentProductId(productId)
    setAdjustmentDraft(createEmptyAdjustmentDraft())
    setAdjustmentErrors({})
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

  function setOptionDialogValueWithReset(value: string) {
    setOptionDialogValue(value)
    setOptionDialogError("")
  }

  return {
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
  }
}
