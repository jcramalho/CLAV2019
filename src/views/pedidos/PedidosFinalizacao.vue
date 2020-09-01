<template>
  <FinalizacaoPedido :idp="$route.params.idPedido" />
</template>

<script>
import FinalizacaoPedido from "@/components/pedidos/FinalizacaoPedido.vue"; // @ is an alias to /src

export default {
  components: {
    FinalizacaoPedido,
  },
};
</script>
