<template>
  <v-row class="ma-1" :key="componentKey">
    <v-col cols="3">
      <div class="info-label">
        Notas de Exclusão (NE):
      </div>
      <hr style="border-top: 0px" />
      <v-btn
        color="primary"
        dark
        rounded
        @click="insereNovaNota(lista.notasEx)"
      >
        Nova Nota
        <v-icon dark right>add_circle_outline</v-icon>
      </v-btn>
    </v-col>
    <v-col>
      <v-row fluid v-for="(nota, index) in lista.notasEx" :key="index">
        <v-textarea
          v-model="nota.nota"
          v-if="nota.backgroundColor == 'transparent'"
          auto-grow
          solo
          rows="1"
          readonly
          :backgroundColor="nota.backgroundColor"
        >
        </v-textarea>
        <v-textarea
          v-model="nota.nota"
          v-else
          auto-grow
          solo
          rows="1"
          :backgroundColor="nota.backgroundColor"
        >
        </v-textarea>
        <v-btn
          class="ma-1"
          color="primary"
          dark
          fab
          small
          @click="
            forceRerenderEdit(nota.backgroundColor);
            nota.backgroundColor = 'blue lighten-3';
          "
        >
          <v-icon dark>edit</v-icon>
        </v-btn>
        <v-btn
          class="ma-1"
          color="red darken-2"
          dark
          fab
          small
          @click="
            lista.notasEx.splice(index, 1);
            forceRerender();
          "
        >
          <v-icon dark>clear</v-icon>
        </v-btn>
      </v-row>
    </v-col>

    <v-snackbar v-model="neVaziaFlag" :color="'warning'" :timeout="60000">
      {{
        "A nota anterior encontra-se vazia. Por favor preencha antes de criar nova."
      }}
      <v-btn dark text @click="neVaziaFlag = false">
        Fechar
      </v-btn>
    </v-snackbar>

    <v-snackbar v-model="neDuplicadaFlag" :color="'error'" :timeout="60000">
      {{
        "A última nota introduzida é um duplicado de outra já introduzida previamente!"
      }}
      <v-btn dark text @click="neDuplicadaFlag = false">
        Fechar
      </v-btn>
    </v-snackbar>
  </v-row>
</template>

<script>
const nanoid = require("nanoid");

export default {
  props: ["lista", "compKeyNE"],

  data() {
    return {
      neVaziaFlag: false,
      neDuplicadaFlag: false,
      componentKey: 0
    };
  },

  watch: {
    compKeyNE: function() {
      this.componentKey += 1;
    }
  },

  methods: {
    notaDuplicada: function(notas) {
      if (notas.length > 1) {
        var lastNota = notas[0].nota;
        var duplicados = notas.filter(n => n.nota == lastNota);
        if (duplicados.length > 1) {
          return true;
        } else return false;
      } else {
        return false;
      }
    },

    insereNovaNota: function(notas) {
      if (notas.length > 0 && notas[0].nota == "") {
        this.neVaziaFlag = true;
      } else if (this.notaDuplicada(notas)) {
        this.neDuplicadaFlag = true;
      } else {
        var n = { id: "ne" + "_" + nanoid(), nota: "" };
        notas.unshift(n);
        this.forceRerender();
      }
    },
    forceRerender: function() {
      this.componentKey += 1;
    },
    forceRerenderEdit: async function(color) {
      if (color == "transparent") {
        this.componentKey += 1;
      }
    }
  },
  created: function() {
    this.componentKey += 1;
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
