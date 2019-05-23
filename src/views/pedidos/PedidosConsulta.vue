<template>
  <ConsultaPedido :idp="$route.params.idPedido" />
</template>

<script>
import ConsultaPedido from "@/components/pedidos/ConsultaPedido.vue"; // @ is an alias to /src

export default {
  components: {
    ConsultaPedido
  }
};
</script>
