<template>
  <div>
    <v-row class="ma-2 text-center">
      <ValidarDocumentacaoCientificaInfoBox :t="t" :acao="this.acao" />
      <v-col>
        <v-btn
          v-if="this.acao == 'Criação'"
          rounded
          class="indigo accent-4 white--text"
          @click="criarClasseDocumentacaoCientifica"
          >Criar Entrada na Documentação Científica</v-btn
        >
        <v-btn
          v-if="this.acao == 'Alteração'"
          rounded
          class="indigo accent-4 white--text"
          @click="criarClasseDocumentacaoCientifica"
          >Alterar Entrada na Documentação Científica</v-btn
        >
      </v-col>

      <v-col>
        <v-btn
          v-if="this.acao == 'Criação'"
          dark
          rounded
          class="red darken-4"
          @click="eliminarClasseDocumentacaoCientifica"
          >Cancelar Criação</v-btn
        >
        <v-btn
          v-else-if="this.acao == 'Alteração'"
          dark
          rounded
          class="red darken-4"
          @click="eliminarClasseDocumentacaoCientifica"
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
      <v-dialog v-model="dialogClasseDocumentacaoCientificaCriada" width="70%">
        <v-card>
          <v-card-title
            >{{ acao }} de Entrada na Documentação Científica
            Submetida</v-card-title
          >
          <v-card-text>
            <v-row>
              <v-col cols="2">
                <div class="info-label">Tipo:</div>
              </v-col>

              <v-col>
                <div class="info-content">{{ t.classe }}</div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="2">
                <div class="info-label">Título:</div>
              </v-col>

              <v-col>
                <div class="info-content">{{ t.titulo }}</div>
              </v-col>
            </v-row>

            <v-row v-if="t.url == 'FICHEIRO'">
              <v-col cols="2">
                <div class="info-label">Ficheiro:</div>
              </v-col>

              <v-col>
                <div class="info-content">
                  {{
                    t.ficheiro !== null && t.ficheiro !== undefined
                      ? t.ficheiro.name
                        ? t.ficheiro.name
                        : t.ficheiro.nome
                        ? t.ficheiro.nome
                        : ""
                      : ""
                  }}
                </div>
              </v-col>
            </v-row>

            <v-row v-else>
              <v-col cols="2">
                <div class="info-label">URL:</div>
              </v-col>

              <v-col>
                <div class="info-content">{{ t.url }}</div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="2">
                <div class="info-label">Local:</div>
              </v-col>

              <v-col>
                <div class="info-content">{{ t.local }}</div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="2">
                <div class="info-label">Ano:</div>
              </v-col>

              <v-col>
                <div class="info-content">{{ t.ano }}</div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="2">
                <div class="info-label">Visivel:</div>
              </v-col>

              <v-col>
                <div class="info-content">
                  {{ t.visivel == true ? "Sim" : "Não" }}
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="2">
                <div class="info-label">Autores:</div>
              </v-col>

              <v-col v-if="acao == 'Criação'">
                <div class="info-content">
                  {{
                    t.autores !== undefined
                      ? t.autores
                          .map(a => {
                            return a.nome;
                          })
                          .join(", ")
                      : ""
                  }}
                </div>
              </v-col>
              <v-col v-if="acao == 'Alteração'">
                <div class="info-content">
                  {{ t.autores !== undefined ? t.autores.join(", ") : "" }}
                </div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="indigo darken-1"
              dark
              @click="criacaoClasseDocumentacaoCientificaTerminada"
              >Fechar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Cancelamento da criação de uma Entrada na Documentacao Científica: confirmação -->
      <v-dialog v-model="pedidoEliminado" width="50%">
        <v-card>
          <v-card-title
            >Cancelamento e eliminação do pedido de {{ acao }} da Entrada na
            Documentação Científica</v-card-title
          >
          <v-card-text>
            <p>
              Selecionou o cancelamento da {{ acao }} da Entrada na Documentação
              Científica.
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
              @click="cancelarCriacaoClasseDocumentacaoCientifica"
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
import ValidarDocumentacaoCientificaInfoBox from "@/components/documentacaoApoio/ValidarDocumentacaoCientificaInfoBox";
export default {
  props: ["t", "acao"],

  components: {
    ValidarDocumentacaoCientificaInfoBox
  },

  data() {
    return {
      pendenteGuardado: false,
      pendenteGuardadoInfo: "",
      loginErrorSnackbar: false,
      loginErrorMessage:
        "Precisa de fazer login para criar a documentação Científica!",
      dialogClasseDocumentacaoCientificaCriada: false,
      numeroErros: 0,
      errosValidacao: false,
      pedidoEliminado: false,
      headers: [
        { text: "Classe", value: "classe", class: "subtitle-1" },
        { text: "Título", value: "titulo", class: "subtitle-1" },
        { text: "URL", value: "url", class: "subtitle-1" },
        { text: "Local", value: "local", class: "subtitle-1" },
        { text: "Autores", value: "autores", class: "subtitle-1" },
        { text: "Ano", value: "ano", class: "subtitle-1" },
        { text: "Ficheiro", value: "ficheiro", class: "subtitle-1" },
        { text: "Visivel", value: "visivel", class: "subtitle-1" }
      ]
    };
  },

  methods: {
    async validarClasseDocumentacaoCientifica() {
      this.numeroErros = 0;
      // Tipo
      if (this.t.classe == "" || this.t.classe == null) {
        this.numeroErros++;
      }
      // Titulo
      if (this.t.titulo == "" || this.t.titulo == null) {
        this.numeroErros++;
      }
      // Formato
      if (
        this.t.url == "" ||
        this.t.url == null ||
        (this.t.ficheiro == null && this.t.url == "FICHEIRO")
      ) {
        this.numeroErros++;
      }
      // Local
      if (this.t.local == "" || this.t.local == null) {
        this.numeroErros++;
      }
      // Ano
      if (this.t.ano == "" || this.t.ano == null) {
        this.numeroErros++;
      }
      // Autores
      if (this.acao == "Criação") {
        for (let i = 0; i < this.t.autores.length; i++) {
          if (this.t.autores[i].nome == "" || this.t.autores[i].nome == null) {
            this.numeroErros++;
          }
        }
      } else if (this.acao == "Alteração") {
        for (let i = 0; i < this.t.autores.length; i++) {
          if (this.t.autores[i] == "" || this.t.autores[i] == null) {
            this.numeroErros++;
          }
        }
      }

      return this.numeroErros;
    },

    // Lança o pedido de criação da Documentação Científica no worflow
    async criarClasseDocumentacaoCientifica() {
      try {
        if (this.$store.state.name === "") {
          this.loginErrorSnackbar = true;
        } else {
          let erros = 0;

          switch (this.acao) {
            case "Criação":
              erros = await this.validarClasseDocumentacaoCientifica();
              if (erros == 0) {
                var formData = new FormData();
                formData.append("classe", this.t.classe);
                formData.append("titulo", this.t.titulo);
                formData.append("url", this.t.url);
                formData.append("local", this.t.local);
                formData.append("ano", this.t.ano);
                formData.append("visivel", this.t.visivel);
                formData.append(
                  "autores",
                  this.t.autores.map(a => {
                    return a.nome;
                  })
                );
                if (this.t.ficheiro != null) {
                  formData.append("file", this.t.ficheiro);
                }

                var response = await this.$request(
                  "post",
                  "/documentacaoCientifica",
                  formData
                );
                this.dialogClasseDocumentacaoCientificaCriada = true;
              } else {
                this.errosValidacao = true;
              }
              break;
            case "Alteração":
              erros = await this.validarClasseDocumentacaoCientifica();
              if (erros == 0) {
                let formData = new FormData();
                formData.append("classe", this.t.classe);
                formData.append("titulo", this.t.titulo);
                formData.append("url", this.t.url);
                formData.append("local", this.t.local);
                formData.append("ano", this.t.ano);
                formData.append("visivel", this.t.visivel);
                formData.append("autores", this.t.autores);
                if (this.t.ficheiro != null) {
                  formData.append("file", this.t.ficheiro);
                }
                let response = await this.$request(
                  "put",
                  "/documentacaoCientifica/" + this.t._id,
                  formData
                );
                this.dialogClasseDocumentacaoCientificaCriada = true;
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

    criacaoClasseDocumentacaoCientificaTerminada: function() {
      this.$router.push("/");
    },

    // Cancela a criação da documentação Científica
    eliminarClasseDocumentacaoCientifica: function() {
      this.pedidoEliminado = true;
    },

    cancelarCriacaoClasseDocumentacaoCientifica: function() {
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
