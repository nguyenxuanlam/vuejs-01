import type { RendererNode } from 'vue'
import type { EllipsisProps } from 'naive-ui'
import type { IconifyIconProps } from '@iconify/vue'
import { NEllipsis, NImage, NTooltip } from 'naive-ui'
import { Icon } from '@iconify/vue'
import { HistoryDomain } from '@/types'
import CIcon from '@/components/icon/CIcon.vue'

export const useRender = () => {
  function renderIndex(currentPage: number, perPage: number, index: number) {
    const page = currentPage > 1 ? currentPage - 1 : 0
    return page * perPage + index + 1
  }

  function renderIcon(props: IconifyIconProps) {
    return () => h(Icon, props)
  }

  function renderEllipsis(label: string | RendererNode, props?: EllipsisProps) {
    return () =>
      h(NEllipsis, { tooltip: { keepAliveOnHover: false }, ...props }, { default: () => label })
  }

  function renderTooltip(text: string, node: VNode) {
    return h(
      NTooltip,
      { trigger: 'hover', keepAliveOnHover: false },
      { default: () => text, trigger: () => node }
    )
  }

  function renderTooltipThumbnail(
    imagePath: string | null | undefined,
    node: VNode,
    props: { width?: number } = { width: 300 }
  ) {
    return h(
      NTooltip,
      { trigger: 'hover', keepAliveOnHover: false, style: { padding: '6px' } },
      {
        default: () =>
          h(NImage, {
            src: imagePath || '/no-image.svg',
            fallbackSrc: '/no-image.svg',
            fit: 'cover',
            width: props.width,
            class: 'cursor-pointer',
            previewDisabled: true
          }),
        trigger: () => node
      }
    )
  }

  function renderCheckProxyIcon(status: HistoryDomain.StatusCode) {
    switch (status) {
      case HistoryDomain.StatusCode.Blocked:
        return h(CIcon, {
          icon: 'icon-close-circle',
          class: `text-2xl mx-auto outline-none text-danger`
        })
      case HistoryDomain.StatusCode.Ok:
        return h(CIcon, {
          icon: 'icon-check-circle',
          class: `text-2xl mx-auto outline-none text-success`
        })
      case HistoryDomain.StatusCode.Unknown:
        return h(Icon, {
          icon: 'carbon:help-filled',
          class: `text-2xl mx-auto outline-none text-warning`
        })
      case HistoryDomain.StatusCode.VerifyCaptcha:
        return h(Icon, {
          icon: 'logos:recaptcha',
          class: `text-2xl mx-auto outline-none`
        })
      case HistoryDomain.StatusCode.Timeout:
        return h(Icon, {
          icon: 'mdi:timer-minus-outline',
          class: `text-2xl mx-auto outline-none text-gray-500`
        })
      case HistoryDomain.StatusCode.ProxyError:
        return h(Icon, {
          icon: 'mdi:network-strength-2-alert',
          class: `text-2xl mx-auto outline-none text-[#e06cd9]`
        })
      case HistoryDomain.StatusCode.Error:
        return h(Icon, {
          icon: 'icon-park-outline:error-computer',
          class: `text-2xl text-red-800 mx-auto outline-none`
        })
      default:
        return h('span', {}, '-')
    }
  }

  return {
    renderIndex,
    renderIcon,
    renderEllipsis,
    renderTooltip,
    renderTooltipThumbnail,
    renderCheckProxyIcon
  }
}
