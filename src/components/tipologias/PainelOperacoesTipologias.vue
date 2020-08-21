<template>
  <div>
    <v-row class="align-center pa-3" style="text-align:center;">
      <ValidarTipologiaInfoBox :t="t" :original="original" :acao="acao" />

      <v-col>
        <v-btn
          v-if="this.acao == 'Criação'"
          @click="criarAlterarTipologia"
          color="success darken-1"
          rounded
          class="white--text"
          :class="{
            'px-8': $vuetify.breakpoint.lgAndUp,
            'px-2': $vuetify.breakpoint.mdAndDown
          }"
          id="botao-verde"
        >
          <unicon
            name="adicionar-icon"
            width="20"
            height="20"
            viewBox="0 0 20.71 20.71"
            fill="#ffffff"
          />
          <p class="ml-2">Criar</p>
        </v-btn>
        <v-btn
          v-else-if="this.acao == 'Alteração'"
          @click="criarAlterarTipologia"
          color="success darken-1"
          rounded
          class="white--text"
          :class="{
            'px-8': $vuetify.breakpoint.lgAndUp,
            'px-2': $vuetify.breakpoint.mdAndDown
          }"
          id="botao-verde"
        >
          <unicon
            name="alterar-icon"
            width="20"
            height="20"
            viewBox="0 0 20.71 20.727"
            fill="#ffffff"
          />
          <p class="ml-2">Alterar</p>
        </v-btn>
      </v-col>

      <v-col>
        <v-btn
          @click="eliminarTipologia"
          color="red darken-4"
          rounded
          class="white--text"
          :class="{
            'px-8': $vuetify.breakpoint.lgAndUp,
            'px-2': $vuetify.breakpoint.mdAndDown
          }"
          id="botao-vermelho"
        >
          <unicon
            name="remove-icon"
            width="20"
            height="20"
            viewBox="0 0 20.71 20.697"
            fill="#ffffff"
          />
          <p class="ml-2">
            Cancelar
          </p>
        </v-btn>
      </v-col>
    </v-row>
    <!-- Erros de Validação -->
    <v-row justify-center>
      <v-dialog v-model="errosValidacao" width="60%">
        <v-card dark class="info-card">
          <v-card-title class="headline mb-2"
            >Erros detetados na validação</v-card-title
          >
          <div class="info-content px-3 mx-6 mb-2">
            <v-card-text class="pa-2 px-4 font-weight-medium">
              <p>
                Há erros de validação. Selecione "Validar" para ver exatamente
                quais e proceder à sua correção.
              </p>
            </v-card-text>
          </div>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="red darken-4"
              rounded
              dark
              elevation="0"
              class="px-4"
              @click="errosValidacao = false"
            >
              Fechar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <!-- Pedido de criação de tipologia submetido com sucesso -->
    <v-row justify-center>
      <v-dialog v-model="dialogTipologiaCriada" persistent max-width="60%">
        <DialogTipologiaSucesso
          :t="t"
          :codigoPedido="codigoPedido"
          :acao="acao"
        />
      </v-dialog>
    </v-row>

    <!-- Cancelamento da criação de uma tipologia: confirmação -->
    <v-row justify-center>
      <v-dialog v-model="pedidoEliminado" persistent max-width="60%">
        <v-card dark class="info-card">
          <v-card-title class="headline mb-2">
            Cancelamento e eliminação do pedido de criação de tipologia de
            entidade
          </v-card-title>
          <div class="info-content px-3 mx-6 mb-2">
            <v-card-text class="pa-2 px-4 font-weight-medium">
              <p>
                Selecionou o cancelamento do pedido de criação de tipologia de
                entidade.
              </p>
              <p>Toda a informação introduzida será eliminada.</p>
              <p>
                Confirme a decisão para ser reencaminhado para a página
                principal.
              </p>
            </v-card-text>
          </div>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="success darken-1"
              rounded
              dark
              elevation="0"
              class="px-4"
              @click="cancelarCriacaoTipologia"
            >
              Confirmo
            </v-btn>
            <v-btn
              color="red darken-4"
              rounded
              dark
              elevation="0"
              class="px-4"
              @click="pedidoEliminado = false"
            >
              Enganei-me, desejo continuar o trabalho
            </v-btn>
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
        <v-btn icon color="white" @click="loginErrorSnackbar = false">
          <unicon
            name="remove-icon"
            width="15"
            height="15"
            viewBox="0 0 20.71 20.697"
            fill="#ffffff"
          />
        </v-btn>
      </v-snackbar>
    </v-row>
  </div>
</template>

<script>
import ValidarTipologiaInfoBox from "@/components/tipologias/ValidarTipologiaInfoBox";
import DialogTipologiaSucesso from "@/components/tipologias/DialogTipologiaSucesso";

import {
  comparaArraySel,
  criarHistorico,
  extrairAlteracoes
} from "@/utils/utils";

export default {
  props: ["t", "acao", "original"],

  components: {
    ValidarTipologiaInfoBox,
    DialogTipologiaSucesso
  },

  data() {
    return {
      loginErrorSnackbar: false,
      loginErrorMessage: "Precisa de fazer login para criar a Tipologia!",
      dialogTipologiaCriada: false,
      codigoPedido: "",
      errosValidacao: false,
      pedidoEliminado: false
    };
  },

  methods: {
    async validarTipologiaCriacao() {
      let numeroErros = 0;

      // Designação
      if (this.t.designacao === "" || this.t.designacao === null) {
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
      if (this.t.sigla === "" || this.t.sigla === null) {
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
      if (dados.designacao === "" || dados.designacao === null) {
        numeroErros++;
      } else if (dados.designacao !== undefined) {
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
            let userBD = this.$verifyTokenUser();

            let pedidoParams = {
              tipoPedido: this.acao,
              tipoObjeto: "Tipologia",
              novoObjeto: dataObj,
              user: { email: userBD.email },
              entidade: userBD.entidade,
              token: this.$store.state.token,
              historico: historico
            };

            if (this.original !== undefined)
              pedidoParams.objetoOriginal = this.original;
            else pedidoParams.objetoOriginal = dataObj;

            const codigoPedido = await this.$request(
              "post",
              "/pedidos",
              pedidoParams
            );

            this.codigoPedido = codigoPedido.data;

            this.dialogTipologiaCriada = true;
          } else {
            this.errosValidacao = true;
          }
        }
      } catch (err) {
        return err;
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
    }
  }
};
</script>

<style scoped>
.info-card {
  background: linear-gradient(to right, #19237e 0%, #0056b6 100%);
  text-shadow: 0px 1px 2px rgba(255, 255, 255, 0.22) !important;
}
.info-content {
  padding: 8px;
  background-color: #f1f6f8 !important;
  color: #606060;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}
</style>
