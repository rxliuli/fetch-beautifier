import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './components/theme/ThemeProvider.tsx'
import { Header } from './components/Header.tsx'
import { Footer } from './components/Footer.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-2 md:py-8">
          <App />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  </StrictMode>,
)
