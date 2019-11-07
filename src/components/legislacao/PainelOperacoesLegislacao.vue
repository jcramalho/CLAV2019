<template>
  <div>
    <v-row class="ma-2 text-center">
      <v-col cols="3">
        <v-btn
          rounded
          class="indigo darken-3 white--text"
          :disabled="!l.numero"
          @click="guardarTrabalho"
          >Guardar Trabalho</v-btn
        >
      </v-col>

      <ValidarLegislacaoInfoBox :l="l" :acao="acao" />

      <v-col>
        <v-btn
          v-if="this.acao == 'Criação'"
          rounded
          class="indigo accent-4 white--text"
          @click="criarAlterarLegislacao"
          >Criar Diploma</v-btn
        >
        <v-btn
          v-else-if="this.acao == 'Alteração'"
          rounded
          class="indigo accent-4 white--text"
          @click="criarAlterarLegislacao"
          >Alterar Diploma</v-btn
        >
      </v-col>

      <v-col>
        <v-btn
          v-if="this.acao == 'Criação'"
          rounded
          class="red darken-4 white--text"
          @click="eliminarLegislacao"
          >Cancelar Criação</v-btn
        >
        <v-btn
          v-else-if="this.acao == 'Alteração'"
          rounded
          class="red darken-4 white--text"
          @click="eliminarLegislacao"
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

      <!-- Pedido de criação de legislacao submetido com sucesso -->
      <v-dialog v-model="dialogLegislacaoCriada" width="70%">
        <v-card>
          <v-card-title>Pedido de {{ acao }} de Diploma Submetido</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="2">
                <div class="info-label">Tipo de diploma:</div>
              </v-col>

              <v-col>
                <div class="info-content">{{ l.tipo }}</div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="2">
                <div class="info-label">Fonte do diploma:</div>
              </v-col>

              <v-col>
                <div class="info-content">{{ l.diplomaFonte }}</div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="2">
                <div class="info-label">Número de diploma:</div>
              </v-col>

              <v-col>
                <div class="info-content">{{ l.numero }}</div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="2">
                <div class="info-label">Data:</div>
              </v-col>

              <v-col>
                <div class="info-content">{{ l.data }}</div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="2">
                <div class="info-label">Sumário:</div>
              </v-col>

              <v-col>
                <div class="info-content">{{ l.sumario }}</div>
              </v-col>
            </v-row>

            <v-row v-if="l.link != '' && l.link != null">
              <v-col cols="2">
                <div class="info-label">Link:</div>
              </v-col>

              <v-col>
                <div class="info-content">{{ l.link }}</div>
              </v-col>
            </v-row>

            <v-row v-if="l.entidadesSel.length > 0">
              <v-col cols="2">
                <div class="info-label">Entidades:</div>
              </v-col>

              <v-col>
                <v-data-table
                  :headers="headersEntidades"
                  :items="l.entidadesSel"
                  class="elevation-1"
                  hide-default-footer
                ></v-data-table>
              </v-col>
            </v-row>

            <v-row v-if="l.processosSel.length > 0">
              <v-col cols="2">
                <div class="info-label">Processos:</div>
              </v-col>

              <v-col>
                <v-data-table
                  :headers="headersProcessos"
                  :items="l.processosSel"
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
              @click="criacaoLegislacaoTerminada"
              >Fechar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Cancelamento da criação de uma legislacao: confirmação -->
      <v-dialog v-model="pedidoEliminado" width="50%">
        <v-card>
          <v-card-title
            >Cancelamento e eliminação do pedido de criação do
            diploma</v-card-title
          >
          <v-card-text>
            <p>Selecionou o cancelamento da criação do diploma.</p>
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
              @click="cancelarCriacaoLegislacao"
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
import ValidarLegislacaoInfoBox from "@/components/legislacao/ValidarLegislacaoInfoBox";

