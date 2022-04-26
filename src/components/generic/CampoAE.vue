<template>
  <v-row>
    <v-col cols="12" sm="6" md="5">
      <v-card class="pa-4 mb-2" :color="color">
        <v-row class="pa-0 ma-0" justify="center">
          <span class="clav-info-label">{{ nome }}</span>
        </v-row>
      </v-card>
      <slot name="lateral"></slot>
    </v-col>
    <v-col cols="12" sm="6" md="7">
      <v-card color="secondary" class="pa-4">
        <slot name="conteudo"></slot>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  props: ["color", "nome"],
};
</script>
<style></style>
