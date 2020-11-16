<template>
  <v-content
    :class="{
      'px-6': $vuetify.breakpoint.smAndDown,
      'px-12': $vuetify.breakpoint.mdAndUp
    }"
  >
    <CriaEnt />
  </v-content>
</template>

<script>
import CriaEnt from "@/components/entidades/CriaEntidade.vue";

export default {
  components: {
    CriaEnt
  }
};
</script>
