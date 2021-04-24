<template>
  <div style="width: 100%;">
    <RADAEntry label="Descrição" :value="classe.descricao" />
    <RADAEntry v-if="!!classe.eFilhoDe" label="Classe pai" :value="classe.eFilhoDe" />
    <RADAEntry v-if="classe.tipo" label="Nível" :value="!!classe.tipo ? classe.tipo : 'N1'" />
  </div>
</template>

<script>
import RADAEntry from "@/components/rada/consulta/elementos/campos/RadaEntry.vue";

export default {
  props: ["classe"],
  components: {
    RADAEntry
  }
};
</script>