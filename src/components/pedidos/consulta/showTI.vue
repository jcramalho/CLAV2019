<template>
  <v-card class="mt-4">
    <v-card-title class="pa-2 indigo darken-4 title white--text"
      >{{ p.objeto.acao }} do Termo de Índice</v-card-title
    >
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
  color: #1a237e !important;
  padding: 8px;
  width: 100%;
  background-color: #dee2f8;
  font-weight: bold;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12) !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 6px;
  text-align: center;
}
.info-content {
  padding: 5px;
  width: 100%;
  background-color: #f1f6f8 !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}
</style>
