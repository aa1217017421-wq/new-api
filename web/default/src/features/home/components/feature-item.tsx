interface FeatureItemProps {
  title: string
  description: string
  icon: React.ReactNode
}

/**
 * Individual feature item with icon, title, and description
 */
export function FeatureItem({ title, description, icon }: FeatureItemProps) {
  return (
    <div className='group/feature text-foreground flex flex-col gap-4 p-4'>
      {/* Icon */}
      <div className='flex items-center self-start'>
        <div className='flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary shadow-inner ring-1 ring-primary/20 transition-all duration-300 group-hover/feature:ring-primary/40'>
          {icon}
        </div>
      </div>
      {/* Title */}
      <h3 className='text-sm leading-none font-semibold tracking-tight sm:text-base'>
        {title}
      </h3>
      {/* Description */}
      <p className='text-muted-foreground max-w-[240px] text-sm text-balance'>
        {description}
      </p>
    </div>
  )
}
