<template>
  <div>
    <v-row class="ma-2 text-center">
      <ValidarClasseDocumentacaoApoioInfoBox :t="t" :acao="this.acao" />

      <v-col>
        <v-btn
          v-if="this.acao == 'Criação'"
          rounded
          class="indigo accent-4 white--text"
          @click="criarClasseDocumentacaoApoio"
          >Criar Classe da Documentação de Apoio</v-btn
        >

        <v-btn
          v-if="this.acao == 'Alteração'"
          rounded
          class="indigo accent-4 white--text"
          @click="criarClasseDocumentacaoApoio"
          >Editar Classe da Documentação de Apoio</v-btn
        >
      </v-col>

      <v-col>
        <v-btn
          v-if="this.acao == 'Criação'"
          dark
          rounded
          class="red darken-4"
          @click="eliminarClasseDocumentacaoApoio"
          >Cancelar Criação</v-btn
        >
        <v-btn
          v-else-if="this.acao == 'Alteração'"
          dark
          rounded
          class="red darken-4"
          @click="eliminarClasseDocumentacaoApoio"
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
      <v-dialog v-model="dialogClasseDocumentacaoApoioCriada" width="70%">
        <v-card>
          <v-card-title
            >{{ acao }} de Classe de Documentação de Apoio
            Submetida</v-card-title
          >
          <v-card-text>
            <v-row>
              <v-col cols="2">
                <div class="info-label">Classe:</div>
              </v-col>

              <v-col>
                <div class="info-content">{{ t.classe }}</div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="indigo darken-1"
              dark
              @click="criacaoClasseDocumentacaoApoioTerminada"
              >Fechar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Cancelamento da criação de uma Classe de Documentacao de Apoio: confirmação -->
      <v-dialog v-model="pedidoEliminado" width="50%">
        <v-card>
          <v-card-title
            >Cancelamento e eliminação do pedido de {{ acao }} da Classe da
            Documentação de apoio</v-card-title
          >
          <v-card-text>
            <p>
              Selecionou o cancelamento da {{ acao }} da Classe da Documentação
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
              @click="cancelarCriacaoClasseDocumentacaoApoio"
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
import ValidarClasseDocumentacaoApoioInfoBox from "@/components/documentacaoApoio/ValidarClasseDocumentacaoApoioInfoBox";
export default {
  props: ["t", "acao"],

  components: {
    ValidarClasseDocumentacaoApoioInfoBox
  },

  data() {
    return {
      classes: [],
      pendenteGuardado: false,
      pendenteGuardadoInfo: "",
      loginErrorSnackbar: false,
      loginErrorMessage:
        "Precisa de fazer login para criar a documentação de apoio!",
      dialogClasseDocumentacaoApoioCriada: false,
      numeroErros: 0,
      errosValidacao: false,
      pedidoEliminado: false,
      headers: [{ text: "Classe", value: "classe", class: "subtitle-1" }]
    };
  },

  methods: {
    async validarClasseDocumentacaoApoio() {
      this.numeroErros = 0;
      // Classe
      if (this.t.classe == "" || this.t.classe == null) {
        this.numeroErros++;
      }
      let index = this.classes.indexOf(this.t.classe);
      if (index > -1) {
        this.numeroErros++;
      }
      return this.numeroErros;
    },

    // Lança o pedido de criação da Documentação de Apoio no worflow
    async criarClasseDocumentacaoApoio() {
      try {
        if (this.$store.state.name === "") {
          this.loginErrorSnackbar = true;
        } else {
          let erros = 0;

          switch (this.acao) {
            case "Criação":
              erros = await this.validarClasseDocumentacaoApoio();
              if (erros == 0) {
                let pack = {
                  classe: this.t.classe
                };
                let response = await this.$request(
                  "post",
                  "/documentacaoApoio/",
                  pack
                );
                this.dialogClasseDocumentacaoApoioCriada = true;
              } else {
                this.errosValidacao = true;
              }
              break;
            case "Alteração":
              erros = await this.validarClasseDocumentacaoApoio();
              if (erros == 0) {
                let pack = {
                  classe: this.t.classe
                };
                let response = await this.$request(
                  "put",
                  "/documentacaoApoio/" + this.t._id,
                  pack
                );
                this.dialogClasseDocumentacaoApoioCriada = true;
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

    criacaoClasseDocumentacaoApoioTerminada: function() {
      this.$router.push("/");
    },

    // Cancela a criação da documentação de apoio
    eliminarClasseDocumentacaoApoio: function() {
      this.pedidoEliminado = true;
    },

    cancelarCriacaoClasseDocumentacaoApoio: function() {
      this.$router.push("/");
    }
  },
  created: async function() {
    let response = await this.$request("get", "/documentacaoApoio/classes");
    this.classes = response.data;
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
