import { login, logout } from '@/api/user'
import { getUser, setUser, removeUser } from '@/utils/auth'
import { resetRouter } from '@/router'
import store from '@/store'

const state = {
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  user: getUser()
}

const mutations = {
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_USER: (state, user) => {
	state.setUser = user
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_USER', data)
        setUser(data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  /*getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { roles, name, avatar, introduction } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },*/

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
    	store.dispatch('permission/resetRoutes')
    	// reset visited views and cached views
    	dispatch('tagsView/delAllViews', null, { root: true })
        removeUser()
        resetRouter()

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetUser({ commit }) {
    return new Promise(resolve => {
      commit('SET_USER', {})
      removeUser()
      resolve()
    })
  }

  // dynamically modify permissions
  /*changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }*/
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
