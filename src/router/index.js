import { createRouter, createWebHistory } from 'vue-router'
import MinhwaHomeView from '../views/MinhwaHomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // 화폭을 옮기면 새 화폭의 맨 위에서 시작한다 (뒤로가기는 있던 자리로)
  scrollBehavior(to, from, savedPosition) {
    return savedPosition ?? { top: 0 }
  },
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
      path: '/edition',
      name: 'edition',
      component: () => import('../views/EditionView.vue'),
    },
    {
      path: '/classic',
      name: 'classic-home',
      component: () => import('../views/WeatherHomeView.vue'),
      meta: { showsTemp: true }, // 기온이 보이는 화면 = 내비에 단위 토글
    },
    {
      path: '/weather/:cityId',
      name: 'weather-detail',
      component: () => import('../views/WeatherDetailView.vue'),
      meta: { showsTemp: true },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/WeatherAboutView.vue'),
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
