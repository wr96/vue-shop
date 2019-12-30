import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/Home', component: Home }]

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
