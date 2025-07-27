import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/AuthContext"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Recipe Generator - Create Amazing Recipes",
  description: "Generate personalized recipes based on your ingredients, preferences, and cooking time.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Suspense>
          <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">{children}</div>
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  )
}
