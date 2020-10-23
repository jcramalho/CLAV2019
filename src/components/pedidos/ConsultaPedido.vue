<template>
  <div v-if="pedidoLoaded">
    <ShowPedido :p="selectedPedido" :etapaPedido="etapaPedido" />
  </div>

  <div v-else style="text-align:center;" class="mt-4">
    <p>A carregar informação...</p>
    <v-progress-circular indeterminate size="100" width="10" color="blue" />
  </div>
</template>

<script>
import ShowPedido from "@/components/pedidos/consulta/showPedido.vue";

export default {
  props: ["idp"],

  components: { ShowPedido },

  data: () => ({
    etapaPedido: null,
    selectedPedido: {},
    pedidoLoaded: false,
  }),

  mounted: function() {
    this.$request("get", "/pedidos/" + this.idp)
      .then((response) => {
        const pedido = response.data;
        this.selectedPedido = pedido;

        switch (pedido.estado) {
          case "Submetido":
            this.etapaPedido = "Pedidos Novos";
            break;
          case "Distribuído":
          case "Redistribuído":
            this.etapaPedido = "Pedidos em Apreciação Técnica";
            break;
          case "Apreciado":
          case "Reapreciado":
            this.etapaPedido = "Pedidos em Validação";
            break;
          case "Devolvido":
            this.etapaPedido = "Pedidos Devolvidos";
            break;
          case "Validado":
            this.etapaPedido = "Pedidos Aprovados";
            break;
          case "Em Despacho":
            this.etapaPedido = "Pedidos em Despacho";
            break;

          default:
            break;
        }

        this.$emit('pedido_original', this.selectedPedido)
        this.pedidoLoaded = true;
      })
      .catch((error) => {
        return error;
      });
  },
};
</script>
