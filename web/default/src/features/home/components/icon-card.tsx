import { getLobeIcon } from '@/lib/lobe-icon'
import { cn } from '@/lib/utils'

interface IconCardProps {
  iconName: string
  size?: number
  className?: string
}

/**
 * Reusable icon card component with glass morphism effect
 */
export function IconCard({ iconName, size = 32, className }: IconCardProps) {
  return (
    <div
      className={cn(
        'group/card border-border/70 bg-card/80',
        'relative overflow-hidden rounded-lg border p-5 shadow-[0_8px_30px_-26px_rgba(20,20,19,0.35)]',
        'transition-all duration-300 hover:border-primary/35 hover:bg-card',
        className
      )}
    >
      <div className='absolute inset-x-0 top-0 h-px bg-primary/0 transition-all duration-300 group-hover/card:bg-primary/50' />
      <div className='relative flex items-center justify-center'>
        {getLobeIcon(iconName, size)}
      </div>
    </div>
  )
}
