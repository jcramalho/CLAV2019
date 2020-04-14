<template>
  <div>
    <v-row class="ma-2 text-center">
      <ValidarLegislacaoInfoBox :l="l" :original="original" :acao="acao" />

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
            <v-row v-if="l.tipo">
              <v-col cols="2">
                <div class="info-label">Tipo de diploma:</div>
              </v-col>

              <v-col>
                <div class="info-content">{{ l.tipo }}</div>
              </v-col>
            </v-row>

            <v-row v-if="l.diplomaFonte">
              <v-col cols="2">
                <div class="info-label">Fonte do diploma:</div>
              </v-col>

              <v-col>
                <div class="info-content">{{ l.diplomaFonte }}</div>
              </v-col>
            </v-row>

            <v-row v-if="l.numero">
              <v-col cols="2">
                <div class="info-label">Número de diploma:</div>
              </v-col>

              <v-col>
                <div class="info-content">{{ l.numero }}</div>
              </v-col>
            </v-row>

            <v-row v-if="l.data">
              <v-col cols="2">
                <div class="info-label">Data:</div>
              </v-col>

              <v-col>
                <div class="info-content">{{ l.data }}</div>
              </v-col>
            </v-row>

            <v-row v-if="l.Sumário">
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

            <v-row v-if="l.dataRevogacao">
              <v-col cols="2">
                <div class="info-label">Data de Revogação:</div>
              </v-col>

              <v-col>
                <div class="info-content">{{ l.dataRevogacao }}</div>
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
          <v-card-title>Cancelamento do pedido.</v-card-title>
          <v-card-text>
            <p>Selecionou o cancelamento do pedido.</p>
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
  props: ["l", "acao", "original"],

  components: {
    ValidarLegislacaoInfoBox,
  },

  data() {
    return {
      pendenteGuardado: false,
      pendenteGuardadoInfo: "",
      loginErrorSnackbar: false,
      loginErrorMessage: "Precisa de fazer login para criar o Diploma!",
      dialogLegislacaoCriada: false,
      errosValidacao: false,
      pedidoEliminado: false,
      headersEntidades: [
        { text: "Sigla", value: "sigla", class: "subtitle-1" },
        { text: "Designação", value: "designacao", class: "subtitle-1" },
      ],
      headersProcessos: [
        { text: "Código", value: "codigo", class: "subtitle-1" },
        { text: "Título", value: "titulo", class: "subtitle-1" },
      ],
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

      return numeroErros;
    },

    validarLegislacaoAlteracao(dados) {
      let numeroErros = 0;

      // Sumário
      if (dados.sumario === "" || dados.sumario === null) {
        numeroErros++;
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

          switch (this.acao) {
            case "Criação":
              erros = await this.validarLegislacaoCriacao();
              break;

            case "Alteração":
              for (const key in dataObj) {
                if (
                  typeof dataObj[key] === "string" &&
                  dataObj[key] === this.original[key]
                ) {
                  if (key !== "id") delete dataObj[key];
                }
              }

              erros = this.validarLegislacaoAlteracao(dataObj);
              break;

            default:
              break;
          }

          if (erros == 0) {
            let userBD = await this.$request(
              "get",
              "/users/" + this.$store.state.token + "/token"
            );

            let pedidoParams = {
              tipoPedido: this.acao,
              tipoObjeto: "Legislação",
              novoObjeto: dataObj,
              user: { email: userBD.data.email },
              entidade: userBD.data.entidade,
              token: this.$store.state.token,
            };

            if (this.original !== undefined)
              pedidoParams.objetoOriginal = this.original;

            await this.$request("post", "/pedidos", pedidoParams);

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
    },
  },
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
