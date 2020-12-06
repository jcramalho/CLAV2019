<template>
  <v-content
    :class="{
      'px-6': $vuetify.breakpoint.smAndDown,
      'px-12': $vuetify.breakpoint.mdAndUp,
    }"
  >
    <CriaTabSelOrg />
  </v-content>
</template>

<script>
import CriaTabSelOrg from '@/components/tabSel/criacaoTSOrg/CriaTabSelOrg.vue';

export default {
  components: {
    CriaTabSelOrg,
  },
};
</script>
