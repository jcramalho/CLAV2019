<template>
  <v-layout wrap row ma-2>
    <!-- Notas de Aplicação -->
    <v-flex xs2>
      <div class="info-label">
        Notas de Aplicação
        <InfoBox
          header="Notas de Aplicação"
          :text="myhelp.Classe.Campos.NotasAp"
        />
      </div>
      
          <v-btn
            color="green darken-2"
            dark
            round
            @click="insereNovaNota(c.notasAp, 'na')"
          >
            Nota aplicação
            <v-icon dark right>add_circle_outline</v-icon>
          </v-btn>
       
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

    <v-snackbar v-model="naVaziaFlag" :color="'warning'" :timeout="60000">
        {{ mensagemNAVazia }}
        <v-btn dark flat @click="naVaziaFlag=false">
          Fechar
        </v-btn>
    </v-snackbar>

    <v-snackbar v-model="naDuplicadaFlag" :color="'error'" :timeout="60000">
        {{ mensagemNADuplicada }}
        <v-btn dark flat @click="naDuplicadaFlag=false">
          Fechar
        </v-btn>
    </v-snackbar>

  </v-layout>
</template>

<script>
const nanoid = require("nanoid");
const help = require("@/config/help").help;
const lhost = require("@/config/global").host;
const axios = require("axios");

import InfoBox from "@/components/generic/infoBox.vue";

export default {
  props: ["c"],

  components: {
    InfoBox
  },

  data() {
    return {
      myhelp: help,
      naVaziaFlag: false,
      naDuplicadaFlag: false,
      mensagemNAVazia: "A nota anterior encontra-se vazia. Queira preenchê-la antes de criar nova.",
      mensagemNADuplicada: "A última nota introduzida é um duplicado de outra já introduzida previamente!"
    };
  },

  methods: {
    notaDuplicada: function(notas){
      if(notas.length > 1){
        var lastNota = notas[notas.length-1].nota
        var duplicados = notas.filter(n => n.nota == lastNota )
        if(duplicados.length > 1){
          return true
        }
        else return false
      }
      else{
        return false
      }
    },

    insereNovaNota: async function(notas, tipo) {
      if((notas.length > 0) && (notas[notas.length-1].nota == "")){
        this.naVaziaFlag = true
      }
      else if(this.notaDuplicada(notas)){
        this.naDuplicadaFlag = true
      }
      else{
        var n = { id: tipo + "_" + nanoid(), nota: "" }; 
        notas.push(n);
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
