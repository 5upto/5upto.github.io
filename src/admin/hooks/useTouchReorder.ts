import { useCallback, useRef, useState } from 'react'

export function useTouchReorder(itemCount: number, onReorder: (from: number, to: number) => void) {
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [overIdx, setOverIdx] = useState<number | null>(null)
  const touchStartY = useRef(0)
  const itemHeight = useRef(0)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const idx = Number((e.currentTarget as HTMLElement).dataset.idx)
    if (isNaN(idx)) return
    touchStartY.current = e.touches[0].clientY
    itemHeight.current = (e.currentTarget as HTMLElement).offsetHeight + 8
    setDragIdx(idx)
    setOverIdx(idx)
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (dragIdx === null) return
    e.preventDefault()
    const touch = e.touches[0]
    const delta = touch.clientY - touchStartY.current
    const offset = Math.round(delta / itemHeight.current)
    const newOver = Math.min(Math.max(0, dragIdx + offset), itemCount - 1)
    setOverIdx(newOver)
  }, [dragIdx, itemCount])

  const handleTouchEnd = useCallback(() => {
    if (dragIdx !== null && overIdx !== null && dragIdx !== overIdx) {
      onReorder(dragIdx, overIdx)
    }
    setDragIdx(null)
    setOverIdx(null)
  }, [dragIdx, overIdx, onReorder])

  return {
    dragIdx,
    overIdx,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  }
}
