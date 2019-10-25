<template>
  <v-row class="ma-1" :key="componentKey">
    <v-col cols="3">
      <div class="info-label">
        Termos de Índice
      </div>
      <hr style="border-top: 0px"/>
      <v-btn
        color="primary"
        dark
        rounded
        @click="insereNovoTI(lista.termosInd)"
      >
        Novo termo
        <v-icon dark right>add_circle_outline</v-icon>
      </v-btn>
    </v-col>
    <v-col>
      <v-row fluid v-for="(ti, index) in lista.termosInd" :key="index">
        <v-textarea v-model="ti.termo" auto-grow solo rows="1"></v-textarea>
        <v-btn
          class="ma-1"
          color="red darken-2"
          dark
          rounded
          @click="
            lista.termosInd.splice(index, 1);
            forceRerender();
          "
        >
          <v-icon dark>clear</v-icon>
        </v-btn>
      </v-row>
    </v-col>

    <v-snackbar v-model="tiVazioFlag" :color="'warning'" :timeout="60000">
      {{
        "O Termo de Índice anterior encontra-se vazio. Por favor preencha antes de criar um novo."
      }}
      <v-btn dark text @click="tiVazioFlag = false">
        Fechar
      </v-btn>
    </v-snackbar>

    <v-snackbar v-model="tiDuplicadoFlag" :color="'error'" :timeout="60000">
      {{
        "O último termo introduzido é um duplicado de outro já introduzido previamente!"
      }}
      <v-btn dark text @click="tiDuplicadoFlag = false">
        Fechar
      </v-btn>
    </v-snackbar>
  </v-row>
</template>

<script>
const nanoid = require("nanoid");

export default {
  props: ["lista"],

  data() {
    return {
      tiVazioFlag: false,
      tiDuplicadoFlag: false,
      componentKey: 0
    };
  },

  methods: {
    tiDuplicado: function(termos) {
      if (termos.length > 1) {
        var lastTermo = termos[0].termo;
        var duplicados = termos.filter(t => t.termo == lastTermo);
        if (duplicados.length > 1) {
          return true;
        } else return false;
      } else {
        return false;
      }
    },

    insereNovoTI: function(termos) {
      if (termos.length > 0 && termos[0].termo == "") {
        this.tiVazioFlag = true;
      } else if (this.tiDuplicado(termos)) {
        this.tiDuplicadoFlag = true;
      } else {
        var n = { idTi: "ti_" + nanoid(), termo: "", existe: false };
        termos.unshift(n);
        this.forceRerender();
      }
    },
    forceRerender: function() {
      this.componentKey += 1;
    }
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
</style>
