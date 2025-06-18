import type { supportedLangs } from '@/i18n/config'

type Exclude<T, U> = T extends U ? never : T

export interface ThemeConfig {

  site: {
    title: string
    subtitle: string
    description: string
    i18nTitle: boolean
    author: string
    url: string
    favicon: string
  }

  color: {
    mode: 'light' | 'dark' | 'auto'
    light: {
      primary: string
      secondary: string
      background: string
      highlight: string
    }
    dark: {
      primary: string
      secondary: string
      background: string
      highlight: string
    }
  }

  global: {
    locale: typeof supportedLangs[number]
    moreLocales: typeof supportedLangs[number][]
    fontStyle: 'sans' | 'serif'
    dateFormat: 'YYYY-MM-DD' | 'MM-DD-YYYY' | 'DD-MM-YYYY' | 'MONTH DAY YYYY' | 'DAY MONTH YYYY'
    toc: boolean
    katex: boolean
    reduceMotion: boolean
  }

  comment: {
    enabled: boolean
    waline?: {
      serverURL?: string
      emoji?: string[]
      search?: boolean
      imageUploader?: boolean
    }
    giscus?: {
      repo?: string
      repoID?: string
      category?: string
      categoryID?: string
      mapping?: 'pathname' | 'url' | 'title' | 'og:title'
      strict?: '0' | '1'
      reactionsEnabled?: '0' | '1'
      emitMetadata?: '0' | '1'
      inputPosition?: 'top' | 'bottom'
    }
  }

  seo?: {
    twitterID?: string
    verification?: {
      google?: string
      bing?: string
      yandex?: string
      baidu?: string
    }
    googleAnalyticsID?: string
    umamiAnalyticsID?: string
    follow?: {
      feedID?: string
      userID?: string
    }
    apiflashKey?: string
  }

  footer: {
    links: {
      name: string
      url: string
    }[]
    startYear: number
  }

  preload?: {
    imageHostURL?: string
    customGoogleAnalyticsJS?: string
    customUmamiAnalyticsJS?: string
  }
}

export default ThemeConfig
