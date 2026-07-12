/// <reference types="vite/client" />

interface Window {
  particlesJS?: (id: string, config: any) => void
  pJSDom?: Array<{ pJS: any }>
}
