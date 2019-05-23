<template>
  <div>
    <v-layout>
      <v-toolbar color="teal darken-4 body-2 font-weight-bold" dark height="30">
        <v-toolbar-title>Decisões de Avaliação</v-toolbar-title>
      </v-toolbar>
    </v-layout>

    <DecisaoComSubPCA
      :c="c"
      :semaforos="semaforos"
      :pcaFormasContagem="pcaFormasContagem"
      :pcaSubFormasContagem="pcaSubFormasContagem"
    />

    <hr style="border-top: 2px dashed green;" />

    <DecisaoSemSubDF
      :c="c"
      :semaforos="semaforos"
      :pcaFormasContagem="pcaFormasContagem"
      :pcaSubFormasContagem="pcaSubFormasContagem"
    />
  </div>
</template>

<script>
import DecisaoComSubPCA from "@/components/classes/criacao/DecisaoComSubPCA.vue";
import DecisaoSemSubDF from "@/components/classes/criacao/DecisaoSemSubDF.vue";

export default {
  props: ["c", "semaforos", "pcaFormasContagem", "pcaSubFormasContagem"],

  components: {
    DecisaoComSubPCA,
    DecisaoSemSubDF
  }
};
</script>
