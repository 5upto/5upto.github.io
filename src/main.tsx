import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import { SoundProvider } from './hooks/useSound'
import './index.css'

const queryClient = new QueryClient()

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SoundProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </SoundProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
