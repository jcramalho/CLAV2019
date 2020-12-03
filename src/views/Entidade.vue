<template>
  <v-main>
    <v-row>
      <v-col cols=12>
        <Info v-if="this.$store.state.name === ''"/>
        <Noticias :level="level" />
        <DocumentacaoApoio />
      </v-col>
    </v-row>
  </v-main>
</template>

<script>
/* eslint-disable */
import Noticias from "@/components/principal/Noticias.vue";
import Info from "@/components/principal/Info.vue";
import DocumentacaoApoio from "@/components/principal/DocumentacaoApoio.vue";

export default {
  components: {
    Info,
    DocumentacaoApoio,
    Noticias
  },
  data() {
    return {
      panelHeaderColor: "indigo darken-4",
      level: 0,
      entidade: "Nome da Entidade"
    };
  },
  mounted: async function() {
    this.level = this.$userLevel();
  }
};
</script>
