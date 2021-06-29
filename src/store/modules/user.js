/*
 * @Author: fan
 * @Date: 2021-06-28 19:34:01
 * @LastEditors: fan
 * @LastEditTime: 2021-06-29 17:03:12
 * @Description: 用户的状态
 */

import { login, getUserInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
// 状态
const state = {
  token: getToken(),
  userInfo: {} // 初始化用户信息，不能为null，否则vuex中取用户信息的值会报错
}

// 修改状态
const mutations = {
  // 设置 token
  setToken(state, token) {
    state.token = token // 设置 token，只是修改 state 的数据
    setToken(token) // vuex 和缓存数据的同步
  },
  // 删除缓存
  removeToken(state) {
    state.token = null // 删除 vuex 的 token
    removeToken() // 先清除 vuex 再清除缓存
  },
  // 设置用户信息
  setUserInfo(state, userInfo) {
    state.userInfo = { ...userInfo }
  },
  // 移除用户信息
  removeUserInfo() {
    state.userInfo = {} // 用户信息置空
  }
}

// 执行异步
const actions = {
  // 定义 login action 也需要参数 调用action时 传递过来的参数
  async login(context, data) {
    const result = await login(data)
    context.commit('setToken', result)
  },
  // 也可以使用 promise 的方法
  // login(context, data) {
  //   return new Promise(function(resolve) {
  //     login(data).then(result => {
  //       if (result.data.success) {
  //         context.commit('setToken', result.data.data) // 提交mutations设置token
  //         resolve() // 执行成功
  //       }
  //     })
  //   })
  // }

  // 获取用户信息资料
  async getUserInfo(context) {
    const result = await getUserInfo()
    context.commit('setUserInfo', result)
    return result // 这里需要添加返回值，后面可以用到
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
