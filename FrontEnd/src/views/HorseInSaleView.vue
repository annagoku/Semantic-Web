<!--Pagina che contiene le informazioni sui cavalli in vendita in formato tabellare-->
<template>
<!-- Sezione per la creazione di filtri con pulsanti per la loro attivazione e disattivazione -->
  <div class="container">
    <div class="row pt-5">
      <span class="p-float-label col-xs-3 col-md-3">
          <Dropdown id="Regione" :disabled="selectedDiscipline" v-model="selectedRegion" :options="regions" optionLabel="label" optionValue="label" placeholder="Filtra per Regione" class="w-full md:w-14rem" />
          <label for="Regione">Regione</label> 
      </span>
      <span class="p-float-label col-xs-3 col-md-3">
          <Dropdown id="Disciplina" :disabled="selectedRegion" v-model="selectedDiscipline" :options="disciplines" optionLabel="label" optionValue="label" placeholder="Filtra per disciplina o impiego" class="w-full md:w-14rem" />
          <label for="Disciplina">Disciplina o impiego</label> 
      </span>
      <span class="text-right col-xs-6 col-md-6">
        <span class="ml-5">
          <Button type="button" :disabled="!selectedRegion && !selectedDiscipline" icon="pi pi-filter-slash"  style="background-color:grey;border-radius: 50%;box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);" @click="initFilters()"></Button>
        </span>
        <span class="ml-5">
        <Button type="button"  icon="pi pi-filter"  style="border-radius: 50%;box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);" @click="filterHorseInSale()"></Button>
      </span>
        
         </span>
      
  </div>
  <div v-if="filter.enabled" class="row pt-5">
    <span class="p-float-label col-xs-12 col-md-12">
<!--A filtro attivo viene restituito anche il nome del filtro attivato e il numero di risultati ottenuti-->
      <p>Elenco filtrato per {{ filter.type }} {{ filter.value }} - <b>Risutati: {{ horses.length }}</b></p>
    </span>
  </div>
  <br/>
<!--questa pagina è costituita dal componente di Vue "DataTable" le cui righe sono popolate da dati
ottenuti tramite richiesta http verso Graph DB -->   
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
            <p><b>Razza:</b> <b><span class="link-secondary link-offset-2" style="cursor: pointer;"  href="#" @click="showHorseBreed(slotProps.data.razzaUri)"> {{ slotProps.data.razza }} </span></b></p>
            <p><b>Regione di scuderizzazione:</b> {{ slotProps.data.regione }}</p>
            <p><b>Età:</b> {{ slotProps.data.anni }}</p>
            <p><b>Disciplina:</b> 
              <template v-for="(disciplina, index) in slotProps.data.disciplina">&nbsp;{{ disciplina }}<span v-if="index  < slotProps.data.disciplina.length-1">,</span> </template> </p>
            <p><b>Numero Discipline:</b>{{ slotProps.data.numberOfDiscipline }} </p>
          </template>
      </Column>
           
        <Column field="prezzo" header="Prezzo [Euro]">
        <template #body="slotProps">
            <p>{{ slotProps.data.prezzo }}</p>
            
             
              
        </template>
      </Column>
      <Column  >
        <template #body="slotProps">
          <Button icon="pi pi-info" size="small" style="border-radius: 50%;box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);" aria-label="Info" @click="showHorseDetail(slotProps.index, slotProps.data)" ></Button>
        </template>
      </Column>



    </DataTable>
    

  </div>


<!-- Dialog che contiene le informazioni di dettaglio di un annuncio di vendita-Si attiva al click dell'utente su relativo pulsante-->
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


