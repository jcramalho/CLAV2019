<template>
  <ConsultaClasse :idc="$route.params.idClasse" />
</template>

<script>
import ConsultaClasse from "@/components/classes/consulta/ConsultaClasse.vue"; // @ is an alias to /src

export default {
  components: {
    ConsultaClasse
  }
};
</script>
