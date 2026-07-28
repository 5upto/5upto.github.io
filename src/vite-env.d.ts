/// <reference types="vite/client" />

declare module '*.glb'
declare module '*.png'

declare module 'meshline' {
  export const MeshLineGeometry: any
  export const MeshLineMaterial: any
}

interface Window {
  particlesJS?: (id: string, config: any) => void
  pJSDom?: Array<{ pJS: any }>
}
