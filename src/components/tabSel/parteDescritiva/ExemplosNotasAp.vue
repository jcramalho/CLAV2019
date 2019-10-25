<template>
  <v-row class="ma-1" :key="componentKey">
    <v-col cols="3">
      <div class="info-label">
        Exemplo(s) de NA:
        <InfoBox
          header="Exemplo(s) de Nota(s) de Aplicação"
          :text="myhelp.Classe.Campos.ExemplosNotasAp"
        />
      </div>
      <hr style="border-top: 0px"/>
      <v-btn
        color="primary"
        dark
        rounded
        @click="insereNovoExemplo(lista.exemplosNotasAp)"
      >
        Novo Exemplo
        <v-icon dark right>add_circle_outline</v-icon>
      </v-btn>
    </v-col>
    <v-col>
      <v-row
        fluid
        v-for="(ex, index) in lista.exemplosNotasAp"
        :key="index"
      >
        <v-textarea v-model="ex.exemplo" auto-grow solo rows="1"></v-textarea>
        <v-btn
          class="ma-1"
          color="red darken-2"
          dark
          rounded
          @click="
            lista.exemplosNotasAp.splice(index, 1);
            forceRerender();
          "
        >
          <v-icon dark>clear</v-icon>
        </v-btn>
      </v-row>
    </v-col>

    <v-snackbar
      v-model="exemploNotaApVazioFlag"
      :color="'warning'"
      :timeout="60000"
    >
      {{
        "O exemplo anterior encontra-se vazio. Por favor preencha antes de criar novo."
      }}
      <v-btn dark text @click="exemploNotaApVazioFlag = false">
        Fechar
      </v-btn>
    </v-snackbar>

    <v-snackbar
      v-model="exemploNotaApDuplicadoFlag"
      :color="'error'"
      :timeout="60000"
    >
      {{
        "O último exemplo introduzido é um duplicado de outro já introduzido previamente!"
      }}
      <v-btn dark text @click="exemploNotaApDuplicadoFlag = false">
        Fechar
      </v-btn>
    </v-snackbar>
  </v-row>
</template>

<script>
const nanoid = require("nanoid");
const help = require("@/config/help").help;

import InfoBox from "@/components/generic/infoBox.vue";

export default {
  props: ["lista"],

  components: {
    InfoBox
  },

  data() {
    return {
      myhelp: help,
      exemploNotaApVazioFlag: false,
      exemploNotaApDuplicadoFlag: false,
      componentKey: 0
    };
  },

  methods: {
    exemploDuplicado: function(exemplos) {
      if (exemplos.length > 1) {
        var lastExemplo = exemplos[0].exemplo;
        var duplicados = exemplos.filter(e => e.exemplo == lastExemplo);
        if (duplicados.length > 1) {
          return true;
        } else return false;
      } else {
        return false;
      }
    },
    insereNovoExemplo: async function(exemplos) {
      if (exemplos.length > 0 && exemplos[0].exemplo == "") {
        this.exemploNotaApVazioFlag = true;
      } else if (this.exemploDuplicado(exemplos)) {
        this.exemploNotaApDuplicadoFlag = true;
      } else {
        var e = { idExemplo: "exna_" + nanoid(), exemplo: "" };
        exemplos.unshift(e);
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
