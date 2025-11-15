// components/PageTransition.tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    // Start transition
    setIsTransitioning(true)
    
    // Very brief white screen
    const whiteScreenTimer = setTimeout(() => {
      setIsTransitioning(false)
    }, 50) // 50ms white screen - very brief

    return () => {
      clearTimeout(whiteScreenTimer)
    }
  }, [pathname])

  return (
    <>
      {/* White Screen Flash */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.05 }} // Very fast flash
            className="fixed inset-0 bg-white z-50 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Page Content */}
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ 
          duration: 0.3,
          delay: 0.05, // Start after white screen
          ease: "easeOut"
        }}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </>
  )
}