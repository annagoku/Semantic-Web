<template>
  <div class="container">
    <DataTable stripedRows showGridlines :value="horses" tableStyle="min-width: 50rem" :loading="loadingTable">
      <Column field="razza" header="Cavallo in vendita"></Column>
      <Column  header="Immagine">
        <template #body="slotProps">
            <img v-if="slotProps.data.immagine" :src="`${slotProps.data.immagine}`" :alt="slotProps.data.immagine" class="w-6rem border-round" />
        </template>
      </Column>
      
      <Column field="descrizione" header="Dettagli">
        <template #body="slotProps">
            <p>{{ slotProps.data.descrizione }}</p>
            <p><b>Regione:</b> {{ slotProps.data.regione }}</p>
            <p><b>Età:</b> {{ slotProps.data.anni }}</p>
          </template>
      </Column>
           
        <Column field="prezzo" header="Prezzo [Euro]">
        <template #body="slotProps">
            <p>{{ slotProps.data.prezzo }}</p>
            
             
              
        </template>
      </Column>
      <Column  >
        <template #body="slotProps">
          <Button icon="pi pi-info" size="small" raised rounded aria-label="Info" @click="showHorseDetail(slotProps.index, slotProps.data)" ></Button>
        </template>
      </Column>



    </DataTable>
  </div>


<!-- DIALOG DETTAGLIO RAZZA-->
<Dialog v-model:visible="showDetail" modal header="Dettaglio" :style="{ width: '75vw' }" :breakpoints="{ '960px': '75vw', '641px': '100vw' }">
  <template #header>
    <div class="row">
      <div class="col-xs-12 ">
        <span class="font-bold text-2xl mr-4">{{ selectedHorse.razza}}</span>
      </div>
    </div>
    
  </template>

  <div class="container">
  <div class="row">
    <div class="col">
      <img v-if="selectedHorse.detail.immagine" :src="`${selectedHorse.detail.immagine}`" :alt="selectedHorse.detail.immagine" class="border-round" /> 
    
    </div>
    <div class="col">
      <p>{{ selectedHorse.descrizione}}</p>
      <p><b>Nazione:</b> {{ selectedHorse.nazione }}</p>
      <p><b>Regione di origine:</b> {{ selectedHorse.detail.regioneOrigine }}</p>
      <p><b>Morfologia:</b> <span style="text-transform: capitalize;">{{ selectedHorse.morfologia }}</span></p>
      <p><b>Indole:</b> {{ selectedHorse.indole }}</p>
      <p><b>Peso medio:</b> {{ selectedHorse.detail.pesoMedio }} kg</p>
      <p><b>Altezza media al garrese:</b> {{ selectedHorse.detail.altezzaMediaGarrese }} cm</p>
      <p><b>Mantelli:</b> 
        <template v-for="(mantello, index) in selectedHorse.detail.mantelli">&nbsp;<span style="text-transform: capitalize;">{{ mantello }}</span><span v-if="index  < selectedHorse.detail.mantelli.length-1">,</span> </template> </p>
      <p><b>Impieghi:</b> 
        <template v-for="(impiego, index) in selectedHorse.detail.impieghi">&nbsp;{{ impiego }}<span v-if="index  < selectedHorse.detail.impieghi.length-1">,</span> </template> </p>
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
import { horsesalesService } from '@/stores/horsesalesService'
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Row from 'primevue/row';     
import Dialog from 'primevue/dialog';
import Card from 'primevue/card';

export default {
  name: "HorseInSaleView",
  data() {
    return {
      layout: "grid",
      horses: null,
      filters: null,
      loadingTable: false,
      selectedHorse: null,
      showDetail: false
    };
  },
  setup () {
    const store = useStore();
    return {store};
  },
  mounted : function () {
      this.getAllHorses();
  },
  components: {
      Button, DataTable,  Column, Row, Card, Dialog
  },
  props: {
     
  },
  methods: {
      //richiamo tutte le razze di cavalli
      getAllHorses : function () {
        this.loadingTable = true;
      
        horsesalesService().getAllHorses().then((data)=>{
              this.loadingTable = false;
              this.horses = [...data];
              console.log("COPIO IL VETTORE SU Horses");
              console.log(this.horses);


            }).catch(e => {
              this.loadingTable = false;
              
            });
      },

      showHorseDetail: function(index, sub){
        console.log("show horse detail "+index);
        var horse = this.horses[index];
        this.selectedHorse = horse;
        
        
      },

      hideDetail: function() {
        this.showDetail = false;
        this.selectedHorse = null;
      }
        
    }

};
</script>

