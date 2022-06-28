<template>
  <div>
    <v-row class="ma-2 text-center">
      <ValidarLegislacaoInfoBox :l="l" :original="original" :acao="acao" />

      <v-col>
        <v-btn
          v-if="this.acao == 'Criação'"
          rounded
          class="teal darken-4 white--text"
          @click="criarAlterarLegislacao"
          >Submeter</v-btn
        >
        <v-btn
          v-else-if="this.acao == 'Alteração'"
          rounded
          class="teal darken-4 white--text"
          @click="criarAlterarLegislacao"
          >Submeter</v-btn
        >
        <v-btn
          v-else-if="this.acao == 'Revogação'"
          rounded
          class="indigo accent-4 white--text"
          @click="criarAlterarLegislacao"
          >Revogar Diploma</v-btn
        >
      </v-col>

      <v-col>
        <v-btn
          rounded
          class="red darken-4 white--text"
          @click="eliminarLegislacao"
          >Cancelar</v-btn
        >
      </v-col>

      <!-- Erros de Validação -->
      <v-dialog v-model="errosValidacao" width="30%">
        <v-card>
          <v-card-title>Erros detetados na validação</v-card-title>
          <v-card-text>
            <p>
              Há erros de validação. Selecione "Validar" para ver extamente quais e
              proceder à sua correção.
            </p>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="red darken-4" dark @click="errosValidacao = false"
              >Fechar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Cancelamento da criação de uma legislacao: confirmação -->
      <v-dialog v-model="pedidoEliminado" width="50%">
        <v-card>
          <v-card-title>Cancelamento do pedido.</v-card-title>
          <v-card-text>
            <p>Selecionou o cancelamento do pedido.</p>
            <p>Toda a informação introduzida será eliminada.</p>
            <p>Confirme a decisão para ser reencaminhado para a página principal.</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="indigo darken-1" text @click="cancelarCriacaoLegislacao"
              >Confirmo</v-btn
            >
            <v-btn color="red darken-1" dark @click="pedidoEliminado = false"
              >Enganei-me, desejo continuar o trabalho</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-row>
      <v-snackbar v-model="loginErrorSnackbar" :timeout="8000" color="error" :top="true">
        {{ loginErrorMessage }}
        <v-btn text @click="loginErrorSnackbar = false">Fechar</v-btn>
      </v-snackbar>
    </v-row>

    <!-- Dialog de erro no caso de algum erro ocorrer -->
    <v-dialog v-model="erroDialog" width="50%" persistent>
      <ErroDialog :erros="erros" @fecharErro="fecharErro()" />
    </v-dialog>
  </div>
</template>

<script>
import ValidarLegislacaoInfoBox from "@/components/legislacao/ValidarLegislacaoInfoBox";
import ErroDialog from "@/components/generic/ErroDialog";

import { criarHistorico, extrairAlteracoes } from "@/utils/utils";
import { eNUV, eDataFormatoErrado, eNV } from "@/utils/validadores";

