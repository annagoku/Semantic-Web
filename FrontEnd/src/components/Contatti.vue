<template>
<div id="contacts" class="cointainer row mx-auto bg-red text-light p-3">
  <div class="col-xs-12 col-md-4 px-2">
    <img :src="mappa" style="zoom: 50%">    
  </div>    
  <div class="col-xs-12 col-md-4 px-2">
    <h3>Contatti</h3>
    <p><a style="color: white" :href="'mailto:'+contacts.email">{{ contacts.email }}</a></p>    
    <p>{{ contacts.address}}</p>    
    <p>{{ contacts.phone }}</p>    
  </div>    
  <div class="col-xs-12 col-md-4 px-2">
    <h3>Orari</h3>
    <p>Lun-Dom: 14:00 - 20:00</p>    
  </div>    
      <!--GMapMap
      :center="contacts.coordinates"
      :zoom="7"
      map-type-id="terrain"
      style="width: 100vw; height: 900px"
      >
      </GMapMap-->
      
</div>
</template>
<script>
import mappa from '@/assets/img/mappa.png' 

export default {
  name: "Contatti",
  data() {
    return {
        contacts: {
          email: "scuderiaonline@gmail.com",
          phone: "+39 340 2345393",
          address: "via Donatori di Sangue, 2, Airasca (TO)",
          coordinates: {lat: 44.918603, lng: 7.479040}
        }
    };
  },
  setup () {
    return {mappa};
  },
  props: {
     
  },
  mounted : function () {
     

  },
  methods: {
      
  },
};
</script>