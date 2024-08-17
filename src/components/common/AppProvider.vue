<script setup lang="ts">
import {
  NMessageProvider,
  NDialogProvider,
  NNotificationProvider,
  NLoadingBarProvider,
  useDialog,
  useLoadingBar,
  useMessage,
  useNotification
} from 'naive-ui'
import { createTextVNode } from 'vue'

defineOptions({
  name: 'AppProvider'
})

const ContextHolder = defineComponent({
  name: 'ContextHolder',
  setup() {
    function register() {
      window.$loadingBar = useLoadingBar()
      window.$dialog = useDialog()
      window.$message = useMessage()
      window.$notification = useNotification()
    }

    register()

    return () => createTextVNode()
  }
})
</script>

<template>
  <NLoadingBarProvider>
    <NDialogProvider>
      <NNotificationProvider :max="5">
        <NMessageProvider :max="5" :duration="5000" keep-alive-on-hover>
          <ContextHolder />
          <slot />
        </NMessageProvider>
      </NNotificationProvider>
    </NDialogProvider>
  </NLoadingBarProvider>
</template>
