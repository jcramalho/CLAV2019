<template>
  <ListaPedidos @pedidoSelected="consultaPedido($event)" />
</template>

<script>
import ListaPedidos from "@/components/pedidos/ListaPedidos.vue"; // @ is an alias to /src

export default {
  components: {
    ListaPedidos
  },
  methods: {
    consultaPedido: function(item) {
      this.$router.push("/pedidos/" + item.codigo);
    }
  }
};
</script>
