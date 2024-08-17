import { isReactive, isRef } from 'vue'
import _ from 'lodash'

export const useToggleState = (
  process: () => Promise<void>,
  target: any = null,
  path: string | null = null
) => {
  const setState = (state: boolean) => {
    if (_.isNull(target)) {
      return state
    }
    if (isRef(target)) {
      return (target.value = state)
    }
    if (isReactive(target)) {
      return _.set(target, path ?? 'value', state)
    }
    return (target = state)
  }

  return Promise.resolve()
    .then(() => setState(true))
    .then(process)
    .finally(() => setState(false))
}
