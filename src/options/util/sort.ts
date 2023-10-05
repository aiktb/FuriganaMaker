import { Rule } from '~contents/core'

export enum State {
  DEFAULT = 0,
  ASCEND = 1,
  DESCEND = 2
}

export enum Field {
  DOMAIN = 'domain',
  SELECTOR = 'selector',
  DYNAMIC = 'dynamic',
  ENABLED = 'enabled'
}

type CompareFn = (a: Rule, b: Rule) => number
export const makeCompareFn = (
  field: Field,
  order: State.ASCEND | State.DESCEND
): CompareFn => {
  const sign = order === State.ASCEND ? 1 : -1
  let compareFn: CompareFn
  switch (field) {
    case Field.DOMAIN:
      compareFn = (a, b) => a.domain.localeCompare(b.domain) * sign
      break
    case Field.SELECTOR:
      compareFn = (a, b) => a.selector.localeCompare(b.selector) * sign
      break
    case Field.DYNAMIC:
      compareFn = (a, b) =>
        (a.dynamic === b.dynamic ? 0 : a.dynamic ? 1 : -1) * sign
      break
    case Field.ENABLED:
      compareFn = (a, b) =>
        (a.enabled === b.enabled ? 0 : a.enabled ? 1 : -1) * sign
      break
  }
  return compareFn
}
