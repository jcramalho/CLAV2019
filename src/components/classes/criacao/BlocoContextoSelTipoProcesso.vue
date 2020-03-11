<template>
  <v-row>
    <v-col cols="2">
      <div class="info-label">
        Tipo de Processo
        <InfoBox
          header="Tipo de Processo"
          :text="myhelp.Classe.Campos.TipoProcesso"
        />
      </div>
    </v-col>
    <v-col>
      <v-radio-group v-model="c.tipoProc" row>
        <v-radio
          v-for="(p, i) in processoTipos"
          :key="i"
          :label="p.label"
          :value="p.value"
          color="indigo darken-3"
        ></v-radio>
      </v-radio-group>
    </v-col>
  </v-row>
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
<style>
.info-label {
  color: #2e7d32; /* green darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8f5e9; /* green lighten-5 */
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
}

.is-collapsed li:nth-child(n + 5) {
  display: none;
}
</style>
