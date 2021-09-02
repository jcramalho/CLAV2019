<template>
  <v-expansion-panel>
    <v-expansion-panel-header hide-actions class="white--text clav-linear-background">
      <v-row class="ma-0 pa-0" align="center">
        <v-col v-if="icon" cols="1" class="pl-3 ma-0 pa-0" align="center">
          <v-icon color="secondary">
            {{ icon }}
          </v-icon>
        </v-col>
        <v-col v-if="!icon" cols="1" class="pl-3 ma-0 pa-0" align="center">
          <slot name="icon"></slot>
        </v-col>
        <v-col cols="11" justify="center">
          <span class="mr-3 header-text">{{ titulo }}</span>
          <InfoBox :header="infoHeader" :text="infoBody" />
        </v-col>
      </v-row>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <slot name="conteudo"></slot>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import InfoBox from "@/components/generic/infoBox.vue";

export default {
  props: ["titulo", "icon", "infoHeader", "infoBody"],
  components: {
    InfoBox,
  },
};
</script>

<style scoped>
.header-text {
  font-weight: bold;
  font-size: 14pt;
}
</style>
