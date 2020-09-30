<template>
  <v-expansion-panel popout focusable>
    <!-- CONTEXTO DE IDENTIFICAÇÃO DO PPD -->
    <v-expansion-panel-header class="expansion-panel-heading">
      <div>
        Identificação do plano de preservação digital
        <InfoBox header="Identificação ppd" :text="myhelp.Classe.BlocoDecisoes"  helpColor="white"/>
      </div>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-row>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Número de referência SI</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
          <v-text-field
            :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
            v-model="c.nRef"
            label="Identificador do sistema de informação"
            solo
            clearable
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Nome do SI</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
          <v-text-field
            :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
            v-model="c.identificacao.nomeSI"
            label="Designação oficial do sistema"
            solo
            clearable
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Localização dos dados</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
          <v-text-field
            :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
            v-model="c.identificacao.local"
            label="Indique nome do(s) organismo(s) onde os dados estão armazenados"
            solo
            clearable
          ></v-text-field>
        </v-col>
      </v-row>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
const nanoid = require("nanoid");
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

    };
  }

};
</script>
<style>
.info-label {
  color: #2e7d32;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8f5e9;
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}

.separador {
  color: white;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #1a237e;
  font-size: 14pt;
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
