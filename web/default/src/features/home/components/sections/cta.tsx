import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { AnimateInView } from '@/components/animate-in-view'

interface CTAProps {
  className?: string
  isAuthenticated?: boolean
}

export function CTA(props: CTAProps) {
  const { t } = useTranslation()

  if (props.isAuthenticated) {
    return null
  }

  return (
    <section className='relative z-10 overflow-hidden border-y border-border/70 bg-card/35 px-6 py-20 md:py-24'>
      {/* Restrained warm band for the closing action */}
      <div
        aria-hidden
        className='absolute inset-0 -z-10 opacity-80 dark:opacity-45'
        style={{
          background:
            'linear-gradient(180deg, color-mix(in srgb, var(--muted) 55%, transparent) 0%, transparent 100%)',
        }}
      />

      <AnimateInView
        className='mx-auto max-w-2xl text-center'
        animation='scale-in'
      >
        <h2 className='text-2xl leading-tight font-bold tracking-tight md:text-4xl'>
          {t('Ready to simplify')}
          <br />
          <span className='text-primary'>
            {t('your AI integration?')}
          </span>
        </h2>
        <p className='text-muted-foreground/80 mx-auto mt-5 max-w-md text-sm leading-relaxed md:text-base'>
          {t(
            'Deploy your own gateway and start routing requests through your configured upstream services.'
          )}
        </p>
        <div className='mt-8 flex items-center justify-center gap-3'>
          <Button className='group rounded-md' asChild>
            <Link to='/sign-up'>
              {t('Get Started')}
              <ArrowRight className='ml-1 size-3.5 transition-transform duration-200 group-hover:translate-x-0.5' />
            </Link>
          </Button>
          <Button
            variant='outline'
            className='hover:bg-muted/60 rounded-md border-border/80 hover:border-primary/40'
            asChild
          >
            <Link to='/pricing'>{t('View Pricing')}</Link>
          </Button>
        </div>
      </AnimateInView>
    </section>
  )
}
