<template>
  <v-content
    :class="{
      'px-6': $vuetify.breakpoint.smAndDown,
      'px-12': $vuetify.breakpoint.mdAndUp
    }"
  >
    <CriaTip />
  </v-content>
</template>

<script>
import CriaTip from "@/components/tipologias/CriaTipologia.vue";

export default {
  components: {
    CriaTip
  }
};
</script>
