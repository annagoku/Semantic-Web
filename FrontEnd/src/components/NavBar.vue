<template>
  <header>
  <nav id="navbar" class="navbar navbar-expand-md navbar-light fixed-top bg-light py-0">
    <div class="container-fluid">
      <a class="navbar-brand mx-2" href="/#" @click="goToHomePublic()"><img :src="logoInverted" style="zoom: 20%">  {{title}}</a>
      <div v-if="store.pageTitle" class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto mx-2" >
          <li  class="nav-item mx-2"><a  id="navlink-home"  class="nav-link active" href="#"  >{{store.pageTitle}}</a></li>
        </ul>
      </div>
    </div>
      </nav>
    </header>
</template>

<script>
import logoInverted from '@/assets/img/logo.svg' // => or relative path
import { useStore } from '@/stores/store'

export default {
  name: 'NavBar',
  data() {
    return {
        showNavbar: false,
    };
  },
  setup () {
    const store = useStore();
    return {store, logoInverted};
  },

  components: {
    
  },
  props: {
    title: String
  },
  methods: {
    
    goToHomePublic() {
      this.store.pageTitle = null;
      this.$router.push({name: "home"});
    },    
    /*scrollTo(idElem) {
      var elem = document.getElementById(idElem);
      var y = elem.getBoundingClientRect().top-50+window.scrollY;
      console.log("scroll to y = "+y)
      window.scroll(0, y);
    }*/
  },
  computed: {
    
  }
}
</script>

