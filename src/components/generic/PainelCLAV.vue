<template>
  <v-expansion-panel class="ma-2">
    <v-expansion-panel-header
      style="outline: none"
      class="white--text header-text clav-linear-background"
    >
      {{ titulo }}
    </v-expansion-panel-header>
    <v-expansion-panel-content class="pa-5">
      <slot name="conteudo"></slot>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
export default {
  props: ["titulo"],
};
</script>

<style scoped>
.header-text {
  font-weight: bold;
}
</style>
