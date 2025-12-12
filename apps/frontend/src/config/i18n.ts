import { createNavigation } from 'next-intl/navigation'
import { LocalePrefix } from 'next-intl/routing'

export const locales = ['pt-BR'] as const

export const localesNames = {'pt-BR': 'Português (Brasil)' }

export const i18nConfig = {
  defaultLocale: 'pt-BR' as const,
  locales,
  localePrefix: 'always' as LocalePrefix<typeof locales>,
}

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(i18nConfig)
