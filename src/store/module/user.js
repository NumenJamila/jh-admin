import {
  login,
  logout,
  loginByAccessToken
} from '@/api/user'
import { setToken, getToken } from '@/libs/util'

export default {
  state: {
    
  },
  mutations: {
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
  },
  getters: {
    
  },
  actions: {
    // 登录
    handleLogin ({ commit }, { name, password }) {
      name = name.trim()
      return new Promise((resolve, reject) => {
        login({
          name,
          password
        }).then(res => {
          // const data = res.data.data
          // commit('setToken', data)
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          // commit('setToken', '')
          // commit('setAccess', [])
          resolve()
        }).catch(err => {
          reject(err)
        })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        // commit('setToken', '')
        // commit('setAccess', [])
        // resolve()
      })
    },
    // 根据返回的token继续登录
    loginByAccessToken ({ commit }, token) {
      return new Promise((resolve, reject) => {
        try {
          loginByAccessToken(token).then(res => {
            // const data = res.data
            // commit('setAvatar', data.avatar)
            // commit('setUserName', data.name)
            // commit('setUserId', data.user_id)
            // commit('setAccess', data.access)
            // commit('setHasGetInfo', true)
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
  }
}
