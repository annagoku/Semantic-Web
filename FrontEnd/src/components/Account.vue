<template>
<div id="account" class="cointainer row mx-auto mt-4">
 
<Card>
  <template #title>Profilo Utente</template>
    <template #content>
        <div class="row">
          <span class="p-float-label col-sm-12 col-md-4 mt-md-0 mt-3">
              <InputText :class="'w-full'" id="name" disabled v-model="store.user.name" />
              <label for="name">Nome</label>
          </span>
          <span class="p-float-label col-sm-12 col-md-4 mt-md-0 mt-3">
              <InputText :class="'w-full'" id="surname" disabled v-model="store.user.surname" />
              <label for="surname">Cognome</label>
          </span>
          <span class="p-float-label col-sm-12 col-md-4 mt-md-0 mt-3">
              <InputText :class="'w-full'" id="email" disabled v-model="store.user.email" />
              <label for="email">Email</label>
          </span>
        </div>
        <div class="row py-7">
          <span class="p-float-label col-xs-6 col-md-4 mt-md-0 mt-3">
            <Calendar baseZIndex="3000" :class="'w-full'" id="birthdate" v-model="birthdate" showIcon  dateFormat="dd/mm/yy" />
              <label for="birthdate">Data di nascita</label>
          </span>
          <span class="p-float-label col-xs-6 col-md-4 mt-md-0 mt-3">
              <InputText :class="'w-full'" id="qualification" disabled v-model="user.qualification" />
              <label for="qualification">Patente equestre</label>
          </span>
        </div>
        <div class="row py-7">
            <span class="p-float-label col-xs-12 col-md-12 mt-md-0 mt-3">
              <Textarea :class="'w-full'" id="descritpion" v-model="user.description" autoresize rows="5" cols="30" ></Textarea>
              <label for="descritpion">Descrizione</label>
            </span>
        </div>
    </template>
    <template #footer>
        <Button class="btn-primary" icon="pi pi-check" label="Salva" @click.stop.prevent="save"></Button>
        <Button class="btn-cancel" icon="pi pi-times" label="Annulla" @click="cancel" style="margin-left: 0.5em"></Button>
    </template>
</Card>

</div>
</template>
<script>
import Card from 'primevue/card';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import { useStore } from '@/stores/store';
import Calendar from 'primevue/calendar';
import { userService } from '@/stores/userService'
import {format} from 'date-fns';
import {parse} from 'date-fns';

export default {
  name: "Account",
  data() {
    return {
        user: {},
        birthdate: null
    };
  },
  setup() {
    const store = useStore();
    return {store};
  },
  components: {
    Card, InputText, Button, Textarea, Calendar
  },
  props: {
     
  },
  mounted : function () {
    // copy from store
    console.log("Account mounted");
    this.user = {...this.store.user};
    if(this.user.birthdate) {
      this.birthdate = parse(this.user.birthdate, 'dd/MM/yyyy', new Date());
      
    }
    console.log(this.user);
    console.log(this.birthdate);
  },
  methods: {
    save: function () {
      console.log("SAVE USER")
      if(this.birthdate) {
        this.user.birthdate = format(this.birthdate, 'dd/MM/yyyy');
      
      }
      userService().updateUser (this.user)


    },
    cancel: function () {
      this.user = {...this.store.user};
    }
  },
};
</script>