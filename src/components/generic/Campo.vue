<template>
  <v-row>
    <v-col cols="12" sm="4">
      <span>{{ nome }}</span>
      <InfoBox :header="infoHeader" :text="infoBody" />
    </v-col>
    <v-col cols="12" sm="8">
      <slot name="conteudo"></slot>
    </v-col>
  </v-row>
</template>
<script>
import InfoBox from "@/components/generic/infoBox.vue";
export default {
  props: ["color", "nome", "infoHeader", "infoBody"],
  components: {
    InfoBox,
  },
};
</script>
<style></style>
