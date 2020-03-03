<template>
  <div>
    <v-row class="ma-2 text-center">
      <v-col>
        <v-btn
          dark
          rounded
          class="red darken-4"
          @click="devolverPedidoDialog = true"
        >
          Devolver
        </v-btn>
      </v-col>

      <v-col>
        <v-btn
          v-if="operacao === 'Analisar'"
          rounded
          class="indigo accent-4 white--text"
          @click="avancarPedidoDialog = true"
        >
          Encaminhar
        </v-btn>

        <v-btn
          v-else
          rounded
          class="indigo accent-4 white--text"
          @click="finalizarPedidoDialog = true"
        >
          Finalizar
        </v-btn>
      </v-col>
    </v-row>

    <!-- Dialog Avançar Pedido -->
    <v-dialog v-model="avancarPedidoDialog" width="60%">
      <AvancarPedido
        :utilizadores="utilizadores"
        :texto="{
          textoTitulo: 'Encaminhamento',
          textoAlert: 'validação',
          textoBotao: 'Encaminhar'
        }"
        @fecharDialog="fecharDialog()"
        @avancarPedido="avancarPedido($event)"
      />
    </v-dialog>

    <!-- Campo despacho -->
    <v-dialog v-model="devolverPedidoDialog" width="60%">
      <DevolverPedido
        @fecharDialog="fecharDialog()"
        @devolverPedido="devolverPedido($event)"
      />
    </v-dialog>

    <!-- Dialog de Confirmação de Operação -->
    <v-dialog v-model="finalizarPedidoDialog" width="50%">
      <v-card>
        <v-card-title class="warning title white--text" dark>
          <v-icon color="white" class="ma-1">warning</v-icon>
          Aviso
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
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="red darken-4"
            dark
            rounded
            text
            @click="finalizarPedidoDialog = false"
          >
            Não
          </v-btn>

          <v-btn
            class="indigo accent-4"
            rounded
            dark
            @click="finalizarPedido()"
          >
            Sim
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import AvancarPedido from "@/components/pedidos/generic/AvancarPedido";
import DevolverPedido from "@/components/pedidos/generic/DevolverPedido";

export default {
  props: ["operacao"],

  components: {
    AvancarPedido,
    DevolverPedido
  },

  data() {
    return {
      avancarPedidoDialog: false,
      devolverPedidoDialog: false,
      finalizarPedidoDialog: false,
      utilizadores: []
    };
  },

  methods: {
    fecharDialog() {
      this.avancarPedidoDialog = false;
      this.devolverPedidoDialog = false;
    },

    avancarPedido(dados) {
      this.$emit("avancarPedido", dados);
    },

    devolverPedido(dados) {
      this.$emit("devolverPedido", dados);
    },

    finalizarPedido() {
      this.$emit("finalizarPedido");
    }
  },

  async created() {
    try {
      const response = await this.$request("get", "/users");
      this.utilizadores = response.data;
    } catch (e) {
      return e;
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
