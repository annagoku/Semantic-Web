import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HorseBreedsView from '../views/HorseBreedsView.vue'
import HorseInSaleView from '../views/HorseInSaleView.vue'
import DownloadView from '../views/DownloadView.vue'

/* Componente di navigazione */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/', // path per pagina principale (Home)
      name: 'home',
      component: HomeView // Componente View per Home
    },
    {
      path: '/horsebreeds', // path per dizionario Razze
      name: 'horsebreeds',
      component: HorseBreedsView, // Componente View per dizionario Razze

    },
    {
      path: '/horseinsale', // path per cavalli in vendita
      name: 'horseinsale',
      component: HorseInSaleView, // Componente View per cavalli in vendita

    },
    {
      path: '/download',// path per il download dei documenti di progetto
      name: 'download',
      component: DownloadView, // Componente View per il download

    }
  ]
})

export default router
