<template>
  <div>
    <v-row>{{p.objeto.dados}}</v-row>
    <v-row>
      <v-spacer />
      <PO
        operacao="Validar"
        @finalizarPedido="finalizarPedido($event)"
        @devolverPedido="despacharPedido($event)"
      />
    </v-row>
    <v-row>
      <!-- Dialog de erros -->
      <v-dialog v-model="erroDialog.visivel" width="50%" persistent>
        <ErroDialog :erros="erroDialog.mensagem" uri="/pedidos" />
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import PO from "@/components/pedidos/generic/PainelOperacoes";
import ErroDialog from "@/components/generic/ErroDialog";

export default {
  data: () => ({
    erroDialog: {
      visivel: false,
      mensagem: null
    }
  }),
  components: {
    PO,
    ErroDialog
  },
  props: ["p"],
  methods: {
    async despacharPedido(dados) {
      try {
        let dadosUtilizador = this.$verifyTokenUser();

        const novaDistribuicao = {
          estado: "Devolvido",
          responsavel: dadosUtilizador.email,
          data: new Date(),
          despacho: dados.mensagemDespacho
        };

        let pedido = JSON.parse(JSON.stringify(this.p));

        pedido.estado = "Devolvido";
        pedido.token = this.$store.state.token;

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao
        });

        this.$router.go(-1);
      } catch (e) {
        this.erroDialog.visivel = true;
        this.erroDialog.mensagem =
          "Erro ao devolver o pedido, por favor tente novamente";
      }
    },

    async finalizarPedido(dados) {
      try {
        let pedido = JSON.parse(JSON.stringify(this.p));

        //await this.$request("post", "/entidades", pedido.objeto.dados);

        let dadosUtilizador = this.$verifyTokenUser();

        const novaDistribuicao = {
          estado: "Validado",
          responsavel: dadosUtilizador.email,
          data: new Date(),
          despacho: dados.mensagemDespacho
        };

        pedido.estado = "Validado";
        pedido.token = this.$store.state.token;

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao
        });

        this.$router.go(-1);
      } catch (e) {
        console.log(e);
      }
    }
  }
};
</script>