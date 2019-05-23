<template>
  <!-- BLOCO DESCRITIVO -->
  <v-expansion-panel-content>
    <template v-slot:header>
      <v-toolbar color="teal darken-4 body-2 font-weight-bold" dark>
        <v-toolbar-title>Descritivo da Classe</v-toolbar-title>
      </v-toolbar>
    </template>
    <v-layout wrap ma-2>
      <!-- DESCRIÇÂO -->
      <v-flex xs2>
        <div class="info-label">Descrição</div>
      </v-flex>
      <v-flex xs9>
        <v-text-field
          v-model="c.descricao"
          label="Descrição"
          solo
          clearable
        ></v-text-field>
      </v-flex>
    </v-layout>

    <hr />
    <BlocoDescritivoNotasAp :c="c" />
    <hr />
    <BlocoDescritivoExemplosNotasAp :c="c" />
    <hr />
    <BlocoDescritivoNotasEx :c="c" />
    <hr />
    <TermosIndiceOps :c="c" v-if="c.nivel == 3 && !c.temSubclasses4Nivel" />
  </v-expansion-panel-content>
</template>

<script>
const nanoid = require("nanoid");

import BlocoDescritivoNotasAp from "@/components/classes/criacao/BlocoDescritivoNotasAp.vue";
import BlocoDescritivoExemplosNotasAp from "@/components/classes/criacao/BlocoDescritivoExemplosNotasAp.vue";
import BlocoDescritivoNotasEx from "@/components/classes/criacao/BlocoDescritivoNotasEx.vue";
import TermosIndiceOps from "@/components/classes/criacao/TermosIndiceOps.vue";

export default {
  props: ["c"],

  components: {
    BlocoDescritivoNotasAp,
    BlocoDescritivoExemplosNotasAp,
    BlocoDescritivoNotasEx,
    TermosIndiceOps
  }
};
</script>

<style>
.info-label {
  color: #00695c;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e0f2f1;
  font-weight: bold;
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
