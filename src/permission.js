/*
 * @Author: fan
 * @Date: 2021-06-28 19:34:01
 * @LastEditors: fan
 * @LastEditTime: 2021-06-29 17:19:19
 * @Description: 权限拦截再进行路由跳转（路由守卫）
 */
// 权限拦截再路由跳转 路由守卫
import nProgress from 'nprogress'
import router from '@/router'
import store from '@/store'

// 定义白名单
const whiteList = ['/login', '404']
// 不需要导出 因为只需要让代码执行即可
// 前置守卫
// next() 放过
// next(false) 终止跳转
// next(地址) 跳转到某个地址
router.beforeEach(async(to, from, next) => {
  // 开启进度条
  nProgress.start()
  // 判断 vuex 中是否有 token
  if (store.getters.token) {
    // 有 token 且访问的路径是 login
    if (to.path === '/login') {
      // 跳转到首页
      next('/')
    } else {
      if (!store.getters.userId) {
        await store.dispatch('user/getUserInfo')
      }
      // 直接放行
      next()
    }
  } else {
    // 如果没有 token，判断是否在白名单中
    if (whiteList.indexOf(to.path) > -1) {
      // 在白名单中直接放行
      next()
    } else {
      // 跳到登录页
      next('/login')
    }
  }
  nProgress.done() // 手动强制关闭进度条，这是为了解决手动切换地址时，进度条不关闭的问题
})
// 后置守卫
router.afterEach((to, from, next) => {
  nProgress.done()
})
