<script setup>
import { useStore } from '@/stores/store'
import {RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'
import Dialog from 'primevue/dialog';
import InlineMessage from 'primevue/inlinemessage';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
const store = useStore()
</script>

<template>
  <div v-if="store.loading" class="overlay">
    <ProgressSpinner/>
  </div>
  <NavBar :title="title" />
  <Dialog id="messageDialog" v-model:visible="store.showDialog" modal closable="false" header="Attenzione" :style="{ width: '50vw' }" :breakpoints="{ '960px': '75vw', '641px': '100vw' }">
    <InlineMessage severity="info" v-for="message in store.messages">
        {{ message }}
    </InlineMessage>
    <InlineMessage severity="error" v-for="alert in store.alerts">
        {{ alert }}
    </InlineMessage>
    <template #footer>
        <Button label="OK" icon="pi pi-check" @click="store.dismissMessages()" />
    </template>
  </Dialog>
  <main>
      <RouterView />
  </main>
  <Footer />
</template>

<script>

export default {
  name: "App",
  data() {
    return {
      title: "OntoHorses"
    };
  },
  mounted : function () {
    console.log("APP mounted");
    this.calculateViewPort(); 
    this.handleResize();

  },
  methods: {
      handleResize: function() {
        
        window.addEventListener("resize", 
          this.calculateViewPort
        );
      },
      calculateViewPort: function() {
        var viewport_w = window.innerWidth || document.documentElement.clientWidth;
        console.log("viewport -> "+viewport_w);
        if(viewport_w < 601) {
          useStore().setSmartPhone(true);
        }
      }
  },
};
</script>

