import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'To-Do List',
  description: 'Created with devs',
  generator: 'd2.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
