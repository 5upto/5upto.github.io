import { useId, useMemo } from 'react'
import type { CSSProperties } from 'react'

import aiBuilderSvg from '../assets/icons/power-platform/AIBuilder_scalable.svg?raw'
import dataverseSvg from '../assets/icons/power-platform/Dataverse_scalable.svg?raw'
import powerAppsSvg from '../assets/icons/power-platform/PowerApps_scalable.svg?raw'
import powerAutomateSvg from '../assets/icons/power-platform/PowerAutomate_scalable.svg?raw'
import powerBiSvg from '../assets/icons/power-platform/PowerBI.svg?raw'
import powerPagesSvg from '../assets/icons/power-platform/PowerPages_scalable.svg?raw'
import powerPlatformSvg from '../assets/icons/power-platform/PowerPlatform_scalable.svg?raw'
import sharePointSvg from '../assets/icons/power-platform/SharePoint.svg?raw'

export interface CustomIconProps {
  size?: number | string
  color?: string
  style?: CSSProperties
  className?: string
  title?: string
}

interface InlineSvgIconProps extends CustomIconProps {
  source: string
}

/**
 * Renders one of the bundled Power Platform SVGs.
 *
 * The source files reuse the same gradient / clip-path ids, so every instance
 * gets a React-generated prefix before it is injected. Without that, rendering
 * two different Power Platform icons on the same page would make them share
 * whichever <defs> happened to be first in the document.
 */
function InlineSvgIcon({ source, size = 24, style, className, title }: InlineSvgIconProps) {
  const rawId = useId()
  const prefix = rawId.replace(/[^a-zA-Z0-9_-]/g, '')

  const markup = useMemo(() => {
    // Some downloaded SVGs (e.g. the Wikimedia SharePoint file) start with an
    // XML declaration, which is not valid inside inline HTML.
    let svg = source
      .replace(/^\s*<\?xml[^>]*\?>\s*/i, '')
      .replace(/^\s*<!DOCTYPE[^>]*>\s*/i, '')
    const ids = new Set<string>()
    for (const match of svg.matchAll(/\bid="([^"]+)"/g)) ids.add(match[1])

    for (const id of ids) {
      svg = svg.split(`id="${id}"`).join(`id="${prefix}-${id}"`)
      svg = svg.split(`url(#${id})`).join(`url(#${prefix}-${id})`)
      svg = svg.split(`href="#${id}"`).join(`href="#${prefix}-${id}"`)
    }

    // Let the component own the rendered size while keeping the source viewBox.
    svg = svg.replace(/<svg\b([^>]*)>/, (_match, attrs: string) => {
      const cleaned = attrs.replace(/\s(?:width|height)="[^"]*"/g, '')
      return `<svg${cleaned} width="${size}" height="${size}" role="img" aria-hidden="true" focusable="false">`
    })

    return svg
  }, [source, size, prefix])

  return (
    <span
      className={className}
      title={title}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        lineHeight: 0,
        width: size,
        height: size,
        ...style,
      }}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  )
}

export function AIBuilderIcon(props: CustomIconProps) {
  return <InlineSvgIcon source={aiBuilderSvg} {...props} />
}

export function DataverseIcon(props: CustomIconProps) {
  return <InlineSvgIcon source={dataverseSvg} {...props} />
}

export function PowerAppsIcon(props: CustomIconProps) {
  return <InlineSvgIcon source={powerAppsSvg} {...props} />
}

export function PowerAutomateIcon(props: CustomIconProps) {
  return <InlineSvgIcon source={powerAutomateSvg} {...props} />
}

export function PowerBiIcon(props: CustomIconProps) {
  return <InlineSvgIcon source={powerBiSvg} {...props} />
}

export function PowerPagesIcon(props: CustomIconProps) {
  return <InlineSvgIcon source={powerPagesSvg} {...props} />
}

export function PowerPlatformIcon(props: CustomIconProps) {
  return <InlineSvgIcon source={powerPlatformSvg} {...props} />
}

export function SharePointIcon(props: CustomIconProps) {
  return <InlineSvgIcon source={sharePointSvg} {...props} />
}
