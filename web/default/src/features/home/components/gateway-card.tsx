import { useTranslation } from 'react-i18next'
import { Separator } from '@/components/ui/separator'
import { getGatewayFeatures } from '../constants'

interface GatewayCardProps {
  logo: string
  systemName: string
}

/**
 * Central gateway card with features grid
 */
export function GatewayCard({ logo, systemName }: GatewayCardProps) {
  const { t } = useTranslation()
  const features = getGatewayFeatures(t)

  return (
    <div className='glass-3 group relative overflow-hidden rounded-lg border border-border/70 p-8 transition-all duration-500 sm:p-10'>
      {/* Top gradient border effect */}
      <Separator className='absolute top-0 left-[10%] h-[2px] w-[80%] bg-primary/65' />

      <div className='absolute inset-x-0 top-0 h-24 bg-muted/35 transition-opacity duration-500 group-hover:opacity-80' />

      <div className='relative'>
        {/* Gateway Header */}
        <div className='mb-8 flex items-center justify-center gap-3'>
          <img
            src={logo}
            alt={systemName}
            className='h-12 w-12 rounded-md bg-card object-contain ring-1 ring-border'
          />
          <h3 className='text-2xl font-semibold text-foreground'>
            {systemName}
          </h3>
        </div>

        {/* Features Grid */}
        <div className='grid grid-cols-2 gap-3'>
          {features.map((feature, i) => (
            <div
              key={i}
              className='group/item relative overflow-hidden rounded-md border border-border/70 bg-card/70 px-4 py-3.5 text-center shadow-sm transition-all duration-300 hover:border-primary/40 hover:bg-card'
            >
              <div className='absolute inset-x-0 top-0 h-px bg-primary/0 transition-all duration-300 group-hover/item:bg-primary/50' />
              <span className='text-foreground/90 group-hover/item:text-foreground relative text-sm font-medium'>
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
