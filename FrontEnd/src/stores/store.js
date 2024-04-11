import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios';
import { faRupiahSign } from '@fortawesome/free-solid-svg-icons';

export const useStore = defineStore('store', {
  state: () => ({ 
    pageTitle: null,
    loading: false,
    alerts: [],
    messages: [],
  }),
  getters: {
    showDialog: (state) => (state.alerts != null && state.alerts.length > 0 ) || (state.messages != null && state.messages.length > 0 ),

  },
  actions: {
    dismissMessages() {
      this.alerts = [];
      this.messages = [];
      
    },
    addMessage(m) {
      this.messages.push(m);
    },
    addError(err) {
      this.alerts.push(err);
    },
    getLabelFromUri(uri) {
      const indice = uri.indexOf('#');
      if(indice !== -1) {
        return uri.slice(indice +1);
      }
      else {
        return uri;
      }
    },
    checkBreedUri(horses, element){
      console.log("ho chiamato la funzione checkBreed")
      var result= {};
      result.index=-1;
      result.found=false;
      if(horses && element.cavalliInVenditaUri){
          for (var i=0; i<horses.lenght && found==false; i++){
            if(horses[i].uri===element.cavalliInVenditaUri.value){
              index=i;
              found=true;
            }
          }                    
        }
        return result;
       },
       
},
  
})
