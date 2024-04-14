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

      select ?Immagine ?cavalliInVendita ?cavalliInVenditaUri ?Prezzo ?Anni ?Regione ?Descrizione ?Disciplina
      where {
          ?cavalliInVenditaUri rdf:type oh:Cavallo;
              rdfs:label ?cavalliInVendita;
              schema:image ?Immagine;
              oh:vieneUtilizzatoPer ?DisciplinaUri;
              rdfs:comment ?Descrizione;
              oh:eta ?Anni;
              designpatternprice:hasPrice ?PrezzoUri;
              oh:èScuderizzatoIn ?RegioneUri.
         
          
          ?RegioneUri rdfs:label ?Regione.
          ?PrezzoUri designpatternprice:hasValue ?Prezzo.
          ?DisciplinaUri rdfs:label ?Disciplina
          
          FILTER (lang(?Descrizione) = "it" && lang(?Regione)="it" && lang(?cavalliInVendita)="it" && lang(?Disciplina)="it")  
      } ORDER BY(?cavalliInVendita)`;
    
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
        var horse = null;

        console.log("Faccio for each")
        response.data.results.bindings.forEach(element => {
          console.log(element);  
          var horseUri = element.cavalliInVenditaUri.value; 
          console.log("CAVALLO "+horseUri);
          if(horse == null || horse.uri != horseUri) {
            console.log("DEVO CREARE NUOVO CAVALLO ");
          
            if(horse != null) {
              horses.push(horse);
            }
            horse = {};
            horse.uri = horseUri;
            horse.nomeAnnuncio=element.cavalliInVendita.value;
            horse.disciplina = [];
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
          }
          if(element.Disciplina != null)
            horse.disciplina.push(element.Disciplina.value);   

        });
        horses.push(horse);
        
        
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
      
      
      select ?CavalloUri ?NomeCavallo ?Anni ?Regione ?Città ?Proprietario ?Razza ?Sesso ?AltezzaGarrese ?Disciplina ?Livello ?CategoriaSalto ?CategoriaDressage ?Prezzo                   
      where {
            ?CavalloUri rdf:type oh:Cavallo;
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
                  ?CavalloUri oh:adattoAlConseguimentoDi ?LivelloUri;
                       oh:gareggiaNelleCategorieDiSalto ?CategorieSaltoUri.
                  ?LivelloUri rdfs:label ?Livello.
                  ?CategorieSaltoUri rdfs:label ?CategoriaSalto.
                  
              FILTER (lang(?Livello)="it" && lang(?CategoriaSalto)="it" )
          }
          OPTIONAL {
                  ?CavalloUri oh:gareggiaNellaCategoriaDiDressage ?CategoriaDressageUri.
                  ?CategoriaDressageUri rdfs:label ?CategoriaDressage.
                       
                  
              FILTER (lang(?CategoriaDressage)="it" )
          }
          
          
          FILTER(?CavalloUri=<`+horseUri+`> && lang(?Regione)="it" && lang(?Città)="it" && lang(?Proprietario)="it" && lang(?Razza)="it" && lang(?Disciplina)="it")
               
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
        horseDetail.disciplina= [];
        horseDetail.livello= [];
        horseDetail.categorieSalto= [];

        console.log("FACCIO FOREACH")
        
        response.data.results.bindings.forEach(element => {
          console.log(element)

          console.log("NOME")
          if(!horseDetail.nome && element.NomeCavallo) {
            horseDetail.nome = element.NomeCavallo.value;
          }

          console.log("RAZZA")
          if(!horseDetail.razza && element.Razza) {
            horseDetail.razza = element.Razza.value;
          }

          console.log("SESSO")
          if(!horseDetail.sesso && element.Sesso) {
            horseDetail.sesso = element.Sesso.value;
          }

          console.log("ANNI")
          if(!horseDetail.anni && element.Anni) {
            horseDetail.anni = element.Anni.value;
          }

          console.log("REGIONE")
          if(!horseDetail.regione && element.Regione) {
            horseDetail.regione = element.Regione.value;
          }
          console.log("CITTA'")
          if(!horseDetail.city && element.Città) {
            horseDetail.city = element.Città.value;
          }
          console.log("PROPRIETARIO")
          if(!horseDetail.proprietario && element.Proprietario) {
            horseDetail.proprietario = element.Proprietario.value;
          }
          
          console.log("ALTEZZA")
          if(!horseDetail.altezzaGarrese && element.AltezzaGarrese) {
            horseDetail.altezzaGarrese = element.AltezzaGarrese.value;
          }

          console.log("IMMAGINE")         
          if(!horseDetail.immagine && element.Immagine) {
            horseDetail.immagine = element.Immagine.value;
          }

          console.log("DISCIPLINA")
          if(element.Disciplina) {
            var disciplina = element.Disciplina.value;
            if(horseDetail.disciplina.indexOf(disciplina) === -1) {
              horseDetail.disciplina.push(disciplina);
            }
          }
          
          console.log("LIVELLO")
          if(element.Livello) {
            var livello = element.Livello.value;
            if(horseDetail.livello.indexOf(livello) === -1) {
              horseDetail.livello.push(livello);
            }
          }
          
          console.log("CATEGORIA DI SALTO")
          if(element.CategoriaSalto) {
            var categorieSalto = element.CategoriaSalto.value;
            if(horseDetail.categorieSalto.indexOf(categorieSalto) === -1) {
              horseDetail.categorieSalto.push(categorieSalto);
            }
          } 

          console.log("CATEGORIA DRESSAGE")         
          if(!horseDetail.categoriaDressage && element.CategoriaDressage) {
            horseDetail.categoriaDressage = element.CategoriaDressage.value;
          }

        });
        console.log(horseDetail)
        return horseDetail;
      } catch (error) {
        store.alerts = ["Impossibile recuperare i dati. Riprovare più tardi"];
        throw error;
      }
    },

    async getAllHorsesInSaleRegions(){
      console.log("getAllHorsesRegion()");
      const store = useStore();
      
      const query = `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX oh: <http://www.semanticweb.org/annag/ontologies/2024/1/ontoHorses#>
      
      select distinct ?RegioneUri ?Regione
      where {
            ?CavalloUri rdf:type oh:Cavallo;  
                oh:èScuderizzatoIn ?RegioneUri.         
                ?RegioneUri rdfs:label ?Regione.
          
          FILTER (lang(?Regione)="it" ).  
      }
      ORDER BY (?Regione)`;
    
      try {
        const response = await axios.get(serverBaseUrl, {
          headers: {
            'Accept': 'application/sparql-results+json'
          },
          params: {
            query: query
          }
        });
        console.log("RESPONSE ALL HORSES IN SALE REGIONS")
        console.log(response.data)
         
        var regions = [];
        
        console.log("FACCIO FOREACH")
        
        response.data.results.bindings.forEach(element => {
          var region = {};
          region.label= element.Regione.value;
          region.uri=element.RegioneUri.value;
  
          regions.push(region);
        });
        console.log("ELENCO REGIONI")
        console.log(regions);
  
        return regions;
      } catch (error) {
        store.alerts = ["Impossibile recuperare i dati delle regioni"];
        throw error;
      }
    },

    async getAllHorsesInSaleDisciplines(){
      console.log("getAllHorsesDisciplines()");
      const store = useStore();
      
      const query = `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX oh: <http://www.semanticweb.org/annag/ontologies/2024/1/ontoHorses#>
            
            select distinct ?DisciplinaUri ?Disciplina
            where {
                    ?DisciplinaUri rdf:type oh:Impiego;
                    rdfs:label ?Disciplina.
       
          FILTER NOT EXISTS {
              {?DisciplinaUri rdf:type oh:CategorieDiSalto.}
              UNION
              {?DisciplinaUri rdf:type oh:CategorieDressage.}
        }
          FILTER (lang(?Disciplina)="it") 
      }`;
    
      try {
        const response = await axios.get(serverBaseUrl, {
          headers: {
            'Accept': 'application/sparql-results+json'
          },
          params: {
            query: query
          }
        });
        console.log("RESPONSE ALL HORSES IN SALE DISCIPLINES")
        console.log(response.data)
         
        var disciplines = [];
        
        console.log("FACCIO FOREACH")
        
        response.data.results.bindings.forEach(element => {
          var discipline= {};
          discipline.label= element.Disciplina.value;
          discipline.uri=element.DisciplinaUri.value;
  
          disciplines.push(discipline);
        });
        console.log("ELENCO DISCIPLINE")
        console.log(disciplines);
  
        return disciplines;
      } catch (error) {
        store.alerts = ["Impossibile recuperare i dati delle discipline o impieghi"];
        throw error;
      }
    },

   
  },

  
})
