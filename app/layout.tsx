import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import MiniKitProvider from "../components/providers/minikit-provider"
import { ErudaProvider } from "../components/providers/eruda"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WorldSocial",
  description: "A social platform for sharing and discovering videos",
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:ital@0;1&family=Rubik:ital,wght@0,300..900;1,300..900&family=Sora:wght@600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ErudaProvider>
          <MiniKitProvider appId={process.env.MINIKIT_APP_ID}>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </MiniKitProvider>
        </ErudaProvider>
      </body>
    </html>
  )
}


