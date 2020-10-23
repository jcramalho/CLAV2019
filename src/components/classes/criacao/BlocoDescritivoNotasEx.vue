<template>
  <v-row>
    <!-- Notas de Exclusão -->
    <v-col cols="2">
      <div class="info-label">
        Notas de Exclusão
        <InfoBox
          header="Notas de Exclusão"
          :text="myhelp.Classe.Campos.NotasEx"
          helpColor="indigo darken-4"
        />
      </div>

      <v-btn color="indigo darken-2" dark rounded @click="insereNovaNota(c.notasEx, 'ne')">
        Nota de exclusão
        <v-icon dark right>add_circle_outline</v-icon>
      </v-btn>
    </v-col>
    <v-col>
      <v-row v-for="(nota, index) in c.notasEx" :key="index">
        <v-col cols="10">
          <v-textarea v-model="nota.nota" auto-grow solo label="Nota de Exclusão" rows="1"></v-textarea>
        </v-col>
        <v-col>
          <v-btn color="red darken-2" dark rounded @click="c.notasEx.splice(index, 1)">
            Remover
            <v-icon dark right>remove_circle_outline</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-col>

    <v-snackbar v-model="neVaziaFlag" :color="'warning'" :timeout="60000">
      {{ mensagemNEVazia }}
      <v-btn dark text @click="neVaziaFlag=false">Fechar</v-btn>
    </v-snackbar>

    <v-snackbar v-model="neDuplicadaFlag" :color="'error'" :timeout="60000">
      {{ mensagemNEDuplicada }}
      <v-btn dark text @click="neDuplicadaFlag=false">Fechar</v-btn>
    </v-snackbar>
  </v-row>
</template>

<script>
const nanoid = require("nanoid");
const help = require("@/config/help").help;

import InfoBox from "@/components/generic/infoBox.vue";

export default {
  props: ["c"],

  components: {
    InfoBox
  },

  data() {
    return {
      myhelp: help,
      neVaziaFlag: false,
      neDuplicadaFlag: false,
      mensagemNEVazia:
        "A nota anterior encontra-se vazia. Queira preenchê-la antes de criar nova.",
      mensagemNEDuplicada:
        "A última nota introduzida é um duplicado de outra já introduzida previamente!"
    };
  },

  methods: {
    notaDuplicada: function(notas) {
      if (notas.length > 1) {
        var lastNota = notas[notas.length - 1].nota;
        var duplicados = notas.filter(n => n.nota == lastNota);
        if (duplicados.length > 1) {
          return true;
        } else return false;
      } else {
        return false;
      }
    },

    insereNovaNota: function(notas, tipo) {
      if (notas.length > 0 && notas[notas.length - 1].nota == "") {
        this.neVaziaFlag = true;
      } else if (this.notaDuplicada(notas)) {
        this.neDuplicadaFlag = true;
      } else {
        var n = { id: tipo + "_" + nanoid(), nota: "" };
        notas.push(n);
      }
    }
  }
};
</script>
<style>
.info-label {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
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
