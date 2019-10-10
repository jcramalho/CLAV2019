<template>
  <v-card class="mt-4">
    <v-card-title
      class="pa-2 indigo darken-4 title white--text"
    >{{ p.objeto.acao }} do Termo de Índice</v-card-title>
    <v-card-text>
      <v-row v-for="t in legislacaoInfo" :key="t.campo">
        <v-col cols="2" v-if="t.conteudo != ''">
          <div class="info-label">{{ t.campo }}</div>
        </v-col>

        <v-col v-if="t.conteudo != ''">
          <div class="info-content">{{ t.conteudo }}</div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ["p"],

  data() {
    return {
      legislacaoInfo: [
        { campo: "Termo de Índice", conteudo: this.p.objeto.dados.termo },
        { campo: "Processo", conteudo: this.p.objeto.dados.idClasse },
        { campo: "Código", conteudo: this.p.objeto.dados.codigo }
      ]
    };
  }
};
</script>

<style scoped>
.info-label {
  color: #1a237e; /* indigo darken-4 */
  font-weight: 400;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  border-radius: 3px;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
  border-radius: 3px;
}
</style>