<template>
  <div>
    TESTE
    <v-textarea v-model="json" rows="20" readonly />
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

export default {
  props: ["p"],
  components: {
    PO
  },

  data() {
    return {
      novoHistorico: null,
      json: null,
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
          despacho: dados.mensagemDespacho
        };

        let pedido = JSON.parse(JSON.stringify(this.p));

        pedido.estado = estado;
        pedido.token = this.$store.state.token;
        
        pedido.historico.push(this.novoHistorico);

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao
        });

        this.$router.go(-1);
      } catch (e) {
        //console.log("e :", e);
      }
    },
    async encaminharPedido(dados) {
      try {
        const estado = "Apreciado";

        let dadosUtilizador = this.$verifyTokenUser();

        let pedido = JSON.parse(JSON.stringify(this.p));
        
        pedido.estado = estado;
        pedido.token = this.$store.state.token;

        pedido.historico.push(this.novoHistorico);

        const novaDistribuicao = {
          estado: estado,
          responsavel: dadosUtilizador.email,
          proximoResponsavel: {
            nome: dados.utilizadorSelecionado.name,
            entidade: dados.utilizadorSelecionado.entidade,
            email: dados.utilizadorSelecionado.email
          },
          data: new Date(),
          despacho: dados.mensagemDespacho
        };

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao
        });

        this.$router.go(-1);
      } catch (e) {
        //console.log("e :", e);
      }
    }
  },

  mounted() {
    this.json = JSON.stringify(this.p, null, 2);
  },
};
</script>
