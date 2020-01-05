import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import User from '../components/user/users.vue'
import Rights from '../components/power/rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/Home', component: Home, redirect:'/Welcome', children:[
    {path: '/Welcome',component: Welcome},
    {path: '/users',component: User},
    { path: '/rights', component: Rights },
    { path: '/Roles', component: Roles },
    { path: '/categories', component: Cate }
  ]},
  
]

const router = new VueRouter({
  routes
})
// 挂在路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next()
  } else {
    const tokenStr = sessionStorage.getItem('token')
    if (!tokenStr) {
      return next('/login')
    } else {
      next()
    }
  }
})
export default router