<!-- Dialog che contiene le informazioni di dettaglio di una razza-Si attiva al click dell'utente su relativo pulsante-->
<Dialog v-model:visible="showDetailBreed" modal header="Dettaglio Razza" :style="{ width: '75vw' }" :breakpoints="{ '960px': '75vw', '641px': '100vw' }">
  <template #header>
    <div class="row">
      <div class="col-xs-12 ">
        <span class="font-bold text-2xl mr-4">{{ selectedBreed.detail.razza}}</span>
      </div>
    </div>
    
  </template>

  <div class="container">
  <div class="row">
    <div class="col">
      <img v-if="selectedBreed.detail.immagine" :src="`${selectedBreed.detail.immagine}`" :alt="selectedBreed.detail.immagine" class="border-round" /> 
    
    </div>
    <div class="col">
      <p>{{ selectedBreed.detail.descrizione}}</p>
      <p><b>Nazione:</b> {{ selectedBreed.detail.nazione }}</p>
      <p><b>Regione di origine:</b> {{ selectedBreed.detail.regioneOrigine }}</p>
      <p><b>Morfologia:</b> <span style="text-transform: capitalize;">{{ selectedBreed.detail.morfologia }}</span></p>
      <p><b>Indole:</b> {{ selectedBreed.detail.indole }}</p>
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
        <Button label="Chiudi"  @click="hideDetailBreed"   />
    </template>
</Dialog>

</template>

