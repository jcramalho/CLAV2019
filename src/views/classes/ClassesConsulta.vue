<template>
  <ConsultaClasse :idc="$route.params.idClasse" :savedSearch="savedSearch" />
</template>

<script>
import ConsultaClasse from "@/components/classes/consulta/ConsultaClasse.vue"; // @ is an alias to /src

export default {
  props: {
    savedSearch: {
      type: Object
    }
  },
  components: {
    ConsultaClasse
  }
};
</script>
