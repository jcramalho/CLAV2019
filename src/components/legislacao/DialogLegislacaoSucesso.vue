<template>
  <v-card>
    <v-card-title class="indigo darken-4 white--text">
      Pedido n.º {{ codigoPedido }} de {{ acao }} de Diploma Submetido
    </v-card-title>

    <v-card-text>
      <v-row v-if="l.tipo">
        <v-col cols="2">
          <div class="info-label">Tipo de diploma:</div>
        </v-col>

        <v-col>
          <div class="info-content">{{ l.tipo }}</div>
        </v-col>
      </v-row>

      <v-row v-if="l.diplomaFonte">
        <v-col cols="2">
          <div class="info-label">Fonte do diploma:</div>
        </v-col>

        <v-col>
          <div class="info-content">{{ l.diplomaFonte }}</div>
        </v-col>
      </v-row>

      <v-row v-if="l.numero">
        <v-col cols="2">
          <div class="info-label">Número de diploma:</div>
        </v-col>

        <v-col>
          <div class="info-content">{{ l.numero }}</div>
        </v-col>
      </v-row>

      <v-row v-if="l.data">
        <v-col cols="2">
          <div class="info-label">Data:</div>
        </v-col>

        <v-col>
          <div class="info-content">{{ l.data }}</div>
        </v-col>
      </v-row>

      <v-row v-if="l.Sumário">
        <v-col cols="2">
          <div class="info-label">Sumário:</div>
        </v-col>

        <v-col>
          <div class="info-content">{{ l.sumario }}</div>
        </v-col>
      </v-row>

      <v-row v-if="l.link != '' && l.link != null">
        <v-col cols="2">
          <div class="info-label">Link:</div>
        </v-col>

        <v-col>
          <div class="info-content">{{ l.link }}</div>
        </v-col>
      </v-row>

      <v-row v-if="l.entidadesSel.length > 0">
        <v-col cols="2">
          <div class="info-label">Entidades:</div>
        </v-col>

        <v-col>
          <v-data-table
            :headers="headersEntidades"
            :items="l.entidadesSel"
            class="elevation-1"
            hide-default-footer
          ></v-data-table>
        </v-col>
      </v-row>

      <v-row v-if="l.processosSel.length > 0">
        <v-col cols="2">
          <div class="info-label">Processos:</div>
        </v-col>

        <v-col>
          <v-data-table
            :headers="headersProcessos"
            :items="l.processosSel"
            class="elevation-1"
            hide-default-footer
          ></v-data-table>
        </v-col>
      </v-row>

      <v-row v-if="l.dataRevogacao">
        <v-col cols="2">
          <div class="info-label">Data de Revogação:</div>
        </v-col>

        <v-col>
          <div class="info-content">{{ l.dataRevogacao }}</div>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="indigo darken-1" dark @click="criacaoTerminada"
        >Fechar</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ["l", "codigoPedido", "acao"],

  data() {
    return {
      headersEntidades: [
        { text: "Sigla", value: "sigla", class: "subtitle-1" },
        { text: "Designação", value: "designacao", class: "subtitle-1" },
      ],
      headersProcessos: [
        { text: "Código", value: "codigo", class: "subtitle-1" },
        { text: "Título", value: "titulo", class: "subtitle-1" },
      ],
    };
  },

  methods: {
    criacaoTerminada() {
      this.$router.push("/");
    },
  },
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
  border: 1px solid #1a237e;
  border-radius: 3px;
}
</style>
