import { defineStore } from 'pinia'
import axios from 'axios';
import { useStore } from '@/stores/store'

const serverBaseUrl = "http://localhost:7200/repositories/ontoHorses2024";
axios.defaults.withCredentials = false


export const horsebreedsService = defineStore('horsebreedsService', {
  state: () => ({ 
  }),
  getters: {
    /*doubleCount: (state) => state.count * 2,*/
  },
  actions: {

    async getAllBreeds(){
      console.log("getAllBreeds()");
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
        console.log("RESPONSE ALL BREEDS")
        console.log(response.data)
         
        var breeds = [];
        
        console.log("FACCIO FOREACH")
        
        response.data.results.bindings.forEach(element => {
          element.Razza.label = store.getLabelFromUri(element.Razza.value);
          element.Nazionalità.label = store.getLabelFromUri(element.Nazionalità.value);
          console.log("FACCIO PUSH Razza "+element.Razza.label);
          
          var breed = {};
          breed.razza= element.Razza.label;
          breed.uri=element.Razza.value;

          if(element.Immagine != null)
            breed.immagine= element.Immagine.value;
          if(element.Nazionalità != null)
            breed.nazione= element.Nazionalità.label;
          if(element.Informazioni != null)
            breed.descrizione= element.Informazioni.value;
          if(element.Indole != null) {
            breed.indole= store.getLabelFromUri(element.Indole.value);
          }
          if(element.Morfologia != null) {
            breed.morfologia= store.getLabelFromUri(element.Morfologia.value);
          }


          breeds.push(breed);
        });
        console.log("BREEDS AFTER")
        console.log(breeds);

        return breeds;
      } catch (error) {
        store.alerts = ["Impossibile recuperare i dati. Riprovare più tardi"];
        throw error;
      }
    },

    async getBreedDetail(breedUri) {
      console.log("getBreedDetail("+breedUri+")");
      const store = useStore();
      
      const query = `PREFIX schema: <http://schema.org/>
      PREFIX oh: <http://www.semanticweb.org/annag/ontologies/2024/1/ontoHorses#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      
      select   ?Regione_di_Origine ?AltezzaMediaGarrese ?PesoMedio ?Impiego ?ColoriMantello ?Immagine 
      where {
          ?Razza rdf:type oh:RazzaCavallo;
          oh:altezzaMediaGarrese ?AltezzaMediaGarrese;
          oh:pesoMedio ?PesoMedio;
          oh:puòEssereImpiegataIn ?Impiego;
          oh:haColoreMantello ?ColoriMantello.
        optional{
                    ?Razza oh:haRegioneDiOrigine ?Regione_di_Origine.                     
        }
        optional{
                    ?Razza schema:image ?Immagine.                     
        }
       FILTER(?Razza=<`+breedUri+`>)	
      } `;
    
      try {
        console.log("chiamo il servizio ")
        const response = await axios.get(serverBaseUrl, {
          headers: {
            'Accept': 'application/sparql-results+json'
          },
          params: {
            query: query
          }
        });
        console.log("RESPONSE BREED DETAIL")
        console.log(response.data)
         
        var breedDetail = {};
        breedDetail.impieghi= [];
        breedDetail.mantelli= [];

        console.log("FACCIO FOREACH")
        
        response.data.results.bindings.forEach(element => {
          console.log(element)

          console.log("ORIGINE")
          if(!breedDetail.regioneOrigine && element.Regione_di_Origine) {
            breedDetail.regioneOrigine = store.getLabelFromUri(element.Regione_di_Origine.value);
          }
          console.log("ALTEZZA")
          if(!breedDetail.altezzaMediaGarrese && element.AltezzaMediaGarrese) {
            breedDetail.altezzaMediaGarrese = element.AltezzaMediaGarrese.value;
          }
          console.log("PESO")
          
          if(!breedDetail.pesoMedio && element.PesoMedio) {
            breedDetail.pesoMedio = element.PesoMedio.value;
          }
          console.log("IMMAGINE")
          
          if(!breedDetail.immagine && element.Immagine) {
            breedDetail.immagine = element.Immagine.value;
          }

          console.log("IMPIEGHI")
          if(element.Impiego) {
            var impiego = store.getLabelFromUri(element.Impiego.value);
            if(breedDetail.impieghi.indexOf(impiego) === -1) {
              breedDetail.impieghi.push(impiego);
            }
          }
          
          console.log("MANTELLI")
          if(element.ColoriMantello) {
            var mantello = element.ColoriMantello.value;
            if(breedDetail.mantelli.indexOf(mantello) === -1) {
              breedDetail.mantelli.push(mantello);
            }
          }
          
          

        });
        console.log(breedDetail)
        return breedDetail;
      } catch (error) {
        store.alerts = ["Impossibile recuperare i dati. Riprovare più tardi"];
        throw error;
      }
    }


  },

  
})
