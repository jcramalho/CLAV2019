<template>
  <v-dialog v-model="dialog" width="70%" persistent>
  <v-card>
    <v-card-title class="indigo darken-4 white--text">
      Cancelamento e eliminação do pedido de criação de classe
    </v-card-title>
    <v-card-text>
        <p>Selecionou o cancelamento da criação da classe.</p>
        <p>Toda a informação introduzida será eliminada.</p>
        <p>
            Confirme a decisão para ser reencaminhado para a página principal.
        </p>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="cancelarCriacaoClasse">
              Confirmo
        </v-btn>
        <v-btn color="red darken-1" text @click="pedidoEliminado = false">
              Enganei-me, desejo continuar o trabalho
        </v-btn>
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
        { text: "Designação", value: "designacao", class: "subtitle-1" },
      ],
    };
  },

  mounted: function(){
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
