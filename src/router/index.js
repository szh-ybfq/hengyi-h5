import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import Home from '@/views/home/Home.vue'
import Live from '@/views/live/Live.vue'
import Cart from '@/views/cart/Cart.vue'
import Message from '@/views/message/Message.vue'
import Mine from '@/views/mine/Mine.vue'
import CategoryGoods from '@/views/goods/CategoryGoods.vue'
import GoodsDetail from '@/views/goods/GoodsDetail.vue'
export const constantRoutes= [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/login/Register.vue')
  },
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { showTab: true }
  },
  {
    path: '/live',
    name: 'Live',
    component: Live,
    meta: { showTab: true }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
    meta: { showTab: true }
  },
  {
    path: '/message',
    name: 'Message',
    component: Message,
    meta: { showTab: true }
  },
  {
    path: '/mine',
    name: 'Mine',
    component: Mine,
    meta: { showTab: true }
  },
  {
    path: '/category-goods/:categoryId',
    name: 'CategoryGoods',
    component: CategoryGoods,
    meta: { showTab: true }
  },
  {
    path: '/goods-detail/:spuId',
    name: 'GoodsDetail',
    component: GoodsDetail,
    meta: { showTab: false }
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/home/Search.vue'),
    meta: { showTab: false } // 不展示底部tab栏
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes
})

router.beforeEach(async (to, from, next) => {
  if (to.path === '/login' || to.path === '/register') {
    next()
    return
  }
  const userStore = useUserStore()
  // 本地完全没有token，直接去登录
  if (!userStore.token) {
    next('/login')
    return
  }
  next()
})

export default router
