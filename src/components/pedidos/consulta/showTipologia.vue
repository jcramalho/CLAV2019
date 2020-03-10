<template>
  <v-card class="mt-4">
    <v-card-title class="indigo darken-4 white--text title"
      >{{ p.objeto.acao }} da Tipologia</v-card-title
    >
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
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  border-radius: 3px;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #283593;
  border-radius: 3px;
}
</style>
