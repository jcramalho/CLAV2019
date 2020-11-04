<template>
  <v-content
    :class="{
      'px-6': $vuetify.breakpoint.smAndDown,
      'px-12': $vuetify.breakpoint.mdAndUp,
    }"
  >
    <CriaTabSelPluri />
  </v-content>
</template>

<script>
import CriaTabSelPluri from '@/components/tabSel/criacaoTSPluri/CriaTabSelPluri.vue';

export default {
  components: {
    CriaTabSelPluri,
  },
};
</script>