export default {
  props: ["l", "acao"],

  components: {
    ValidarLegislacaoInfoBox
  },

  data() {
    return {
      pendenteGuardado: false,
      pendenteGuardadoInfo: "",
      loginErrorSnackbar: false,
      loginErrorMessage: "Precisa de fazer login para criar o Diploma!",
      dialogLegislacaoCriada: false,
      numeroErros: 0,
      errosValidacao: false,
      pedidoEliminado: false,
      headersEntidades: [
        { text: "Sigla", value: "sigla", class: "subtitle-1" },
        { text: "Designação", value: "designacao", class: "subtitle-1" }
      ],
      headersProcessos: [
        { text: "Código", value: "codigo", class: "subtitle-1" },
        { text: "Título", value: "titulo", class: "subtitle-1" }
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
            tipo: "Legislação",
            objeto: this.l,
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

    async validarLegislacaoCriacao() {
      let parseAno = this.l.numero.split("/");
      let anoDiploma = parseInt(parseAno[1]);

      // Tipo
      if (this.l.tipo == "" || this.l.tipo == null) {
        this.numeroErros++;
      }

      // Fonte diploma
      if (this.l.diplomaFonte == "" || this.l.diplomaFonte == null) {
        this.numeroErros++;
      }

      // Número Diploma
      if (this.l.numero == "" || this.l.numero == null) {
        this.numeroErros++;
      } else {
        try {
          let existeNumero = await this.$request(
            "post",
            "/api/legislacao/verificarNumero",
            { numero: this.l.numero }
          );

          if (existeNumero.data) {
            this.numeroErros++;
          } else if (!/[0-9]+(-\w)?\/[0-9]+$/.test(this.l.numero)) {
            this.numeroErros++;
          } else if (anoDiploma < 2000) {
            if (!/[0-9]+(-\w)?\/[0-9]\d{1}$/.test(this.l.numero)) {
              this.numeroErros++;
            }
          }
        } catch (err) {
          this.numeroErros++;
        }
      }

      // Data
      if (this.l.data == "" || this.l.data == null) {
        this.numeroErros++;
      } else if (!/[0-9]+\/[0-9]+\/[0-9]+/.test(this.l.data)) {
        this.numeroErros++;
      } else {
        let date = new Date();

        let ano = parseInt(this.l.data.slice(0, 4));
        let mes = parseInt(this.l.data.slice(5, 7));
        let dia = parseInt(this.l.data.slice(8, 10));

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

      // Sumário
      if (this.l.sumario == "" || this.l.sumario == null) {
        this.numeroErros++;
      }

      return this.numeroErros;
    },

    validarLegislacaoAlteracao() {
      let parseAno = this.l.numero.split("/");
      let anoDiploma = parseInt(parseAno[1]);

      // Tipo
      if (this.l.tipo == "" || this.l.tipo == null) {
        this.numeroErros++;
      }

      // Fonte diploma
      if (this.l.diplomaFonte == "" || this.l.diplomaFonte == null) {
        this.numeroErros++;
      }

      // Número Diploma
      if (this.l.numero == "" || this.l.numero == null) {
        this.numeroErros++;
      } else if (!/[0-9]+(-\w)?\/[0-9]+$/.test(this.l.numero)) {
        this.numeroErros++;
      } else if (anoDiploma < 2000) {
        if (!/[0-9]+(-\w)?\/[0-9]\d{1}$/.test(this.l.numero)) {
          this.numeroErros++;
        }
      }

      // Data
      if (this.l.data == "" || this.l.data == null) {
        this.numeroErros++;
      } else if (!/[0-9]+\/[0-9]+\/[0-9]+/.test(this.l.data)) {
        this.numeroErros++;
      } else {
        let date = new Date();

        let ano = parseInt(this.l.data.slice(0, 4));
        let mes = parseInt(this.l.data.slice(5, 7));
        let dia = parseInt(this.l.data.slice(8, 10));

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

      // Sumário
      if (this.l.sumario == "" || this.l.sumario == null) {
        this.numeroErros++;
      }

      return this.numeroErros;
    },

    // Lança o pedido de criação da legislacao no worflow
    async criarAlterarLegislacao() {
      try {
        if (this.$store.state.name === "") {
          this.loginErrorSnackbar = true;
        } else {
          let erros = 0;

          switch (this.acao) {
            case "Criação":
              erros = await this.validarLegislacaoCriacao();
              break;

            case "Alteração":
              erros = this.validarLegislacaoAlteracao();
              break;

            default:
              break;
          }

          if (erros == 0) {
            let userBD = await this.$request(
              "get",
              "/api/users/listarToken/" + this.$store.state.token
            );

            let randID = await this.$request("get", "/api/utils/id");

            let dataObj = this.l;
            dataObj.codigo = "leg_" + randID.data;

            let pedidoParams = {
              tipoPedido: this.acao,
              tipoObjeto: "Legislação",
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

    criacaoLegislacaoTerminada: function() {
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
