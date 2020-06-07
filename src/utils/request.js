import axios from 'axios'
import { Message, Loading } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import merge from "lodash/merge";
import qs from "qs";
// import store from '@/store'
import router from '@/router/index.js'

NProgress.configure({ easing: 'ease', trickleRate: 0.1, trickleSpeed: 100, showSpinner: false })

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  // headers: {
  //   "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
  // },
  timeout: 20000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    showFullScreenLoading(config.method)
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    tryHideFullScreenLoading()
    const res = response.data
    if (res.code === 200) {
      // 成功
      return res
    } else if (res.code === 401) {
      // 未授权
      router.replace({ path: '/401' })
      return Promise.reject()
    } else {
      Message({
        message: res.message || '抱歉！服务异常，请联系管理员',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject()
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

/**
 * 请求地址处理
 * @param {*} actionName action方法名称
 */
service.apiUrl = actionName => {
  // console.log(process.env.VUE_APP_RAP);
  // 非生产环境 / 开启代理, 接口前缀统一前缀做代理拦截!
  // return process.env.VUE_APP_BASE_API == 'true' ? '/rap_api' + actionName : process.env.VUE_APP_BASE_API + actionName;
  return process.env.VUE_APP_BASE_API + actionName;
}

/**
 * post请求数据处理
 * @param {*} data 数据对象
 * @param {*} openDefultdata 是否开启默认数据?
 * @param {*} contentType 数据格式
 *  json: 'application/json; charset=utf-8'
 *  form: 'application/x-www-form-urlencoded; charset=utf-8'
 */
service.adornData = (data = {}, openDefultdata = true, contentType = "form") => {
  var defaults = {
    t: new Date().getTime()
  };
  data = openDefultdata ? merge(defaults, data) : data;
  return contentType === "json" ? JSON.stringify(data) : qs.stringify(data);
}

let loading

function startLoading() { //使用Element loading-start 方法
  loading = Loading.service({
    // target: document.querySelector('.app-container el-loading-parent--relative') || document.querySelector('.app-container'),
    lock: true,
    text: '加载中……',
    background: 'rgba(0, 0, 0, 0.05)'
  })
}

function endLoading() { //使用Element loading-close 方法
  loading.close()
}
//那么 showFullScreenLoading() tryHideFullScreenLoading() 要干的事儿就是将同一时刻的请求合并。
//声明一个变量 needLoadingRequestCount，每次调用showFullScreenLoading方法 needLoadingRequestCount + 1。
//调用tryHideFullScreenLoading()方法，needLoadingRequestCount - 1。needLoadingRequestCount为 0 时，结束 loading。
let needLoadingRequestCount = 0
export function showFullScreenLoading(methodType) {
  if (needLoadingRequestCount === 0) {
    NProgress.start()
    if (methodType === 'post' || methodType === 'put' || methodType === 'delete') {
      startLoading()
    }
  }
  NProgress.set(0.2)
  needLoadingRequestCount++
}

export function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) {
    return
  }
  NProgress.set(0.2)
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    NProgress.done()
    endLoading()
  }
}

export default service
