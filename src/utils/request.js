import axios from 'axios'
import { Message } from 'element-ui'
import merge from "lodash/merge";
import qs from "qs";
// import store from '@/store'
import router from '@/router/index.js'

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

export default service
