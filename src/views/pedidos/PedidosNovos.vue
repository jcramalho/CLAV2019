<template>
  <ConsultaNovo :idp="$route.params.idPedido" />
</template>

<script>
import ConsultaNovo from "@/components/pedidos/ConsultaNovo"; // @ is an alias to /src

export default {
  components: {
    ConsultaNovo,
  },
};
</script>
