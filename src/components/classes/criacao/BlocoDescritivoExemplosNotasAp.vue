<template>
  <v-row>
    <!-- Exemplos de notas de Aplicação -->
    <v-col cols="2">
      <div class="info-label">
        Exemplo(s) de Nota(s) de Aplicação:
        <InfoBox
          header="Exemplo(s) de Nota(s) de Aplicação"
          :text="myhelp.Classe.Campos.ExemplosNotasAp"
        />
      </div>

      <v-tooltip top color="info">
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            color="green darken-2"
            dark
            rounded
            @click="insereNovoExemplo(c.exemplosNotasAp)"
          >
            Exemplo N. A.
            <v-icon dark right>add_circle_outline</v-icon>
          </v-btn>
        </template>
        <span>Exemplo de nota de aplicação</span>
      </v-tooltip>
    </v-col>
    <v-col>
      <v-row v-for="(ex, index) in c.exemplosNotasAp" :key="index">
        <v-col cols="10">
          <v-textarea
            v-model="ex.exemplo"
            auto-grow
            solo
            label="Exemplo de Nota de Aplicação"
            rows="1"
          ></v-textarea>
        </v-col>
        <v-col>
          <v-btn color="red darken-2" dark rounded @click="c.exemplosNotasAp.splice(index, 1)">
            Remover
            <v-icon dark right>remove_circle_outline</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-col>

    <v-snackbar v-model="exemploNotaApVazioFlag" :color="'warning'" :timeout="60000">
      {{ mensagemExemploNotaApVazio }}
      <v-btn dark text @click="exemploNotaApVazioFlag=false">Fechar</v-btn>
    </v-snackbar>

    <v-snackbar v-model="exemploNotaApDuplicadoFlag" :color="'error'" :timeout="60000">
      {{ mensagemExemploNotaApDuplicado }}
      <v-btn dark text @click="exemploNotaApDuplicadoFlag=false">Fechar</v-btn>
    </v-snackbar>
  </v-row>
</template>

<script>
const nanoid = require("nanoid");
const help = require("@/config/help").help;

import InfoBox from "@/components/generic/infoBox.vue";

export default {
  props: ["c"],

  data() {
    return {
      myhelp: help,
      exemploNotaApVazioFlag: false,
      exemploNotaApDuplicadoFlag: false,
      mensagemExemploNotaApVazio:
        "O exemplo anterior encontra-se vazio. Queira preenchê-lo antes de criar novo.",
      mensagemExemploNotaApDuplicado:
        "O último exemplo introduzido é um duplicado de outro já introduzido previamente!"
    };
  },

  components: {
    InfoBox
  },

  methods: {
    exemploDuplicado: function(exemplos) {
      if (exemplos.length > 1) {
        var lastExemplo = exemplos[exemplos.length - 1].exemplo;
        var duplicados = exemplos.filter(e => e.exemplo == lastExemplo);
        if (duplicados.length > 1) {
          return true;
        } else return false;
      } else {
        return false;
      }
    },

    insereNovoExemplo: async function(exemplos) {
      if (exemplos.length > 0 && exemplos[exemplos.length - 1].exemplo == "") {
        this.exemploNotaApVazioFlag = true;
      } else if (this.exemploDuplicado(exemplos)) {
        this.exemploNotaApDuplicadoFlag = true;
      } else {
        var e = { idExemplo: "exna_" + nanoid(), exemplo: "" };
        exemplos.push(e);
      }
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

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
}

.is-collapsed li:nth-child(n + 5) {
  display: none;
}
</style>
