import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSystemConfig } from '@/hooks/use-system-config'
import { Button } from '@/components/ui/button'
import { HeroTerminalDemo } from '../hero-terminal-demo'

interface HeroProps {
  className?: string
  isAuthenticated?: boolean
}

export function Hero(props: HeroProps) {
  const { t } = useTranslation()
  const { systemName } = useSystemConfig()

  return (
    <section className='relative z-10 flex flex-col items-center overflow-hidden px-6 pt-28 pb-16 md:pt-32 md:pb-20'>
      {/* Warm MO API surface treatment */}
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 -z-10 opacity-90 dark:opacity-60'
        style={{
          background:
            'linear-gradient(180deg, color-mix(in srgb, var(--card) 82%, transparent) 0%, transparent 64%)',
        }}
      />
      <div
        aria-hidden
        className='absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom,black_0%,transparent_80%)] bg-[size:3.5rem_3.5rem] opacity-[0.12]'
      />

      <div className='flex max-w-3xl flex-col items-center text-center'>
        <h1
          className='landing-animate-fade-up text-4xl leading-[1.08] font-semibold tracking-tight text-foreground md:text-5xl'
          style={{ animationDelay: '0ms' }}
        >
          {t('Unified API Gateway for')}
          <br />
          <span className='text-primary'>
            {t('All Your AI Models')}
          </span>
        </h1>
        <p
          className='landing-animate-fade-up text-muted-foreground/80 mt-5 max-w-lg text-base leading-relaxed opacity-0 md:text-lg'
          style={{ animationDelay: '80ms' }}
        >
          {systemName}{' '}
          {t(
            'is an open-source AI API gateway for self-hosted deployments. Connect multiple upstream services, manage models, keys, quotas, logs, and routing policies in one place.'
          )}
        </p>
        <div
          className='landing-animate-fade-up mt-8 flex items-center gap-3 opacity-0'
          style={{ animationDelay: '160ms' }}
        >
          {props.isAuthenticated ? (
            <Button className='group rounded-md' asChild>
              <Link to='/dashboard'>
                {t('Go to Dashboard')}
                <ArrowRight className='ml-1 size-3.5 transition-transform duration-200 group-hover:translate-x-0.5' />
              </Link>
            </Button>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>

      <div
        className='landing-animate-fade-up w-full opacity-0'
        style={{ animationDelay: '300ms' }}
      >
        <HeroTerminalDemo />
      </div>
    </section>
  )
}
