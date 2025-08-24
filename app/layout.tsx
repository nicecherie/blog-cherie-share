import { Header } from '@/components/Header'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/components/auth-provider'
import { ToastProvider } from '@/components/toast/toast-provider'
import './globals.css'
import type { Metadata } from 'next'
import { LoadingProvider } from '@/components/loading'
import Footer from '@/components/footer'

export const metadata: Metadata = {
  title: "cherie's blog",
  description: 'Work in progress'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system">
          <AuthProvider>
            <ToastProvider>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 bg-grid">
                  <LoadingProvider>{children}</LoadingProvider>
                </main>
                <Footer />
              </div>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
