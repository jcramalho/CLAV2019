<template>
  <div>
    <v-row class="ma-2 text-center">
      <ValidarEntidadeInfoBox
        v-if="this.acao !== 'Extinção'"
        :e="e"
        :acao="acao"
      />

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

      <!-- Trabalho pendente guardado com sucesso
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
      </v-dialog> -->

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

      <!-- Pedido de "Ação" de entidade submetido com sucesso -->
      <v-dialog v-model="dialogEntidadeCriada" width="70%">
        <v-card>
          <v-card-title
            >Pedido de {{ acao }} de Entidade Submetido</v-card-title
          >
          <v-card-text>
            <v-row v-if="e.designacao">
              <v-col cols="2">
                <div class="info-label">Nome da Entidade:</div>
              </v-col>

              <v-col>
                <div class="info-content">{{ e.designacao }}</div>
              </v-col>
            </v-row>

            <v-row v-if="e.sigla">
              <v-col cols="2">
                <div class="info-label">Sigla:</div>
              </v-col>

              <v-col>
                <div class="info-content">{{ e.sigla }}</div>
              </v-col>
            </v-row>

            <v-row v-if="e.internacional">
              <v-col cols="2">
                <div class="info-label">Internacional:</div>
              </v-col>

              <v-col>
                <div class="info-content">{{ e.internacional }}</div>
              </v-col>
            </v-row>

            <v-row v-if="e.sioe">
              <v-col cols="2">
                <div class="info-label">SIOE:</div>
              </v-col>

              <v-col>
                <div class="info-content">{{ e.sioe }}</div>
              </v-col>
            </v-row>

            <v-row v-if="e.tipologiasSel.length > 0">
              <v-col cols="2">
                <div class="info-label">Tipologias:</div>
              </v-col>

              <v-col>
                <v-data-table
                  :headers="headers"
                  :items="e.tipologiasSel"
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
              @click="criacaoEntidadeTerminada"
              >Fechar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Cancelamento da criação de uma entidade: confirmação -->
      <v-dialog v-model="pedidoEliminado" width="50%">
        <v-card>
          <v-card-title>Cancelamento do pedido </v-card-title>
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

export default {
  props: ["e", "acao"],
  components: {
    ValidarEntidadeInfoBox
  },
  data() {
    return {
      pendenteGuardado: false,
      pendenteGuardadoInfo: "",
      loginErrorSnackbar: false,
      loginErrorMessage: "Precisa de fazer login para criar a Entidade!",
      dialogEntidadeCriada: false,
      numeroErros: 0,
      errosValidacao: false,
      pedidoEliminado: false,
      headers: [
        { text: "Sigla", value: "sigla", class: "subtitle-1" },
        { text: "Designação", value: "designacao", class: "subtitle-1" }
      ]
    };
  },

  methods: {
    validarEntidadeCriacao: async function() {
      // Designação
      if (this.e.designacao == "" || this.e.designacao == null) {
        this.numeroErros++;
      } else {
        try {
          let existeDesignacao = await this.$request(
            "get",
            "/api/entidades?existeDesignacao=" +
              encodeURIComponent(this.e.designacao)
          );
          if (existeDesignacao.data) {
            this.numeroErros++;
          }
        } catch (err) {
          this.numeroErros++;
        }
      }

      // Sigla
      if (this.e.sigla == "" || this.e.sigla == null) {
        this.numeroErros++;
      } else {
        try {
          let existeSigla = await this.$request(
            "get",
            "/api/entidades?existeSigla=" + encodeURIComponent(this.e.sigla)
          );
          if (existeSigla.data) {
            this.numeroErros++;
          }
        } catch (err) {
          this.numeroErros++;
        }
      }

      // Internacional
      if (this.e.internacional == "" || this.e.internacional == null) {
        this.numeroErros++;
      }

      // SIOE
      if (this.e.sioe != "" && this.e.sioe != null) {
        if (this.e.sioe.length > 12) {
          this.numeroErros++;
        }
      }

      return this.numeroErros;
    },

    validarEntidadeAlteracao() {
      // Designação
      if (this.e.designacao == "" || this.e.designacao == null) {
        this.numeroErros++;
      }

      // Sigla
      if (this.e.sigla == "" || this.e.sigla == null) {
        this.numeroErros++;
      }

      // Internacional
      if (this.e.internacional == "" || this.e.internacional == null) {
        this.numeroErros++;
      }

      // SIOE
      if (this.e.sioe != "" && this.e.sioe != null) {
        if (this.e.sioe.length > 12) {
          this.numeroErros++;
        }
      }

      return this.numeroErros;
    },

    // Lança o pedido de criação da entidade no worflow
    criarAlterarEntidade: async function() {
      try {
        if (this.$store.state.name === "") {
          this.loginErrorSnackbar = true;
        } else {
          let erros = 0;
          switch (this.acao) {
            case "Criação":
              erros = await this.validarEntidadeCriacao();
              break;

            case "Alteração":
              erros = this.validarEntidadeAlteracao();
              break;

            default:
              break;
          }

          if (erros == 0) {
            let userBD = await this.$request(
              "get",
              "/api/users/" + this.$store.state.token + "/token"
            );
            let dataObj = this.e;
            dataObj.codigo = "ent_" + this.e.sigla;
            let pedidoParams = {
              tipoPedido: this.acao,
              tipoObjeto: "Entidade",
              novoObjeto: dataObj,
              user: { email: userBD.data.email },
              entidade: userBD.data.entidade,
              token: this.$store.state.token
            };

            var response = await this.$request(
              "post",
              "/api/pedidos",
              pedidoParams
            );
            this.dialogEntidadeCriada = true;
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

    criacaoEntidadeTerminada: function() {
      this.$router.push("/");
    },

    // Cancela a criação da Entidade
    eliminarEntidade: function() {
      this.pedidoEliminado = true;
    },

    cancelarCriacaoEntidade: function() {
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
