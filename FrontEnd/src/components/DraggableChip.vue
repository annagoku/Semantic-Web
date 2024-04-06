<template>
  <Chip  :id="id"
    :class="$attrs.class"
    draggable="true"
    @dragstart="dragStart"
    @dragend="dragEnd"
    @dragover.stop
  >
  <slot></slot>
</Chip>
</template>
<script>
import Chip from 'primevue/chip';

export default {
  name: "DraggableChip",
  
  props: [
    'id', 'name'
  ],
  components: {
    Chip
  },
  mounted : function () {
     

  },
  methods: {
    dragStart: function (e) {
      const target = e.target;
      e.dataTransfer.setData("dropped", "false");
      e.dataTransfer.setData("c_id", target.id);
      target.classList.add("dragging");
    },
    dragEnd: function (e) {
      const target = e.target;
      console.log("dragend")
      target.classList.remove("dragging");

      
    }       
  },
};
</script>