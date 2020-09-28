<template>
  <v-card>
    <v-card-title class="warning title white--text" dark>
      <v-icon color="white" class="ma-1">warning</v-icon>Aviso
    </v-card-title>
    <v-card-text>
      <v-container>
        <h4>Deseja mesmo finalizar o pedido?</h4>
        <br />
        <h6>
          Ao clicar em Sim está a introduzir toda a informação validada no
          sistema.
        </h6>
      </v-container>

      <hr />

      <v-container>
        <v-form ref="form">
          <v-row v-if="existeNumDespacho">
            <v-col cols="3">
              <div class="info-label">Nº do Despacho</div>
            </v-col>

            <v-col>
              <v-text-field
                solo
                :rules="[v => !!v || 'Campo Obrigatório']"
                color="indigo"
                label="Nº do Despacho"
                v-model="nDespacho"
              />
            </v-col>
          </v-row>
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
        </v-form>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="red darken-4" dark rounded text @click="cancelar()">Não</v-btn>

      <v-btn class="indigo accent-4" rounded dark @click="finalizarPedido()">Sim</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ["existeNumDespacho"],
  data() {
    return {
      mensagemDespacho: null,
      nDespacho: null
    };
  },

  methods: {
    cancelar() {
      this.utilizadorSelecionado = null;
      this.mensagemDespacho = null;
      this.$emit("fecharDialog");
    },

    finalizarPedido() {
      if (this.$refs.form.validate()) {
        const despacho = {};
        if (this.mensagemDespacho !== null)
          despacho.mensagemDespacho = this.mensagemDespacho;

        if (this.nDespacho !== null) despacho.nDespacho = this.nDespacho;

        this.$emit("finalizarPedido", despacho);
      }
    }
  }
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
