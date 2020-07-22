<template>
  <v-container fluid class="pa-0 ma-0" style="max-width:100%;">
    <v-row
      :class="{
        'mt-12': $vuetify.breakpoint.smAndDown,
        'mt-6': $vuetify.breakpoint.mdAndUp
      }"
    >
      <v-col cols="12" lg="2">
        <div class="info-label">
          Tipo de Processo
          <InfoBox
            header="Tipo de Processo"
            :text="myhelp.Classe.Campos.TipoProcesso"
            helpColor="info"
          />
        </div>
      </v-col>
      <v-col cols="12" lg="10">
        <div class="info-content pa-4 pb-4">
          <v-radio-group
            v-model="c.tipoProc"
            row
            hide-details
            :class="{
              'px-0': $vuetify.breakpoint.smAndDown,
              'px-3': $vuetify.breakpoint.mdAndUp
            }"
          >
            <v-radio
              v-for="(p, i) in processoTipos"
              :key="i"
              :label="p.label"
              :value="p.value"
              color="blue"
              :class="{
                'mx-auto': $vuetify.breakpoint.smAndDown
              }"
            ></v-radio>
          </v-radio-group>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
const help = require("@/config/help").help;

import InfoBox from "@/components/generic/infoBox.vue";

export default {
  props: ["c"],

  components: {
    InfoBox
  },

  data: () => {
    return {
      myhelp: help,
      processoTipos: [
        { label: "Processo Comum", value: "PC" },
        { label: "Processo Específico", value: "PE" }
      ]
    };
  }
};
</script>
<style scoped>
.info-label {
  color: #1a237e !important;
  padding: 8px;
  width: 100%;
  background-color: #dee2f8;
  font-weight: bold;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12) !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 6px;
  text-align: center;
}
.info-content {
  padding: 8px;
  background-color: #f1f6f8 !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}
</style>
