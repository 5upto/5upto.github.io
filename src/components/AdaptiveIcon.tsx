import type { IconType } from 'react-icons'

export type IconPair = {
  outline: IconType
  filled: IconType
  /**
   * For Material glyphs whose outlined counterpart is identical to the filled
   * one: render the outlined state by stroking the filled glyph instead.
   */
  strokeOutline?: boolean
}

interface AdaptiveIconProps extends IconPair {
  /** Keeps the filled variant visible, e.g. for the current/active nav item. */
  active?: boolean
  size?: number | string
  className?: string
}

/**
 * Renders the outlined icon by default and cross-fades to the filled variant
 * while its parent `.group` is hovered/focused (or when `active` is set).
 */
export default function AdaptiveIcon({
  outline: Outline,
  filled: Filled,
  active = false,
  size,
  className = '',
  strokeOutline = false,
}: AdaptiveIconProps) {
  return (
    <span className={`adaptive-icon${active ? ' is-active' : ''}`} aria-hidden="true">
      <Outline
        size={size}
        className={`adaptive-icon-outline${strokeOutline ? ' adaptive-icon-stroked' : ''} ${className}`}
      />
      <Filled size={size} className={`adaptive-icon-filled ${className}`} />
    </span>
  )
}
