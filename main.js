// #ifndef VUE3
import Vue from 'vue'
import App from './App'

// 按需导入 $http 对象
import {
  $http
} from '@escook/request-miniprogram'

// 在 uni-app 项目中，可以把 $http 挂载到 uni 顶级对象之上，方便全局调用
uni.$http = $http

// 请求根路径
$http.baseUrl = 'https://api-hmugo-web.itheima.net'

// 请求拦截器：请求开始之前做一些事情
$http.beforeRequest = function(option) {
  // 展示 loading 效果
  uni.showLoading({
    title: '数据加载中...'
  })
}
// 响应拦截器：请求完成之后做一些事情
$http.afterRequest = function(option) {
  // 隐藏 loading 效果
  uni.hideLoading()
}

// 封装的展示消息提示的方法
uni.$showMsg = function(title = '数据请求失败！', duration = 1500) {
  uni.showToast({
    title: title,
    duration: duration,
    icon: 'none'
  })
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
  createSSRApp
} from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif
