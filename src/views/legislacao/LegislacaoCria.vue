<template>
  <v-content
    :class="{
      'px-6': $vuetify.breakpoint.smAndDown,
      'px-12': $vuetify.breakpoint.mdAndUp
    }"
  >
    <CriaLeg />
  </v-content>
</template>

<script>
import CriaLeg from "@/components/legislacao/CriaLegislacao.vue";

export default {
  components: {
    CriaLeg
  }
};
</script>
