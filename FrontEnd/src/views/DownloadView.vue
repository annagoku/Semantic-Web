<template>
  <div class="container">
   
    <DataTable stripedRows showGridlines :value="document" tableStyle="min-width: 30rem" :loading="loadingTable">
      <Column field="title" header="Titolo Documento">
      </Column>
      <Column >
        <template #body="slotProps">
          <Button icon="pi pi-download" size="small" style="border-radius: 50%;box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);float: right;" aria-label="Info" @click="downloadDocumentSelected(slotProps.index, slotProps.data)" ></Button>
        </template>
      </Column>
    </DataTable>
  </div>

</template>


<script>
import { useStore } from '@/stores/store'
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Row from 'primevue/row';     
import Dialog from 'primevue/dialog';
import Card from 'primevue/card';

export default {
  name: "DownloadView",
  data() {
    return {
      layout: "grid",
      loadingTable: false,
      selectedDocument: null,
      document:[
                  {title:'Ontologia.ttl'},
                  {title:'Ontologia con inferenze.ttl'},
                  {title:'Documentazione LODE'},
                  {title:'Relazione di progetto.pdf'}
                ]
   
    };
  },
  setup () {
    const store = useStore();
    return {store};
  },
  mounted : function () {
     
  },
  components: {
      Button, DataTable,  Column, Row, Card, Dialog
  },
  props: {
     
  },
  methods: {
      
      hideDetail: function() {
        this.showDetail = false;
        this.selectedBreed = null;
      },
      
      
        
    }

};
</script>

