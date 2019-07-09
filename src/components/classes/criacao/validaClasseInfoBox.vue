<template>
  <!-- Infobox com os resultados da VALIDAÇÂO -->
      <v-btn dark round color="green darken-4" @click="validarClasse">Validar classe
      <v-dialog v-model="dialog" width="80%" >
        <v-card>
          <v-card-title class="headline">Erros detetados na validação: {{ mensagensErro.length }}</v-card-title>
          <v-card-text>
            <v-layout row wrap ma-2 v-for="(m, i) in mensagensErro" :key="i">
              <v-flex xs4>
                <div class="info-label">{{ m.sobre }}</div>
              </v-flex>
              <v-flex xs8>
                <div class="info-content">
                      {{ m.mensagem }}
                </div>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>

          <v-btn
            color="red darken-4"
            round dark
            @click="fecharReport">Fechar</v-btn>
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
      
      mensagensErro: [],
      numeroErros: 0
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
      var i = 0
  
      // Título
      if(this.c.titulo == ""){
          this.mensagensErro.push({sobre: "Título", mensagem:"O título não pode ser vazio."})
          this.numeroErros++
      }
      else {
          var existeTitulo = await axios.post( lhost + '/api/classes/verificarTitulo', {titulo: this.c.titulo})
          if(existeTitulo.data){
            this.mensagensErro.push({sobre: "Título", mensagem:"Título já existente na BD."})
            this.numeroErros++
          }
      }
      
      // Notas de Aplicação
      for(i=0; i < this.c.notasAp.length; i++){
        var existeNotaAp = await axios.post( lhost + '/api/classes/verificarNA', {na: this.c.notasAp[i].nota})
        if(existeNotaAp.data){
          this.mensagensErro.push({sobre: "Nota de Aplicação(" + (i+1) + ")", mensagem:"[" + this.c.notasAp[i].nota + "] já existente na BD."})
          this.numeroErros++
        }
      }
      if(this.notaDuplicada(this.c.notasAp)){
          this.mensagensErro.push({sobre: "Nota de Aplicação(" + (i+1) + ")", mensagem:"A última nota encontra-se duplicada."})
          this.numeroErros++
      }

      // Exemplos de notas de Aplicação
      for(i=0; i < this.c.exemplosNotasAp.length; i++){
        var existeExemploNotaAp = await axios.post( lhost + '/api/classes/verificarExemploNA', {exemplo: this.c.exemplosNotasAp[i].exemplo})
        if(existeExemploNotaAp.data){
          this.mensagensErro.push({sobre: "Exemplo de nota de Aplicação(" + (i+1) + ")", mensagem:"[" + this.c.exemplosNotasAp[i].exemplo + "] já existente na BD."})
          this.numeroErros++
        }
      }
      if(this.exemploDuplicado(this.c.exemplosNotasAp)){
          this.mensagensErro.push({sobre: "Exemplo de nota de Aplicação(" + (i+1) + ")", mensagem:"O último exemplo encontra-se duplicado."})
          this.numeroErros++
      }

      // Notas de Exclusão
      if(this.notaDuplicada(this.c.notasEx)){
          this.mensagensErro.push({sobre: "Nota de Exclusão(" + (this.c.notasEx.length) + ")", mensagem:"A última nota encontra-se duplicada."})
          this.numeroErros++
      }

      // Decisões
      // Sem subdivisão
      if((this.c.nivel == 3)&&(!this.c.temSubclasses4Nivel)){
        // PCA: prazo
        if((this.c.pca.valor<0)||(this.c.pca.valor>200)||(!this.c.pca.valor)){
          this.mensagensErro.push({sobre: "PCA (prazo)", mensagem:"Prazo fora dos limites."})
          this.numeroErros++
        }
        // PCA: forma e subforma de contagem
        if(this.c.pca.formaContagem == ""){
          this.mensagensErro.push({sobre: "PCA (forma de contagem)", mensagem:"A forma de contagem não pode ser vazia."})
          this.numeroErros++
        }
        else if((this.c.pca.formaContagem == "vc_pcaFormaContagem_disposicaoLegal")&&(this.c.pca.subFormaContagem == "")){
          this.mensagensErro.push({sobre: "PCA (subforma de contagem)", mensagem:"Quando a forma de contagem é \"Disposição legal\" a subforma não pode ser vazia."})
          this.numeroErros++
        }
      }
      // Com subdivisão
      else if((this.c.nivel == 3)&&(this.c.temSubclasses4Nivel)){
        var subclasse = {}
        // PCA: prazo
        for(i=0; i < this.c.subclasses.length; i++){
          subclasse = this.c.subclasses[i]
          if((subclasse.pca.valor<0)||(subclasse.pca.valor>200)||(!subclasse.pca.valor)){
            this.mensagensErro.push({sobre: "PCA (prazo) da subclasse " + subclasse.codigo, mensagem:"Prazo fora dos limites."})
            this.numeroErros++
          }
          // PCA: forma e subforma de contagem
          if(subclasse.pca.formaContagem == ""){
            this.mensagensErro.push({sobre: "PCA (forma de contagem) da subclasse " + subclasse.codigo, mensagem:"A forma de contagem não pode ser vazia."})
            this.numeroErros++
          }
          else if((subclasse.pca.formaContagem == "vc_pcaFormaContagem_disposicaoLegal")&&(subclasse.pca.subFormaContagem == "")){
            this.mensagensErro.push({sobre: "PCA (subforma de contagem) da subclasse " + subclasse.codigo, mensagem:"Quando a forma de contagem é \"Disposição legal\" a subforma não pode ser vazia."})
            this.numeroErros++
          }
        }
      }
      if(this.numeroErros > 0){
        this.dialog = true
      }
    },

    fecharReport: function(){
      this.dialog = false
      this.numeroErros = 0
      this.mensagensErro = []
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