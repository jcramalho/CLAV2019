<template>
  <v-card class="mt-4">
    <v-card-title class="info-label title" dark>{{ p.objeto.acao }} da Entidade</v-card-title>
    <v-card-text>
      <v-row v-for="e in entidadeInfo" :key="e.campo">
        <v-col cols="2">
          <div class="info-label">{{ e.campo }}</div>
        </v-col>

        <v-col>
          <div class="info-content">{{ e.conteudo }}</div>
        </v-col>
      </v-row>

      <v-card outlined class="mt-4">
        <v-card-text>{{ JSON.stringify(p) }}</v-card-text>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ["p"],

  data() {
    return {
      entidadeInfo: [
        { campo: "Entidade", conteudo: this.p.objeto.dados.designacao },
        { campo: "Sigla", conteudo: this.p.objeto.dados.sigla },
        { campo: "Internacional", conteudo: this.p.objeto.dados.internacional }
      ]
    };
  }
};
</script>

<style scoped>
.info-label {
  color: #1565c0; /* blue darken-3 */
  font-weight: 400;
  width: 100%;
  background-color: #e3f2fd; /* blue lighten-5 */
  font-weight: bold;
  border-radius: 3px;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1565c0;
  border-radius: 3px;
}
</style>