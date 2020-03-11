<template>
  <!-- BLOCO DESCRITIVO -->
  <v-expansion-panel popout focusable>
    <v-expansion-panel-header>
      <div class="separador">
        Descritivo da Classe
        <InfoBox
          header="Descritivo da Classe"
          :text="myhelp.Classe.BlocoDescritivo"
          helpColor="white"
        />
      </div>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-row>
        <!-- DESCRIÇÂO -->
        <v-col cols="2">
          <div class="info-label">
            Descrição
            <InfoBox
              header="Descrição"
              :text="myhelp.Classe.Campos.Descricao"
              helpColor="indigo darken-4"
            />
          </div>
        </v-col>
        <v-col>
          <v-text-field
            v-model="c.descricao"
            label="Descrição"
            solo
            clearable
          ></v-text-field>
        </v-col>
      </v-row>

      <hr style="border-top: 1px dashed #dee2f8;" />

      <BlocoDescritivoNotasAp :c="c" />

      <hr style="border-top: 1px dashed #dee2f8;" />

      <BlocoDescritivoExemplosNotasAp v-if="c.nivel > 2" :c="c" />

      <hr style="border-top: 1px dashed #dee2f8;" />

      <BlocoDescritivoNotasEx :c="c" />

      <hr style="border-top: 1px dashed #dee2f8;" />

      <TermosIndiceOps :c="c" v-if="c.nivel == 3 && !c.temSubclasses4Nivel" />
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
const nanoid = require("nanoid");
const help = require("@/config/help").help;

import BlocoDescritivoNotasAp from "@/components/classes/criacao/BlocoDescritivoNotasAp.vue";
import BlocoDescritivoExemplosNotasAp from "@/components/classes/criacao/BlocoDescritivoExemplosNotasAp.vue";
import BlocoDescritivoNotasEx from "@/components/classes/criacao/BlocoDescritivoNotasEx.vue";
import TermosIndiceOps from "@/components/classes/criacao/TermosIndiceOps.vue";
import InfoBox from "@/components/generic/infoBox.vue";

export default {
  props: ["c"],

  components: {
    BlocoDescritivoNotasAp,
    BlocoDescritivoExemplosNotasAp,
    BlocoDescritivoNotasEx,
    TermosIndiceOps,
    InfoBox
  },

  data() {
    return {
      myhelp: help
    };
  }
};
</script>

<style>
.info-label {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
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

.expansion-panel-heading {
  background-color: #283593 !important;
  color: #fff;
  font-size: large;
  font-weight: bold;
}

.is-collapsed li:nth-child(n + 5) {
  display: none;
}
</style>
