"use client"

import { motion } from "framer-motion"

interface LotoNumberProps {
  number: number
  delay: number
  size?: "sm" | "lg"
}

export function LotoNumber({ number, delay, size = "lg" }: LotoNumberProps) {
  const sizeClasses = {
    sm: "min-w-8 h-8 text-sm",
    lg: "min-w-10 h-10 text-lg"
  }

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: delay
      }}
      className={`${sizeClasses[size]} px-2 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold`}
    >
      {number}
    </motion.div>
  )
}