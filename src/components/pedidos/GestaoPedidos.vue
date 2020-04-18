<template>
  <v-row class="ma-1">
    <v-col>
      <v-card>
        <v-card-title class="indigo darken-4 title white--text" dark>
          Gestão de Pedidos
        </v-card-title>
        <v-card-text class="mt-4">
          <v-expansion-panels>
            <PedidosNovos
              :pedidos="pedidosSubmetidos"
              @distribuir="distribuiPedido($event)"
            />

            <PedidosAnalise
              :pedidos="pedidosDistribuidos"
              @analisar="analisaPedido($event)"
            />

            <PedidosValidacao
              :pedidos="pedidosValidados"
              @validar="validaPedido($event)"
            />

            <PedidosDevolvidos :pedidos="pedidosDevolvidos" />

            <PedidosProcessados :pedidos="pedidosProcessados" />
          </v-expansion-panels>
        </v-card-text>
      </v-card>

      <v-dialog v-model="distribuir" width="80%" persistent>
        <AvancarPedido
          :utilizadores="utilizadores"
          :texto="{
            textoTitulo: 'Distribuição',
            textoAlert: 'análise',
            textoBotao: 'Distribuir',
          }"
          :pedido="pedidoParaDistribuir.codigo"
          @fecharDialog="fecharDialog()"
          @avancarPedido="atribuirPedido($event)"
        />
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
import PedidosNovos from "@/components/pedidos/PedidosNovos";
import PedidosAnalise from "@/components/pedidos/PedidosAnalise";
import PedidosValidacao from "@/components/pedidos/PedidosValidacao";
import PedidosDevolvidos from "@/components/pedidos/PedidosDevolvidos";
import PedidosProcessados from "@/components/pedidos/PedidosProcessados";
import AvancarPedido from "@/components/pedidos/generic/AvancarPedido";

import { NIVEL_MINIMO_DISTRIBUIR_PEDIDOS_NOVOS } from "@/utils/consts";
import { filtraNivel } from "@/utils/utils";

export default {
  components: {
    PedidosNovos,
    PedidosAnalise,
    PedidosValidacao,
    PedidosDevolvidos,
    PedidosProcessados,
    AvancarPedido,
  },

  data() {
    return {
      pedidoParaDistribuir: {},
      distribuir: false,
      utilizadores: [],
      pedidosSubmetidos: [],
      pedidosDistribuidos: [],
      pedidosValidados: [],
      pedidosDevolvidos: [],
      pedidosProcessados: [],
    };
  },

  async created() {
    await this.carregaPedidos();
  },

  methods: {
    async carregaPedidos() {
      try {
        let pedidos = await this.$request("get", "/pedidos");
        pedidos = pedidos.data;

        this.pedidosSubmetidos = pedidos.filter((p) => p.estado == "Submetido");
        this.pedidosDistribuidos = pedidos.filter(
          (p) => p.estado == "Distribuído"
        );
        this.pedidosValidados = pedidos.filter((p) => p.estado == "Apreciado");
        this.pedidosDevolvidos = pedidos.filter((p) => p.estado == "Devolvido");
        this.pedidosProcessados = pedidos.filter((p) => p.estado == "Validado");

        await this.listaUtilizadores();
      } catch (e) {
        return e;
      }
    },

    fecharDialog() {
      this.distribuir = false;
    },

    distribuiPedido(dados) {
      this.pedidoParaDistribuir = dados;
      this.distribuir = true;
    },

    async listaUtilizadores() {
      const response = await this.$request("get", "/users");

      const utilizadores = filtraNivel(
        response.data,
        NIVEL_MINIMO_DISTRIBUIR_PEDIDOS_NOVOS,
        ">="
      );

      this.utilizadores = utilizadores;
    },

    analisaPedido(pedido) {
      this.$router.push("/pedidos/analisar/" + pedido.codigo);
    },

    validaPedido(pedido) {
      this.$router.push("/pedidos/validar/" + pedido.codigo);
    },

    async atribuirPedido(dados) {
      try {
        let pedido = JSON.parse(JSON.stringify(this.pedidoParaDistribuir));

        const estado = "Distribuído";

        let dadosUtilizador = this.$verifyTokenUser();

        pedido.estado = estado;
        pedido.token = this.$store.state.token;

        const novaDistribuicao = {
          estado: estado,
          responsavel: dadosUtilizador.email,
          data: new Date(),
          despacho: dados.mensagemDespacho,
        };

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao,
        });

        this.carregaPedidos();
        // this.$router.push("/pedidos");
        this.fecharDialog();
      } catch (e) {
        //console.log("e :", e);
      }
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
