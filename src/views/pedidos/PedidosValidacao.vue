<template>
  <ValidaPedidos :idp="$route.params.idPedido" />
</template>

<script>
import ValidaPedidos from "@/components/pedidos/validacao/ValidaPedidos"; // @ is an alias to /src

export default {
  components: {
    ValidaPedidos
  }
};
</script>
