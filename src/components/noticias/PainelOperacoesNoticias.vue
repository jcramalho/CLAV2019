<template>
  <div>
    <v-row class="ma-2 text-center">
      <ValidarNoticiaInfoBox :t="t" :acao="this.acao" />

      <v-col>
        <v-btn
          v-if="this.acao == 'Criação'"
          rounded
          class="indigo accent-4 white--text"
          @click="criarAlterarNoticia"
          >Criar Notícia</v-btn
        >
        <v-btn
          v-else-if="this.acao == 'Alteração'"
          rounded
          class="indigo accent-4 white--text"
          @click="criarAlterarNoticia"
          >Alterar Notícia</v-btn
        >
      </v-col>

      <v-col>
        <v-btn
          v-if="this.acao == 'Criação'"
          dark
          rounded
          class="red darken-4"
          @click="eliminarNoticia"
          >Cancelar Criação</v-btn
        >
        <v-btn
          v-else-if="this.acao == 'Alteração'"
          dark
          rounded
          class="red darken-4"
          @click="eliminarNoticia"
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

      <!-- Criação/Alteração de noticia submetido com sucesso -->
      <v-dialog v-model="dialogNoticiaCriada" width="70%">
        <v-card>
          <v-card-title>{{ acao }} de Noticia Submetida</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="2">
                <div class="info-label">Título</div>
              </v-col>

              <v-col>
                <div class="info-content">{{ t.titulo }}</div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="2">
                <div class="info-label">Data</div>
              </v-col>

              <v-col>
                <div class="info-content">{{ t.data }}</div>
              </v-col>
            </v-row>

            <v-row v-if="acao == 'Alteração'">
              <v-col cols="2">
                <div class="info-label">Publicada</div>
              </v-col>

              <v-col>
                <div class="info-content">
                  {{ t.ativa == true ? "Sim" : "Não" }}
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="2">
                <div class="info-label">Descrição</div>
              </v-col>

              <v-col>
                <div class="info-content">{{ t.desc }}</div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="indigo darken-1" dark @click="criacaoNoticiaTerminada"
              >Fechar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Cancelamento da criação de uma noticia: confirmação -->
      <v-dialog v-model="pedidoEliminado" width="50%">
        <v-card>
          <v-card-title
            >Cancelamento e eliminação do pedido de {{ acao }} da
            noticia</v-card-title
          >
          <v-card-text>
            <p>Selecionou o cancelamento da {{ acao }} da notícia.</p>
            <p>Toda a informação introduzida será eliminada.</p>
            <p>
              Confirme a decisão para ser reencaminhado para a página principal.
            </p>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="indigo darken-1" text @click="cancelarCriacaoNoticia"
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
import ValidarNoticiaInfoBox from "@/components/noticias/ValidarNoticiaInfoBox";
export default {
  props: ["t", "acao"],

  components: {
    ValidarNoticiaInfoBox
  },

  data() {
    return {
      idNoticia: this.$route.path.split("/")[3],
      pendenteGuardado: false,
      pendenteGuardadoInfo: "",
      loginErrorSnackbar: false,
      loginErrorMessage: "Precisa de fazer login para criar a Notícia!",
      dialogNoticiaCriada: false,
      numeroErros: 0,
      errosValidacao: false,
      pedidoEliminado: false,
      headers: [
        { text: "Título", value: "titulo", class: "subtitle-1" },
        { text: "Data", value: "data", class: "subtitle-1" },
        { text: "Descrição", value: "desc", class: "subtitle-1" }
      ]
    };
  },

  methods: {
    async validarNoticia() {
      // Título
      if (this.t.titulo == "" || this.t.titulo == null) {
        this.numeroErros++;
      }

      if (this.t.data == "" || this.t.data == null) {
        this.numeroErros++;
      } else if (!/[0-9]+\-[0-9]+\-[0-9]+/.test(this.t.data)) {
        this.numeroErros++;
      } else {
        let date = new Date();

        let ano = parseInt(this.t.data.slice(0, 4));
        let mes = parseInt(this.t.data.slice(5, 7));
        let dia = parseInt(this.t.data.slice(8, 10));

        let dias = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        if (mes > 12) {
          this.numeroErros++;
        } else if (dia > dias[mes - 1]) {
          if (mes == 2) {
            if (!(ano % 4 == 0 && mes == 2 && dia == 29)) {
              this.numeroErros++;
            }
          } else {
            this.numeroErros++;
          }
        } else if (ano > parseInt(date.getFullYear())) {
          this.numeroErros++;
        } else if (
          ano == parseInt(date.getFullYear()) &&
          mes > parseInt(date.getMonth() + 1)
        ) {
          this.numeroErros++;
        } else if (
          ano == parseInt(date.getFullYear()) &&
          mes == parseInt(date.getMonth() + 1) &&
          dia > parseInt(date.getDate())
        ) {
          this.numeroErros++;
        }
      }

      if (this.t.desc == "" || this.t.desc == null) {
        this.numeroErros++;
      }

      return this.numeroErros;
    },

    // Lança o pedido de criação da noticia no worflow
    async criarAlterarNoticia() {
      try {
        if (this.$store.state.name === "") {
          this.loginErrorSnackbar = true;
        } else {
          let erros = 0;

          switch (this.acao) {
            case "Alteração":
              erros = await this.validarNoticia();
              if (erros == 0) {
                let noticiaParams = {
                  titulo: this.t.titulo,
                  desc: this.t.desc,
                  data: this.t.data,
                  ativa: this.t.ativa,
                  token: this.$store.state.token
                };

                let response = await this.$request(
                  "put",
                  "/noticias/" + this.idNoticia,
                  noticiaParams
                );
                this.dialogNoticiaCriada = true;
              } else {
                this.errosValidacao = true;
              }
              break;
            case "Criação":
              erros = await this.validarNoticia();
              if (erros == 0) {
                let noticiaParams = {
                  titulo: this.t.titulo,
                  data: this.t.data,
                  desc: this.t.desc,
                  token: this.$store.state.token
                };

                let response = await this.$request(
                  "post",
                  "/noticias/",
                  noticiaParams
                );
                this.dialogNoticiaCriada = true;
              } else {
                this.errosValidacao = true;
              }
            default:
              break;
          }
        }
      } catch (err) {
        return err;
      }
    },

    criacaoPendenteTerminada: function() {
      this.$router.push("/");
    },

    criacaoNoticiaTerminada: function() {
      this.$router.push("/");
    },

    // Cancela a criação da Notícia
    eliminarNoticia: function() {
      this.pedidoEliminado = true;
    },

    cancelarCriacaoNoticia: function() {
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
