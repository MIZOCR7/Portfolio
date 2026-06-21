import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false)
  const cursorSize = isHovered ? 50 : 20

  const mouse = {
    x: useMotionValue(0),
    y: useMotionValue(0),
  }

  // Smooth spring physics for the cursor
  const smoothOptions = { damping: 20, stiffness: 300, mass: 0.5 }
  const smoothMouse = {
    x: useSpring(mouse.x, smoothOptions),
    y: useSpring(mouse.y, smoothOptions),
  }

  const manageMouseMove = (e: MouseEvent) => {
    mouse.x.set(e.clientX - cursorSize / 2)
    mouse.y.set(e.clientY - cursorSize / 2)
  }

  const manageMouseOver = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    // Check if hovering over a clickable element or magnetic element
    if (
      target.tagName.toLowerCase() === 'a' ||
      target.tagName.toLowerCase() === 'button' ||
      target.closest('a') ||
      target.closest('button') ||
      target.closest('.magnetic')
    ) {
      setIsHovered(true)
    } else {
      setIsHovered(false)
    }
  }

  useEffect(() => {
    window.addEventListener('mousemove', manageMouseMove)
    window.addEventListener('mouseover', manageMouseOver)
    return () => {
      window.removeEventListener('mousemove', manageMouseMove)
      window.removeEventListener('mouseover', manageMouseOver)
    }
  }, [isHovered, cursorSize])

  return (
    <motion.div
      style={{
        left: smoothMouse.x,
        top: smoothMouse.y,
        width: cursorSize,
        height: cursorSize,
        mixBlendMode: 'difference',
      }}
      className="fixed top-0 left-0 bg-white rounded-full pointer-events-none z-[9999]"
      animate={{
        width: cursorSize,
        height: cursorSize,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    />
  )
}
