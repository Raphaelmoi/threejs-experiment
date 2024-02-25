import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/page2',
      name: 'page2',
      component: () => import('../views/page2.vue')
    },
    {
      path: '/page3',
      name: 'page3',
      component: () => import('../views/page3.vue')
    }
    ,
    {
      path: '/page4',
      name: 'page4',
      component: () => import('../views/page4.vue')
    }  ,
    {
      path: '/page5',
      name: 'page5',
      component: () => import('../views/page5.vue')
    }  ,
    {
      path: '/page6',
      name: 'page6',
      component: () => import('../views/page5.vue')
    }  ,
    {
      path: '/globe',
      name: 'globe',
      component: () => import('../views/globe.vue')
    },
    ,
    {
      path: '/globeOpenGPt',
      name: 'globeOpenGPt',
      component: () => import('../views/globeOpenGPt.vue')
    }
  ]
})

export default router
