import store from '@/store'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const buttonPerm = store.getters && store.getters.buttonPerm
    const permissions = value

    const hasPermission = buttonPerm.some(perm => {
      return permissions.includes(perm)
    })

    if (!hasPermission) {
      return false
    }
    return true
  } else {
    console.error(`hasPermission 方法未设置权限"`)
    return false
  }
}
