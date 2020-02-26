<template>
  <div>
    <v-row class="ma-2 text-center">
      <v-col>
        <v-btn
          dark
          rounded
          class="red darken-4"
          @click="
            mensagemDespacho = '';
            dialog = true;
            textoOperacao = 'devolução';
            textoBotao = 'Devolver';
          "
        >
          Devolver
        </v-btn>
      </v-col>

      <v-col>
        <v-btn
          rounded
          class="indigo accent-4 white--text"
          @click="
            mensagemDespacho = '';
            dialog = true;
            textoOperacao = 'encaminhamento';
            textoBotao = 'Encaminhar';
          "
        >
          Encaminhar
        </v-btn>
      </v-col>
    </v-row>

    <!-- Campo despacho -->
    <v-dialog v-model="dialog" width="60%">
      <v-card>
        <v-card-title>Insira uma mensagem de {{ textoOperacao }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="2">
              <div class="info-label">Mensagem:</div>
            </v-col>

            <v-col>
              <v-text-field
                solo
                clearable
                hide-details
                color="indigo"
                :label="`Mensagem de ${textoOperacao}`"
                v-model="mensagemDespacho"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="red darken-4" dark rounded text @click="dialog = false">
            Fechar
          </v-btn>
          <v-btn
            class="indigo accent-4 white--text"
            rounded
            dark
            @click="
              dialog = false;
              despacho();
            "
          >
            {{ textoBotao }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      textoOperacao: null,
      textoBotao: null,
      mensagemDespacho: ""
    };
  },

  methods: {
    despacho() {
      this.dialog = true;

      this.$emit("mensagemDespacho", {
        tipoOperacao: this.textoBotao,
        mensagem: this.mensagemDespacho
      });
    }
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
