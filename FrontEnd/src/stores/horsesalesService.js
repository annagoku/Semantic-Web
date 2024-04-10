import { defineStore } from 'pinia'
import axios from 'axios';
import { useStore } from '@/stores/store'

const serverBaseUrl = "http://localhost:7200/repositories/ontoHorses2024";
axios.defaults.withCredentials = false


export const horsesalesService = defineStore('horsesalesService', {
  state: () => ({ 
  }),
  getters: {
    /*doubleCount: (state) => state.count * 2,*/
  },
  actions: {

    async getAllHorses(){
      console.log("getAllHorses()");
      const store = useStore();
      
      const query = `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX schema: <http://schema.org/>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX oh: <http://www.semanticweb.org/annag/ontologies/2024/1/ontoHorses#>
      
      select ?Immagine ?cavalliInVendita ?cavalliInVenditaUri ?Disciplina ?Regione ?Descrizione
      where {
          ?cavalliInVenditaUri rdf:type oh:Cavallo;
              rdfs:label ?cavalliInVendita;
              schema:image ?Immagine;
              rdfs:comment ?Descrizione;
              oh:vieneUtilizzatoPer ?DisciplinaUri;
              oh:èScuderizzatoIn ?RegioneUri.
         
          ?DisciplinaUri rdfs:label ?Disciplina.
        ?RegioneUri rdfs:label ?Regione.
          
          FILTER (lang(?Descrizione) = "it" && lang(?Regione)="it" && lang (?Disciplina)="it" &&lang(?cavalliInVendita)="it")  
      }`;
    
      try {
        console.log("chiamo il servizio +")
        const response = await axios.get(serverBaseUrl, {
          headers: {
            'Accept': 'application/sparql-results+json'
          },
          params: {
            query: query
          }
        });
        console.log("RESPONSE ALL HORSES")
        console.log(response.data)
         
        var horses = [];
        
        response.data.results.bindings.forEach(element => {
          
          var horse = {};
          horse.disciplina =[];
          console.log("CAVALLO")
          
          
          horse.razza= element.cavalliInVendita.value;
          horse.uri=element.cavalliInVenditaUri.value;

          if(element.Immagine != null)
            horse.immagine= element.Immagine.value;
          if(element.Regione != null)
            horse.regione= element.Regione.value;
          if(element.Descrizione != null)
            horse.descrizione= element.Descrizione.value;
          if(element.Disciplina != null)
            horse.disciplina= element.Disciplina.value;
          
          horses.push(horse);
        });
        
        console.log("HORSES AFTER")
        console.log(horses);

        return horses;
      } catch (error) {
        store.alerts = ["Impossibile recuperare i dati. Riprovare più tardi"];
        throw error;
      }
    },

   
  },

  
})
