<template>
  <v-dialog v-model="dialog" width="70%" persistent>
    <v-card>
      <v-card-title class="indigo darken-4 white--text">
        Pedido n.º {{ codigoPedido }} de {{ acao }} de Classe submetido com
        sucesso
      </v-card-title>
      <v-card-text>
        <v-row v-if="c.codigo">
          <v-col cols="2">
            <div class="info-label">Código da classe:</div>
          </v-col>

          <v-col>
            <div class="info-content">{{ c.codigo }}</div>
          </v-col>
        </v-row>

        <v-row v-if="c.titulo">
          <v-col cols="2">
            <div class="info-label">Título:</div>
          </v-col>

          <v-col>
            <div class="info-content">{{ c.titulo }}</div>
          </v-col>
        </v-row>

        <v-row v-if="c.descricao">
          <v-col cols="2">
            <div class="info-label">Descrição:</div>
          </v-col>

          <v-col>
            <div class="info-content">{{ c.descricao }}</div>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="indigo darken-1"
          dark
          @click="
            $emit('sair');
            dialog = false;
          "
          >Fechar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["c", "codigoPedido", "acao"],

  data() {
    return {
      dialog: false,
      headers: [
        { text: "Sigla", value: "sigla", class: "subtitle-1" },
        { text: "Designação", value: "designacao", class: "subtitle-1" }
      ]
    };
  },

  mounted: function() {
    this.dialog = true;
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
  border: 1px solid #1a237e;
  border-radius: 3px;
}
</style>
