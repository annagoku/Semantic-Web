import { defineStore } from 'pinia'
import axios from 'axios';
import { useStore } from '@/stores/store'

const serverBaseUrl = "http://localhost:7200/repositories/ontoHorses2024";
axios.defaults.withCredentials = false


export const horsesalesService = defineStore('horsesalesService', {
  state: () => ({ 
  }),
  getters: {
  
  },
  actions: {

    async getAllHorses(){
      console.log("getAllHorses()");
      const store = useStore();
      
      const query = `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX schema: <http://schema.org/>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX oh: <http://www.semanticweb.org/annag/ontologies/2024/1/ontoHorses#>
      
      PREFIX designpatternprice: <http://www.ontologydesignpatterns.org/cp/owl/price.owl#>

      select ?Immagine ?cavalliInVendita ?cavalliInVenditaUri ?Prezzo ?Anni ?Regione ?Descrizione
      where {
          ?cavalliInVenditaUri rdf:type oh:Cavallo;
              rdfs:label ?cavalliInVendita;
              schema:image ?Immagine;
              rdfs:comment ?Descrizione;
              oh:eta ?Anni;
              designpatternprice:hasPrice ?PrezzoUri;
              oh:èScuderizzatoIn ?RegioneUri.
         
          
        ?RegioneUri rdfs:label ?Regione.
          ?PrezzoUri designpatternprice:hasValue ?Prezzo.
          
          FILTER (lang(?Descrizione) = "it" && lang(?Regione)="it" && lang(?cavalliInVendita)="it")  
      } `;
    
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
        
       

        console.log("Faccio for each")
        response.data.results.bindings.forEach(element => {
          console.log(element)
          var horse = {};
          
            console.log("CAVALLO")
            horse.razza= element.cavalliInVendita.value;
            horse.uri=element.cavalliInVenditaUri.value;
            console.log("IMMAGINE")
            if(element.Immagine != null)
              horse.immagine= element.Immagine.value;
              console.log("REGIONE")
            if(element.Regione != null)
              horse.regione= element.Regione.value;
              console.log("DESCRIZIONE")
            if(element.Descrizione != null)
              horse.descrizione= element.Descrizione.value;
            if(element.Prezzo != null)
            horse.prezzo= parseInt(element.Prezzo.value);
            if(element.Anni != null)
            horse.anni= element.Anni.value;
          
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
    async getHorseDetail(horseUri) {
      console.log("getHorseDetail("+horseUri+")");
      const store = useStore();
      
      const query = `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX schema: <http://schema.org/>
      PREFIX oh: <http://www.semanticweb.org/annag/ontologies/2024/1/ontoHorses#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX designpatternprice: <http://www.ontologydesignpatterns.org/cp/owl/price.owl#>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      
      
      select ?NomeCavallo ?Anni ?Regione ?Città ?Proprietario ?Razza ?Sesso ?AltezzaGarrese ?Disciplina ?Livello ?CategoriaSalto ?CategoriaDressage ?Prezzo                   
      where {
            ?Cavallo rdf:type oh:Cavallo;
                oh:nomeCavallo ?NomeCavallo;
                oh:eta ?Anni;
                oh:èScuderizzatoIn ?RegioneUri;
                oh:èScuderizzatoInCittàDi ?CittàUri;
                oh:èPossedutoDa ?ProprietarioUri;
                oh:haRazza ?RazzaUri;
                oh:haSesso ?Sesso;
                oh:altezzaGarrese ?AltezzaGarrese;
                oh:vieneUtilizzatoPer ?DisciplinaUri;
                designpatternprice:hasPrice ?PrezzoUri.
                
          
          ?RegioneUri rdfs:label ?Regione.
          ?CittàUri  rdfs:label ?Città.
          ?ProprietarioUri rdfs:label ?Proprietario.
          ?RazzaUri skos:prefLabel ?Razza.
          ?DisciplinaUri rdfs:label ?Disciplina.
          ?PrezzoUri designpatternprice:hasValue ?Prezzo.
          
          OPTIONAL {
                  ?Cavallo oh:adattoAlConseguimentoDi ?LivelloUri;
                       oh:gareggiaNelleCategorieDiSalto ?CategorieSaltoUri.
                  ?LivelloUri rdfs:label ?Livello.
                  ?CategorieSaltoUri rdfs:label ?CategoriaSalto.
                  
              FILTER (lang(?Livello)="it" && lang(?CategoriaSalto)="it" )
          }
          OPTIONAL {
                  ?Cavallo oh:gareggiaNellaCategoriaDiDressage ?CategoriaDressageUri.
                  ?CategoriaDressageUri rdfs:label ?CategoriaDressage.
                       
                  
              FILTER (lang(?CategoriaDressage)="it" )
          }
          
          
          FILTER(lang(?Regione)="it" && lang(?Città)="it" && lang(?Proprietario)="it" && lang(?Razza)="it" && lang(?Disciplina)="it")
               
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
        console.log("RESPONSE HORSE DETAIL")
        console.log(response.data)
         
        var horseDetail = {};
        horseDetail.discipline= [];
        horseDetail.livello= [];
        horseDetail.categorieSalto= [];

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
    }

   
  },

  
})
