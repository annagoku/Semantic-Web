<template>
<div id="horse" class="cointainer">
 
<Card>
  <template #title>
    <div class="row w-100">
      <span class="col">Dati Cavalli</span>
      <span class="relative col "><Button class="absolute right-0" @click.stop.prevent="refresh()" icon="pi pi-refresh" aria-label="Refresh" /></span>
    </div>
  
  </template>
    <template #content>
      <DataTable :value="horses" :loading="loadingTable" v-model:filters="filters" filterLocale="it" 
                  resizableColumns columnResizeMode="fit"  tableStyle="min-width: 50rem">
            <template #header>
              
              <div class="flex justify-content-end">
                <Button type="button" class="mr-5" icon="pi pi-filter-slash" label="Annulla filtro" outlined @click="initFilters()" />
                <span class="p-input-icon-left">
                      <i class="pi pi-search" />
                      <InputText v-model="filters['global'].value" placeholder="Cerca..." />
                  </span>
              </div>
          </template>
          <template #empty> Nessun cavallo trovato </template>
          <Column field="horse.horseName" header="Nome" sortable ></Column>
          <Column v-if="store.user.isAdmin" field="user.nominativo" header="Proprietario" sortable > 

          </Column>
          <Column v-if="store.user.isAdmin" header="Info" >   
            <template #body="slotProps">
                    <Tag icon="pi pi-user" class="mt-1" v-if="slotProps.data.horse.privateHorse" value="privato" rounded></Tag>
                    <Tag icon="pi pi-home" class="mt-1" v-else value="maneggio" rounded></Tag>
                    <br/>
                    <Tag severity="success" class="mt-1" v-if="slotProps.data.horse.available" value="disponibile" rounded></Tag>
                    <Tag severity="warning" class="mt-1" v-else value="non disponibile" rounded></Tag>
                    <br/>
                    <Tag severity="success" class="mt-1" v-if="slotProps.data.horse.active" value="attivo" rounded></Tag>
                    <Tag severity="danger" class="mt-1" v-else value="non attivo" rounded></Tag>
                    
                </template>
          
          </Column>   
          <Column field="horse.height" header="Altezza [cm]" sortable ></Column>
          <Column field="horse.horseBirthdate" header="Data di nascita" sortable dateFormat="dd/mm/yy"></Column>
          <Column field="horse.breed" header="Razza" sortable></Column>
          <Column field="horse.coat" header="Colore Mantello" sortable ></Column>
          <Column field="horse.box.boxName" header="Box" sortable ></Column>
          <Column header="Azioni">
              <template #body="slotProps">
                  <Button type="button" icon="pi pi-pencil" rounded class="mr-2" @click.stop.prevent="showDialogToUpdate(slotProps.data)"></Button>
              </template>
          </Column>
      </DataTable>
    </template>
    <template v-if="store.user.isAdmin" #footer>
          <div class="row w-100">
            <span class="relative col ">  <Button type="button" icon="pi pi-plus" severity="info"  @click=showDialogToUpdate(newHorse) raised rounded  size="large" style="margin-left: 60em"> </Button></span>
          </div>
    </template>
</Card>

  <Dialog v-model:visible="visible"  modal :header="dialogHeader" :style="{ width: '50vw' }">
    
          <div class="row pt-3">
            <span class="p-float-label col-xs-6 col-md-4">
                <Dropdown id="owner" v-model="selectedOwner"  :options="users" optionLabel="nominativo" optionValue="email" 
                          placeholder="Seleziona il proprietario" class="w-full md:w-14rem" />
                 <label for="owner">Proprietario</label> 
              </span>
              <span class="p-float-label col-xs-6 col-md-4">
                  <InputText styleClass="w-full" id="horseName"  v-model="selectedHorse.horseName" />
                  <label for="horseName">Nome</label>
              </span>
           </div> 
           <div class="row py-5">
              <span class="p-float-label col-xs-6 col-md-4">
                  <InputText styleClass="w-full" id="height"  v-model="selectedHorse.height" />
                  <label for="height">Altezza [cm]</label>
              </span>
              <span class="p-float-label col-xs-6 col-md-4">
                <Calendar styleClass="w-full" id="horseBirthdate" v-model="horseBirthDate" showIcon dateFormat="dd/mm/yy" />
                  <label for="horseBirthdate">Data di nascita</label>
              </span>
            </div>

            <div class="row py-5">
              <span class="p-float-label col-xs-6 col-md-4">
                  <InputText styleClass="w-full" id="breed"  v-model="selectedHorse.breed" />
                  <label for="height">Razza</label>
              </span>
              <span class="p-float-label col-xs-6 col-md-4">
                 <Dropdown id="coat" v-model="selectedHorse.coat" :options="coat" placeholder="Seleziona un colore di mantello" class="w-full md:w-14rem" />
                 <label for="coat">Colore Mantello</label>   
                 
              </span>
            </div>
            <div class="row py-5">
              <span class="p-float-label col-xs-6 col-md-4">
                  <Dropdown id="boxName" styleClass="w-full" :options="boxes" optionValue="stableBoxId" optionLabel="boxName"  
                            placeholder="Seleziona un box" class="w-full md:w-14rem"   v-model="selectedHorse.box.stableBoxId" />
                  <label for="boxName">Box</label>
              </span>
              <div class="row py-5">
                <span class="p-float-label col-xs-6 col-md-4">
                      Maneggio <InputSwitch v-model="selectedHorse.privateHorse" class="ml-1 mr-1"></InputSwitch> Privato
                </span>
                <span class="p-float-label col-xs-6 col-md-4">
                      Non disponibile <InputSwitch v-model="selectedHorse.available" class="ml-1 mr-1"></InputSwitch> Disponibile
                </span>
                </div>
                <div class="row py-5"></div>
                <span class="p-float-label col-xs-6 col-md-4">
                     Non Attivo <InputSwitch v-model="selectedHorse.active" class="ml-1 mr-1"></InputSwitch> Attivo
                </span>     
                       
            </div>
            <template #footer>
              <Button class="btn-primary" icon="pi pi-check" label="Salva" @click.stop.prevent="save()"></Button>
              <Button class="btn-cancel" icon="pi pi-times" label="Annulla" @click="cancel()" style="margin-left: 0.5em"></Button>
            </template>
  </Dialog>

