<template>
  <v-card class="mt-4">
    <v-card-title class="info-label title" dark>
      {{ p.objeto.acao }} da Classe
    </v-card-title>
    <v-card-text>
      <v-row v-for="c in classeInfo" :key="c.campo">
        <v-col cols="2">
          <div class="info-label">{{ c.campo }}</div>
        </v-col>
        <v-col>
          <div class="info-content">{{ c.conteudo }}</div>
        </v-col>
      </v-row>
      
      <div>
        {{ JSON.stringify(p.objeto.dados) }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ["p"],

  data () {
      return {
        headers: [
          {text: 'Campo', value: 'campo'},
          { text: 'Conteúdo', value: 'conteudo'}
        ],
        classeInfo: [
          {campo: 'Nível', conteudo: this.p.objeto.dados.nivel},
          {campo: 'Código', conteudo: this.p.objeto.dados.codigo},
          {campo: 'Título', conteudo: this.p.objeto.dados.titulo},
          {campo: 'Descrição', conteudo: this.p.objeto.dados.descricao},
        ]
      }
  }
}
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
</style>