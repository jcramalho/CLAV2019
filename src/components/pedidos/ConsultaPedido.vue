<template>
<div v-if="pedidoLoaded">
      <ShowPedido :p="selectedPedido" />
</div>
  
<div v-else>
  <p>A carregar informação...</p> 
</div>
</template>

<script>
import axios from "axios";
const lhost = require("@/config/global").host;

import ShowPedido from "@/components/pedidos/consulta/showPedido.vue"

export default {
  props: ["idp"],

  components: { ShowPedido },

  data: () => ({
    selectedPedido: {},
    pedidoLoaded: false
  }),
  
  mounted: function() {
    axios
      .get(lhost + "/api/pedidos/" + this.idp)
      .then(response => {
        this.selectedPedido = response.data;
        this.pedidoLoaded = true;
      })
      .catch(error => {
        return error;
      });
  }
};
</script>

<style></style>
