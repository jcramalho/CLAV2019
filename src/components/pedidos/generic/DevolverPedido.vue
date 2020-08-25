<template>
  <v-card>
    <v-card-title class="indigo darken-3 white--text">
      Insira uma mensagem para devolução
    </v-card-title>
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
      mensagemDespacho: null
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
  padding: 8px;
  background-color: #f1f6f8 !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}

.is-collapsed li:nth-child(n + 5) {
  display: none;
}
</style>
