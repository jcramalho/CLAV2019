<template>
  <v-content
    :class="{
      'px-6': $vuetify.breakpoint.smAndDown,
      'px-12': $vuetify.breakpoint.mdAndUp,
    }"
  >
    <CriaTabSel />
  </v-content>
</template>

<script>
import CriaTabSel from '@/components/tabSel/CriaTabSelTipo.vue';

export default {
  components: {
    CriaTabSel,
  },
};
</script>
