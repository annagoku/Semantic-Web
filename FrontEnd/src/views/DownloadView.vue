<!--questa pagina è costituita dal componente di Vue "DataTable" le cui righe sono popolate dai dati inseriti nella variabile "document" indicata
nella sezione "Data"-->

<template>
  <div class="container">
   
    <DataTable stripedRows showGridlines :value="document" tableStyle="min-width: 30rem" :loading="loadingTable">
      <Column field="title" header="Titolo Documento">
      </Column>
      <Column >
        <template #body="slotProps">
          <Button icon="pi pi-download" size="small" style="border-radius: 50%;box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);float: right;" aria-label="Info" @click="downloadDocumentSelected(slotProps.data)" ></Button>
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
                  {title:'Ontologia.ttl', path:'docs/Progetto_finale.ttl', filetype:'file'},
                  {title:'Ontologia con inferenze.ttl', path:'docs/ontoHorsesInferred.owl', filetype:'file'},
                  {title:'Documentazione LODE', path:'docs/Progetto_finale_documentazioneLODE.html', filetype:'html'},
                  {title:'Relazione di progetto.pdf', path:'docs/OntoHorsesDocumentation.pdf', filetype:'file'}
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
      /**Metodo per il download-- sono gestite due casististiche di file : html e non html */
      downloadDocumentSelected: function(data) {
        console.log("Download title:"+data.title);
        console.log("Download path :"+data.path);
        console.log("Download type :"+data.filetype);
        
        if(data.filetype==='html') {
          window.open(data.path)
        }
        else {
          const anchor = document.createElement('a');
          anchor.href = data.path;
          anchor.download = data.title;
          document.body.appendChild(anchor);
          anchor.click();
          document.body.removeChild(anchor);
        }



      },
      
      
        
    }

};
</script>

