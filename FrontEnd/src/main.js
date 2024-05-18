/******* Main.js - punto di ingresso dell'applicazione - Creazione applicazione con Vue+PrimeVue */
import { createApp } from 'vue'
import { createPinia } from 'pinia' // libreria per store/servizi
import PrimeVue from 'primevue/config';


import App from './App.vue'
import router from './router'

// librerie per bootstrap
import 'bootstrap'
import '@popperjs/core'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.js'

// import per PrimeVue
import "primevue/resources/themes/md-light-indigo/theme.css";     
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import 'primeflex/primeflex.css';

// import di CSS dell'applicazione - deve essere sempre l'ultimo CSS importato
import './assets/main.css'


const app = createApp(App)
app.use(PrimeVue); // libreria con componenti UX
app.use(createPinia()); // libreria per store/servizi
app.use(router); //aggancio libreria router


app.mount('#app') // aggancio al div dell'HTML
