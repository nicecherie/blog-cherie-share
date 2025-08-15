import { Header } from '@/components/Header'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/components/auth-provider'
import { ToastProvider } from '@/components/toast/toast-provider'
import './globals.css'
import type Metadata from 'next'
import { LoadingProvider } from '@/components/loading'

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
    <html lang="zh-CN">
      <body>
        <ThemeProvider attribute="class" defaultTheme="system">
          <AuthProvider>
            <ToastProvider>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">
                  <LoadingProvider>{children}</LoadingProvider>
                </main>
                <footer className="py-2">
                  <div className="container mx-auto text-center text-sm px-4 text-muted-foreground">
                    © {new Date().getFullYear()} cherie. 保留所有权利.
                  </div>
                </footer>
              </div>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
