<template>
  <EmDespacho :idPedido="$route.params.idPedido" />
</template>

<script>
import EmDespacho from "@/components/pedidos/EmDespacho.vue"; // @ is an alias to /src

export default {
  components: {
    EmDespacho,
  },
};
</script>
