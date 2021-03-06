<template>
  <v-card flat class="pa-3">
    <v-row justify="center">
      <v-col cols="12" sm="8">
        <p class="clav-content-title-1">Gestão de Pedidos</p>
      </v-col>
    </v-row>
    <TogglePanelsCLAV :n="panelsArrItems" @alternar="panelsArr = $event">
    </TogglePanelsCLAV>
    <v-expansion-panels v-model="panelsArr" multiple>
      <PainelCLAV
        v-for="estado in estados"
        :key="estado.titulo"
        :titulo="estado.titulo"
        :infoHeader="estado.titulo"
      >
        <template v-slot:icon>
          <v-badge color="error" overlap offset-x="5">
            <unicon
              :name="estado.icon"
              width="20"
              height="20"
              viewBox="0 0 20.71 20.709"
              fill="#ffffff"
            />
            <template v-slot:badge>
              {{ estado.pedidos ? estado.pedidos.length : 0 }}
            </template>
          </v-badge>
        </template>
        <template v-slot:conteudo>
          <EstadoConteudo
            :pedidos="estado.pedidos"
            :utilizadores="utilizadoresMapped"
            @distribuir="distribuiPedido($event)"
            @devolver="devolverPedido($event)"
            @analisar="analisaPedido($event)"
            @validar="validaPedido($event)"
            @despachar="despacharPedido($event)"
          />
        </template>
      </PainelCLAV>
    </v-expansion-panels>

    <!-- Dialog distribuir -->
    <v-dialog v-model="distribuir" width="80%">
      <AvancarPedido
        :utilizadores="utilizadoresParaAnalisar"
        :texto="{
          textoTitulo: 'Distribuição',
          textoAlert: 'análise',
          textoBotao: 'Distribuir',
        }"
        :pedido="pedidoParaDistribuir.codigo"
        @fecharDialog="distribuir = false"
        @avancarPedido="atribuirPedido($event)"
      />
    </v-dialog>

    <!-- Dialog devolver -->
    <v-dialog v-model="devolver" width="80%">
      <DevolverPedido
        @fecharDialog="devolver = false"
        @devolverPedido="devolvePedido($event)"
      />
    </v-dialog>
  </v-card>
</template>

<script>
import PainelCLAV from "@/components/generic/PainelCLAV";
import EstadoConteudo from "./EstadoConteudo";
import AvancarPedido from "@/components/pedidos/generic/AvancarPedido";
import DevolverPedido from "@/components/pedidos/generic/DevolverPedido";
import TogglePanelsCLAV from "@/components/generic/TogglePanelsCLAV";

import { NIVEIS_ANALISAR_PEDIDO, NIVEIS_DISTRIBUIR_PEDIDO } from "@/utils/consts";
import { filtraNivel } from "@/utils/permissoes";

