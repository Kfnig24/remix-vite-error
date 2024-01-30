import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const font = Poppins({
  weight: ["500", "600", "700"],
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: 'JobTeen',
  description: "Faites de l'argent facilement",
  manifest: "/manifest.json",
  icons: { apple: '/icon.png', icon: "/icon-192x192.png" }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={font.className}>
          {children}
        <Toaster />  
      </body>
    </html>
  )
}
