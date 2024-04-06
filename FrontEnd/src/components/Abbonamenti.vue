<template>
 
<Card>
  <template #title>Dati Abbonamenti</template>
    <template #content>
      <DataTable :value="subscriptions" :loading="loadingTable" v-model:filters="filters" filterLocale="it" 
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
          <template #empty> Nessun abbonamento trovato </template>
          <Column field="subscription.subscriptionType.subscriptionName" header="Tipo Abbonamento"></Column>
          <Column field="subscription.startDate" header="Inizio"  ></Column>
          <Column field="subscription.endDate" header="Fine" sortable dateFormat="dd/mm/yy"></Column>
          <Column field="subscription.subscriptionType.duration" header="Durata" sortable></Column>
          <Column field="subscription.subscriptionType.weekFrequency" header="Frequenza"  ></Column>
          <Column field="subscription.subscriptionType.price" header="Prezzo"  ></Column>
          <Column field="subscriptionState" header="Stato"  ></Column>
          <Column v-if="store.user.isAdmin" field="user.nominativo" header="Utente"></Column>
          <Column v-if="store.user.isAdmin" header="Azioni">
              <template  #body="slotProps">
                  <Button v-if="slotProps.data.subscriptionState=='Scaduto'"  type="button" icon="pi pi-envelope" rounded class="mr-2" @click.stop.prevent="showDialogToUpdate(slotProps.data)"></Button>
              </template>
          </Column>
      </DataTable>
    </template>
</Card>


</template>


<script>
import Card from 'primevue/card';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import { useStore } from '@/stores/store';
import Calendar from 'primevue/calendar';
import { userService } from '@/stores/userService'
import { subscriptionService } from '@/stores/subscriptionService'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';  
import Dialog from 'primevue/dialog'; 
import Dropdown from 'primevue/dropdown';
import { ref } from "vue";
import {format, parse} from 'date-fns';
import { FilterMatchMode} from 'primevue/api';




export default {
  name: "subscription",
  data() {
    return {
        subscriptions: null,
        loadingTable: true,
        filters:null         
    };
  },
  created() {
        this.initFilters();
  },
  setup() {
    const store = useStore();

    return {store};
  },
  components: {
    Card, InputText, Button, Textarea, Calendar, DataTable, Column, ColumnGroup, Row, Dialog, Dropdown,FilterMatchMode
  },
  props: {
     
  },
  mounted : function () {
    this.getSubscriptions();
    this.loadingTable=false;
  },

  methods: {
    getSubscriptions: function() {
      if(this.store.user.isAdmin){

        subscriptionService().getAllSubscription().then(data => this.subscriptions = data);

      }
      else{
        subscriptionService().getSubscriptionUser(this.store.user.email).then(data => this.subscriptions = data);

      }
      console.log("this.subscriptions");
      console.log(this.subscriptions);
    },
    initFilters: function () {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      };
    },

    
  },
};
</script>