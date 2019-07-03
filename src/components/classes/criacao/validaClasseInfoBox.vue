<template>
  <!-- Infobox com os resultados da VALIDAÇÂO -->
      <v-btn dark round color="green darken-4" @click="validarClasse">Validar classe
      <v-dialog v-model="dialog" width="80%" >
        <v-card>
          <v-card-title class="headline">Validação da informação introduzida</v-card-title>
          <v-card-text>
            <v-layout row wrap ma-2>
              <v-flex xs2>
                <div class="info-label">Título</div>
              </v-flex>
              <v-flex xs10>
                <div class="info-content" :style="{color: tituloColor}">
                      {{ existeTituloMensagem }}
                </div>
              </v-flex>
            </v-layout>

            <v-layout row wrap ma-2>
              <v-flex xs2>
                <div class="info-label">Notas de Aplicação</div>
              </v-flex>
              <v-flex xs10 v-if="c.notasAp.length > 0" >
                <div class="info-content" v-for="(mensagem, index) in existeNotaApMensagem" :key="index">
                      {{ mensagem }}
                </div>
              </v-flex>
              <v-flex xs10 v-else >
                <div class="info-content">
                      Sem notas. OK.
                </div>
              </v-flex>
            </v-layout>

            <v-layout row wrap ma-2>
              <v-flex xs2>
                <div class="info-label">Exemplos de notas de Aplicação</div>
              </v-flex>
              <v-flex xs10 v-if="c.exemplosNotasAp.length > 0" >
                <div class="info-content" v-for="(mensagem, index) in existeExemploNotaApMensagem" :key="index">
                      {{ mensagem }}
                </div>
              </v-flex>
              <v-flex xs10 v-else >
                <div class="info-content">
                      Sem notas. OK.
                </div>
              </v-flex>
            </v-layout>

            <v-layout row wrap ma-2>
              <v-flex xs2>
                <div class="info-label">Notas de Exclusão</div>
              </v-flex>
              <v-flex xs10>
                <div class="info-content">
                      {{ existeNotaExMensagem }}
                </div>
              </v-flex>
            </v-layout>

            <v-layout row wrap ma-2>
              <v-flex xs2>
                <div class="info-label">PCA (prazo)</div>
              </v-flex>
              <v-flex xs10>
                <div class="info-content" :style="{color: PCAPrazoColor}">
                      {{ PCAPrazoMensagem }}
                </div>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>

          <v-btn
            color="red darken-4"
            round dark
            @click="dialog=false">Fechar</v-btn>
        </v-card-actions>
        </v-card>
      </v-dialog>
    </v-btn>
</template>

<script>
const lhost = require("@/config/global").host;
const axios = require("axios");

export default {
  props: ["c"],
  data() {
    return {
      dialog: false,
      existeTituloMensagem: "",
      tituloColor: "green",
      existeNotaApMensagem: [],
      notasApColor: "green",
      existeNotaExMensagem: "",
      existeExemploNotaApMensagem: [],
      PCAPrazoMensagem: "",
      PCAPrazoColor: "green"
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

    exemploDuplicado: function(exemplos){
      if(exemplos.length > 1){
        var lastExemplo = exemplos[exemplos.length-1].exemplo
        var duplicados = exemplos.filter(e => e.exemplo == lastExemplo )
        if(duplicados.length > 1){
          return true
        }
        else return false
      }
      else{
        return false
      }
    },

    // Valida a informação introduzida e verifica se a classe pode ser criada

    validarClasse: async function(){
      // Título
      var existeTitulo = await axios.post( lhost + '/api/classes/verificarTitulo', {titulo: this.c.titulo})
      if(existeTitulo.data){
        this.existeTituloMensagem = "Título já existente na BD."
        this.tituloColor = "red"
      }
      else{
        this.existeTituloMensagem = "OK."
        this.tituloColor = "green"
      }

      // Notas de Aplicação
      var existeNotaAp = false
      this.existeNotaApMensagem = []
      for(var i=0; i < this.c.notasAp.length; i++){
        existeNotaAp = await axios.post( lhost + '/api/classes/verificarNA', {na: this.c.notasAp[i].nota})
        if(existeNotaAp.data){
          this.existeNotaApMensagem.push("Nota de Aplicação(" + (i+1) + "): [" + this.c.notasAp[i].nota + "] já existente na BD.")
        }
        else{
          this.existeNotaApMensagem.push("Nota de Aplicação(" + (i+1) + "): OK." ) 
        }
      }
      if(this.notaDuplicada(this.c.notasAp)){
          this.existeNotaApMensagem.push("A última nota encontra-se duplicada.")
      }

      // Exemplos de notas de Aplicação
      var existeExemploNotaAp = false
      this.existeExemploNotaApMensagem = []
      for(var i=0; i < this.c.exemplosNotasAp.length; i++){
        existeExemploNotaAp = await axios.post( lhost + '/api/classes/verificarExemploNA', {exemplo: this.c.exemplosNotasAp[i].exemplo})
        if(existeExemploNotaAp.data){
          this.existeExemploNotaApMensagem.push("Exemplo de nota de Aplicação(" + (i+1) + "): [" + this.c.exemplosNotasAp[i].exemplo + "] já existente na BD.")
        }
        else{
          this.existeExemploNotaApMensagem.push("Exemplo de nota de Aplicação(" + (i+1) + "): OK." ) 
        }
      }
      if(this.exemploDuplicado(this.c.exemplosNotasAp)){
          this.existeExemploNotaApMensagem.push("O último exemplo encontra-se duplicado.")
      }

      // Notas de Exclusão
      if(this.notaDuplicada(this.c.notasEx)){
          this.existeNotaExMensagem = "A última nota encontra-se duplicada."
      }
      else{
          this.existeNotaExMensagem = "Notas de exclusão em conformidade."
      }

      // PCA: prazo
      if((this.c.pca.valor>0)&&(this.c.pca.valor<200)){
          this.PCAPrazoMensagem = "Prazo em conformidade."
          this.PCAPrazoColor = "green"
      }
      else{
          this.PCAPrazoMensagem = "Prazo fora dos limites."
          this.PCAPrazoColor = "red"
      }

      this.dialog = true
    },
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