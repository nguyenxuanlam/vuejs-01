import { useClipboard } from '@vueuse/core'
import axios from 'axios'

export const useHelper = () => {
  function getCatchMsg(error: any, defaultMsg?: string) {
    if (error.response?.data?.message) {
      if (error.response.data.errors) {
        let msg = ''
        for (const key in error.response.data.errors) {
          if (Object.prototype.hasOwnProperty.call(error.response.data.errors, key)) {
            const value: string[] | string = error.response.data.errors[key]
            if (Array.isArray(value)) {
              msg += value.join(' ') + '\n'
            } else {
              msg += value + '\n'
            }
          }
        }
        return msg
      } else if (typeof error.response.data.message === 'string') {
        return error.response.data.message
      }
    }
    return error.message || defaultMsg || $t('errors.error')
  }

  function showMessageError(error: any, defaultMsg?: string) {
    window.$message.error(() =>
      h('div', { class: 'whitespace-pre' }, { default: () => getCatchMsg(error, defaultMsg) })
    )
  }

  return {
    getCatchMsg,
    showMessageError
  }
}

export function useEnv<T = any>(key: string): T | undefined {
  return window.configs[key] ?? import.meta.env[key] ?? undefined
}

export const useDownload = (blob: BlobPart, fileName?: string) => {
  const _url = window.URL.createObjectURL(new Blob([blob]))
  const link = document.createElement('a')
  link.href = _url
  link.setAttribute('download', fileName ?? '')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const useDownloadUrl = async (url: string, fileName?: string) => {
  try {
    const res = await axios.get(url, {
      responseType: 'blob'
    })
    useDownload(res.data, fileName)
  } catch (error) {
    console.log(error)
  }
}

export const useCopyToClipboard = () => {
  const { text, copy, copied, isSupported } = useClipboard({
    legacy: true
  })

  async function copyToClipboard(value: string) {
    if (!isSupported.value) {
      window.$message.error($t('messages.copy_not_supported'))
      return
    }
    await copy(value)
    if (copied.value) {
      window.$message.success($t('messages.copied'))
    } else {
      window.$message.error($t('messages.copy_failed'))
    }
  }

  return {
    text,
    copy,
    copyToClipboard,
    copied,
    isSupported
  }
}

export function useEnsureHttp() {
  const ensureHttp = (url: string) => {
    url = url.trim().replace(/\s/g, '')
    const re = new RegExp('^(http|https)://', 'i')
    return re.test(url) ? url : `http://${url}`
  }

  return { ensureHttp }
}
