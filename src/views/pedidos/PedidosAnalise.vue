<template>
  <AnalisaPedido :idp="$route.params.idPedido" />
</template>

<script>
import AnalisaPedido from "@/components/pedidos/analise/AnalisaPedido.vue"; // @ is an alias to /src

export default {
  components: {
    AnalisaPedido
  }
};
</script>