<script>
import { useStore } from '@/stores/store'
import { horsesalesService } from '@/stores/horsesalesService'
import { horsebreedsService } from '@/stores/horsebreedsService'
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
      allHorses:[],
      allHorsesNumberOfDiscipline:[],
      filter: {
        enabled: false,
        value: null,
        type: null // per segnare la scelta di quale filtro è abilitato (Disciplina o Regione)
      },
      
      loadingTable: false,
      selectedHorse: null,
      selectedBreed: null,
      showDetail: false,
      showDetailBreed: false,
      selectedDiscipline: null,
      disciplines:[],
      selectedRegion:null,
      regions:[]
      
    };
  },
  setup () {
    const store = useStore();
    return {store};
  },
  mounted : function () {
      this.getAllHorsesNumberOfDiscipline();
      this.getAllHorses();
      this.getRegions();
      this.getDisciplines();
      
  },
  components: {
      Button, DataTable,  Column, Row, Card, Dialog, Dropdown
  },
  props: {
     
  },
  methods: {
/**Funzione che gestisce l'output di una richiesta http per ottenere l'elenco di tutte le Regioni  */
      getRegions : function () {
        horsesalesService().getAllHorsesInSaleRegions().then((data)=>{
                
                this.regions = data;
                
              }).catch(e => {
                this.loadingTable = false;
                
              });
        },

/**Funzione che gestisce l'output di una richiesta http per ottenere l'elenco di tutte le discipline  */
        getDisciplines : function () {
        horsesalesService().getAllHorsesInSaleDisciplines().then((data)=>{
                
                this.disciplines = data;
                
              }).catch(e => {
                this.loadingTable = false;
                
              });
        },
     
/**Funzione che gestisce l'output di una richiesta http per ottenere l'elenco di tutti gli annunci di vendita  */
      getAllHorses : function () {
        this.loadingTable = true;
      
        horsesalesService().getAllHorses().then((data)=>{
              this.loadingTable = false;
              this.allHorses = [...data];
              this.horses=[...this.allHorses];
              console.log("COPIO IL VETTORE SU horses");
              console.log(this.horses);
/**Aggiunta dell'informazione sul conteggio delle discipline di ogni cavallo in vendita */
              for(var i=0; i<this.horses.length;i++){
                console.log("Uri da horses");
                console.log(this.horses[i].uri);
                console.log("Uri da allHorsesNumber of discipline");
                console.log(this.allHorsesNumberOfDiscipline[i].uri);

                for(var j=0;j<this.allHorsesNumberOfDiscipline.length; j++){
                  console.log(this.horses[i].uri==this.allHorsesNumberOfDiscipline[j].uri);
                  if(this.horses[i].uri==this.allHorsesNumberOfDiscipline[j].uri){
                    
                    this.horses[i].numberOfDiscipline=this.allHorsesNumberOfDiscipline[j].NumeroDiscipline;
                  }
                }
                
              }
              console.log("Vettore horses modificato con il numero di discipline");
              console.log(this.horses);


            }).catch(e => {
              this.loadingTable = false;
              
            });
      },
/**Funzione che gestisce l'output di una richiesta http per ottenere l'elenco di tutti gli annunci di vendita con il numero di discipline */
      getAllHorsesNumberOfDiscipline : function () {
       // this.loadingTable = true;
      
        horsesalesService().getAllHorsesInSaleNumberOfDisciplines().then((data)=>{
              //this.loadingTable = false;
              this.allHorsesNumberOfDiscipline = data;
              console.log("View numero di discipline")
              console.log(this.allHorsesNumberOfDiscipline);


            }).catch(e => {
              this.loadingTable = false;
              
            });
      },



/** Funzione che consente l'apertura della finestra di dialogo con le informazioni di dettaglio relative ad un annuncio di vendita
 attivata al click dell'utente */
      showHorseDetail: function(index, sub){
        console.log("show horse detail "+index);
        var horse = this.horses[index];
        this.selectedHorse = horse;

        //chiamo il servizio per reperire i dettagli del cavallo selezionato
        horsesalesService().getHorseDetail(horse.uri).then((data)=>{
              this.selectedHorse.detail = data;
              this.showDetail = true;
      
            }).catch(e => {
              
            });
        
        
      },
/** Funzione che consente l'apertura della finestra di dialogo con le informazioni di dettaglio relative ad una razza e ad un annuncio di vendita
 attivata al click dell'utente */
      showHorseBreed: function(horseBreedUri){
        console.log("show horse breed "+horseBreedUri);
        
        //chiamo il servizio per reperire i dettagli della razza selezionata
        horsebreedsService().getBreedDetail(horseBreedUri).then((data)=>{
          this.selectedBreed = {};  
          this.selectedBreed.detail = data;
          this.showDetailBreed = true;
      
        }).catch(e => {
          
        });
    
        
      },
/**Funzione che chiude la finestra di dialogo con le informazioni di dettaglio di un annuncio di vendita */      
      hideDetail: function() {
        this.showDetail = false;
        this.selectedHorse = null;
      },
/**Funzione che chiude la finestra di dialogo con le informazioni di dettaglio di una razza */
      hideDetailBreed: function() {
        this.showDetailBreed = false;
        this.selectedBreed = null;
      },
      
/**Funzione di inizializzazione e/o pulizia dei filtri */
      initFilters: function () {
        this.selectedRegion=null;
        this.selectedDiscipline=null;
        this.filter.enabled=false;
        this.filter.type=null;
        this.filter.value=null;
        this.horses = [...this.allHorses];
      },
/**Funzione di gestione dei filtri. Solo un filtro per volta può essere attivo */       
      filterHorseInSale: function () {
        console.log("Filtro gli annunci di cavalli in vendita");
        this.filter.enabled = true;
        this.loadingTable = true;
          
        
        if(this.selectedRegion) {
          this.filter.type="Regione";
          this.filter.value=this.selectedRegion;
          console.log("Filtro per "+this.filter.type+" "+this.selectedRegion);
// Informazioni filtrate direttamente a frontend
          this.horses = [];
          this.allHorses.forEach(horse => {
            if(horse.regione.toUpperCase() == this.selectedRegion.toUpperCase()) {
              this.horses.push(horse);
            }

          });  
        }
        else if(this.selectedDiscipline) {
          this.filter.type="Disciplina o Impiego";
          this.filter.value=this.selectedDiscipline;
          console.log("Filtro per "+this.filter.type+" "+this.selectedDiscipline);
// Informazioni filtrate direttamente a frontend
          this.horses = [];
          
          this.allHorses.forEach(horse => {
            console.log("faccio for each su ");
            console.log(horse.disciplina);
            var found=false;
            for(var i=0;  horse.disciplina!= null && i< horse.disciplina.length && !found; i++){
                console.log(horse.disciplina[i]);
                if(horse.disciplina[i].toUpperCase() == this.selectedDiscipline.toUpperCase()) {
                  found=true;
                  this.horses.push(horse);
                }
            }
          });  
        }
        
        this.loadingTable = false;
        
      },
    }

};
</script>