</div>
</template>


<script>
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import { useStore } from '@/stores/store';
import Calendar from 'primevue/calendar';
import { userService } from '@/stores/userService'
import { stableBoxService} from '@/stores/stableBoxService'
import { horseService } from '@/stores/horseService'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';  
import Dialog from 'primevue/dialog'; 
import Dropdown from 'primevue/dropdown';
import { ref } from "vue";
import {format} from 'date-fns';
import {parse} from 'date-fns';
import InputSwitch from 'primevue/inputswitch';
import { FilterMatchMode} from 'primevue/api';



export default {
  name: "horse",
  data() {
    return {
        horses: null,
        filters: null,
        boxes:null,
        selectedOwner: null,
        dialogHeader:null,
        newHorse:null,
        userFound:false,
        users:[],
        userValues:[],
        visible: false,
        loadingTable: false,
        selectedHorse: null,
        horseBirthDate: null,
        coat : ["Morello","Baio", "Sauro","Grigio","Sorcino", "Ubero", "Falbo o Lupino", "Roano", "Pezzato", "Mantello Coniugato", "Isabella", "Crema", "Palomino", "Apaloosa"]
                
    };
  },
  horseService: null,
  created() {
        this.initFilters();
  },
  setup() {
    const store = useStore();
    return {store};
  },
  components: {
    Card, InputText, Button, Textarea, Calendar, DataTable, Column, ColumnGroup, Row, Dialog, Dropdown,InputSwitch,FilterMatchMode, Tag
  },
  props: {
     
  },
  mounted : function () {
    this.refresh();
    this.getOwner();
    this.getBox();
  },

  methods: {
    showDialogToUpdate: function(horseItem) {
      
      if(horseItem!=null){
        this.selectedHorse={...horseItem.horse};
        console.log("Selected Horse: ");
        console.log(this.selectedHorse);
        this.selectedHorse["isNew"]=false;
        this.dialogHeader="Modifica dati cavallo";
        this.selectedOwner=horseItem.user.mail;
          if(this.selectedHorse.box == null) {
            this.selectedHorse.box = {stableBoxId: null};
          }
          else {
            this.selectedHorse.box = {... horseItem.horse.box};
          }
          if(this.selectedHorse.horseBirthdate) {
            this.horseBirthDate = parse(this.selectedHorse.horseBirthdate, 'dd/MM/yyyy', new Date());
          
          }
      }else{
        this.selectedOwner=null;
        this.selectedHorse = {
          isNew: true,
          box: {
            stableBoxId: null
          },
          privateHorse: false,
          active: false,
          available: false
        }

        this.dialogHeader="Inserisci un nuovo cavallo";
        this.horseBirthDate=""
      }
      this.visible=true;
      
    },
    initFilters: function () {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      };
    },

    save: function () {
     
      console.log("SAVE HORSE");
      if(this.horseBirthDate) {
        this.selectedHorse.horseBirthdate = format(this.horseBirthDate, 'dd/MM/yyyy');
      }
      if(this.selectedHorse.box != null && this.selectedHorse.box.stableBoxId == null) {
        this.selectedHorse.box = null;
      }
      console.log(this.selectedHorse);
      if(!this.selectedHorse.isNew){
          if(this.selectedOwner) {
            this.selectedHorse.user = {mail: this.selectedOwner};
          }
          horseService().updateHorse (this.selectedHorse).then(() => {
            this.visible=false;
            this.refresh();

          }).catch((err) => {

          })
      }else{
          horseService().createNewHorseAdmin(this.selectedHorse, this.selectedOwner).then(()=>{ 
          this.userFound=false;
          this.visible=false;
          this.refresh(); 
        }).catch((err)=>{

        })
        
        };   
    
    },
    cancel: function () {
      this.visible=false;
      this.horseBirthDate="";
    },


    getOwner: function () {
      userService().getAllUsers().then((data) =>{
        this.users=data;
        this.users.forEach((u) => {
        u["nominativo"]=u.name+" "+u.surname;
        this.userValues.push(u.nominativo);
        
      });
      console.log("Lista utenti");
      console.log(this.users);
      console.log("userValues");
       console.log(this.userValues);
      }).catch(e=> {

      }); 
      
    },
    
    getBox: function(){
      stableBoxService().getStableBox().then((data)=>{
        this.boxes=data;
      }).catch(e=>{

      });
    },

    refresh: function() {
      this.loadingTable = true;
      if(!this.store.user.isAdmin){
            horseService().getHorsesUser(this.store.user.email).then((data) => {
              this.loadingTable = false;
              this.horses = data;
            }).catch(e => {
              this.loadingTable = false;
              
            });
          }else {
            horseService().getAllHorses().then((data)=>{
              this.loadingTable = false;
              this.horses = data;
            }).catch(e => {
              this.loadingTable = false;
              
            });
          }
    }
  },
};
</script>