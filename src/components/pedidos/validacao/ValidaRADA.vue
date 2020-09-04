<template>
  <div>
    <v-row>{{ p.objeto.dados }}</v-row>
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
import { converterParaTriplosRADA } from "@/utils/conversorTriplosRADA";

export default {
  data: () => ({
    erroDialog: {
      visivel: false,
      mensagem: null,
    },
  }),
  components: {
    PO,
    ErroDialog,
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
          despacho: dados.mensagemDespacho,
        };

        let pedido = JSON.parse(JSON.stringify(this.p));

        pedido.estado = "Devolvido";

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

    async finalizarPedido(dados) {
      try {
        let pedido = JSON.parse(JSON.stringify(this.p));

        // Fazer pedido para obter as subformas do PCA pois pode ter subformas que existem na plataforma e outras não;
        // Isso faz com que tenhamos uma object property ou data property, tendo que se verificar na construção dos triplos;

        let responseSFC = await this.$request(
          "get",
          "/vocabularios/vc_pcaSubformaContagem"
        );

        let subformasContagem = responseSFC.data.map((item) => {
          return {
            label: item.termo.split(": ")[1] + ": " + item.desc,
            value: item.idtermo.split("#")[1],
          };
        });

        let triplos = await converterParaTriplosRADA(
          pedido.objeto.dados,
          subformasContagem
        );

        await this.$request("post", "/rada", { triplos });

        let dadosUtilizador = this.$verifyTokenUser();

        const novaDistribuicao = {
          estado: "Validado",
          responsavel: dadosUtilizador.email,
          data: new Date(),
          despacho: dados.mensagemDespacho,
        };

        pedido.estado = "Validado";

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao,
        });

        this.$router.go(-1);
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>
