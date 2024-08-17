import type { MessageApi, DialogApi, NotificationApi, LoadingBarApi } from 'naive-ui'

declare global {
  interface Window {
    configs: any
    // Naive-ui
    $message: MessageApi
    $dialog: DialogApi
    $notification: NotificationApi
    $loadingBar: LoadingBarApi
  }
}
