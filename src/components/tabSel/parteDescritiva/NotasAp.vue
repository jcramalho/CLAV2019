<template>
  <v-row class="ma-1" :key="componentKey">
    <v-col cols="3">
      <div class="info-label">
        Notas de Aplicação (NA):
        <InfoBox
          header="Notas de Aplicação"
          :text="myhelp.Classe.Campos.NotasAp"
        />
      </div>
      <hr style="border-top: 0px"/>
      <v-btn
        color="primary"
        dark
        rounded
        @click="insereNovaNota(lista.notasAp)"
      >
        Nova Nota
        <v-icon dark right>add_circle_outline</v-icon>
      </v-btn>
    </v-col>
    <v-col>
      <v-row fluid v-for="(nota, index) in lista.notasAp" :key="index">
          <v-textarea v-model="nota.nota" auto-grow solo rows="1"> </v-textarea>
          <v-btn
            class="ma-1"
            color="red darken-2"
            dark
            rounded
            @click="
              lista.notasAp.splice(index, 1);
              forceRerender();
            "
          >
            <v-icon dark>clear</v-icon>
          </v-btn>
      </v-row>
    </v-col>

    <v-snackbar v-model="naVaziaFlag" :color="'warning'" :timeout="60000">
      {{
        "A nota anterior encontra-se vazia. Por favor preencha antes de criar uma nova."
      }}
      <v-btn dark text @click="naVaziaFlag = false">
        Fechar
      </v-btn>
    </v-snackbar>

    <v-snackbar v-model="naDuplicadaFlag" :color="'error'" :timeout="60000">
      {{
        "A última nota introduzida é um duplicado de outra já introduzida previamente!"
      }}
      <v-btn dark text @click="naDuplicadaFlag = false">
        Fechar
      </v-btn>
    </v-snackbar>
  </v-row>
</template>

<script>
const nanoid = require("nanoid");

import InfoBox from "@/components/generic/infoBox.vue";
const help = require("@/config/help").help;

export default {
  props: ["lista"],

  components: {
    InfoBox
  },

  data() {
    return {
      myhelp: help,
      naVaziaFlag: false,
      naDuplicadaFlag: false,
      componentKey: 0
    };
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
        this.naVaziaFlag = true;
      } else if (this.notaDuplicada(notas)) {
        this.naDuplicadaFlag = true;
      } else {
        var n = { idNota: "na" + "_" + nanoid(), nota: "" };
        notas.unshift(n);
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
  color: #1a237e;
  padding: 4px;
  font-weight: 400;
  width: 90%;
  background-color: #dee2f8;
  font-weight: bold;
}
</style>
