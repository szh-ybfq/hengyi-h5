import axios from 'axios'
// 引入vant的Toast用来弹窗提示
import { showToast } from 'vant'
import router from '@/router'
import { useUserStore } from '@/stores/user'

const service = axios.create({
  baseURL: '/user/api/v1', 
  timeout: 15000
})

// 请求拦截器（到达后端前）
service.interceptors.request.use(config => {
  const whiteList = [
    "/login",
    "/register"
  ];
  const isWhite = whiteList.some(item => config.url.includes(item));
  if (isWhite) {
    return config;
  }
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

//  响应拦截器 （到达前端前）
service.interceptors.response.use(
  response => {
    // 正常返回，直接丢给业务
    return response
  },
  error => {
    // 捕获接口异常
    if (error.response && error.response.status === 401) {
      const userStore = useUserStore()
      // 清空pinia里面token + localStorage
      userStore.token = ''
      localStorage.removeItem('token')
      // 提示
      showToast('登录已过期，请重新登录')
      // 跳转到登录页
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default service
