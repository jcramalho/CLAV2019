<template>
  <v-container fluid class="pa-0 ma-0" style="max-width:100%;">
    <v-row>
      <!-- TERMOS DE ÍNDICE -->
      <v-col cols="12" lg="2" style="text-align: center;" class="mb-n6">
        <div class="info-label">
          Termos de Índice
          <InfoBox
            header="Termos de Índice"
            :text="myhelp.Classe.Campos.TermosIndice"
            helpColor="info"
          />
        </div>
        <v-tooltip top color="info" open-delay="600">
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              color="success"
              icon
              @click="insereNovoTI(c.termosInd)"
              class="mb-4"
            >
              <unicon
                name="adicionar-icon"
                width="15"
                height="15"
                viewBox="0 0 20.71 20.71"
                fill="#4caf50"
              />
            </v-btn>
          </template>
          <span>Adicionar novo termo de índice</span>
        </v-tooltip>
      </v-col>
      <v-col cols="12" lg="10">
        <v-row
          v-for="(ti, index) in c.termosInd"
          :key="index"
          class="info-content mx-0 mb-6 px-4 pb-3"
          style="mix-height: 50px;"
        >
          <v-col cols="10" class="mt-n4">
            <v-textarea
              class="mt-0"
              v-model="ti.termo"
              label="Termo de Índice"
              auto-grow
              text
              single-line
              hide-details
              color="blue darken-3"
              rows="1"
            ></v-textarea>
          </v-col>
          <v-col class="mt-n3">
            <v-btn
              icon
              color="red darken-2"
              @click="c.termosInd.splice(index, 1)"
            >
              <unicon
                name="remove-icon"
                width="15"
                height="15"
                viewBox="0 0 20.71 20.697"
                fill="#ff5252"
              />
            </v-btn>
          </v-col>
        </v-row>
      </v-col>

      <v-snackbar v-model="tiVazioFlag" :color="'warning'" :timeout="60000">
        {{ mensagemTIVazio }}
        <v-btn icon color="white" @click="tiVazioFlag = false">
          <unicon
            name="remove-icon"
            width="15"
            height="15"
            viewBox="0 0 20.71 20.697"
            fill="#ffffff"
          />
        </v-btn>
      </v-snackbar>

      <v-snackbar v-model="tiDuplicadoFlag" :color="'error'" :timeout="60000">
        {{ mensagemTIDuplicado }}
        <v-btn icon color="white" @click="tiDuplicadoFlag = false">
          <unicon
            name="remove-icon"
            width="15"
            height="15"
            viewBox="0 0 20.71 20.697"
            fill="#ffffff"
          />
        </v-btn>
      </v-snackbar>
    </v-row>
  </v-container>
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

      tiVazioFlag: false,
      tiDuplicadoFlag: false,
      mensagemTIVazio:
        "O Termo de Índice anterior encontra-se vazio. Queira preenchê-lo antes de criar um novo.",
      mensagemTIDuplicado:
        "O último termo introduzido é um duplicado de outro já introduzido previamente!"
    };
  },

  methods: {
    tiDuplicado: function(termos) {
      if (termos.length > 1) {
        var lastTermo = termos[termos.length - 1].termo;
        var duplicados = termos.filter(t => t.termo == lastTermo);
        if (duplicados.length > 1) {
          return true;
        } else return false;
      } else {
        return false;
      }
    },

    insereNovoTI: function(termos) {
      if (termos.length > 0 && termos[termos.length - 1].termo == "") {
        this.tiVazioFlag = true;
      } else if (this.tiDuplicado(termos)) {
        this.tiDuplicadoFlag = true;
      } else {
        var n = { id: "ti_" + nanoid(), termo: "", existe: false };
        termos.push(n);
      }
    }
  }
};
</script>
<style scoped>
.info-label {
  color: #1a237e !important;
  padding: 8px;
  width: 100%;
  background-color: #dee2f8;
  font-weight: bold;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12) !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 6px;
  text-align: center;
}
.info-content {
  padding: 5px;
  background-color: #f1f6f8 !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}
</style>
