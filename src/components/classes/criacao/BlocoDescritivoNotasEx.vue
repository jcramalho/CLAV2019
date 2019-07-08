<template>
  <v-layout wrap row ma-2>
    <!-- Notas de Exclusão -->
    <v-flex xs2>
      <div class="info-label">Notas de Exclusão</div>
      <v-tooltip top color="info">
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            color="green darken-2"
            dark
            round
            @click="insereNovaNota(c.notasEx, 'ne')"
          >
            Nota Exclusão
            <v-icon dark right>add_circle_outline</v-icon>
          </v-btn>
        </template>
        <span>Nota de exclusão</span>
      </v-tooltip>
    </v-flex>
    <v-flex>
      <v-layout fluid row v-for="(nota, index) in c.notasEx" :key="index">
        <v-flex xs9>
          <v-textarea
            v-model="nota.nota"
            auto-grow
            solo
            label="Nota de Exclusão:"
            rows="1"
          ></v-textarea>
        </v-flex>
        <v-flex>
          <v-btn
            color="red darken-2"
            dark
            round
            @click="c.notasEx.splice(index, 1)"
          >
            Remover
            <v-icon dark right>clear</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-flex>

    <v-snackbar v-model="neVaziaFlag" :color="'warning'" :timeout="60000">
        {{ mensagemNEVazia }}
        <v-btn dark flat @click="neVaziaFlag=false">
          Fechar
        </v-btn>
    </v-snackbar>

    <v-snackbar v-model="neDuplicadaFlag" :color="'error'" :timeout="60000">
        {{ mensagemNEDuplicada }}
        <v-btn dark flat @click="neDuplicadaFlag=false">
          Fechar
        </v-btn>
    </v-snackbar>

  </v-layout>
</template>

<script>
const nanoid = require("nanoid");

export default {
  props: ["c"],

  data() {
    return {
      neVaziaFlag: false,
      neDuplicadaFlag: false,
      mensagemNEVazia: "A nota anterior encontra-se vazia. Queira preenchê-la antes de criar nova.",
      mensagemNEDuplicada: "A última nota introduzida é um duplicado de outra já introduzida previamente!"
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

    insereNovaNota: function(notas, tipo) {
      if((notas.length > 0) && (notas[notas.length-1].nota == "")){
        this.neVaziaFlag = true
      }
      else if(this.notaDuplicada(notas)){
        this.neDuplicadaFlag = true
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
