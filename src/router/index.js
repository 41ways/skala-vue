import { createRouter, createWebHistory } from 'vue-router'
import MinhwaHomeView from '../views/MinhwaHomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MinhwaHomeView,
    },
    {
      path: '/world',
      name: 'world',
      component: () => import('../views/WorldWeatherView.vue'),
    },
    {
      path: '/classic',
      name: 'classic-home',
      component: () => import('../views/WeatherHomeView.vue'),
    },
    {
      path: '/weather/:cityId',
      name: 'weather-detail',
      component: () => import('../views/WeatherDetailView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/WeatherAboutView.vue'),
    },
    {
      path: '/sky',
      name: 'sky-drive',
      component: () => import('../views/SkyDriveView.vue'),
    },
    {
      path: '/guide',
      name: 'guide',
      component: () => import('../views/LaundryGuideView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

export default router
