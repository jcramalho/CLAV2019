<template>
  <Pedido :idp="$route.params.idPedido" />
</template>

<script>
import Pedido from "@/components/pedidos/Pedido"; // @ is an alias to /src

export default {
  components: {
    Pedido,
  },
};
</script>
