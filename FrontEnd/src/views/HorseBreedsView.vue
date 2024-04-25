<template>
  <div class="container">
    <div class="row pt-5">
      <span class="p-float-label col-xs-6 col-md-3">
          <Dropdown id="Indole" :disabled="selectedNation || selectedMorphology" v-model="selectedNature" :options="nature" optionLabel="name" optionValue="name" placeholder="Filtra per Indole" class="w-full md:w-14rem" />
          <label for="Indole">Indole</label> 
      </span>
      <span class="p-float-label col-xs-6 col-md-3">
          <Dropdown id="Nazione di origine" :disabled="selectedNature || selectedMorphology" v-model="selectedNation" :options="nations" optionValue="label" optionLabel="label" placeholder="Filtra per Nazione" class="w-full md:w-14rem" />
          <label for="Nazione di origine">Nazione di origine</label> 
      </span>
      <span class="p-float-label col-xs-6 col-md-4">
          <Dropdown id="Morfologia" :disabled="selectedNation || selectedNature" v-model="selectedMorphology" :options="morphology" optionLabel="name" optionValue="name" placeholder="Filtra per morfologia" class="w-full md:w-14rem" />
          <label for="Morfologia">Morfologia</label> 
      </span>
      <span class="text-right col-xs-6 col-md-2">
        <span class="ml-5">
          <Button type="button" :disabled="!selectedNation && !selectedNature && !selectedMorphology" icon="pi pi-filter-slash"  style="background-color:grey;border-radius: 50%;box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);" @click="initFilters()"></Button>
        </span>
        <span class="ml-5">
          <Button type="button"  icon="pi pi-filter"  style="border-radius: 50%;box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);" @click="filterBreeds()"></Button>
        </span>
      </span>
  </div>
  <div v-if="filter.enabled" class="row pt-5">
    <span class="p-float-label col-xs-12 col-md-12">
      <p>Elenco filtrato per {{ filter.type }} {{ filter.value }} - <b>Risutati: {{ breeds.length }}</b></p>
    </span>
  </div>
  <br/>
    <DataTable stripedRows showGridlines :value="breeds" tableStyle="min-width: 50rem" :loading="loadingTable">
      <Column field="razza" header="Razza"></Column>
      <Column  header="Immagine">
        <template #body="slotProps">
            <img v-if="slotProps.data.immagine" :src="`${slotProps.data.immagine}`"  class="w-6rem border-round" />
            <span v-if="!slotProps.data.immagine">N/A</span>
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
          <Button icon="pi pi-info" size="small" style="border-radius: 50%;box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);" aria-label="Info" @click="showBreedDetail(slotProps.index, slotProps.data)" ></Button>
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
import Dropdown from 'primevue/dropdown';

export default {
  name: "HorseBreedsView",
  data() {
    return {
      layout: "grid",
      breeds: null,
      allBreeds: [],
      filter: {
        enabled: false,
        value: null,
        type: null // per segnare la scelta di quale filtro è abilitato (Indole, Nazione o Morfologia)
      },
      loadingTable: false,
      selectedBreed: null,
      showDetail: false,
      selectedNature: null,
      nature: [
                { name: 'sangue caldo', uri:'oh:sangueCaldo' },
                { name: 'sangue freddo', uri:'oh:sangueFreddo'},
                { name: 'sangue misto', uri:'oh:sangueMisto' }
      ],
      selectedNation: null,
      nations: [],
      selectedMorphology: null,
      morphology: [
                { name: 'Mesomorfo', uri:'oh:mesomorfo' },
                { name: 'Brachimorfo', uri:'oh:brachimorfo'},
                { name: 'Dolicomorfo', uri:'oh:dolicomorfo' },
                { name: 'Meso-dolicomorfo', uri:'oh:mesoDolicomorfo' },
                { name: 'Meso-brachimorfo', uri:'oh:mesoBrachimorfo' }
      ]
    };
  },
  setup () {
    const store = useStore();
    return {store};
  },
  mounted : function () {
      this.getAllBreeds();
      this.getNations();
  },
  components: {
      Button, DataTable,  Column, Row, Card, Dialog, Dropdown
  },
  props: {
     
  },
  methods: {
      getNations : function () {
        horsebreedsService().getAllBreedsNations().then((data)=>{
              
              this.nations = data;
              
            }).catch(e => {
              this.loadingTable = false;
              
            });
      },
      //richiamo tutte le razze di cavalli
      getAllBreeds : function () {
        this.loadingTable = true;
      
        horsebreedsService().getAllBreeds().then((data)=>{
              this.loadingTable = false;
              this.allBreeds = [...data];
              this.breeds = [...this.allBreeds];
              console.log("COPIO IL VETTORE SU breeds");
              console.log(this.breeds);

              // solo per log si potrebbe togliere
              this.allBreeds.forEach(element => {
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
      },
      initFilters: function () {
        this.selectedMorphology=null;
        this.selectedNature=null;
        this.selectedNation=null;
        this.filter.enabled=false;
        this.filter.type=null;
        this.filter.value=null;
        this.breeds = [...this.allBreeds];
      },
      filterBreeds: function () {
        console.log("Filtro le razze");
        this.filter.enabled = true;
        this.loadingTable = true;
          
        
        if(this.selectedMorphology) {
          this.filter.type="Morfologia";
          this.filter.value=this.selectedMorphology;
          console.log("Filtro per "+this.filter.type+" "+this.selectedMorphology);
          // filtro direttamente a frontend
          this.breeds = [];
          this.allBreeds.forEach(breed => {
            if(breed.morfologia.toUpperCase() == this.selectedMorphology.toUpperCase()) {
              this.breeds.push(breed);
            }

          });  
        }
        else if(this.selectedNation) {
          this.filter.type="Nazione di origine";
          this.filter.value=this.selectedNation;
          console.log("Filtro per "+this.filter.type+" "+this.selectedNation);
          // filtro direttamente a frontend
          this.breeds = [];
          this.allBreeds.forEach(breed => {
            if(breed.nazione.toUpperCase() == this.selectedNation.toUpperCase()) {
              this.breeds.push(breed);
            }

          });  
        }
        else if(this.selectedNature) {
          this.filter.type="Indole";
          this.filter.value=this.selectedNature;
          console.log("Filtro per "+this.filter.type+" "+this.selectedNature);
          // filtro direttamente a frontend
          this.breeds = [];
          this.allBreeds.forEach(breed => {
            if(breed.indole.toUpperCase() == this.selectedNature.toUpperCase()) {
              this.breeds.push(breed);
            }

          });  
        }
        this.loadingTable = false;
        
      },
        
    }

};
</script>

