<template>
  <div>
    <v-row class="ma-2 text-center">
      <ValidarEntradaDocumentacaoApoioInfoBox :t="t" :acao="this.acao" />

      <v-col>
        <v-btn
          v-if="this.acao == 'Criação'"
          rounded
          class="indigo accent-4 white--text"
          @click="criarEntradaDocumentacaoApoio"
          >Criar Entrada na Documentação de Apoio</v-btn
        >
        <v-btn
          v-if="this.acao == 'Alteração'"
          rounded
          class="indigo accent-4 white--text"
          @click="criarEntradaDocumentacaoApoio"
          >Editar Entrada na Documentação de Apoio</v-btn
        >
      </v-col>

      <v-col>
        <v-btn
          v-if="this.acao == 'Criação'"
          dark
          rounded
          class="red darken-4"
          @click="eliminarEntradaDocumentacaoApoio"
          >Cancelar Criação</v-btn
        >
        <v-btn
          v-else-if="this.acao == 'Alteração'"
          dark
          rounded
          class="red darken-4"
          @click="eliminarEntradaDocumentacaoApoio"
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
              Há erros de validação. Selecione "Validar" para ver exatamente
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

      <!-- Criação/Alteração de Documentacao Cientifica submetido com sucesso -->
      <v-dialog v-model="dialogEntradaDocumentacaoApoioCriada" width="70%">
        <v-card>
          <v-card-title
            >{{ acao }} de Entrada de Documentação de Apoio
            Submetida</v-card-title
          >
          <v-card-text>
            <v-row>
              <v-col cols="2">
                <div class="info-label">Descrição:</div>
              </v-col>

              <v-col>
                <div class="info-content">{{ t.descricao }}</div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="indigo darken-1"
              dark
              @click="criacaoEntradaDocumentacaoApoioTerminada"
              >Fechar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Cancelamento da criação de uma Entrada de Documentacao de Apoio: confirmação -->
      <v-dialog v-model="pedidoEliminado" width="50%">
        <v-card>
          <v-card-title
            >Cancelamento e eliminação do pedido de {{ acao }} da Entrada da
            Documentação de apoio</v-card-title
          >
          <v-card-text>
            <p>
              Selecionou o cancelamento da {{ acao }} da Entrada da Documentação
              de apoio.
            </p>
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
              @click="cancelarCriacaoEntradaDocumentacaoApoio"
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
import ValidarEntradaDocumentacaoApoioInfoBox from "@/components/documentacaoApoio/ValidarEntradaDocumentacaoApoioInfoBox";
export default {
  props: ["t", "acao"],

  components: {
    ValidarEntradaDocumentacaoApoioInfoBox
  },

  data() {
    return {
      idDoc: this.$route.path.split("/")[4],
      pendenteGuardado: false,
      pendenteGuardadoInfo: "",
      loginErrorSnackbar: false,
      loginErrorMessage:
        "Precisa de fazer login para criar a documentação de apoio!",
      dialogEntradaDocumentacaoApoioCriada: false,
      numeroErros: 0,
      errosValidacao: false,
      pedidoEliminado: false,
      headers: [{ text: "Descrição", value: "descricao", class: "subtitle-1" }]
    };
  },

  methods: {
    async validarEntradaDocumentacaoApoio() {
      this.numeroErros = 0;
      if (this.t.descricao == "" || this.t.descricao == null) {
        this.numeroErros++;
      }
      return this.numeroErros;
    },

    // Lança o pedido de criação da Documentação de Apoio no worflow
    async criarEntradaDocumentacaoApoio() {
      try {
        if (this.$store.state.name === "") {
          this.loginErrorSnackbar = true;
        } else {
          let erros = 0;

          switch (this.acao) {
            case "Criação":
              erros = await this.validarEntradaDocumentacaoApoio();
              if (erros == 0) {
                let obj = { descricao: this.t.descricao };
                let response = await this.$request(
                  "post",
                  "/documentacaoApoio/" + this.idDoc,
                  obj
                );
                this.dialogEntradaDocumentacaoApoioCriada = true;
              } else {
                this.errosValidacao = true;
              }
              break;
            case "Alteração":
              erros = await this.validarEntradaDocumentacaoApoio();
              if (erros == 0) {
                let obj = { descricao: this.t.descricao };
                let response = await this.$request(
                  "put",
                  "/documentacaoApoio/" +
                    this.t.idDoc +
                    "/entradas/" +
                    this.t.idEntrada,
                  obj
                );
                this.dialogEntradaDocumentacaoApoioCriada = true;
              } else {
                this.errosValidacao = true;
              }
              break;
            default:
          }
        }
      } catch (err) {
        return err;
      }
    },

    criacaoPendenteTerminada: function() {
      this.$router.push("/");
    },

    criacaoEntradaDocumentacaoApoioTerminada: function() {
      this.$router.push("/");
    },

    // Cancela a criação da documentação de apoio
    eliminarEntradaDocumentacaoApoio: function() {
      this.pedidoEliminado = true;
    },

    cancelarCriacaoEntradaDocumentacaoApoio: function() {
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
