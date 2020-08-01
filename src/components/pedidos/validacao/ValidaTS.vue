<template>
  <div>
    <v-overlay :value="overlay">
      <v-progress-circular 
        indeterminate 
        :size="128"
        :width="20"
        color="indigo darken-4"
      >
      A processar pedido...
      </v-progress-circular>
    </v-overlay>
    <v-textarea v-model="json" rows="20" readonly />
    <v-row>
      <v-spacer />
      <PO
        operacao="Validar"
        @finalizarPedido="finalizarPedido($event)"
        @devolverPedido="despacharPedido($event)"
      />
    </v-row>
    <v-dialog v-model="sucessDialog" width="700" persistent>
      <v-card outlined>
        <v-card-title
          class="success darken-4 title white--text"
          dark
        >Tabela de Seleção adicionada com sucesso!</v-card-title>

        <v-card-text>
          <span class="subtitle-1" style="white-space: pre-wrap">
            O Pedido de criação da Tabela de Seleção foi efetuado com sucesso...
          </span>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="red darken-4" text @click="$router.go(-1)">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="erroPedido" width="80%" hide-overlay>
      <ErroDialog :erros="erros" @fecharErro="erroPedido=false" />
    </v-dialog>
  </div>
</template>

<script>
import PO from "@/components/pedidos/generic/PainelOperacoes";
import ErroDialog from "@/components/pedidos/generic/ErroDialog";

export default {
  props: ["p"],
  components: {
    PO,
    ErroDialog
  },

  data() {
    return {
      json: null,
      result: "",
      sucessDialog: false,
      erros: [],
      erroPedido: false,
      overlay: false,
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

        this.overlay = true;
        await this.$request("post", "/tabelasSelecao", {
          tabela: pedido,
        });
        
        const estado = "Validado";

        let dadosUtilizador = this.$verifyTokenUser();

        const novaDistribuicao = {
          estado: estado,
          responsavel: dadosUtilizador.email,
          data: new Date(),
          despacho: dados.mensagemDespacho,
        };

        pedido.estado = estado;
        pedido.token = this.$store.state.token;

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao,
        });
        this.overlay = false;
        this.sucessDialog = true;
          
      } catch (e) {
        this.overlay = false;
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
