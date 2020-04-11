<template>
  <ConsultaPendente :idp="$route.params.idPendente" />
</template>

<script>
import ConsultaPendente from "@/components/pendentes/ConsultaPendente.vue"; // @ is an alias to /src

export default {
  components: {
    ConsultaPendente
  }
};
</script>
