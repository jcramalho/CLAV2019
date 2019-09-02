<template>
  <v-layout wrap row ma-2 :key="componentKey">
    <v-flex xs3>
      <div class="info-label">
          Notas de Exclusão
      </div>
        <v-btn
            color="primary"
            dark
            round
            @click="insereNovaNota(lista.notasEx)"
            >
            Nova Nota
            <v-icon dark right>add_circle_outline</v-icon>
        </v-btn>
    </v-flex>
    <v-flex>
      <v-layout fluid row v-for="(nota, index) in lista.notasEx" :key="index">
        <v-flex xs10>
          <v-textarea
            v-model="nota.nota"
            auto-grow
            solo
            rows="2"
          ></v-textarea>
        </v-flex>
        <v-flex>
          <v-btn
            color="red darken-2"
            dark
            round
            @click="lista.notasEx.splice(index, 1); forceRerender()"
          >
            <v-icon dark>clear</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-flex>

    <v-snackbar v-model="neVaziaFlag" :color="'warning'" :timeout="60000">
        {{ "A nota anterior encontra-se vazia. Por favor preencha antes de criar nova." }}
        <v-btn dark flat @click="neVaziaFlag=false">
          Fechar
        </v-btn>
    </v-snackbar>

    <v-snackbar v-model="neDuplicadaFlag" :color="'error'" :timeout="60000">
        {{ "A última nota introduzida é um duplicado de outra já introduzida previamente!" }}
        <v-btn dark flat @click="neDuplicadaFlag=false">
          Fechar
        </v-btn>
    </v-snackbar>

  </v-layout>
</template>

<script>
const nanoid = require("nanoid");

export default {
  props: ["lista"],

  data() {
    return {
      neVaziaFlag: false,
      neDuplicadaFlag: false,
      componentKey: 0,
    };
  },


  methods: {

    notaDuplicada: function(notas){
      if(notas.length > 1){
        var lastNota = notas[0].nota
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

    insereNovaNota: function(notas) {
      if((notas.length > 0) && (notas[0].nota == "")){
        this.neVaziaFlag = true
      }
      else if(this.notaDuplicada(notas)){
        this.neDuplicadaFlag = true
      }
      else{
        var n = { id: 'ne' + "_" + nanoid(), nota: "" }; 
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
  color: #00695c;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e0f2f1;
  font-weight: bold;
}

</style>
