<template>
  <v-layout wrap row ma-2>
    <!-- Notas de Aplicação -->
    <v-flex xs2>
      <div class="info-label">
        Notas de Aplicação
        <InfoBox header="Notas de Aplicação" :text="myhelp.Classe.Campos.NotasAp" />
      </div>
      <v-tooltip top color="info">
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            color="green darken-2"
            dark
            round
            @click="insereNovaNota(c.notasAp, 'na')"
          >
            Nota aplicação
            <v-icon dark right>add_circle_outline</v-icon>
          </v-btn>
        </template>
        <span>Nota de aplicação</span>
      </v-tooltip>
    </v-flex>
    <v-flex>
      <v-layout fluid row v-for="(nota, index) in c.notasAp" :key="index">
        <v-flex xs9>
          <v-textarea
            v-model="nota.nota"
            auto-grow
            solo
            label="Nota de Aplicação:"
            rows="1"
          ></v-textarea>
        </v-flex>
        <v-flex>
          <v-btn
            color="red darken-2"
            dark
            round
            @click="c.notasAp.splice(index, 1)"
          >
            Remover
            <v-icon dark right>clear</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
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

  data () {
      return {
        myhelp: help
      }
  },

  methods: {
    insereNovaNota: function(notas, tipo) {
      var n = { id: tipo + "_" + nanoid(), conteudo: "" };
      notas.push(n);
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
