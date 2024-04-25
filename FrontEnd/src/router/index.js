import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HorseBreedsView from '../views/HorseBreedsView.vue'
import HorseInSaleView from '../views/HorseInSaleView.vue'
import DownloadView from '../views/DownloadView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/horsebreeds',
      name: 'horsebreeds',
      component: HorseBreedsView,

    },
    {
      path: '/horseinsale',
      name: 'horseinsale',
      component: HorseInSaleView,

    },
    {
      path: '/download',
      name: 'download',
      component: DownloadView,

    }
  ]
})

export default router
