<template>
<footer class="footer mt-auto py-3  w-100">
  <div class="row container-fluid ">
    <div class="col text-center">
      <p>&copy; 2024 - Annalisa Sabatelli</p>
      <nav>
        <p>Contatti:  <a href="mailto:annalisa.sabatelli@unito.it">Annalisa.sabatelli@edu.unito.it</a></p>
      </nav>
    </div>
      </div>
</footer>
</template>

<script>
import { useStore } from '@/stores/store'


export default {
  name: 'Footer',
  data() {
    return {
    };
  },
  setup () {
    const store = useStore();
    return {store};
  },

  components: {
    
  },
  props: {
    
  },
  methods: {
    
  },
  computed: {

  }
}
</script>

