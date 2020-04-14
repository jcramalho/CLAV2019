<template>
  <div v-if="pedidoLoaded">
    <showPedidoNovo :p="selectedPedido" />
  </div>

  <div v-else style="text-align: center;" class="mt-4">
    <p>A carregar informação...</p>
    <v-progress-circular indeterminate size="100" width="10" color="blue" />
  </div>
</template>

<script>
import showPedidoNovo from "@/components/pedidos/consulta/showPedidoNovo";

export default {
  props: ["idp"],

  components: { showPedidoNovo },

  data: () => ({
    selectedPedido: {},
    pedidoLoaded: false,
  }),

  mounted: function () {
    this.$request("get", "/pedidos/" + this.idp)
      .then((response) => {
        this.selectedPedido = response.data;
        this.pedidoLoaded = true;
      })
      .catch((error) => {
        return error;
      });
  },
};
</script>
