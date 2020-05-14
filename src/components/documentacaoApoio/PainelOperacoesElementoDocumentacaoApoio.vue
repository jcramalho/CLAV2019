<template>
  <div>
    <v-row class="ma-2 text-center">
      <ValidarElementoDocumentacaoApoioInfoBox :t="t" :acao="this.acao" />
      <v-col>
        <v-btn
          v-if="this.acao == 'Criação'"
          rounded
          class="indigo accent-4 white--text"
          @click="criarElementoDocumentacaoApoio"
          >Criar Elemento na Documentação de Apoio</v-btn
        >

        <v-btn
          v-if="this.acao == 'Alteração'"
          rounded
          class="indigo accent-4 white--text"
          @click="criarElementoDocumentacaoApoio"
          >Alterar Elemento na Documentação de Apoio</v-btn
        >
      </v-col>

      <v-col>
        <v-btn
          v-if="this.acao == 'Criação'"
          dark
          rounded
          class="red darken-4"
          @click="eliminarElementoDocumentacaoApoio"
          >Cancelar Criação</v-btn
        >
        <v-btn
          v-else-if="this.acao == 'Alteração'"
          dark
          rounded
          class="red darken-4"
          @click="eliminarElementoDocumentacaoApoio"
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
      <v-dialog v-model="dialogElementoDocumentacaoApoioCriada" width="70%">
        <v-card>
          <v-card-title
            >{{ acao }} de Elemento de Documentação de Apoio
            Submetida</v-card-title
          >
          <v-card-text>
            <v-row v-if="t.ficheiro != null">
              <v-col cols="2">
                <div class="info-label">Ficheiro:</div>
              </v-col>

              <v-col>
                <div class="info-content">{{ t.ficheiro.name }}</div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="2">
                <div class="info-label">Texto:</div>
              </v-col>

              <v-col>
                <div class="info-content">{{ t.texto }}</div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="2">
                <div class="info-label">Visível:</div>
              </v-col>

              <v-col>
                <div class="info-content">
                  {{ t.visivel == true ? "Sim" : "Não" }}
                </div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="indigo darken-1"
              dark
              @click="criacaoElementoDocumentacaoApoioTerminada"
              >Fechar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Cancelamento da criação de uma Elemento de Documentacao de Apoio: confirmação -->
      <v-dialog v-model="pedidoEliminado" width="50%">
        <v-card>
          <v-card-title
            >Cancelamento e eliminação do pedido de {{ acao }} da Elemento da
            Documentação de apoio</v-card-title
          >
          <v-card-text>
            <p>
              Selecionou o cancelamento da {{ acao }} da Elemento da
              Documentação de apoio.
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
              @click="cancelarCriacaoElementoDocumentacaoApoio"
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
import ValidarElementoDocumentacaoApoioInfoBox from "@/components/documentacaoApoio/ValidarElementoDocumentacaoApoioInfoBox";
export default {
  props: ["t", "acao"],

  components: {
    ValidarElementoDocumentacaoApoioInfoBox
  },

  data() {
    return {
      idDoc: this.$route.path.split("/")[4],
      idEntrada: this.$route.path.split("/")[5],
      pendenteGuardado: false,
      pendenteGuardadoInfo: "",
      loginErrorSnackbar: false,
      loginErrorMessage:
        "Precisa de fazer login para criar a documentação de apoio!",
      dialogElementoDocumentacaoApoioCriada: false,
      numeroErros: 0,
      errosValidacao: false,
      pedidoEliminado: false,
      headers: [
        { text: "Texto", value: "t.texto", class: "subtitle-1" },
        { text: "Ficheiro", value: "t.ficheiro.name", class: "subtitle-1" },
        { text: "Visibilidade", value: "t.visivel", class: "subtitle-1" }
      ]
    };
  },

  methods: {
    async validarElementoDocumentacaoApoio() {
      this.numeroErros = 0;
      if (this.t.texto == "" || this.t.texto == null) {
        this.numeroErros++;
      }
      if (this.t.visivel == "" || this.t.visivel == null) {
        this.numeroErros++;
      }
      if (
        this.t.ficheiro != null &&
        this.t.texto.search(/\[.+\]\(FICHEIRO\)/) == -1
      ) {
        this.numeroErros++;
      }
      if (
        this.t.ficheiro == null &&
        this.t.texto.search(/\[.+\]\(FICHEIRO\)/) > -1
      ) {
        this.numeroErros++;
      }
      return this.numeroErros;
    },

    // Lança o pedido de criação da Documentação de Apoio no worflow
    async criarElementoDocumentacaoApoio() {
      try {
        if (this.$store.state.name === "") {
          this.loginErrorSnackbar = true;
        } else {
          let erros = 0;
          switch (this.acao) {
            case "Criação":
              erros = await this.validarElementoDocumentacaoApoio();

              if (erros == 0) {
                var formData = new FormData();
                formData.append("texto", this.t.texto);
                formData.append("visivel", this.t.visivel);
                if (this.t.ficheiro != null) {
                  formData.append("file", this.t.ficheiro);
                }
                let response = await this.$request(
                  "post",
                  "/documentacaoApoio/" +
                    this.idDoc +
                    "/entradas/" +
                    this.idEntrada,
                  formData
                );
                this.dialogElementoDocumentacaoApoioCriada = true;
              } else {
                this.errosValidacao = true;
              }
              break;
            case "Alteração":
              erros = await this.validarElementoDocumentacaoApoio();

              if (erros == 0) {
                var formData = new FormData();
                formData.append("texto", this.t.texto);
                formData.append("visivel", this.t.visivel);
                if (this.t.ficheiro != null) {
                  formData.append("file", this.t.ficheiro);
                }
                if (this.t.eraseFile == true) {
                  formData.append("apagar_ficheiro", true);
                }
                let response = await this.$request(
                  "put",
                  "/documentacaoApoio/" +
                    this.t.idDoc +
                    "/entradas/" +
                    this.t.idEntrada +
                    "/elementos/" +
                    this.t.idElemento,
                  formData
                );
                this.dialogElementoDocumentacaoApoioCriada = true;
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

    criacaoElementoDocumentacaoApoioTerminada: function() {
      this.$router.push("/");
    },

    // Cancela a criação da documentação de apoio
    eliminarElementoDocumentacaoApoio: function() {
      this.pedidoEliminado = true;
    },

    cancelarCriacaoElementoDocumentacaoApoio: function() {
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
