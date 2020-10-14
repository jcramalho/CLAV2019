<template>
  <v-expansion-panel popout focusable>
    <!-- CONTEXTO DE IDENTIFICAÇÃO DO PPD -->
    <v-expansion-panel-header class="expansion-panel-heading">
      <div>
        1.	Identificação do sistema de informação (SI)
        <InfoBox header="Identificação SI" helpColor="white"/>
      </div>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-row>
        <!-- sisISLAÇÂO -->
        <SistemaOps
          :sistema="c.sistema"
          @unselectSistema="unselectSistema($event)"
        />
      </v-row>
      <v-row>
        <SistemaInfo
          :c="c"
          :sistema="c.sistema" @newSistema="newSistema($event, c.sistema)"
          :entidades="entidades"
          :entidadesReady="entidadesReady"
        />
      </v-row>
      <v-row>
        <SistemaSelect
          :sistema="sis"
          :sistemaReady="semaforos.sistemaReady"
          @selectSistema="selectSistema($event)"
        />
      </v-row>

      <hr style="border: 3px solid indigo; border-radius: 3 px;" />
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
const nanoid = require("nanoid");
const help = require("@/config/help").help;

import InfoBox from "@/components/generic/infoBox.vue";
import SistemaOps from "@/components/ppd/SistemaOps.vue";
import SistemaInfo from "@/components/ppd/SistemaInfo.vue";
import SistemaSelect from "@/components/ppd/SistemaSelect.vue";

export default {
  props: ["c","semaforos","sis","entidades","entidadesReady"],

  components: {
    InfoBox,
    SistemaOps,
    SistemaInfo,
    SistemaSelect
  },

  data: () => {
    return {
      myhelp: help,

    };
  },
  methods: {
    newSistema: function(sis, lista) {
        lista.push(sis);
    },

    selectSistema: function(sis) {
      this.c.sistema.push(sis);
      // Remove dos selecionáveis
      var index = this.sis.findIndex(l => l.id === sis.id);
      this.sis.splice(index, 1);
    },
    unselectSistema: function(sistema) {
      // Recoloca o sistema nos selecionáveis
      this.sis.push(sistema);
      var index = this.c.sistema.findIndex(e => e.id === sistema.id);
      this.c.sistema.splice(index, 1);
    },

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
