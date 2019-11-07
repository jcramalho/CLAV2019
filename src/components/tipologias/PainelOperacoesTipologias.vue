<template>
  <div>
    <v-row class="ma-2 text-center">
      <v-col cols="3">
        <v-btn
          rounded
          class="indigo darken-3 white--text"
          :disabled="!t.sigla"
          @click="guardarTrabalho"
          >Guardar Trabalho</v-btn
        >
      </v-col>

      <ValidarTipologiaInfoBox :t="t" :acao="acao" />

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

      <!-- Trabalho pendente guardado com sucesso -->
      <v-dialog v-model="pendenteGuardado" width="60%">
        <v-card>
          <v-card-title>Trabalho pendente guardado</v-card-title>
          <v-card-text>
            <p>
              Os seus dados foram guardados para que possa retomar o trabalho
              mais tarde.
            </p>
            <p>{{ pendenteGuardadoInfo }}</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="indigo darken-1"
              dark
              @click="criacaoPendenteTerminada"
              >Fechar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

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

      <!-- Pedido de criação de tipologia submetido com sucesso -->
      <v-dialog v-model="dialogTipologiaCriada" width="70%">
        <v-card>
          <v-card-title
            >Pedido de {{ acao }} de Tipologia Submetido</v-card-title
          >
          <v-card-text>
            <v-row>
              <v-col cols="2">
                <div class="info-label">Designação:</div>
              </v-col>

              <v-col>
                <div class="info-content">{{ t.designacao }}</div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="2">
                <div class="info-label">Sigla:</div>
              </v-col>

              <v-col>
                <div class="info-content">{{ t.sigla }}</div>
              </v-col>
            </v-row>

            <v-row v-if="t.entidadesSel.length > 0">
              <v-col cols="2">
                <div class="info-label">Entidades:</div>
              </v-col>

              <v-col>
                <v-data-table
                  :headers="headers"
                  :items="t.entidadesSel"
                  class="elevation-1"
                  hide-default-footer
                ></v-data-table>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="indigo darken-1"
              dark
              @click="criacaoTipologiaTerminada"
              >Fechar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Cancelamento da criação de uma tipologia: confirmação -->
      <v-dialog v-model="pedidoEliminado" width="50%">
        <v-card>
          <v-card-title
            >Cancelamento e eliminação do pedido de criação da
            tipologia</v-card-title
          >
          <v-card-text>
            <p>Selecionou o cancelamento da criação da tipologia.</p>
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
  </div>
</template>

<script>
import ValidarTipologiaInfoBox from "@/components/tipologias/ValidarTipologiaInfoBox";

export default {
  props: ["t", "acao"],

  components: {
    ValidarTipologiaInfoBox
  },

  data() {
    return {
      pendenteGuardado: false,
      pendenteGuardadoInfo: "",
      loginErrorSnackbar: false,
      loginErrorMessage: "Precisa de fazer login para criar a Tipologia!",
      dialogTipologiaCriada: false,
      numeroErros: 0,
      errosValidacao: false,
      pedidoEliminado: false,
      headers: [
        { text: "Designação", value: "designacao", class: "subtitle-1" },
        { text: "Sigla", value: "sigla", class: "subtitle-1" }
      ]
    };
  },

  methods: {
    guardarTrabalho: async function() {
      try {
        if (this.$store.state.name === "") {
          this.loginErrorSnackbar = true;
        } else {
          let userBD = await this.$request(
            "get",
            "/api/users/listarToken/" + this.$store.state.token
          );
          let pendenteParams = {
            numInterv: 1,
            acao: this.acao,
            tipo: "Tipologia",
            objeto: this.t,
            criadoPor: userBD.data.email,
            user: { email: userBD.data.email },
            token: this.$store.state.token
          };
          let response = await this.$request(
            "post",
            "/api/pendentes",
            pendenteParams
          );
          this.pendenteGuardado = true;
          this.pendenteGuardadoInfo = JSON.stringify(response.data);
        }
      } catch (error) {
        return error;
      }
    },

    async validarTipologiaCriacao() {
      // Designação
      if (this.t.designacao == "" || this.t.designacao == null) {
        this.numeroErros++;
      } else {
        try {
          let existeDesignacao = await this.$request(
            "post",
            "/api/tipologias/verificarDesignacao",
            { designacao: this.t.designacao }
          );
          if (existeDesignacao.data) {
            this.numeroErros++;
          }
        } catch (err) {
          this.numeroErros++;
        }
      }

      // Sigla
      if (this.t.sigla == "" || this.t.sigla == null) {
        this.numeroErros++;
      } else {
        try {
          let existeSigla = await this.$request(
            "post",
            "/api/tipologias/verificarSigla",
            { sigla: this.t.sigla }
          );
          if (existeSigla.data) {
            this.numeroErros++;
          }
        } catch (err) {
          this.numeroErros++;
        }
      }

      return this.numeroErros;
    },

    validarTipologiaAlteracao() {
      // Designação
      if (this.t.designacao == "" || this.t.designacao == null) {
        this.numeroErros++;
      }

      // Sigla
      if (this.t.sigla == "" || this.t.sigla == null) {
        this.numeroErros++;
      }

      return this.numeroErros;
    },

    // Lança o pedido de criação da tipologia no worflow
    async criarAlterarTipologia() {
      try {
        if (this.$store.state.name === "") {
          this.loginErrorSnackbar = true;
        } else {
          let erros = 0;

          switch (this.acao) {
            case "Criação":
              erros = await this.validarTipologiaCriacao();
              break;

            case "Alteração":
              erros = this.validarTipologiaAlteracao();
              break;

            default:
              break;
          }

          if (erros == 0) {
            let userBD = await this.$request(
              "get",
              "/api/users/listarToken/" + this.$store.state.token
            );

            let dataObj = this.t;
            dataObj.codigo = "tip_" + this.t.sigla;

            let pedidoParams = {
              tipoPedido: this.acao,
              tipoObjeto: "Tipologia",
              novoObjeto: dataObj,
              user: { email: userBD.data.email },
              entidade: userBD.data.entidade,
              token: this.$store.state.token
            };

            let response = await this.$request(
              "post",
              "/api/pedidos",
              pedidoParams
            );
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

    criacaoTipologiaTerminada: function() {
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
