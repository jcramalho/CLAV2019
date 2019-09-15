<template>
  <v-row ma-2>
    <!-- TERMOS DE ÍNDICE -->
    <v-col cols="2">
      <div class="ma-2 info-label">Termos de Índice</div>
      <v-btn
        color="green darken-2"
        dark
        rounded
        @click="insereNovoTI(c.termosInd)"
      >
        Novo termo
        <v-icon dark right>add_circle_outline</v-icon>
      </v-btn>
    </v-col>
    <v-col>
      <v-row v-for="(ti, index) in c.termosInd" :key="index">
        <v-col cols="9">
          <v-textarea
            v-model="ti.termo"
            auto-grow
            solo
            label="Termo de Índice"
            rows="1"
          ></v-textarea>
        </v-col>
        <v-col>
          <v-btn
            color="red darken-2"
            dark
            rounded
            @click="c.termosInd.splice(index, 1)"
          >
            Remover
            <v-icon dark right>clear</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-col>

    <v-snackbar v-model="tiVazioFlag" :color="'warning'" :timeout="60000">
        {{ mensagemTIVazio }}
        <v-btn dark text @click="tiVazioFlag=false">
          Fechar
        </v-btn>
    </v-snackbar>

    <v-snackbar v-model="tiDuplicadoFlag" :color="'error'" :timeout="60000">
        {{ mensagemTIDuplicado }}
        <v-btn dark text @click="tiDuplicadoFlag=false">
          Fechar
        </v-btn>
    </v-snackbar>

  </v-row>
</template>

<script>
const nanoid = require("nanoid");

export default {
  props: ["c"],

  data() {
    return {
      tiVazioFlag: false,
      tiDuplicadoFlag: false,
      mensagemTIVazio: "O Termo de Índice anterior encontra-se vazio. Queira preenchê-lo antes de criar um novo.",
      mensagemTIDuplicado: "O último termo introduzido é um duplicado de outro já introduzido previamente!"
    };
  },

  methods: {
    tiDuplicado: function(termos){
      if(termos.length > 1){
        var lastTermo = termos[termos.length-1].termo
        var duplicados = termos.filter(t => t.termo == lastTermo )
        if(duplicados.length > 1){
          return true
        }
        else return false
      }
      else{
        return false
      }
    },

    insereNovoTI: function(termos) {
      if((termos.length > 0) && (termos[termos.length-1].termo == "")){
        this.tiVazioFlag = true
      }
      else if(this.tiDuplicado(termos)){
        this.tiDuplicadoFlag = true
      }
      else{
        var n = { id: "ti_" + nanoid(), termo: "", existe: false };
        termos.push(n);
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
