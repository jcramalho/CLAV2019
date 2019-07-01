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
                <div class="info-content">
                      {{ existeTituloMensagem }}
                </div>
              </v-flex>
            </v-layout>
            <v-layout row wrap ma-2>
              <v-flex xs2>
                <div class="info-label">Notas de Aplicação</div>
              </v-flex>
              <v-flex xs10>
                <div class="info-content" v-for="(mensagem, index) in existeNotaApMensagem" :key="index">
                      {{ mensagem }}
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
      existeNotaApMensagem: []
    };
  },

  methods: {
      // Valida a informação introduzida e verifica se a classe pode ser criada

    validarClasse: async function(){
      // Título
      var existeTitulo = await axios.post( lhost + '/api/classes/verificarTitulo', {titulo: this.c.titulo})
      if(existeTitulo.data){
        this.existeTituloMensagem = "Título já existente na BD."
      }
      else{
        this.existeTituloMensagem = "OK."
      }

      // Notas de Aplicação
      var existeNotaAp = false
      this.existeNotaApMensagem = []
      for(var i=0; i < this.c.notasAp.length; i++){
        existeNotaAp = await axios.post( lhost + '/api/classes/verificarNA', {na: this.c.notasAp[i].nota})
        if(existeNotaAp.data){
          this.existeNotaApMensagem.push("Nota de Aplicação(" + (i+1) + "): " + this.c.notasAp[i].nota + " já existente na BD.")
        }
      }

      this.dialog = true
    },
  }
};
</script>
