<template>
  <div class="container">
    <DataTable stripedRows showGridlines :value="breeds" tableStyle="min-width: 50rem" :loading="loadingTable">
      <Column field="razza" header="Razza"></Column>
      <Column  header="Immagine">
        <template #body="slotProps">
            <img v-if="slotProps.data.immagine" :src="`${slotProps.data.immagine}`" :alt="slotProps.data.immagine" class="w-6rem border-round" />
        </template>
      </Column>
      
      <Column field="descrizione" header="Dettagli">
        <template #body="slotProps">
            <p>{{ slotProps.data.descrizione }}</p>
            <p><b>Nazione:</b> {{ slotProps.data.nazione }}</p>
            <p style="text-transform: capitalize;"><b>Morfologia:</b> {{ slotProps.data.morfologia }}</p>
            <p><b>Indole: </b> {{ slotProps.data.indole }}</p>
        </template>
      </Column>
      <Column  >
        <template #body="slotProps">
          <Button icon="pi pi-info" size="small" raised rounded aria-label="Info" @click="showBreedDetail(slotProps.index, slotProps.data)" ></Button>
        </template>
      </Column>



    </DataTable>
  </div>


<!-- DIALOG DETTAGLIO RAZZA-->
<Dialog v-model:visible="showDetail" modal header="Dettaglio" :style="{ width: '75vw' }" :breakpoints="{ '960px': '75vw', '641px': '100vw' }">
  <template #header>
    <div class="row">
      <div class="col-xs-12 ">
        <span class="font-bold text-2xl mr-4">{{ selectedBreed.razza}}</span>
      </div>
    </div>
    
  </template>

  <div class="container">
  <div class="row">
    <div class="col">
      <img v-if="selectedBreed.detail.immagine" :src="`${selectedBreed.detail.immagine}`" :alt="selectedBreed.detail.immagine" class="border-round" /> 
    
    </div>
    <div class="col">
      <p>{{ selectedBreed.descrizione}}</p>
      <p><b>Nazione:</b> {{ selectedBreed.nazione }}</p>
      <p><b>Regione di origine:</b> {{ selectedBreed.detail.regioneOrigine }}</p>
      <p><b>Morfologia:</b> <span style="text-transform: capitalize;">{{ selectedBreed.morfologia }}</span></p>
      <p><b>Indole:</b> {{ selectedBreed.indole }}</p>
      <p><b>Peso medio:</b> {{ selectedBreed.detail.pesoMedio }} kg</p>
      <p><b>Altezza media al garrese:</b> {{ selectedBreed.detail.altezzaMediaGarrese }} cm</p>
      <p><b>Mantelli:</b> 
        <template v-for="(mantello, index) in selectedBreed.detail.mantelli">&nbsp;<span style="text-transform: capitalize;">{{ mantello }}</span><span v-if="index  < selectedBreed.detail.mantelli.length-1">,</span> </template> </p>
      <p><b>Impieghi:</b> 
        <template v-for="(impiego, index) in selectedBreed.detail.impieghi">&nbsp;{{ impiego }}<span v-if="index  < selectedBreed.detail.impieghi.length-1">,</span> </template> </p>
      </div>
    
  </div>
</div>
  
  <p>
     <br/>
    
  </p>
         
    

    <template #footer>
        <Button label="Chiudi"  @click="hideDetail"   />
    </template>
</Dialog>


</template>
<script>
import { useStore } from '@/stores/store'
import { horsebreedsService } from '@/stores/horsebreedsService'
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Row from 'primevue/row';     
import Dialog from 'primevue/dialog';
import Card from 'primevue/card';

export default {
  name: "HorseBreedsView",
  data() {
    return {
      layout: "grid",
      breeds: null,
      filters: null,
      loadingTable: false,
      selectedBreed: null,
      showDetail: false
    };
  },
  setup () {
    const store = useStore();
    return {store};
  },
  mounted : function () {
      this.getAllBreeds();
  },
  components: {
      Button, DataTable,  Column, Row, Card, Dialog
  },
  props: {
     
  },
  methods: {
      //richiamo tutte le razze di cavalli
      getAllBreeds : function () {
        this.loadingTable = true;
      
        horsebreedsService().getAllBreeds().then((data)=>{
              this.loadingTable = false;
              this.breeds = [...data];
              console.log("COPIO IL VETTORE SU breeds");
              console.log(this.breeds);

              this.breeds.forEach(element => {
                console.log("RAZZA -> "+element.Razza.value)
              });

            }).catch(e => {
              this.loadingTable = false;
              
            });
      },

      showBreedDetail: function(index, sub){
        console.log("show breed detail "+index);
        var breed = this.breeds[index];
        this.selectedBreed = breed;
        
        //chiamo il servizio per reperire i dettagli della razza selezionata
        horsebreedsService().getBreedDetail(breed.uri).then((data)=>{
              this.selectedBreed.detail = data;
              this.showDetail = true;
      
            }).catch(e => {
              
            });
      },

      hideDetail: function() {
        this.showDetail = false;
        this.selectedBreed = null;
      }
        
    }

};
</script>

