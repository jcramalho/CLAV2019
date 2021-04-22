<template>
  <!-- BLOCO DESCRITIVO -->
  <PainelCLAV
    titulo="Descritivo da Classe"
    infoHeader="Descritivo da Classe"
    :infoBody="myhelp.Classe.BlocoDescritivo"
  >
    <template v-slot:icon>
      <unicon
        name="descricao-icon"
        width="20"
        height="20"
        viewBox="0 0 20.71 23.668"
        fill="#ffffff"
      />
    </template>
    <template v-slot:conteudo>
      <v-expansion-panel-content>
        <!-- DESCRIÇÂO -->
        <Campo
          nome="Descrição"
          infoHeader="Descrição"
          :infoBody="myhelp.Classe.Campos.Descricao"
        >
          <template v-slot:conteudo>
            <v-text-field
              v-model="c.descricao"
              label="Descrição"
              auto-grow
              dense
              single-line
              hide-details
              clearable
            ></v-text-field>
          </template>
        </Campo>

        <hr style="border-top: 1px dashed #dee2f8" />

        <BlocoDescritivoNotasAp :c="c" />

        <div v-if="c.nivel > 2">
          <hr style="border-top: 1px dashed #dee2f8" />
          <BlocoDescritivoExemplosNotasAp :c="c" />
        </div>

        <hr style="border-top: 1px dashed #dee2f8" />

        <BlocoDescritivoNotasEx :c="c" />

        <div v-if="c.nivel == 3 && !c.temSubclasses4Nivel">
          <hr style="border-top: 1px dashed #dee2f8" />
          <TermosIndiceOps :c="c" />
        </div>
      </v-expansion-panel-content>
    </template>
  </PainelCLAV>
</template>

<script>
const nanoid = require("nanoid");
const help = require("@/config/help").help;

import BlocoDescritivoNotasAp from "@/components/classes/criacao/BlocoDescritivoNotasAp.vue";
import BlocoDescritivoExemplosNotasAp from "@/components/classes/criacao/BlocoDescritivoExemplosNotasAp.vue";
import BlocoDescritivoNotasEx from "@/components/classes/criacao/BlocoDescritivoNotasEx.vue";
import TermosIndiceOps from "@/components/classes/criacao/TermosIndiceOps.vue";
import Campo from "@/components/generic/Campo.vue";
import PainelCLAV from "@/components/generic/PainelCLAV.vue";

export default {
  props: ["c"],

  components: {
    BlocoDescritivoNotasAp,
    BlocoDescritivoExemplosNotasAp,
    BlocoDescritivoNotasEx,
    TermosIndiceOps,
    Campo,
    PainelCLAV,
  },

  data() {
    return {
      myhelp: help,
    };
  },
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
  padding: 5px;
  width: 100%;
  background-color: #f1f6f8 !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}
.separador {
  color: white;
  font-weight: 400;
  padding: 5px;
  margin: 5px;
  width: 100%;
  min-height: 55px;
  background: linear-gradient(to right, #19237e 0%, #0056b6 100%) !important;
  font-size: 14pt;
  font-weight: bold;
  border-radius: 10px 10px 0 0;
}
#expanded-content {
  margin-left: 5px;
  margin-top: -1.1rem;
  border: 1px solid #dee2f8;
  border-radius: 0 0 10px 10px;
  box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.12);
}
.is-collapsed li:nth-child(n + 5) {
  display: none;
}
</style>
