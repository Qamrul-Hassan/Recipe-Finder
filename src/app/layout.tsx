'use client'

import '@/styles/globals.css'
import { Provider } from 'react-redux'
import { store } from '@/store/store'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  )
}
