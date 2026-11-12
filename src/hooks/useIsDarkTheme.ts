import { useEffect, useState } from 'react'

/**
 * Reads the theme class that the navbar writes to <html>. Pages outside the
 * homepage (blog, gallery) have no navbar, so they still render with the theme
 * the visitor picked last.
 */
export function useIsDarkTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDark(document.documentElement.classList.contains('dark'))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return dark
}