export default {
  props: ["l", "acao", "original", "pedido"],

  components: {
    ValidarLegislacaoInfoBox,
    ErroDialog,
  },

  data() {
    return {
      erroDialog: false,
      erros: [],
      loginErrorSnackbar: false,
      loginErrorMessage: "Precisa de fazer login para criar o Diploma!",
      errosValidacao: false,
      pedidoEliminado: false,
    };
  },

  methods: {
    fecharErro() {
      this.erroDialog = false;
      this.erros = [];
    },

    async validarLegislacaoCriacao() {
      let numeroErros = 0;

      // Tipo
      if (eNUV(this.l.tipo)) {
        numeroErros++;
      }

      // Número Diploma
      if (eNUV(this.l.numero)) {
        numeroErros++;
      } else {
        try {
          let existeNumero = await this.$request(
            "get",
            "/legislacao/numero?valor=" + encodeURIComponent(this.l.numero)
          );

          if (existeNumero.data) {
            this.numeroErros++;
          }
        } catch (err) {
          numeroErros++;
        }
      }

      // Data
      if (eNUV(this.l.data)) {
        numeroErros++;
      } else if (eDataFormatoErrado(this.l.data)) {
        numeroErros++;
      }

      // Sumário
      if (eNUV(this.l.sumario)) {
        numeroErros++;
      }

      // Data revogação
      if (!eNUV(this.l.data) && !eNUV(this.l.dataRevogacao)) {
        if (eDataFormatoErrado(this.l.dataRevogacao)) {
          numeroErros++;
        } else if (new Date(this.l.data) >= new Date(this.l.dataRevogacao)) {
          numeroErros++;
        }
      }

      return numeroErros;
    },

    validarLegislacaoAlteracao(dados) {
      let numeroErros = 0;

      // Sumário
      if (eNV(dados.sumario)) {
        numeroErros++;
      }

      return numeroErros;
    },

    validarLegislacaoRevogacao(dados) {
      let numeroErros = 0;

      // Data Revogação
      if (eNUV(dados.dataRevogacao)) {
        numeroErros++;
      } else if (!eNUV(dados.dataRevogacao)) {
        if (eDataFormatoErrado(dados.dataRevogacao)) {
          numeroErros++;
        } else if (new Date(dados.data) >= new Date(dados.dataRevogacao)) {
          numeroErros++;
        }
      }

      return numeroErros;
    },

    // Lança o pedido de criação da legislacao no worflow
    async criarAlterarLegislacao() {
      try {
        if (this.$store.state.name === "") {
          this.loginErrorSnackbar = true;
        } else {
          let erros = 0;
          let dataObj = JSON.parse(JSON.stringify(this.l));

          const historico = [];

          switch (this.acao) {
            case "Criação":
              erros = await this.validarLegislacaoCriacao();

              historico.push(criarHistorico(dataObj));

              break;

            case "Alteração":
              dataObj = extrairAlteracoes(this.l, this.original);

              erros = this.validarLegislacaoAlteracao(dataObj);

              historico.push(criarHistorico(this.l, this.original));

              break;

            case "Revogação":
              erros = this.validarLegislacaoRevogacao(dataObj);

              for (const key in dataObj) {
                if (key !== "dataRevogacao") delete dataObj[key];
              }

              historico.push({
                dataRevogacao: {
                  cor: "amarelo",
                  dados: dataObj.dataRevogacao,
                  nota: null,
                },
              });
              break;

            default:
              break;
          }

          if (erros === 0) {
            const objKeys = Object.keys(dataObj);

            if (objKeys.length === 0)
              throw new Error(
                "Não foram alterados dados. Altere a informação pretendida e volte a submeter o pedido."
              );
            if (this.pedido) this.ressubmeterPedido();
            else {
              let userBD = this.$verifyTokenUser();

              let pedidoParams = {
                tipoPedido: this.acao,
                tipoObjeto: "Legislação",
                novoObjeto: dataObj,
                user: { email: userBD.email },
                entidade: userBD.entidade,
                token: this.$store.state.token,
                historico: historico,
              };

              if (this.original !== undefined)
                pedidoParams.objetoOriginal = this.original;
              else pedidoParams.objetoOriginal = dataObj;

              const codigoPedido = await this.$request("post", "/pedidos", pedidoParams);

              this.$router.push(`/pedidos/submissao/${codigoPedido.data}`);
            }
          } else {
            this.errosValidacao = true;
          }
        }
      } catch (err) {
        if (typeof err.message === "string") {
          this.erros.push(err.message);
          this.erroDialog = true;
        }
      }
    },

    async ressubmeterPedido() {
      try {
        this.pedido.objeto.dados = this.l;
        let pedido = JSON.parse(JSON.stringify(this.pedido));
        let estado = "Ressubmetido";

        let dadosUtilizador = this.$verifyTokenUser();

        pedido.estado = estado;

        const novaDistribuicao = {
          estado: estado,
          responsavel: dadosUtilizador.email,
          data: new Date(),
          despacho: "Ressubmissão",
        };

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao,
        });
        this.$router.push(`/pedidos/submissao/${pedido.codigo}`);
      } catch (e) {
        console.log(e);
      }
    },

    async cancelarPedido() {
      try {
        let pedido = JSON.parse(JSON.stringify(this.pedido));

        let dadosUtilizador = this.$verifyTokenUser();

        let estado = "Cancelado";

        pedido.estado = estado;

        const novaDistribuicao = {
          estado: estado,
          responsavel: dadosUtilizador.email,
          data: new Date(),
          despacho: "Cancelar",
        };

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao,
        });
        this.$router.push(`/pedidos/submissao/${pedido.codigo}`);
      } catch (e) {
        console.log(e);
      }
    },
    // Cancela a criação da Legislacao
    eliminarLegislacao: function () {
      this.pedidoEliminado = true;
    },

    cancelarCriacaoLegislacao: function () {
      if (this.pedido) {
        this.cancelarPedido();
        this.$router.push("/");
      } else this.$router.push("/");
    },
  },
};
</script>

<style scoped></style>
