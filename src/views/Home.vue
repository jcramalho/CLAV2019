<template>
  <v-card flat class="pa-3">
    <Info />
    <Noticias :level="level" />
  </v-card>
</template>

<script>
/* eslint-disable */
import Noticias from "@/components/principal/Noticias.vue";
import Info from "@/components/principal/Info.vue";

export default {
  components: {
    Info,
    Noticias,
  },
  data() {
    return {
      panelHeaderColor: "indigo darken-4",
      level: 0,
      entidade: "Nome da Entidade",
    };
  },
  mounted: async function () {
    this.level = this.$userLevel();
  },
};
</script>
