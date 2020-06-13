<template>
  <v-card>
    <v-card-title>Insira uma mensagem para devolução</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="2">
          <div class="info-label">Mensagem</div>
        </v-col>

        <v-col>
          <v-textarea
            solo
            hide-details
            color="indigo"
            label="Mensagem para devolução"
            v-model="mensagemDespacho"
          />
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="red darken-4" dark rounded text @click="cancelar()">
        Cancelar
      </v-btn>

      <v-btn class="indigo accent-4" rounded dark @click="despacho()">
        Devolver
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      mensagemDespacho: null,
    };
  },

  methods: {
    cancelar() {
      this.mensagemDespacho = null;
      this.$emit("fecharDialog");
    },

    despacho() {
      const despacho = {};

      if (this.mensagemDespacho !== null)
        despacho.mensagemDespacho = this.mensagemDespacho;

      this.$emit("devolverPedido", despacho);
    },
  },
};
</script>

<style>
.info-label {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
}

.is-collapsed li:nth-child(n + 5) {
  display: none;
}
</style>
