import { createI18n } from 'vue-i18n'
import type {
  NumberFormatOptions,
  DateTimeFormatOptions
} from '@intlify/core-base/dist/core-base.js'
import { Icon } from '@iconify/vue'

import viVNLocale from '@locales/vi-VN.json'
import enUSLocale from '@locales/en-US.json'
import type { VNodeChild } from 'vue'

const localesConfigs = {
  'vi-VN': {
    ...viVNLocale
  },
  'en-US': {
    ...enUSLocale
  }
}
type NumberConfigs = {
  [K in keyof typeof localesConfigs]: {
    currency: NumberFormatOptions
    number: NumberFormatOptions
  }
}
const numberConfigs: NumberConfigs = {
  'vi-VN': {
    currency: {
      style: 'currency',
      currency: 'VND'
    },
    number: {
      style: 'decimal'
    }
  },
  'en-US': {
    currency: {
      style: 'currency',
      currency: 'USD'
    },
    number: {
      style: 'decimal'
    }
  }
}

type DateTimeConfigs = {
  [K in keyof typeof localesConfigs]: {
    date: DateTimeFormatOptions
    dateTime: DateTimeFormatOptions
    fullDate: DateTimeFormatOptions
  }
}
const datetimeConfigs: DateTimeConfigs = {
  'vi-VN': {
    date: {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    },
    dateTime: {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    },
    fullDate: {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }
  },
  'en-US': {
    date: {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    },
    dateTime: {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    },
    fullDate: {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }
  }
}

export type I18nMessageSchema = Omit<typeof viVNLocale, '$schema'>
export type I18nNumberFormatsSchema = (typeof numberConfigs)['vi-VN']
export type I18nDateTimeFormatsSchema = (typeof datetimeConfigs)['vi-VN']
export type I18nLocalesKey = keyof typeof localesConfigs

function renderIcon(icon: string) {
  return () => h(Icon, { icon })
}

export const localeOptions: { label: string; key: I18nLocalesKey; icon: () => VNodeChild }[] = [
  {
    label: 'Tiếng Việt',
    key: 'vi-VN',
    icon: renderIcon('twemoji:flag-vietnam')
  },
  {
    label: 'English',
    key: 'en-US',
    icon: renderIcon('twemoji:flag-united-states')
  }
]

// export const i18n = createI18n<[I18nMessageSchema], I18nLocalesKey>({
export const i18n = createI18n<[object], I18nLocalesKey>({
  legacy: false,
  globalInjection: false,
  allowComposition: false,
  locale: 'vi-VN',
  fallbackLocale: 'en-US',
  messages: localesConfigs,
  numberFormats: numberConfigs,
  datetimeFormats: datetimeConfigs
})

export const { t, d, n } = i18n.global
