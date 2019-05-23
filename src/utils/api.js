import axios from 'axios'
// 只显示一个错误提示
let networkError = false;
const warn = (message) => {
  if (!networkError) {
    networkError = true;
  }
};

export const baseURL = process.env.BACKEND_SERVER;

const api = axios.create({
  baseURL,
  // timeout: 2000,
  withCredentials: false,
});
// 添加请求拦截器
api.interceptors.request.use((config) => {
  // 清除不需要的参数
  for (const i in config.params) {
    if (config.params[i] === undefined ||
      config.params[i] === null) {
      delete config.params[i]
    }
  }
  return config
});

// 添加响应拦截器
api.interceptors.response.use(response =>  response, (err) => {
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        err.message = '请求错误';
        break;
      // case 401:
      //   err.message = '未授权，请登录';
      //   router.push({ path: '/login' });
      //   break;
      case 403:
        err.message = '拒绝访问';
        break;
      case 404:
        err.message = `请求地址出错: ${err.response.config.url}`;
        break;
      case 408:
        err.message = '请求超时';
        break;
      case 500:
        err.message = '服务器内部错误';
        break;
      case 501:
        err.message = '服务未实现';
        break;
      case 502:
        err.message = '网关错误';
        break;
      case 503:
        err.message = '服务不可用';
        break;
      case 504:
        err.message = '网关超时';
        break;
      case 505:
        err.message = 'HTTP版本不受支持';
        break;
      default:
    }
  } else {
    err.message = '网络错误，请稍后再试！'
  }
  if (err && err.response && err.response.data && err.response.data.message) {
    warn(err.response.data.message)
  } else {
    warn(err.message)
  }
  return Promise.reject(err)
});

// export default api
export default {
  install: function (Vue, option = {}) {
    // 1.通过 Vue.httpClient 调用
    Vue.httpClient = api;
    // 2.通过 this.$httpClient 调用
    Vue.prototype.$httpClient = api
  }
}
