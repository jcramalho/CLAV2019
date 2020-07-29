<template>
  <SubmissaoPedido :idp="$route.params.idPedido" />
</template>

<script>
import SubmissaoPedido from "@/components/pedidos/SubmissaoPedido.vue"; // @ is an alias to /src

export default {
  components: {
    SubmissaoPedido,
  },
};
</script>
