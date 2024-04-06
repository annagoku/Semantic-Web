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
    
    <!--DataView :layout="layout" :value="breeds" >
              <template #grid="slotProps">
                
                <div class="col-12 sm:col-6 lg:col-12 xl:col-4 p-2">
                        <div class="p-4 border-1 surface-border surface-card border-round">
                          <div class="flex flex-column align-items-center gap-3 py-5">
                                <div class="text-2xl font-bold"><img class="w-10rem shadow-2 border-round" :src="slotProps.Immagine.value"/></div>
                            </div>
                            <div class="flex flex-column align-items-center gap-3 py-5">
                                <div class="text-2xl font-bold">{{ slotProps.razza }}</div>
                            </div>
                            <div class="flex align-items-center justify-content-between">
                                <span class="text-2xl font-semibold">€ {{ slotProps.Nazionalità.label }}</span>
                               
                                <Button icon="pi pi-shopping-cart" rounded></Button>
                            </div>
                        </div>
                  </div>
              </template>
          </DataView-->

  </div>

</template>
<script>
import { useStore } from '@/stores/store'
import { horsebreedsService } from '@/stores/horsebreedsService'
import DataView from 'primevue/dataview';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions';

import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';     

export default {
  name: "HorseBreedsView",
  data() {
    return {
      layout: "grid",
      breeds: null,
      filters: null,
      loadingTable: false,
        
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
    DataView,  Button, DataTable, DataViewLayoutOptions, Column, Row
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
                console.log("RAZZA -> "+element.Razza.label)
              });

            }).catch(e => {
              this.loadingTable = false;
              
            });
      },

      showBreedDetail: function(index, sub){
        console.log("show breed detail "+index);
        var breed = this.breeds[index];
        alert("ho cliccato "+breed.razza)

      },
        
    }

};
</script>

