import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers/Providers"

const inter = Inter({
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Proyectos-IT CRM",
  description: "Sistema de gestión de clientes y soporte",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}