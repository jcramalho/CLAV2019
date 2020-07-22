<template>
  <v-card>
    <v-card-title class="indigo darken-4 white--text"
      >Pedido n.º {{ codigoPedido }} de {{ acao }} de Tipologia
      Submetido</v-card-title
    >
    <v-card-text>
      <v-row>
        <v-col cols="2">
          <div class="info-label">Designação</div>
        </v-col>

        <v-col>
          <div class="info-content">{{ t.designacao }}</div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="2">
          <div class="info-label">Sigla</div>
        </v-col>

        <v-col>
          <div class="info-content">{{ t.sigla }}</div>
        </v-col>
      </v-row>

      <v-row v-if="t.entidadesSel.length > 0">
        <v-col cols="2">
          <div class="info-label">Entidades:</div>
        </v-col>

        <v-col>
          <v-data-table
            :headers="headers"
            :items="t.entidadesSel"
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
  props: ["t", "codigoPedido", "acao"],

  data() {
    return {
      headers: [
        { text: "Designação", value: "designacao", class: "subtitle-1" },
        { text: "Sigla", value: "sigla", class: "subtitle-1" }
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
