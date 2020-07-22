<template>
  <v-container fluid class="pa-0 ma-0" style="max-width:100%;">
    <v-row>
      <!-- Notas de Exclusão -->
      <v-col cols="12" lg="2" style="text-align: center;" class="mb-n6">
        <div class="info-label">
          Notas de Exclusão
          <InfoBox
            header="Notas de Exclusão"
            :text="myhelp.Classe.Campos.NotasEx"
            helpColor="info"
          />
        </div>
        <v-tooltip top color="info" open-delay="600">
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              color="success"
              icon
              @click="insereNovaNota(c.notasEx, 'ne')"
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
          <span>Adicionar nota de exclusão</span>
        </v-tooltip>
      </v-col>
      <v-col cols="12" lg="10">
        <v-row
          v-for="(nota, index) in c.notasEx"
          :key="index"
          class="info-content mx-0 mb-6 px-4 pb-3"
          style="min-height: 50px;"
        >
          <v-col cols="10" class="mt-n4">
            <v-textarea
              class="mt-0"
              v-model="nota.nota"
              label="Nota de Exclusão"
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
              @click="c.notasEx.splice(index, 1)"
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
      <v-snackbar v-model="neVaziaFlag" :color="'warning'" :timeout="60000">
        {{ mensagemNEVazia }}
        <v-btn icon color="white" @click="neVaziaFlag = false">
          <unicon
            name="remove-icon"
            width="15"
            height="15"
            viewBox="0 0 20.71 20.697"
            fill="#ffffff"
          />
        </v-btn>
      </v-snackbar>

      <v-snackbar v-model="neDuplicadaFlag" :color="'error'" :timeout="60000">
        {{ mensagemNEDuplicada }}
        <v-btn icon color="white" @click="neDuplicadaFlag = false">
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
