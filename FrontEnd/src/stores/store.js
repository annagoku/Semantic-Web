import { defineStore } from 'pinia' //libreria per stati/servizi dell'applicazione

/* Componente che rappresenta lo stato dell'applicazione */
export const useStore = defineStore('store', {
  state: () => ({ 
    pageTitle: null, // per contenere il nome della pagina corrente
    loading: false, // per attivare eventuale spinner di loading generale
    alerts: [], // array per contenere i messaggi di errore
    messages: [], // array per contenere i messaggi utente non di errore
  }),
  getters: {
    // boolean calcolato in automatico usato per mostrare in automatico il dialog di errore/di messagistica in caso di presenza messaggi
    showDialog: (state) => (state.alerts != null && state.alerts.length > 0 ) || (state.messages != null && state.messages.length > 0 ),

  },
  actions: {
    // azione per dismettere tutti i messagi
    dismissMessages() {
      this.alerts = [];
      this.messages = [];
      
    },
    //azione per aggiungere messaggio da mostrare
    addMessage(m) {
      this.messages.push(m);
    },
    //azione per aggiungere messaggio di errore
    addError(err) {
      this.alerts.push(err);
    },
       
},
  
})
