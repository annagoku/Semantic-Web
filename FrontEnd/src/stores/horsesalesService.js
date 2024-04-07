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
      PREFIX owl: <http://www.w3.org/2002/07/owl#>
      PREFIX schema: <http://schema.org/image>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX oh: <http://www.semanticweb.org/annag/ontologies/2024/1/ontoHorses#>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      select ?Razza ?Nazionalità ?Indole ?Morfologia ?Immagine ?Informazioni 
      where {
            ?Razza rdf:type oh:RazzaCavallo;
                oh:haNazionalità ?Nazionalità;
                oh:haIndole ?Indole;
                oh:haClassificazioneMorfologica ?Morfologia;
                rdfs:comment ?Informazioni.    
          FILTER ( lang(?Informazioni) = "it" ).
          OPTIONAL { 
              ?Razza oh:entitàWikidata ?entita.
                SERVICE <https://query.wikidata.org/sparql> {
                OPTIONAL {
                  ?entita <http://www.wikidata.org/prop/direct/P18> ?Immagine.
                   }
          }
            
                 
          BIND(COALESCE(?Immagine, "n/a") AS ?Imm).			 
          }
      }
      ORDER BY (?Razza)`;
    
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
          //TODO


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
