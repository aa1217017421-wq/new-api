import { type SVGProps } from 'react'
import { cn } from '@/lib/utils'

export function Logo({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      id='newapi-logo'
      viewBox='0 0 64 64'
      xmlns='http://www.w3.org/2000/svg'
      height='64'
      width='64'
      fill='none'
      className={cn('size-6', className)}
      {...props}
    >
      <title>MO API</title>
      <rect
        x='5'
        y='5'
        width='54'
        height='54'
        rx='14'
        fill='var(--card)'
        stroke='var(--border)'
        strokeWidth='2'
      />
      <path
        d='M15.5 43.5V20.5L27 35.2L38.5 20.5V43.5'
        stroke='var(--foreground)'
        strokeWidth='5.2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <circle
        cx='46.4'
        cy='32'
        r='9.4'
        fill='var(--card)'
        stroke='var(--primary)'
        strokeWidth='5.2'
      />
      <path
        d='M44.8 16.5C51.4 16.8 56.7 21.6 58 28'
        stroke='var(--chart-2)'
        strokeWidth='3.2'
        strokeLinecap='round'
      />
      <circle cx='52.8' cy='17.9' r='3.4' fill='var(--chart-1)' />
      <path
        d='M20 49.5H44'
        stroke='var(--border)'
        strokeWidth='2'
        strokeLinecap='round'
      />
    </svg>
  )
}
