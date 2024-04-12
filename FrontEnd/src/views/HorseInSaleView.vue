<template>
  <div class="container">
    
    <DataTable stripedRows showGridlines :value="horses" tableStyle="min-width: 50rem" :loading="loadingTable">
      <Column field="nomeAnnuncio" header="Cavallo in vendita"></Column>
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
            <p><b>Disciplina:</b> 
              <template v-for="(disciplina, index) in slotProps.data.disciplina">&nbsp;{{ disciplina }}<span v-if="index  < slotProps.data.disciplina.length-1">,</span> </template> </p>
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
    
          <div class="row w-100">
            <span class="relative col ">  <Button type="button" icon="pi pi-plus" severity="success"  @click=showDialogToUpdate(newHorse)   size="large" style="border-radius: 50%;box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);margin-left: 77.5em;"> </Button></span>
          </div>
    
  </div>


<!-- DIALOG DETTAGLIO RAZZA-->
<Dialog v-model:visible="showDetail" modal header="Dettaglio" :style="{ width: '75vw' }" :breakpoints="{ '960px': '75vw', '641px': '100vw' }">
  <template #header>
    <div class="row">
      <div class="col-xs-12 ">
        <span class="font-bold text-2xl mr-4">{{ selectedHorse.detail.nome}}</span>
      </div>
    </div>
    
  </template>

  <div class="container">
  <div class="row">
    <div class="col">
      <img v-if="selectedHorse.immagine" :src="`${selectedHorse.immagine}`" :alt="selectedHorse.immagine" class="border-round" /> 
    
    </div>
    <div class="col">
      <p>{{ selectedHorse.descrizione}}</p>
      <p><b>Razza:</b> {{ selectedHorse.detail.razza}}</p>
      <p><b>Anni:</b> {{ selectedHorse.anni}}</p>
      <p><b>Sesso:</b> {{ selectedHorse.detail.sesso}}</p>
      <p><b>Altezza al garrese:</b> {{ selectedHorse.detail.altezzaGarrese }} cm</p>
      <p><b>Regione:</b> {{ selectedHorse.regione}}</p>
      <p><b>Città:</b> {{ selectedHorse.detail.city }}</p>
      
      <p><b>Disciplina:</b> 
        <template v-for="(disciplina, index) in selectedHorse.detail.disciplina">&nbsp;<span style="text-transform: capitalize;">{{ disciplina }}</span><span v-if="index  < selectedHorse.detail.disciplina.length-1">,</span> </template> </p>
      <p><b>Categorie di salto:</b> 
        <template v-for="(categorieSalto, index) in selectedHorse.detail.categorieSalto">&nbsp;{{ categorieSalto }}<span v-if="index  < selectedHorse.detail.categorieSalto.length-1">,</span> </template> </p>

      <p><b>Categorie di Dressage:</b> {{ selectedHorse.detail.categoriaDressage }}</p>
      
      <p><b>Livello:</b> 
        <template v-for="(livello, index) in selectedHorse.detail.livello">&nbsp;{{ livello }}<span v-if="index  < selectedHorse.detail.livello.length-1">,</span> </template> </p>
      <br/>
      <p><b>Prezzo:</b> {{ selectedHorse.prezzo }} Euro</p>
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
import Dropdown from 'primevue/dropdown';

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
      Button, DataTable,  Column, Row, Card, Dialog, Dropdown
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

        //chiamo il servizio per reperire i dettagli della razza selezionata
        horsesalesService().getHorseDetail(horse.uri).then((data)=>{
              this.selectedHorse.detail = data;
              this.showDetail = true;
      
            }).catch(e => {
              
            });
        
        
      },

      hideDetail: function() {
        this.showDetail = false;
        this.selectedHorse = null;
      }
        
    }

};
</script>