export default {
  components: {
    PainelCLAV,
    EstadoConteudo,
    AvancarPedido,
    DevolverPedido,
    TogglePanelsCLAV,
  },
  data() {
    return {
      pedidoParaDistribuir: {},
      pedidoADevolver: {},
      distribuir: false,
      devolver: false,
      utilizadoresParaAnalisar: [],
      utilizadoresMapped: {},
      // Array para poder expandir/fechar todos os panels
      panelsArr: [],
      panelsArrItems: 6,
      estados: [
        {
          titulo: "Pedidos Novos",
          icon: "pedido-novo-icon",
          pedidos: [],
        },
        {
          titulo: "Pedidos em Apreciação Técnica",
          icon: "pedido-apr-tecn-icon",
        },
        {
          titulo: "Pedidos em Validação",
          icon: "pedido-em-validacao-icon",
          pedidos: [],
        },
        {
          titulo: "Pedidos em Despacho",
          icon: "pedido-despacho-icon",
          pedidos: [],
        },
        {
          titulo: "Pedidos Devolvidos",
          icon: "pedido-devolvido-icon",
          pedidos: [],
        },
        {
          titulo: "Pedidos Aprovados",
          icon: "pedido-aprovado-icon",
          pedidos: [],
        },
      ],
    };
  },
  // async created() {
  //   const response = await this.$request("get", "/users");

  //   this.utilizadores = response.data.reduce(
  //     (users, data) => ((users[data["email"]] = { ...data }), users),
  //     {}
  //   );
  // },
  activated() {
    this.carregaPedidos();
  },
  methods: {
    distribuiPedido(dados) {
      this.pedidoParaDistribuir = dados;
      this.distribuir = true;
    },
    devolverPedido(dados) {
      this.pedidoADevolver = dados;
      this.devolver = true;
    },
    analisaPedido(pedido) {
      this.$router.push("/pedidos/analisar/" + pedido.codigo);
    },

    validaPedido(pedido) {
      this.$router.push("/pedidos/validar/" + pedido.codigo);
    },

    despacharPedido(pedido) {
      this.$router.push("/pedidos/despachar/" + pedido.codigo);
    },

    temPermissaoDistribuir() {
      return NIVEIS_DISTRIBUIR_PEDIDO.includes(this.$userLevel());
    },

    carregaPedidos() {
      this.$request("get", "/pedidos/meta")
        .then((data) => {
          var pedidos = data.data;
          this.estados[0].pedidos = pedidos.filter((p) => p.estado === "Submetido");
          this.estados[1].pedidos = pedidos.filter((p) => {
            if (p.estado === "Distribuído" || p.estado === "Redistribuído") return p;
          });
          this.estados[2].pedidos = pedidos.filter((p) => {
            if (p.estado === "Apreciado" || p.estado === "Reapreciado") return p;
          });
          this.estados[4].pedidos = pedidos.filter((p) => p.estado === "Devolvido");
          this.estados[5].pedidos = pedidos.filter((p) => p.estado === "Validado");

          this.estados[3].pedidos = pedidos.filter((p) => p.estado === "Em Despacho");

          if (this.temPermissaoDistribuir()) this.listaUtilizadoresParaAnalisar();
        })
        .catch((err) => console.log(err));
    },
    async atribuirPedido(dados) {
      try {
        let pedido = JSON.parse(JSON.stringify(this.pedidoParaDistribuir));

        let estado = "Distribuído";

        let dadosUtilizador = this.$verifyTokenUser();

        pedido.estado = estado;

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
        this.distribuir = false;
      } catch (e) {
        console.log(e);
      }
    },

    async devolvePedido(dados) {
      try {
        let pedido = JSON.parse(JSON.stringify(this.pedidoADevolver));

        const estado = "Devolvido";

        let dadosUtilizador = this.$verifyTokenUser();

        const novaDistribuicao = {
          estado: estado,
          responsavel: dadosUtilizador.email,
          data: new Date(),
          despacho: dados.mensagemDespacho,
        };

        pedido.estado = estado;

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao,
        });

        this.devolver = false;
        this.pedidoADevolver = "";
        this.carregaPedidos();
        // location.reload();
      } catch (e) {
        this.erroDialog.visivel = true;
        this.erroDialog.mensagem = "Erro ao devolver o pedido, por favor tente novamente";
      }
    },
    async listaUtilizadoresParaAnalisar() {
      const response = await this.$request("get", "/users");

      const utilizadoresFiltrados = filtraNivel(response.data, NIVEIS_ANALISAR_PEDIDO);

      this.utilizadoresParaAnalisar = utilizadoresFiltrados;
      this.utilizadoresMapped = response.data.reduce(
        (users, data) => ((users[data["email"]] = { ...data }), users),
        {}
      );
    },
    // Abrir todos os v-expansion-panel
    expandAll() {
      this.panelsArr = [...Array(this.panelsArrItems).keys()].map((k, i) => i);
    },
    // Fechar todos os v-expansion-panel
    closeAll() {
      this.panelsArr = [];
    },
    print(evento) {
      console.log("---");
      console.log(evento);
    },
  },
};
</script>
