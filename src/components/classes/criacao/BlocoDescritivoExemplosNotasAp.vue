<template>
  <v-container fluid class="pa-0 ma-0" style="max-width:100%;">
    <v-row>
      <!-- Exemplos de notas de Aplicação -->
      <v-col cols="12" lg="2" style="text-align: center;" class="mb-n6">
        <div class="info-label">
          Exemplo(s) de Nota(s) de Aplicação:
          <InfoBox
            header="Exemplo(s) de Nota(s) de Aplicação"
            :text="myhelp.Classe.Campos.ExemplosNotasAp"
            helpColor="info"
          />
        </div>

        <v-tooltip top color="info" open-delay="600">
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              color="success"
              icon
              @click="insereNovoExemplo(c.exemplosNotasAp)"
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
          <span>Adicionar exemplo de nota de aplicação</span>
        </v-tooltip>
      </v-col>
      <v-col cols="12" lg="10">
        <v-row
          v-for="(ex, index) in c.exemplosNotasAp"
          :key="index"
          class="info-content mx-0 mb-6 px-4 pb-3"
          style="min-height: 50px;"
        >
          <v-col cols="10" class="mt-n4">
            <v-textarea
              class="mt-0"
              v-model="ex.exemplo"
              label="Exemplo de Nota de Aplicação"
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
              @click="c.exemplosNotasAp.splice(index, 1)"
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

      <v-snackbar
        v-model="exemploNotaApVazioFlag"
        :color="'warning'"
        :timeout="60000"
      >
        {{ mensagemExemploNotaApVazio }}
        <v-btn icon color="white" @click="exemploNotaApVazioFlag = false">
          <unicon
            name="remove-icon"
            width="15"
            height="15"
            viewBox="0 0 20.71 20.697"
            fill="#ffffff"
          />
        </v-btn>
      </v-snackbar>

      <v-snackbar
        v-model="exemploNotaApDuplicadoFlag"
        :color="'error'"
        :timeout="60000"
      >
        {{ mensagemExemploNotaApDuplicado }}
        <v-btn icon color="white" @click="exemploNotaApDuplicadoFlag = false">
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
