<template>
  <v-card class="mt-4">
    <v-card-title class="info-label title" dark>{{ p.objeto.acao }} da Legislação</v-card-title>
    <v-card-text>
      <v-row v-for="t in legislacaoInfo" :key="t.campo">
        <v-col cols="2" v-if="t.conteudo != ''">
          <div class="info-label">{{ t.campo }}</div>
        </v-col>

        <v-col v-if="t.conteudo != ''">
          <v-data-table
            v-if="t.campo == 'Entidades'"
            :headers="headersEntidades"
            :items="t.conteudo"
            class="elevation-1"
            hide-default-footer
          ></v-data-table>

          <v-data-table
            v-else-if="t.campo == 'Processos'"
            :headers="headersProcessos"
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
      legislacaoInfo: [
        { campo: "Tipo do Diploma", conteudo: this.p.objeto.dados.tipo },
        { campo: "Número do Diploma", conteudo: this.p.objeto.dados.numero },
        { campo: "Data", conteudo: this.p.objeto.dados.data },
        { campo: "Sumário", conteudo: this.p.objeto.dados.sumario },
        { campo: "Link", conteudo: this.p.objeto.dados.link },
        { campo: "Entidades", conteudo: this.p.objeto.dados.entidadesSel },
        { campo: "Processos", conteudo: this.p.objeto.dados.processosSel }
      ],
      headersEntidades: [
        { text: "Sigla", value: "sigla", class: "subtitle-1" },
        { text: "Designação", value: "designacao", class: "subtitle-1" }
      ],
      headersProcessos: [
        { text: "Código", value: "codigo", class: "subtitle-1" },
        { text: "Título", value: "titulo", class: "subtitle-1" }
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