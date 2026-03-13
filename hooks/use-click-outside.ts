"use client"

import * as React from "react"

export function useClickOutside<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  onOutsideClick: () => void,
  enabled = true
) {
  React.useEffect(() => {
    if (!enabled) {
      return
    }

    function handlePointerDown(event: PointerEvent) {
      if (!ref.current?.contains(event.target as Node)) {
        onOutsideClick()
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
    }
  }, [enabled, onOutsideClick, ref])
}
