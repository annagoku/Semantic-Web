<template>
<div id="sezioni" class="cointainer mx-auto text-center">
      <div class="row">
        <div class="p-2"></div>
      </div>
      <div class="row" >
          <div class="card col-xs-12 col-md-3  mx-auto" @click="goToHorseBreeds()">
            <div class="card-title"><h3 class="text-primary">Dizionario delle Razze</h3></div>
            
            <div class="card-body"><img :src="razzaCavalli" style="zoom: 50%"></div>
          </div>
          <div class="card col-xs-12 col-md-3  mx-auto" @click="goToHorseInSale()">
            <div class="card-title"><h3 class="text-primary">Cavalli in vendita</h3></div>
            <div class="card-body"><img :src="horseInSale" style="zoom: 50%"></div>
          </div>
          <div class="card col-xs-12 col-md-3  mx-auto" @click="goToDownload()">
            <div class="card-title"><h3 class="text-primary">Download</h3></div>
            <div class="card-body"><img :src="download" style="zoom: 100%"></div>
          </div>
      </div>
</div>
</template>
<script>
import { useStore } from '@/stores/store'
import razzaCavalli from '@/assets/img/razzaCavalli.jpg' 
import horseInSale from '@/assets/img/HorsesForSale.jpg'
import download from '@/assets/img/download.jpg'



export default {
  name: "Sezioni",
  data() {
    return {
     
    };
  },
  setup () {
    const store = useStore();
    return {store, razzaCavalli, horseInSale, download};
  },
  props: {
    
  },
  mounted : function () {
     
  },
  methods: {
    goToHorseBreeds() {
      this.store.pageTitle = 'Dizionario Razze';
      this.$router.push({name: "horsebreeds"});
    },
    goToHorseInSale() {
      this.store.pageTitle = 'Cavalli in Vendita';
      this.$router.push({name: "horseinsale"});
    },
    goToDownload() {
      this.store.pageTitle = 'Download documentazione di progetto';
      this.$router.push({name: "download"});
    },
  },
};
</script>