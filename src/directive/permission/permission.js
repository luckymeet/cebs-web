import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const buttonPerm = store.getters && store.getters.buttonPerm

    if (value && value instanceof Array && value.length > 0) {
      const permissions = value
      const hasPermission = buttonPerm.some(perm => {
        return permissions.includes(perm)
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`v-permission 指令未设置权限"`)
    }
  }
}
