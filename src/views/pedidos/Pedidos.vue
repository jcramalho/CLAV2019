<template>
  <GestaoPedidos @pedidoSelected="consultaPedido($event)" />
</template>

<script>
import GestaoPedidos from "@/components/pedidos/GestaoPedidos.vue"; // @ is an alias to /src

export default {
  components: {
    GestaoPedidos
  },
  methods: {
    consultaPedido: function(item) {
      switch (item.objeto.tipo) {
        case "Classe":
          this.$router.push("/classes/showPedido/" + item.codigo);
          break;
        default:
          this.$router.push("/pedidos/" + item.codigo);
      }
    }
  }
};
</script>
