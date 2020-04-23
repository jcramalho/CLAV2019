<template>
  <v-card>
    <v-card-title class="indigo darken-4 white--text">
      Pedido n.º {{ codigoPedido }} de {{ acao }} de Entidade Submetido
    </v-card-title>
    <v-card-text>
      <v-row v-if="e.designacao">
        <v-col cols="2">
          <div class="info-label">Nome da Entidade:</div>
        </v-col>

        <v-col>
          <div class="info-content">{{ e.designacao }}</div>
        </v-col>
      </v-row>

      <v-row v-if="e.sigla">
        <v-col cols="2">
          <div class="info-label">Sigla:</div>
        </v-col>

        <v-col>
          <div class="info-content">{{ e.sigla }}</div>
        </v-col>
      </v-row>

      <v-row v-if="e.internacional">
        <v-col cols="2">
          <div class="info-label">Internacional:</div>
        </v-col>

        <v-col>
          <div class="info-content">{{ e.internacional }}</div>
        </v-col>
      </v-row>

      <v-row v-if="e.sioe">
        <v-col cols="2">
          <div class="info-label">SIOE:</div>
        </v-col>

        <v-col>
          <div class="info-content">{{ e.sioe }}</div>
        </v-col>
      </v-row>

      <v-row v-if="e.dataExtincao">
        <v-col cols="2">
          <div class="info-label">Data de Extinção:</div>
        </v-col>

        <v-col>
          <div class="info-content">{{ e.dataExtincao }}</div>
        </v-col>
      </v-row>

      <v-row v-if="e.tipologiasSel.length > 0">
        <v-col cols="2">
          <div class="info-label">Tipologias:</div>
        </v-col>

        <v-col>
          <v-data-table
            :headers="headers"
            :items="e.tipologiasSel"
            class="elevation-1"
            hide-default-footer
          ></v-data-table>
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
  props: ["e", "codigoPedido", "acao"],

  data() {
    return {
      headers: [
        { text: "Sigla", value: "sigla", class: "subtitle-1" },
        { text: "Designação", value: "designacao", class: "subtitle-1" },
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
