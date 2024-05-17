import type { validateFunction } from '@/components/ValidateInput.vue'

export const validateTwoDimIntArray: validateFunction = (str) => {
  try {
    const array = JSON.parse(str)
    if (!(array instanceof Array)) return false
    for (const a of array) {
      if (!(a instanceof Array)) return false
      for (const i of a) {
        if (!Number.isInteger(i)) return false
      }
    }

    return true
  } catch (error) {
    return false
  }
}

export const validateDoubleArray: validateFunction = (str) => {
  try {
    // eslint-disable-next-line no-debugger
    debugger
    const array = JSON.parse(str)
    if (!(array instanceof Array)) return false
    for (const i of array) {
      if (!Number.isFinite(i)) return false
    }

    return true
  } catch (error) {
    return false
  }
}

export const validateTwoDimDoubleArray: validateFunction = (str) => {
  try {
    const array = JSON.parse(str)
    if (!(array instanceof Array)) return false
    for (const a of array) {
      if (!(a instanceof Array)) return false
      for (const i of a) {
        if (!Number.isFinite(i)) return false
      }
    }

    return true
  } catch (error) {
    return false
  }
}

export const validateString: validateFunction = (str) => {
  try {
    const s = JSON.parse(str)
    if (typeof s != 'string') return false

    return true
  } catch (e) {
    return false
  }
}

export const validateStringArray: validateFunction = (str) => {
  try {
    const array = JSON.parse(str)
    if (!(array instanceof Array)) return false
    for (const s of array) {
      if (typeof s != 'string') return false
    }

    return true
  } catch (error) {
    return false
  }
}

export const validateBool: validateFunction = (str) => {
  try {
    const b = JSON.parse(str)
    if (typeof b != 'boolean') return false

    return true
  } catch (error) {
    return false
  }
}
