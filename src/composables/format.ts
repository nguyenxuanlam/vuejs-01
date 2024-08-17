export const useFormatNumber = (
  value: string | number | null | undefined,
  options: {
    locales?: string | string[] | undefined
    valueDefault?: number
  } = {
    locales: 'vi-VN'
  }
) => {
  if (value === null || value === undefined) {
    if (options.valueDefault !== undefined) return options.valueDefault.toString()
    return ''
  }
  return new Intl.NumberFormat(options.locales).format(+value)
}

export const useParseNumber = (value: string | null) => {
  if (!value) return null
  const nums = value.replace(/\./g, '').trim()
  if (/^-?\d+(,(\d+)?)?$/.test(nums)) return Number(nums)
  return nums === '' ? null : Number.NaN
}
