<template>
  <v-card>
    <v-card-title class="clav-content-title-1">Decisões de Avaliação</v-card-title>
    <v-card-text>
      <DecisaoComSubPCA
        :c="c"
        :semaforos="semaforos"
        :pcaFormasContagem="pcaFormasContagem"
        :pcaSubFormasContagem="pcaSubFormasContagem"
      />

      <hr style="border-top: 2px dashed #1a237e" />

      <DecisaoComSubDF
        :c="c"
        :semaforos="semaforos"
        :pcaFormasContagem="pcaFormasContagem"
        :pcaSubFormasContagem="pcaSubFormasContagem"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import DecisaoComSubPCA from "@/components/classes/criacao/DecisaoComSubPCA.vue";
import DecisaoComSubDF from "@/components/classes/criacao/DecisaoComSubDF.vue";

export default {
  props: ["c", "semaforos", "pcaFormasContagem", "pcaSubFormasContagem"],

  components: {
    DecisaoComSubPCA,
    DecisaoComSubDF,
  },
};
</script>
