import Vue from 'vue'
import Router from 'vue-router'
import manager from '@/components/manager'
import manager_index from '@/components/manager_index'
import mission_follow from '@/components/mission_follow'
import mission_detail from '@/components/mission_detail'
import worker from '@/components/worker'
Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    redirect: '/manager'
  }, {
    path: '/manager',
    component: manager,
    children:[
      {path:'index',component:manager_index},
      {path:'follow',component:mission_follow},
      {path:'detail',component:mission_detail},
      {path:'worker',component:worker}
    ]
  }]
})
