<template>
  <v-row>
    <v-spacer />
    <PO
      :operacao="validar ? 'Validar' : 'Analisar'"
      @avancarPedido="encaminharPedido($event)"
      @finalizarPedido="verificaEstadoCampos($event)"
      @devolverPedido="devolverPedido($event)"
    />

    <v-dialog v-model="dialogConfirmacao.visivel" width="50%" persistent>
      <ConfirmacaoOperacao
        :mensagem="dialogConfirmacao.mensagem"
        @fechar="closeDialog(dialogConfirmacao)"
        @confirma="finalizarPedido(dialogConfirmacao.dados)"
      />
    </v-dialog>
  </v-row>
</template>

<script>
import PO from "@/components/pedidos/generic/PainelOperacoes";
import ConfirmacaoOperacao from "@/components/pedidos/generic/ConfirmacaoOperacao";
import { adicionarNotaComRemovidos } from "@/utils/utils";

export default {
  components: {
    PO,
    ConfirmacaoOperacao,
  },
  props: {
    p: Object,
    historico: Array,
    novoHistorico: Object,
    validar: Boolean,
  },
  data() {
    return {
      erroDialog: {
        visivel: false,
        mensagem: null,
      },
      dialogConfirmacao: {
        visivel: false,
        mensagem: "",
        dados: null,
      },
    };
  },
  computed: {
    utilizador: function () {
      return this.$verifyTokenUser();
    },
    pedido: function () {
      return JSON.parse(JSON.stringify(this.p));
    },
  },
  methods: {
    async despachar(estado, { mensagemDespacho, utilizadorSelecionado }) {
      this.pedido.estado = estado;

      let novoHistorico = adicionarNotaComRemovidos(
        this.historico[this.historico.length - 1],
        this.novoHistorico
      );

      this.pedido.historico.push(novoHistorico);

      const novaDistribuicao = {
        estado: estado,
        responsavel: this.utilizador.email,
        data: new Date(),
        despacho: mensagemDespacho,
      };

      if (utilizadorSelecionado)
        novaDistribuicao.proximoResponsavel = { ...utilizadorSelecionado };

      await this.$request("put", "/pedidos", {
        pedido: this.pedido,
        distribuicao: novaDistribuicao,
      });
    },
    async encaminharPedido(dados) {
      var estado;
      if (this.pedido.estado === "Distribuído" || this.pedido.estado === "Redistribuído")
        dados.etapa === "Validação 1" ? (estado = "Apreciado") : (estado = "Apreciado2v");
      else
        dados.etapa === "Validação 1"
          ? (estado = "Reapreciado")
          : (estado = "Reapreciado2v");

      dados.utilizadorSelecionado.nome = dados.utilizadorSelecionado.name;
      await this.despachar(estado, dados);
      this.$router.go(-1);
    },
    async devolverPedido(dados) {
      await this.despachar("Devolvido", dados);
      this.$router.go(-1);
    },
    async verificaEstadoCampos(dados) {
      const haVermelhos = Object.keys(this.novoHistorico).some(
        (key) => this.novoHistorico[key].cor === "vermelho"
      );

      if (haVermelhos) {
        this.dialogConfirmacao = {
          visivel: true,
          mensagem:
            "Existem um ou mais campos assinalados a vermelho, deseja mesmo continuar com a submissão do pedido?",
          dados: dados,
        };
      } else await this.finalizarPedido(dados);
    },
    async finalizarPedido(dados) {
      try {
        await this.$request("post", "/classes", this.pedido.objeto.dados);
        await this.despachar("Validado", dados);
        this.$router.push(`/pedidos/finalizacao/${this.p.codigo}`);
      } catch (e) {
        console.log(e);
        this.erroPedido = true;

        let parsedError = Object.assign({}, e);
        parsedError = parsedError.response;

        if (parsedError !== undefined) {
          if (parsedError.status === 422) {
            parsedError.data.forEach((erro) => {
              this.erros.push({
                parametro: mapKeys(erro.param),
                mensagem: erro.msg,
              });
            });
          }
        } else {
          this.erros.push({
            sobre: "Acesso à Ontologia",
            mensagem: "Ocorreu um erro ao aceder à ontologia.",
          });
        }
      }
    },
    closeDialog(dialog) {
      dialog.visivel = false;
    },
  },
};
</script>
