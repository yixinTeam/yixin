import Vue from 'vue'
import Router from 'vue-router'
import manager from '@/components/manager'
import manager_index from '@/components/manager_index'
import mission_follow from '@/components/mission_follow'
import mission_detail from '@/components/mission_detail'
import worker from '@/components/worker'
import call_count from '@/components/call_count'
import call_detail from '@/components/call_detail'
import label from '@/components/label'
import Staff from '@/components/Staff'
import Staff_index from '@/components/Staff_index'
import Staff_stage from '@/components/Staff_stage'
import Staff_call_count from '@/components/Staff_call_count'
import test from '@/components/test'
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
      {path:'worker',component:worker},
      {path:'call_count',component:call_count},
      {path:'call_detail',component:call_detail},
      {path:'label',component:label},
    ]
  }, {
    path: '/Staff',
    component: Staff,
    children:[
      {path:'index',component:Staff_index},
      {path:'stage',component:Staff_stage},
      {path:'call_count',component:Staff_call_count}
    ]
  }, {
    path: '/test',
    component: test
  }]
})
