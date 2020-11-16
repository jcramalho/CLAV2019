<template>
  <v-card dark class="info-card">
    <v-card-title class="headline mb-4">
      Pedido n.º {{ codigoPedido }} de {{ acao }} de Entidade Submetido
    </v-card-title>
    <v-card-text class="font-weight-medium">
      <v-row v-if="e.designacao">
        <v-col cols="3">
          <div class="info-label px-3">Nome da Entidade:</div>
        </v-col>

        <v-col>
          <div class="info-content px-3">{{ e.designacao }}</div>
        </v-col>
      </v-row>

      <v-row v-if="e.sigla">
        <v-col cols="3">
          <div class="info-label px-3">Sigla:</div>
        </v-col>

        <v-col>
          <div class="info-content px-3">{{ e.sigla }}</div>
        </v-col>
      </v-row>

      <v-row v-if="e.internacional">
        <v-col cols="3">
          <div class="info-label px-3">Internacional:</div>
        </v-col>

        <v-col>
          <div class="info-content px-3">{{ e.internacional }}</div>
        </v-col>
      </v-row>

      <v-row v-if="e.sioe">
        <v-col cols="3">
          <div class="info-label px-3">SIOE:</div>
        </v-col>

        <v-col>
          <div class="info-content px-3">{{ e.sioe }}</div>
        </v-col>
      </v-row>

      <v-row v-if="e.dataExtincao">
        <v-col cols="3">
          <div class="info-label px-3">Data de Extinção:</div>
        </v-col>

        <v-col>
          <div class="info-content px-3">{{ e.dataExtincao }}</div>
        </v-col>
      </v-row>

      <v-row v-if="e.tipologiasSel.length > 0">
        <v-col cols="3">
          <div class="info-label px-3">Tipologias:</div>
        </v-col>

        <v-col>
          <div class="info-content pa-4">
            <v-data-table
              class="content-table"
              :headers="headers"
              :items="e.tipologiasSel"
              hide-default-footer
            ></v-data-table>
          </div>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="red darken-4"
        rounded
        dark
        elevation="0"
        class="px-4"
        @click="criacaoTerminada"
      >
        Fechar
      </v-btn>
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
.info-card {
  background: linear-gradient(to right, #19237e 0%, #0056b6 100%);
  text-shadow: 0px 1px 2px rgba(255, 255, 255, 0.22) !important;
}
.info-content {
  padding: 8px;
  background-color: #f1f6f8 !important;
  color: #606060;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}
.content-table {
  background-color: #f1f6f8 !important;
  border-radius: 10px;
}
</style>
