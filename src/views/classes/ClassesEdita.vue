<template>
  <EditaClasse :idc="$route.params.idClasse" />
</template>

<script>
import EditaClasse from "@/components/classes/edicao/EditaClasse.vue"; // @ is an alias to /src

export default {
  components: {
    EditaClasse
  }
};
</script>
