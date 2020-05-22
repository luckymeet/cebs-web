import { asyncRoutes, constantRoutes } from '@/router'
import { getMenuPerms, getButtonPerms } from '@/api/home'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(menuPerms, route) {
  if (route.meta && route.meta.perms) {
    if (!menuPerms || menuPerms.length <= 0) {
      return false
    }
    return menuPerms.some(perm => route.meta.perms.includes(perm))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, menuPerms) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(menuPerms, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, menuPerms)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: [],
  menuPerm: [],
  buttonPerm: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  RESET_ROUTES: (state, routes) => {
    state.routes = []
  },
  SET_MENU_PERM: (state, perms) => {
    state.menuPerm = perms
  },
  SET_BUTTON_PERM: (state, perms) => {
    state.buttonPerm = perms
  }
}

const actions = {
  getMenuPerms({ commit }) {
    return new Promise((resolve, reject) => {
      getMenuPerms().then(response => {
        const { data } = response
        commit('SET_MENU_PERM', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getButtonPerms({ commit }) {
    return new Promise((resolve, reject) => {
      getButtonPerms().then(response => {
        const { data } = response
        commit('SET_BUTTON_PERM', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  generateRoutes({ commit }, menuPerms) {
    return new Promise(resolve => {
      const accessedRoutes = filterAsyncRoutes(asyncRoutes || [], menuPerms)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
  resetRoutes({ commit }) {
    return new Promise(resolve => {
      commit('RESET_ROUTES')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
