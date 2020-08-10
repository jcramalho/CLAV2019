<template>
  <div>
    <v-row class="ma-2 text-center">
      <ValidarEntidadeInfoBox :e="e" :original="original" :acao="acao" />

      <v-col>
        <v-btn
          v-if="this.acao == 'Criação'"
          rounded
          class="indigo accent-4 white--text"
          @click="criarAlterarEntidade"
          >Criar Entidade</v-btn
        >
        <v-btn
          v-else-if="this.acao == 'Alteração'"
          rounded
          class="indigo accent-4 white--text"
          @click="criarAlterarEntidade"
          >Alterar Entidade</v-btn
        >
        <v-btn
          v-else-if="this.acao == 'Extinção'"
          rounded
          class="indigo accent-4 white--text"
          @click="criarAlterarEntidade"
          >Extinguir Entidade</v-btn
        >
      </v-col>

      <v-col>
        <v-btn
          v-if="this.acao == 'Criação'"
          dark
          rounded
          class="red darken-4"
          @click="eliminarEntidade"
          >Cancelar Criação</v-btn
        >
        <v-btn
          v-else-if="this.acao == 'Alteração'"
          dark
          rounded
          class="red darken-4"
          @click="eliminarEntidade"
          >Cancelar Alteração</v-btn
        >
        <v-btn
          v-else-if="this.acao == 'Extinção'"
          dark
          rounded
          class="red darken-4"
          @click="eliminarEntidade"
          >Cancelar Extinção</v-btn
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

      <!-- Cancelamento da criação de uma entidade: confirmação -->
      <v-dialog v-model="pedidoEliminado" width="50%">
        <v-card>
          <v-card-title>Cancelamento do pedido.</v-card-title>
          <v-card-text>
            <p>Selecionou o cancelamento do pedido.</p>
            <p>Toda a informação introduzida será eliminada.</p>
            <p>
              Confirme a decisão para ser reencaminhado para a página principal.
            </p>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="indigo darken-1" text @click="cancelarCriacaoEntidade"
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
  </div>
</template>

<script>
import ValidarEntidadeInfoBox from "@/components/entidades/ValidarEntidadeInfoBox";

import { criarHistorico, extrairAlteracoes } from "@/utils/utils";
import { eNUV, eNV, eUndefined, eDataFormatoErrado } from "@/utils/validadores";

export default {
  props: ["e", "acao", "original"],

  components: {
    ValidarEntidadeInfoBox,
  },

  data() {
    return {
      loginErrorSnackbar: false,
      loginErrorMessage: "Precisa de fazer login para criar a Entidade!",
      pedidoEliminado: false,
      errosValidacao: false,
    };
  },

  methods: {
    async validarEntidadeCriacao() {
      let numeroErros = 0;

      // Designação
      if (eNUV(this.e.designacao)) {
        numeroErros++;
      } else {
        try {
          let existeDesignacao = await this.$request(
            "get",
            "/entidades/designacao?valor=" +
              encodeURIComponent(this.e.designacao)
          );
          if (existeDesignacao.data) numeroErros++;
        } catch (err) {
          numeroErros++;
        }
      }

      // Sigla
      if (eNUV(this.e.sigla)) {
        numeroErros++;
      } else {
        try {
          let existeSigla = await this.$request(
            "get",
            "/entidades/sigla?valor=" + encodeURIComponent(this.e.sigla)
          );
          if (existeSigla.data) numeroErros++;
        } catch (err) {
          numeroErros++;
        }
      }

      // Internacional
      if (eNUV(this.e.internacional)) {
        numeroErros++;
      }

      // SIOE
      if (!eNUV(this.e.sioe)) {
        if (this.e.sioe.length > 12) numeroErros++;
      }

      //Data Criação
      if (!eNUV(this.e.dataCriacao)) {
        if (eDataFormatoErrado(this.e.dataCriacao)) {
          numeroErros++;
        }
      }

      // Data de Extinção
      if (!eNUV(this.e.dataCriacao) && !eNUV(this.e.dataExtincao)) {
        if (new Date(this.e.dataCriacao) >= new Date(this.e.dataExtincao))
          numeroErros++;
      }

      return numeroErros;
    },

    async validarEntidadeAlteracao(dados) {
      let numeroErros = 0;

      // Designação
      if (eNV(dados.designacao)) {
        numeroErros++;
      } else if (!eUndefined(dados.designacao)) {
        try {
          let existeDesignacao = await this.$request(
            "get",
            "/entidades/designacao?valor=" +
              encodeURIComponent(dados.designacao)
          );
          if (existeDesignacao.data) {
            numeroErros++;
          }
        } catch (err) {
          numeroErros++;
        }
      }

      // Internacional
      if (eNV(dados.internacional)) {
        numeroErros++;
      }

      // SIOE
      if (!eNUV(dados.sioe)) {
        if (dados.sioe.length > 12) numeroErros++;
      }

      //Data Criação
      if (!eNUV(dados.dataCriacao)) {
        if (eDataFormatoErrado(dados.dataCriacao)) {
          numeroErros++;
        }
      }

      return numeroErros;
    },

    validarEntidadeExtincao(dados) {
      let numeroErros = 0;

      // Data de Extinção
      if (eNUV(dados.dataExtincao)) {
        numeroErros++;
      } else if (!eNUV(dados.dataExtincao)) {
        if (eDataFormatoErrado(dados.dataExtincao)) {
          numeroErros++;
        }
      } else if (!eNUV(dados.dataCriacao) && !eNUV(dados.dataExtincao)) {
        if (new Date(dados.dataCriacao) >= new Date(dados.dataExtincao)) {
          numeroErros++;
        }
      }

      return numeroErros;
    },

    // Lança o pedido de criação da entidade no worflow
    async criarAlterarEntidade() {
      try {
        if (this.$store.state.name === "") {
          this.loginErrorSnackbar = true;
        } else {
          let erros = 0;
          let dataObj = JSON.parse(JSON.stringify(this.e));

          const historico = [];

          switch (this.acao) {
            case "Criação":
              if (
                dataObj.dataExtincao !== undefined &&
                dataObj.dataExtincao !== null &&
                dataObj.dataExtincao !== ""
              )
                dataObj.estado = "Inativa";

              erros = await this.validarEntidadeCriacao();

              historico.push(criarHistorico(dataObj));

              break;

            case "Alteração":
              dataObj = extrairAlteracoes(this.e, this.original);

              erros = await this.validarEntidadeAlteracao(dataObj);

              historico.push(criarHistorico(this.e, this.original));
              break;

            case "Extinção":
              erros = this.validarEntidadeExtincao(dataObj);

              for (const key in dataObj) {
                if (key !== "sigla" && key !== "dataExtincao")
                  delete dataObj[key];
              }

              historico.push({
                dataExtincao: {
                  cor: "amarelo",
                  dados: dataObj.dataExtincao,
                  nota: null,
                },
              });
              break;

            default:
              break;
          }

          if (erros === 0) {
            let userBD = this.$verifyTokenUser();

            let pedidoParams = {
              tipoPedido: this.acao,
              tipoObjeto: "Entidade",
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
        console.log("err", err);
        return err;
      }
    },

    criacaoPendenteTerminada: function() {
      this.$router.push("/");
    },

    // Cancela a criação da Entidade
    eliminarEntidade: function() {
      this.pedidoEliminado = true;
    },

    cancelarCriacaoEntidade: function() {
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
