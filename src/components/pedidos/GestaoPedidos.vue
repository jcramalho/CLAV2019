<template>
  <v-row class="ma-1">
    <v-col>
      <v-card>
        <v-card-title class="indigo darken-4 title white--text" dark>
          Gestão de Pedidos
        </v-card-title>
        <v-card-text class="mt-4">
          <v-expansion-panels :value="pesquisaPedidos.painel">
            <PedidosNovos
              :pedidos="pedidosSubmetidos"
              :pesquisaPedidos="pesquisaPedidos"
              @distribuir="distribuiPedido($event)"
            />

            <PedidosAnalise
              :pedidos="pedidosDistribuidos"
              :pesquisaPedidos="pesquisaPedidos"
              @analisar="analisaPedido($event)"
            />

            <PedidosValidacao
              :pedidos="pedidosValidados"
              :pesquisaPedidos="pesquisaPedidos"
              @validar="validaPedido($event)"
            />

            <PedidosEmDespacho
              :pedidos="pedidosEmDespacho"
              :pesquisaPedidos="pesquisaPedidos"
              @despachar="despacharPedido($event)"
            />

            <PedidosProcessados
              :pedidos="pedidosProcessados"
              :pesquisaPedidos="pesquisaPedidos"
            />

            <PedidosDevolvidos
              :pedidos="pedidosDevolvidos"
              :pesquisaPedidos="pesquisaPedidos"
            />
          </v-expansion-panels>
        </v-card-text>
      </v-card>

      <v-dialog v-model="distribuir" width="80%" persistent>
        <AvancarPedido
          :utilizadores="utilizadoresParaAnalisar"
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
import PedidosEmDespacho from "@/components/pedidos/PedidosEmDespacho";
import PedidosProcessados from "@/components/pedidos/PedidosProcessados";
import AvancarPedido from "@/components/pedidos/generic/AvancarPedido";

import {
  NIVEIS_ANALISAR_PEDIDO,
  NIVEIS_DISTRIBUIR_PEDIDO,
} from "@/utils/consts";
import { filtraNivel } from "@/utils/permissoes";

export default {
  components: {
    PedidosNovos,
    PedidosAnalise,
    PedidosValidacao,
    PedidosDevolvidos,
    PedidosProcessados,
    AvancarPedido,
    PedidosEmDespacho,
  },

  data() {
    return {
      pedidoParaDistribuir: {},
      distribuir: false,
      utilizadoresParaAnalisar: [],
      pedidosSubmetidos: [],
      pedidosDistribuidos: [],
      pedidosValidados: [],
      pedidosEmDespacho: [],
      pedidosDevolvidos: [],
      pedidosProcessados: [],
      pesquisaPedidos: {
        painel: undefined,
        pesquisa: "",
        pagina: 1,
      },
    };
  },

  async created() {
    await this.carregaPedidos();

    const storage = JSON.parse(localStorage.getItem("pesquisa-pedidos"));

    if (storage !== null && storage !== undefined) {
      if (storage.limpar) localStorage.removeItem("pesquisa-pedidos");
      else this.pesquisaPedidos = storage;

      localStorage.removeItem("pesquisa-pedidos");
    }
  },

  methods: {
    temPermissaoDistribuir() {
      return NIVEIS_DISTRIBUIR_PEDIDO.includes(this.$userLevel());
    },

    async carregaPedidos() {
      try {
        let pedidos = await this.$request("get", "/pedidos");
        pedidos = pedidos.data;

        this.pedidosSubmetidos = pedidos.filter(
          (p) => p.estado === "Submetido"
        );
        this.pedidosDistribuidos = pedidos.filter((p) => {
          if (p.estado === "Distribuído" || p.estado === "Redistribuído")
            return p;
        });
        this.pedidosEmDespacho = pedidos.filter((p) => {
          if (p.estado === "Em Despacho") return p;
        });
        this.pedidosValidados = pedidos.filter((p) => {
          if (p.estado === "Apreciado" || p.estado === "Reapreciado" || p.estado === "Devolvido para validação") return p;
        });
        this.pedidosDevolvidos = pedidos.filter(
          (p) => p.estado === "Devolvido"
        );
        this.pedidosProcessados = pedidos.filter(
          (p) => p.estado === "Validado"
        );

        if (this.temPermissaoDistribuir())
          await this.listaUtilizadoresParaAnalisar();
      } catch (e) {
        console.warn("e", e);
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

    async listaUtilizadoresParaAnalisar() {
      const response = await this.$request("get", "/users");

      const utilizadoresFiltrados = filtraNivel(
        response.data,
        NIVEIS_ANALISAR_PEDIDO
      );

      this.utilizadoresParaAnalisar = utilizadoresFiltrados;
    },

    analisaPedido(pedido) {
      this.$router.push("/pedidos/analisar/" + pedido.codigo);
    },
    despacharPedido(pedido) {
      this.$router.push("/pedidos/despachar/" + pedido.codigo);
    },

    validaPedido(pedido) {
      this.$router.push("/pedidos/validar/" + pedido.codigo);
    },

    async atribuirPedido(dados) {
      try {
        let pedido = JSON.parse(JSON.stringify(this.pedidoParaDistribuir));

        let estado = "Distribuído";

        let dadosUtilizador = this.$verifyTokenUser();

        pedido.estado = estado;

        pedido.historico.push(pedido.historico[pedido.historico.length - 1]);

        const novaDistribuicao = {
          estado: estado,
          responsavel: dadosUtilizador.email,
          proximoResponsavel: {
            nome: dados.utilizadorSelecionado.name,
            entidade: dados.utilizadorSelecionado.entidade,
            email: dados.utilizadorSelecionado.email,
          },
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
        console.log("e :", e);
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
