<template>
  <v-card class="mt-4">
    <v-card-title class="indigo darken-4 white--text title">{{ p.objeto.acao }} da Legislação</v-card-title>
    <v-card-text>
      <!-- Aviso quando a legislação foi criada a partir de um RADA -->
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
        { campo: "Tipo de Diploma", conteudo: this.p.objeto.dados.tipo },
        {
          campo: "Fonte do Diploma",
          conteudo: this.p.objeto.dados.diplomaFonte
        },
        { campo: "Número do Diploma", conteudo: this.p.objeto.dados.numero },
        { campo: "Data", conteudo: this.p.objeto.dados.data },
        { campo: "Sumário", conteudo: this.p.objeto.dados.sumario },
        { campo: "Link", conteudo: this.p.objeto.dados.link },
        { campo: "Código", conteudo: this.p.objeto.dados.codigo },
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
