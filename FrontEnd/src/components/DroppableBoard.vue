<template>
  <div :class="$attrs.class" :id="id"
    @dragover.prevent
    @drop.prevent="drop"
    
  >
    <slot></slot>
    
  
</div>
</template>
<script>
import Card from 'primevue/card';

export default {
  name: "DroppableBoard",
  
  props: {
    id: {
      type: String,
      required: true
    },
    maxitems: {
      type: Number,
      default: 1
    }
  },
  components: {
    Card
  },
  mounted : function () {
     

  },
  methods: {
    drop: function (e) {
      e.preventDefault();
      console.log("drop function -  max elem allowed: "+this.maxitems);
      console.log("drop function -  target children: "+e.target.children.length);
      if(e.target.children.length >= this.maxitems) {
        return;
      }
      else {
        const chipId = e.dataTransfer.getData("c_id");
        console.log("dropped id "+chipId);
        e.dataTransfer.setData("dropped","true");
        const chip = document.getElementById(chipId);
        e.target.appendChild(chip);

      }
      
    }    
  },
};
</script>