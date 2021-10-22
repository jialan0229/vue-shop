import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '@/views/Login/Login.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/Home/Home.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从那个路径跳转而来
  // next 是一个函数, 表示放行
  //  next() 放行  next('./login) 强制跳转
  if(to.path == '/login'){
    return next()
  }
  //获取token
  const tokenStr = window.sessionStorage.getItem("token");
  if(!tokenStr){
    next('/login')
  }else{
    next()
  }
})

export default router
