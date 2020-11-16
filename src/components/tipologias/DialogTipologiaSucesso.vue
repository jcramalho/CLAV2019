<template>
  <v-card dark class="info-card">
    <v-card-title class="headline mb-4"
      >Pedido n.º {{ codigoPedido }} de {{ acao }} de Tipologia
      Submetido</v-card-title
    >
    <v-card-text class="font-weight-medium">
      <v-row>
        <v-col cols="3">
          <div class="info-label px-3">Designação</div>
        </v-col>

        <v-col>
          <div class="info-content px-3">{{ t.designacao }}</div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="3">
          <div class="info-label px-3">Sigla</div>
        </v-col>

        <v-col>
          <div class="info-content px-3">{{ t.sigla }}</div>
        </v-col>
      </v-row>

      <v-row v-if="t.entidadesSel.length > 0">
        <v-col cols="3">
          <div class="info-label">Entidades:</div>
        </v-col>

        <v-col>
          <div class="info-content pa-4">
            <v-data-table
              class="content-table"
              :headers="headers"
              :items="t.entidadesSel"
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
