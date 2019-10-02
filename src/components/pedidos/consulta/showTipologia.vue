<template>
  <v-card class="mt-4">
    <v-card-title class="info-label title" dark>{{ p.objeto.acao }} da Tipologia</v-card-title>
    <v-card-text>
      <v-row v-for="t in tipologiaInfo" :key="t.campo">
        <v-col cols="2" v-if="t.conteudo != ''">
          <div class="info-label">{{ t.campo }}</div>
        </v-col>

        <v-col v-if="t.conteudo != ''">
          <v-data-table
            v-if="t.campo == 'Entidades'"
            :headers="headers"
            :items="t.conteudo"
            class="elevation-1"
            hide-default-footer
          ></v-data-table>

          <div v-else class="info-content">{{ t.conteudo }}</div>
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
      tipologiaInfo: [
        { campo: "Tipologia", conteudo: this.p.objeto.dados.designacao },
        { campo: "Sigla", conteudo: this.p.objeto.dados.sigla },
        { campo: "Entidades", conteudo: this.p.objeto.dados.entidadesSel },
        { campo: "Código", conteudo: this.p.objeto.dados.codigo }
      ],
      headers: [
        { text: "Sigla", value: "sigla", class: "subtitle-1" },
        { text: "Designação", value: "designacao", class: "subtitle-1" }
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