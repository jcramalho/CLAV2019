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
          textoTitulo: 'Distribuição',
          textoAlert: 'validação',
          textoBotao: 'Distribuir',
        }"
        :pedido="this.$route.params.idPedido"
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
      <FinalizarPedido
        @fecharDialog="fecharDialog()"
        @finalizarPedido="finalizarPedido($event)"
      />
    </v-dialog>
  </div>
</template>

<script>
import AvancarPedido from "@/components/pedidos/generic/AvancarPedido";
import DevolverPedido from "@/components/pedidos/generic/DevolverPedido";
import FinalizarPedido from "@/components/pedidos/generic/FinalizarPedido";

export default {
  props: ["operacao"],

  components: {
    AvancarPedido,
    DevolverPedido,
    FinalizarPedido,
  },

  data() {
    return {
      avancarPedidoDialog: false,
      devolverPedidoDialog: false,
      finalizarPedidoDialog: false,
      utilizadores: [],
    };
  },

  methods: {
    fecharDialog() {
      this.avancarPedidoDialog = false;
      this.devolverPedidoDialog = false;
      this.finalizarPedidoDialog = false;
    },

    avancarPedido(dados) {
      this.$emit("avancarPedido", dados);
    },

    devolverPedido(dados) {
      this.$emit("devolverPedido", dados);
    },

    finalizarPedido(dados) {
      this.fecharDialog();
      this.$emit("finalizarPedido", dados);
    },
  },

  async created() {
    try {
      const response = await this.$request("get", "/users");
      this.utilizadores = response.data;
    } catch (e) {
      return e;
    }
  },
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
