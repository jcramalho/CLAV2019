<template>
  <ConsultaPedidoUtilizador :numeroPedido="$route.params.numeroPedido" />
</template>

<script>
import ConsultaPedidoUtilizador from "@/components/users/ConsultaPedidoUtilizador.vue"; // @ is an alias to /src

export default {
  components: {
    ConsultaPedidoUtilizador,
  },
};
</script>
