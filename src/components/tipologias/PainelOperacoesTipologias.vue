<template>
  <div>
    <v-row class="ma-2 text-center">
      <ValidarTipologiaInfoBox :t="t" :original="original" :acao="acao" />

      <v-col>
        <v-btn
          v-if="this.acao == 'Criação'"
          rounded
          class="indigo accent-4 white--text"
          @click="criarAlterarTipologia"
          >Criar Tipologia</v-btn
        >
        <v-btn
          v-else-if="this.acao == 'Alteração'"
          rounded
          class="indigo accent-4 white--text"
          @click="criarAlterarTipologia"
          >Alterar Tipologia</v-btn
        >
      </v-col>

      <v-col>
        <v-btn
          v-if="this.acao == 'Criação'"
          dark
          rounded
          class="red darken-4"
          @click="eliminarTipologia"
          >Cancelar Criação</v-btn
        >
        <v-btn
          v-else-if="this.acao == 'Alteração'"
          dark
          rounded
          class="red darken-4"
          @click="eliminarTipologia"
          >Cancelar Alteração</v-btn
        >
      </v-col>

      <!-- Erros de Validação -->
      <v-dialog v-model="errosValidacao" width="30%">
        <v-card>
          <v-card-title>Erros detetados na validação</v-card-title>
          <v-card-text>
            <p>
              Há erros de validação. Selecione "Validar" para ver extamente
              quais e proceder à sua correção.
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

      <!-- Cancelamento da criação de uma tipologia: confirmação -->
      <v-dialog v-model="pedidoEliminado" width="50%">
        <v-card>
          <v-card-title>
            Cancelamento e eliminação do pedido
          </v-card-title>
          <v-card-text>
            <p>Selecionou o cancelamento do pedido.</p>
            <p>Toda a informação introduzida será eliminada.</p>
            <p>
              Confirme a decisão para ser reencaminhado para a página principal.
            </p>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="indigo darken-1"
              text
              @click="cancelarCriacaoTipologia"
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
      <v-snackbar
        v-model="loginErrorSnackbar"
        :timeout="8000"
        color="error"
        :top="true"
      >
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
import ValidarTipologiaInfoBox from "@/components/tipologias/ValidarTipologiaInfoBox";
import ErroDialog from "@/components/generic/ErroDialog";

import { criarHistorico, extrairAlteracoes } from "@/utils/utils";
import { eNUV, eNV, eUndefined } from "@/utils/validadores";

export default {
  props: ["t", "acao", "original"],

  components: {
    ValidarTipologiaInfoBox,
    ErroDialog,
  },

  data() {
    return {
      erroDialog: false,
      erros: [],
      loginErrorSnackbar: false,
      loginErrorMessage: "Precisa de fazer login para criar a Tipologia!",
      dialogTipologiaCriada: false,
      pedidoEliminado: false,
      errosValidacao: false,
    };
  },

  methods: {
    fecharErro() {
      this.erroDialog = false;
      this.erros = [];
    },

    async validarTipologiaCriacao() {
      let numeroErros = 0;

      // Designação
      if (eNUV(this.t.designacao)) {
        numeroErros++;
      } else {
        try {
          let existeDesignacao = await this.$request(
            "get",
            "/tipologias/designacao?valor=" +
              encodeURIComponent(this.t.designacao)
          );
          if (existeDesignacao.data) {
            numeroErros++;
          }
        } catch (err) {
          numeroErros++;
        }
      }

      // Sigla
      if (eNUV(this.t.sigla)) {
        numeroErros++;
      } else {
        try {
          let existeSigla = await this.$request(
            "get",
            "/tipologias/sigla?valor=" + encodeURIComponent(this.t.sigla)
          );
          if (existeSigla.data) {
            numeroErros++;
          }
        } catch (err) {
          numeroErros++;
        }
      }

      return numeroErros;
    },

    async validarTipologiasAlteracao(dados) {
      let numeroErros = 0;

      // Designação
      if (eNV(dados.designacao)) {
        numeroErros++;
      } else if (!eUndefined(dados.designacao)) {
        try {
          let existeDesignacao = await this.$request(
            "get",
            "/tipologias/designacao?valor=" +
              encodeURIComponent(dados.designacao)
          );
          if (existeDesignacao.data) {
            numeroErros++;
          }
        } catch (err) {
          numeroErros++;
        }
      }

      return numeroErros;
    },

    // Lança o pedido de criação da tipologia no worflow
    async criarAlterarTipologia() {
      try {
        if (this.$store.state.name === "") {
          this.loginErrorSnackbar = true;
        } else {
          let erros = 0;
          let dataObj = JSON.parse(JSON.stringify(this.t));

          const historico = [];

          switch (this.acao) {
            case "Criação":
              erros = await this.validarTipologiaCriacao();

              historico.push(criarHistorico(dataObj));

              break;

            case "Alteração":
              dataObj = extrairAlteracoes(this.t, this.original);

              erros = await this.validarTipologiasAlteracao(dataObj);

              historico.push(criarHistorico(this.t, this.original));

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

            let userBD = this.$verifyTokenUser();

            let pedidoParams = {
              tipoPedido: this.acao,
              tipoObjeto: "Tipologia",
              novoObjeto: dataObj,
              user: { email: userBD.email },
              entidade: userBD.entidade,
              token: this.$store.state.token,
              historico: historico,
            };

            if (this.original !== undefined)
              pedidoParams.objetoOriginal = this.original;
            else pedidoParams.objetoOriginal = dataObj;

            const codigoPedido = await this.$request(
              "post",
              "/pedidos",
              pedidoParams
            );

            this.$router.push(`/pedidos/submissao/${codigoPedido.data}`);
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

    criacaoPendenteTerminada: function() {
      this.$router.push("/");
    },

    // Cancela a criação da Tipologia
    eliminarTipologia: function() {
      this.pedidoEliminado = true;
    },

    cancelarCriacaoTipologia: function() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.info-label {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  border-radius: 3px;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
  border-radius: 3px;
}
</style>
