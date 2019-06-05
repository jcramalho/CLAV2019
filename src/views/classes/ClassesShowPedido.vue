<template>
  <Pedido :idp="$route.params.idPedido" />
</template>

<script>
import Pedido from "@/components/classes/show/Pedido.vue"; // @ is an alias to /src

export default {
  components: {
    Pedido
  }
};
</script>
