import { i18n, localeOptions } from '@/plugins/i18n'
import type { I18nLocalesKey } from '@/plugins/i18n'

export const useAppStore = defineStore('appStore', {
  state: () => ({
    isLoadingWebsite: false,
    sideBarCollapsed: false,
    i18nLocale: 'vi-VN' as I18nLocalesKey,
    localeOptions: localeOptions,
    breadcrumbs: [] as Breadcrumb[]
  }),
  getters: {
    localeCurrent: (state) => state.localeOptions.find((locale) => locale.key === state.i18nLocale),
    getBreadcrumbRoot: (state) => state.breadcrumbs.find((breadcrumb) => breadcrumb.routeName)
  },
  actions: {
    setLocale(locale: I18nLocalesKey) {
      this.i18nLocale = locale
      // @ts-ignore
      i18n.global.locale.value = locale
    }
  },
  persist: {
    paths: ['sideBarCollapsed', 'i18nLocale']
  }
})
