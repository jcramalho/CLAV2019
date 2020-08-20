<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h1>RADAAA</h1>
        <p>{{ p.objeto }}</p>
      </v-col>
    </v-row>
    <v-row>
      <v-dialog v-model="erroDialog.visivel" width="50%" persistent>
        <ErroDialog :erros="erroDialog.mensagem" uri="/pedidos" />
      </v-dialog>
    </v-row>
    <v-row>
      <v-spacer />
      <PO
        operacao="Analisar"
        @avancarPedido="encaminharPedido($event)"
        @devolverPedido="despacharPedido($event)"
      />
    </v-row>
  </div>
</template>

<script>
import PO from "@/components/pedidos/generic/PainelOperacoes";
import ErroDialog from "@/components/generic/ErroDialog";

export default {
  props: ["p"],
  components: {
    PO,
    ErroDialog,
  },
  data() {
    return {
      erroDialog: {
        visivel: false,
        mensagem: null,
      },
    };
  },
  methods: {
    async encaminharPedido(dados) {
      try {
        let dadosUtilizador = this.$verifyTokenUser();

        let pedido = JSON.parse(JSON.stringify(this.p));

        const estado =
          pedido.estado === "Distribuído" ? "Apreciado" : "Reapreciado";

        pedido.estado = estado;
        pedido.token = this.$store.state.token;

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

        this.$router.go(-1);
      } catch (e) {
        this.erroDialog.visivel = true;
        this.erroDialog.mensagem =
          "Erro ao distribuir o pedido, por favor tente novamente";
      }
    },
    async despacharPedido(dados) {
      try {
        let dadosUtilizador = this.$verifyTokenUser();

        const novaDistribuicao = {
          estado: "Devolvido",
          responsavel: dadosUtilizador.email,
          data: new Date(),
          despacho: dados.mensagemDespacho,
        };

        let pedido = JSON.parse(JSON.stringify(this.p));

        pedido.estado = "Devolvido";
        pedido.token = this.$store.state.token;

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao,
        });

        this.$router.go(-1);
      } catch (e) {
        this.erroDialog.visivel = true;
        this.erroDialog.mensagem =
          "Erro ao devolver o pedido, por favor tente novamente";
      }
    },
  },
};
</script>
