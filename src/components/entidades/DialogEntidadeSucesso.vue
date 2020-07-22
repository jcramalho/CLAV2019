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
        { text: "Designação", value: "designacao", class: "subtitle-1" }
      ]
    };
  },

  methods: {
    criacaoTerminada() {
      this.$router.push("/");
    }
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
