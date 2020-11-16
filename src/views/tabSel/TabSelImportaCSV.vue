<template>
  <v-content
    :class="{
      'px-6': $vuetify.breakpoint.smAndDown,
      'px-12': $vuetify.breakpoint.mdAndUp,
    }"
  >
    <ImportaCSV />
  </v-content>
</template>

<script>
import ImportaCSV from '@/components/tabSel/importarTS/ImportaTSCSV.vue';

export default {
  components: {
    ImportaCSV,
  },
};
</script>
