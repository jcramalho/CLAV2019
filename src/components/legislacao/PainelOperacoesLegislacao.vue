<template>
  <div>
    <v-row class="align-center pa-3" style="text-align:center;">
      <ValidarLegislacaoInfoBox :l="l" :original="original" :acao="acao" />

      <v-col>
        <v-btn
          v-if="this.acao == 'Criação'"
          @click="criarAlterarLegislacao"
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
          @click="criarAlterarLegislacao"
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
          @click="eliminarLegislacao"
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

    <!-- Pedido de criação de legislacao submetido com sucesso -->
    <v-row justify-center>
      <v-dialog v-model="dialogLegislacaoCriada" persistent max-width="60%">
        <DialogLegislacaoSucesso
          :l="l"
          :codigoPedido="codigoPedido"
          :acao="acao"
        />
      </v-dialog>
    </v-row>

    <!-- Cancelamento da criação de uma legislacao: confirmação -->
    <v-row justify-center>
      <v-dialog v-model="pedidoEliminado" persistent max-width="60%">
        <v-card dark class="info-card">
          <v-card-title class="headline mb-2">
            Cancelamento e eliminação do pedido de criação de um diploma
          </v-card-title>
          <div class="info-content px-3 mx-6 mb-2">
            <v-card-text class="pa-2 px-4 font-weight-medium">
              <p>
                Selecionou o cancelamento do pedido de criação de um diploma.
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
              @click="cancelarCriacaoLegislacao"
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
import ValidarLegislacaoInfoBox from "@/components/legislacao/ValidarLegislacaoInfoBox";
import DialogLegislacaoSucesso from "@/components/legislacao/DialogLegislacaoSucesso";

import {
  comparaArraySel,
  criarHistorico,
  extrairAlteracoes
} from "@/utils/utils";

export default {
  props: ["l", "acao", "original"],

  components: {
    ValidarLegislacaoInfoBox,
    DialogLegislacaoSucesso
  },

  data() {
    return {
      pendenteGuardado: false,
      pendenteGuardadoInfo: "",
      loginErrorSnackbar: false,
      loginErrorMessage: "Precisa de fazer login para criar o Diploma!",
      dialogLegislacaoCriada: false,
      codigoPedido: "",
      errosValidacao: false,
      pedidoEliminado: false
    };
  },

  methods: {
    async validarLegislacaoCriacao() {
      let numeroErros = 0;

      // Tipo
      if (this.l.tipo === "" || this.l.tipo === null) {
        numeroErros++;
      }

      // Número Diploma
      if (this.l.numero === "" || this.l.numero === null) {
        numeroErros++;
      }

      // Data
      if (this.l.data === "" || this.l.data === null) {
        numeroErros++;
      } else if (!/[0-9]+-[0-9]+-[0-9]+/.test(this.l.data)) {
        numeroErros++;
      }

      // Sumário
      if (this.l.sumario === "" || this.l.sumario === null) {
        numeroErros++;
      }

      // Data revogação
      if (
        this.l.data !== "" &&
        this.l.data !== null &&
        this.l.data !== undefined &&
        this.l.dataRevogacao !== "" &&
        this.l.dataRevogacao !== null &&
        this.l.dataRevogacao !== undefined
      ) {
        if (new Date(this.l.data) >= new Date(this.l.dataRevogacao)) {
          numeroErros++;
        }
      }

      return numeroErros;
    },

    validarLegislacaoAlteracao(dados) {
      let numeroErros = 0;

      // Sumário
      if (dados.sumario === "" || dados.sumario === null) {
        numeroErros++;
      }

      // Data revogação
      if (
        dados.data !== "" &&
        dados.data !== null &&
        dados.data !== undefined &&
        dados.dataRevogacao !== "" &&
        dados.dataRevogacao !== null &&
        dados.dataRevogacao !== undefined
      ) {
        if (new Date(dados.data) >= new Date(dados.dataRevogacao)) {
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

            default:
              break;
          }

          if (erros === 0) {
            let userBD = this.$verifyTokenUser();

            let pedidoParams = {
              tipoPedido: this.acao,
              tipoObjeto: "Legislação",
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

            this.dialogLegislacaoCriada = true;
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

    // Cancela a criação da Legislacao
    eliminarLegislacao: function() {
      this.pedidoEliminado = true;
    },

    cancelarCriacaoLegislacao: function() {
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
