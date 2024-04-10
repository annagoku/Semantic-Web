<script setup>
import TheWelcome from '../components/TheWelcome.vue'
import Sezioni from '../components/Sezioni.vue'
import fascia from '@/assets/img/fascia-federazioni.png' // => or relative path
import { useStore } from '@/stores/store'
</script>

<template>
    <TheWelcome />
    <!--div class="w-100 py-7"></div-->
    <Sezioni />
    <div class="container w-100 mx-auto py-4 text-center">
      <img :src="fascia" style="width: 70vw">
    </div>
    <div class="w-100 py-4"></div>
    
  
</template>
<script>
export default {
  name: "HomeView",
  data() {
    return {
      scroll_start: 0
    };
  },

  setup () {
    const store = useStore();
    return store;
  },

  mounted : function () {
    window.scrollTo(0,0);  
      
  },
  methods: {
      
    },
};
</script>

