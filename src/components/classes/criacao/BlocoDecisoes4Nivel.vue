<template>
  <div>
    <v-row class="mx-n4">
      <v-col class="mx-1">
        <v-toolbar
          color="#083581"
          class="caption mt-5"
          dark
          height="45"
          style="border-radius: 6px;"
        >
          <v-toolbar-title
            :class="{
              'mx-auto': $vuetify.breakpoint.smAndDown,
              'mx-0': $vuetify.breakpoint.mdAndUp
            }"
          >
            Decisões de Avaliação
          </v-toolbar-title>
        </v-toolbar>
      </v-col>
    </v-row>

    <DecisaoComSubPCA
      :c="c"
      :semaforos="semaforos"
      :pcaFormasContagem="pcaFormasContagem"
      :pcaSubFormasContagem="pcaSubFormasContagem"
    />

    <DecisaoComSubDF
      :c="c"
      :semaforos="semaforos"
      :pcaFormasContagem="pcaFormasContagem"
      :pcaSubFormasContagem="pcaSubFormasContagem"
    />
  </div>
</template>

<script>
import DecisaoComSubPCA from "@/components/classes/criacao/DecisaoComSubPCA.vue";
import DecisaoComSubDF from "@/components/classes/criacao/DecisaoComSubDF.vue";

export default {
  props: ["c", "semaforos", "pcaFormasContagem", "pcaSubFormasContagem"],

  components: {
    DecisaoComSubPCA,
    DecisaoComSubDF
  }
};
</script>
