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
          color="neutralpurple"
        >
          <template v-slot:conteudo>
            <v-textarea
              v-model="c.descricao"
              label="Descrição"
              auto-grow
              dense
              rows="1"
              hide-details
              clearable
            ></v-textarea>
          </template>
        </Campo>

        <ListaDeNotasCLAV nome="Notas de Aplicação" :objeto="c"></ListaDeNotasCLAV>
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
import ListaDeNotasCLAV from "@/components/generic/ListaDeNotasCLAV.vue";

export default {
  props: ["c"],

  components: {
    BlocoDescritivoNotasAp,
    BlocoDescritivoExemplosNotasAp,
    BlocoDescritivoNotasEx,
    TermosIndiceOps,
    Campo,
    PainelCLAV,
    ListaDeNotasCLAV,
  },

  data() {
    return {
      myhelp: help,
    };
  },
};
</script>

<style scoped></style>
