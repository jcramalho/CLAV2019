<template>
  <Campo
    nome="Processo transversal"
    infoHeader="Processo transversal"
    :infoBody="myhelp.Classe.Campos.TermosIndice"
    color="neutralpurple"
  >
    <template v-slot:lateral>
      <v-row>
        <v-col align="right">
          <v-btn
            class="white-text"
            color="success"
            rounded
            @click="insereNovoTI(c.termosInd)"
          >
            Novo termo
            <v-icon right>add_circle_outline</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </template>
    <template v-slot:conteudo>
      <div v-if="c.termosInd.length">
        <v-row v-for="(ti, index) in c.termosInd" :key="index">
          <v-col cols="10">
            <v-textarea
              v-model="ti.termo"
              auto-grow
              solo
              label="Termo de Índice"
              rows="1"
            ></v-textarea>
          </v-col>
          <v-col>
            <v-btn color="error" dark rounded @click="c.termosInd.splice(index, 1)">
              Remover
              <v-icon dark right>remove_circle_outline</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>
      <v-alert v-else border="left" type="warning">Sem Termos de Índice!</v-alert>

      <v-snackbar v-model="tiVazioFlag" :color="'warning'" :timeout="60000">
        {{ mensagemTIVazio }}
        <v-btn dark text @click="tiVazioFlag = false">Fechar</v-btn>
      </v-snackbar>

      <v-snackbar v-model="tiDuplicadoFlag" :color="'error'" :timeout="60000">
        {{ mensagemTIDuplicado }}
        <v-btn dark text @click="tiDuplicadoFlag = false">Fechar</v-btn>
      </v-snackbar>
    </template>
  </Campo>
</template>

<script>
const nanoid = require("nanoid");
const help = require("@/config/help").help;

import Campo from "@/components/generic/CampoCLAV";

export default {
  props: ["c"],

  components: {
    Campo,
  },

  data() {
    return {
      myhelp: help,

      tiVazioFlag: false,
      tiDuplicadoFlag: false,
      mensagemTIVazio:
        "O Termo de Índice anterior encontra-se vazio. Queira preenchê-lo antes de criar um novo.",
      mensagemTIDuplicado:
        "O último termo introduzido é um duplicado de outro já introduzido previamente!",
    };
  },

  methods: {
    tiDuplicado: function (termos) {
      if (termos.length > 1) {
        var lastTermo = termos[termos.length - 1].termo;
        var duplicados = termos.filter((t) => t.termo == lastTermo);
        if (duplicados.length > 1) {
          return true;
        } else return false;
      } else {
        return false;
      }
    },

    insereNovoTI: function (termos) {
      if (termos.length > 0 && termos[termos.length - 1].termo == "") {
        this.tiVazioFlag = true;
      } else if (this.tiDuplicado(termos)) {
        this.tiDuplicadoFlag = true;
      } else {
        var n = { id: "ti_" + nanoid(), termo: "", existe: false };
        termos.push(n);
      }
    },
  },
};
</script>
<style>
.is-collapsed li:nth-child(n + 5) {
  display: none;
}
</style>
