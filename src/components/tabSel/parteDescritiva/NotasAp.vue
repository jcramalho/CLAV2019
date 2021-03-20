<template>
  <v-row>
    <!-- Notas de Aplicação -->
    <v-col cols="2">
      <div class="info-label">
        Notas de Aplicação
        <InfoBox
          header="Notas de Aplicação"
          :text="myhelp.Classe.Campos.NotasAp"
          helpColor="indigo darken-4"
        />
      </div>

      <v-btn
        color="indigo darken-2"
        dark
        rounded
        @click="insereNovaNota(notas, 'na')"
      >
        Nota de aplicação
        <v-icon dark right>add_circle_outline</v-icon>
      </v-btn>
    </v-col>
    <v-col>
      <v-row v-for="(nota, index) in notas" :key="index">
        <v-col cols="10">
          <v-textarea
            v-model="nota.nota"
            auto-grow
            solo
            label="Nota de Aplicação"
            rows="1"
          ></v-textarea>
        </v-col>
        <v-col>
          <v-btn
            color="red darken-2"
            dark
            rounded
            @click="notas.splice(index, 1)"
          >
            Remover
            <v-icon dark right>remove_circle_outline</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-col>

    <v-snackbar v-model="naVaziaFlag" :color="'warning'" :timeout="60000">
      {{ mensagemNAVazia }}
      <v-btn dark text @click="naVaziaFlag = false">Fechar</v-btn>
    </v-snackbar>

    <v-snackbar v-model="naDuplicadaFlag" :color="'error'" :timeout="60000">
      {{ mensagemNADuplicada }}
      <v-btn dark text @click="naDuplicadaFlag = false">Fechar</v-btn>
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
      notas: JSON.parse(JSON.stringify(this.c.notasAp)),
      myhelp: help,
      naVaziaFlag: false,
      naDuplicadaFlag: false,
      mensagemNAVazia:
        "A nota anterior encontra-se vazia. Queira preenchê-la antes de criar nova.",
      mensagemNADuplicada:
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

    insereNovaNota: async function(notas, tipo) {
      if (notas.length > 0 && notas[notas.length - 1].nota == "") {
        this.naVaziaFlag = true;
      } else if (this.notaDuplicada(notas)) {
        this.naDuplicadaFlag = true;
      } else {
        var n = { id: tipo + "_" + nanoid(), nota: "" };
        notas.push(n);
      }
      this.$emit("notasAp", notas);
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
