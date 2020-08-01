<template>
  <div>
    <v-textarea v-model="json" rows="20" readonly />
    <v-row>
      <v-spacer />
      <PO
        operacao="Validar"
        @finalizarPedido="finalizarPedido($event)"
        @devolverPedido="despacharPedido($event)"
      />
    </v-row>

  </div>
</template>

<script>
import PO from "@/components/pedidos/generic/PainelOperacoes";

export default {
  props: ["p"],
  components: {
    PO
  },

  data() {
    return {
      json: null,
      result: "",
    };
  },
  methods: {
    async despacharPedido(dados) {
      try {
        const estado = "Devolvido";

        let dadosUtilizador = this.$verifyTokenUser();

        const novaDistribuicao = {
          estado: estado,
          responsavel: dadosUtilizador.email,
          data: new Date(),
          despacho: dados.mensagemDespacho,
        };

        let pedido = JSON.parse(JSON.stringify(this.p));

        pedido.estado = estado;
        pedido.token = this.$store.state.token;

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao,
        });

        this.$router.go(-1);
      } catch (e) {
        //console.log("e :", e);
      }
    },
    async finalizarPedido(dados) {
      try {
        let pedido = JSON.parse(JSON.stringify(this.p));

        for (const key in pedido.objeto.dados) {
          if (
            pedido.objeto.dados[key] === undefined ||
            pedido.objeto.dados[key] === null ||
            pedido.objeto.dados[key] === ""
          ) {
            delete pedido.objeto.dados[key];
          }
        }

        var res = await this.$request("post", "/tabelasSelecao", {
          tabela: pedido,
        });
        
        // const estado = "Validado";

        // let dadosUtilizador = this.$verifyTokenUser();

        // const novaDistribuicao = {
        //   estado: estado,
        //   responsavel: dadosUtilizador.email,
        //   data: new Date(),
        //   despacho: dados.mensagemDespacho,
        // };

        // pedido.estado = estado;
        // pedido.token = this.$store.state.token;

        // await this.$request("put", "/pedidos", {
        //   pedido: pedido,
        //   distribuicao: novaDistribuicao,
        // });
        // this.sucessDialog = true;
          
      } catch (e) {
        this.erroPedido = true;

        let parsedError = Object.assign({}, e);
        parsedError = parsedError.response;

        if (parsedError !== undefined) {
          if (parsedError.status === 422) {
            parsedError.data.forEach((erro) => {
              this.erros.push({ parametro: erro.param, mensagem: erro.msg });
            });
          }
        } else {
          this.erros.push({
            sobre: "Acesso à Ontologia",
            mensagem: "Ocorreu um erro ao aceder à ontologia.",
          });
        //console.log("e :", e);
        }
      }
    }
  },
  mounted() {
    this.json = JSON.stringify(this.p, null, 2);
  },
};
</script>
