<template>
  <Exportacao />
</template>

<script>
import Exportacao from "@/components/exportacao/Exportacao.vue"; // @ is an alias to /src
export default {
  data: () => ({
    idRel: "",
    idInv: ""
  }),
  components: {
    Exportacao
  }
};
</script>
