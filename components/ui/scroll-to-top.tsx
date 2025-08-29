'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300) // 滚动超过 300px 显示
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.8 }}
      transition={{ duration: 0.3 }}
      onClick={scrollToTop}
      className="
        fixed bottom-6 right-6 z-40
        w-12 h-12 flex items-center justify-center
        rounded-full shadow-lg
        bg-white/50 dark:bg-gray-900/30
        backdrop-blur-lg border border-white/20
        text-gray-800 dark:text-gray-200
        hover:scale-110 transition
      "
    >
      <ArrowUp className="w-5 h-5" />
    </motion.button>
  )
}
