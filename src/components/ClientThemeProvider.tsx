'use client'

import { ThemeProvider } from '@/lib/theme'

export default function ClientThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>
} 