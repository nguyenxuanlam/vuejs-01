import 'vue-i18n'
import type {
  // I18nMessageSchema,
  I18nNumberFormatsSchema,
  I18nDateTimeFormatsSchema
} from '@/plugins/i18n'

declare module 'vue-i18n' {
  // define the locale messages schema
  // export interface DefineLocaleMessage extends I18nMessageSchema {}

  // define the datetime format schema
  export interface DefineDateTimeFormat extends I18nDateTimeFormatsSchema {}

  // define the number format schema
  export interface DefineNumberFormat extends I18nNumberFormatsSchema {}
}
