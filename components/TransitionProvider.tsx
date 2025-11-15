'use client'

import PageTransition from './PageTransition'

export default function TransitionProvider({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>
}