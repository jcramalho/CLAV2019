<template>
  <v-card>
    <v-card-title class="warning title white--text" dark>
      <v-icon color="white" class="ma-1">warning</v-icon>Aviso
    </v-card-title>
    <v-card-text>
      <v-container>
        <h4>Deseja mesmo finalizar o pedido?</h4>
        <div v-if="!vai_para_despacho">
          <br />
          <h6>
            Ao clicar em Sim está a introduzir toda a informação validada no
            sistema.
          </h6>
        </div>
      </v-container>

      <hr />

      <v-container>
        <v-row>
          <v-col cols="3">
            <div class="info-label">Despacho</div>
          </v-col>

          <v-col>
            <v-textarea
              solo
              hide-details
              color="indigo"
              label="Mensagem de despacho"
              v-model="mensagemDespacho"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="red darken-4" dark rounded text @click="cancelar()"
        >Não</v-btn
      >

      <v-btn class="indigo accent-4" rounded dark @click="finalizarPedido()"
        >Sim</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ["vai_para_despacho"],
  data() {
    return {
      mensagemDespacho: null
    };
  },

  methods: {
    cancelar() {
      this.utilizadorSelecionado = null;
      this.mensagemDespacho = null;
      this.$emit("fecharDialog");
    },

    finalizarPedido() {
      const despacho = {};
      if (this.mensagemDespacho !== null)
        despacho.mensagemDespacho = this.mensagemDespacho;
        
      this.$emit("finalizarPedido", despacho);
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
