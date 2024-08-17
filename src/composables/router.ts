import { ROUTE_NAME } from '@/data/constants/router'

export const RouteName = ROUTE_NAME

export const useRouteUtils = () => {
  function replaceParamsInPath(
    path: string,
    params?: Record<string, string | number>,
    query?: Record<string, string | number | boolean | null>
  ): string {
    let result = path
    for (const key in params) {
      result = result.replace(`:${key}`, params[key].toString())
    }

    if (query) result = addQueryToPath(result, query)

    return result
  }

  function addQueryToPath(
    path: string,
    query: Record<string, string | number | boolean | null>
  ): string {
    const queryString = Object.entries(query)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value ?? '')}`)
      .join('&')
    return `${path}?${queryString}`
  }

  return {
    replaceParamsInPath,
    addQueryToPath
  }
}
