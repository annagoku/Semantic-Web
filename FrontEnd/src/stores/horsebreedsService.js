import { defineStore } from 'pinia'
import axios from 'axios';
import { useStore } from '@/stores/store'

const serverBaseUrl = "http://localhost:7200/repositories/ontoHorses2024";
axios.defaults.withCredentials = false


export const horsebreedsService = defineStore('horsebreedsService', {
  state: () => ({ 
  }),
  getters: {
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
      
      select ?RazzaUri ?Razza ?Nazionalità ?Indole ?Morfologia (COALESCE(SAMPLE(?Immagine), "n/a") AS ?Immagine) ?Informazioni 
      where {
            ?RazzaUri rdf:type oh:RazzaCavallo;
                skos:prefLabel ?Razza;
                oh:haIndole ?IndoleUri;
                oh:haClassificazioneMorfologica ?MorfologiaUri;
                oh:haNazionalità ?NazionalitàUri;
                rdfs:comment ?Informazioni.
          
            ?NazionalitàUri rdfs:label ?Nazionalità.
            ?IndoleUri rdfs:label ?Indole.
            ?MorfologiaUri rdfs:label ?Morfologia.
          
          FILTER ( lang(?Informazioni) = "it" && lang(?Nazionalità)="it"&& lang(?Razza)="it" && lang(?Indole)="it" && lang(?Morfologia)="it" ).
          
          OPTIONAL { 
              ?RazzaUri oh:entitàWikidata ?entita.
                SERVICE <https://query.wikidata.org/sparql> {
                OPTIONAL {
                  ?entita <http://www.wikidata.org/prop/direct/P18> ?Immagine.
                   }
                  }			 
          }            
      }
      GROUP BY ?RazzaUri ?Razza ?Nazionalità ?Indole ?Morfologia ?Informazioni
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
          console.log("FACCIO PUSH Razza "+element.Razza.value);
          
          var breed = {};
          breed.razza= element.Razza.value;
          breed.uri=element.RazzaUri.value;

          if(element.Immagine != null)
            breed.immagine= element.Immagine.value;
          if(element.Nazionalità != null)
            breed.nazione= element.Nazionalità.value;
          if(element.Informazioni != null)
            breed.descrizione= element.Informazioni.value;
          if(element.Indole != null) {
            breed.indole= element.Indole.value;
          }
          if(element.Morfologia != null) {
            breed.morfologia= element.Morfologia.value;
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
      
      const query = `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      PREFIX schema: <http://schema.org/>
      PREFIX oh: <http://www.semanticweb.org/annag/ontologies/2024/1/ontoHorses#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      
      select  ?RazzaUri ?Razza  ?AltezzaMediaGarrese (COALESCE(?RegioneDiOrigineLabel, "n/a")AS ?RegioneDiOrigine) ?PesoMedio ?Impiego ?ColoriMantello ?Immagine 
      where {
             ?RazzaUri rdf:type oh:RazzaCavallo;
                  skos:prefLabel ?Razza;
                  oh:altezzaMediaGarrese ?AltezzaMediaGarrese;
                  oh:pesoMedio ?PesoMedio;
                  oh:puòEssereImpiegataIn ?ImpiegoUri;
                
                oh:haColoreMantello ?ColoriMantello.
                
            ?ImpiegoUri rdfs:label ?Impiego.
          
          optional{
              ?RazzaUri oh:haRegioneDiOrigine ?RegioneDiOrigineUri.
              ?RegioneDiOrigineUri rdfs:label ?RegioneDiOrigineLabel.
              FILTER(lang(?RegioneDiOrigineLabel)="it")
          }
        
          optional{
                      ?RazzaUri schema:image ?Immagine.                     
          }
       FILTER(?RazzaUri=<`+breedUri+`> && lang(?Razza)="it" && lang(?Impiego)="it")	
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
          if(!breedDetail.regioneOrigine && element.RegioneDiOrigine) {
            breedDetail.regioneOrigine = element.RegioneDiOrigine.value;
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
            var impiego = element.Impiego.value;
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
    }, 

    async getAllBreedsNations(){
      console.log("getAllBreedsNations()");
      const store = useStore();
      
      const query = `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX oh: <http://www.semanticweb.org/annag/ontologies/2024/1/ontoHorses#>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      
      select distinct ?NazionalitaUri ?Nazionalita 
      where {
            ?RazzaUri rdf:type oh:RazzaCavallo;
                skos:prefLabel ?Razza;
                oh:haNazionalità ?NazionalitaUri.
            
          
            ?NazionalitaUri rdfs:label ?Nazionalita.
          
          FILTER (lang(?Nazionalita)="it"&& lang(?Razza)="it" ).
          
          
      }
      ORDER BY (?Nazionalita)`;
    
      try {
        const response = await axios.get(serverBaseUrl, {
          headers: {
            'Accept': 'application/sparql-results+json'
          },
          params: {
            query: query
          }
        });
        console.log("RESPONSE ALL BREEDS NATIONS")
        console.log(response.data)
         
        var nations = [];
        
        console.log("FACCIO FOREACH")
        
        response.data.results.bindings.forEach(element => {
          var nation = {};
          nation.label= element.Nazionalita.value;
          nation.uri=element.NazionalitaUri.value;
  
          nations.push(nation);
        });
        console.log("BREEDS NATIONS AFTER")
        console.log(nations);
  
        return nations;
      } catch (error) {
        store.alerts = ["Impossibile recuperare i dati delle nazioni"];
        throw error;
      }
    },

  },

  

  
})
