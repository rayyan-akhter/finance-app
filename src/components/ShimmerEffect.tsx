'use client'

interface ShimmerEffectProps {
  className?: string
  children?: React.ReactNode
}

export default function ShimmerEffect({ className = '', children }: ShimmerEffectProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent" />
    </div>
  )
} 