<template>
  <div>
    <v-row class="ma-2 text-center">
      <ValidarCreditoInfoBox :t="t" :acao="this.acao" />

      <v-col>
        <v-btn
          v-if="this.acao == 'Criação'"
          rounded
          class="indigo accent-4 white--text"
          @click="criarAlterarCredito"
          >Criar Colaboração</v-btn
        >
        <v-btn
          v-else-if="this.acao == 'Alteração'"
          rounded
          class="indigo accent-4 white--text"
          @click="criarAlterarCredito"
          >Alterar Colaboração</v-btn
        >
      </v-col>

      <v-col>
        <v-btn
          v-if="this.acao == 'Criação'"
          dark
          rounded
          class="red darken-4"
          @click="eliminarCredito"
          >Cancelar Criação</v-btn
        >
        <v-btn
          v-else-if="this.acao == 'Alteração'"
          dark
          rounded
          class="red darken-4"
          @click="eliminarCredito"
          >Cancelar Alteração</v-btn
        >
      </v-col>

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

      <!-- Criação/Alteração de credito submetido com sucesso -->
      <v-dialog v-model="dialogCreditoCriado" width="70%">
        <v-card>
          <v-card-title>{{ acao }} de Colaboração Submetida</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="2">
                <div class="info-label">Nome</div>
              </v-col>

              <v-col>
                <div class="info-content">{{ t.nome }}</div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="2">
                <div class="info-label">Filiação</div>
              </v-col>

              <v-col>
                <div class="info-content">{{ t.filiacao }}</div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="2">
                <div class="info-label">Função</div>
              </v-col>

              <v-col>
                <div class="info-content">{{ t.funcao }}</div>
              </v-col>
            </v-row>

            <v-row v-if="t.desc !== undefined && t.desc !== null && t.desc !== ''">
              <v-col cols="2">
                <div class="info-label">Descrição</div>
              </v-col>

              <v-col>
                <div class="info-content">{{ t.desc }}</div>
              </v-col>
            </v-row>

            <v-row v-if="t.data_inicio !== undefined && t.data_inicio !== null && t.data_inicio !== ''">
              <v-col cols="2">
                <div class="info-label">Início</div>
              </v-col>

              <v-col>
                <div class="info-content">{{ t.data_inicio }}</div>
              </v-col>
            </v-row>

            <v-row v-if="t.data_fim !== undefined && t.data_fim !== null && t.data_fim !== ''">
              <v-col cols="2">
                <div class="info-label">Fim</div>
              </v-col>

              <v-col>
                <div class="info-content">{{ t.data_fim }}</div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="indigo darken-1" dark @click="criacaoCreditoTerminado"
              >Fechar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Cancelamento da criação de um credito: confirmação -->
      <v-dialog v-model="pedidoEliminado" width="50%">
        <v-card>
          <v-card-title
            >Cancelamento e eliminação do pedido de {{ acao }} da colaboração</v-card-title
          >
          <v-card-text>
            <p>Selecionou o cancelamento da {{ acao }} do crédito.</p>
            <p>Toda a informação introduzida será eliminada.</p>
            <p>
              Confirme a decisão para ser reencaminhado para a página principal.
            </p>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="indigo darken-1" text @click="cancelarCriacaoCredito"
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
import ValidarCreditoInfoBox from "@/components/colaboracoes/ValidarColaboracaoInfoBox";
export default {
  props: ["t", "acao"],

  components: {
    ValidarCreditoInfoBox
  },

  data() {
    return {
      idCredito: this.$route.path.split("/")[3],
      loginErrorSnackbar: false,
      loginErrorMessage: "Precisa de fazer login para criar a colaboração!",
      dialogCreditoCriado: false,
      numeroErros: 0,
      errosValidacao: false,
      pedidoEliminado: false,
      headers: [
        { text: "Nome", value: "nome", class: "subtitle-1" },
        { text: "Filiação", value: "filiacao", class: "subtitle-1" },
        { text: "Função", value: "funcao", class: "subtitle-1" },
        { text: "Descrição", value: "desc", class: "subtitle-1" },
        { text: "Início", value: "desc", class: "subtitle-1" },
        { text: "Fim", value: "desc", class: "subtitle-1" }
      ]
    };
  },

  methods: {
    async validarCredito() {
      this.numeroErros = 0;
      // Nome
      if (this.t.nome == "" || this.t.nome == null) {
        this.numeroErros++;
      }
      // Filiação
      if (this.t.filiacao == "" || this.t.filiacao == null) {
        this.numeroErros++;
      }
      // Função
      if (this.t.funcao == "" || this.t.funcao == null) {
        this.numeroErros++;
      }
      return this.numeroErros;
    },

    // Lança o pedido de criação do credito no worflow
    async criarAlterarCredito() {
      try {
        if (this.$store.state.name === "") {
          this.loginErrorSnackbar = true;
        } else {
          let erros = 0;

          switch (this.acao) {
            case "Alteração":
              erros = await this.validarCredito();
              if (erros == 0) {
                let creditoParams = {
                  nome: this.t.nome,
                  filiacao: this.t.filiacao,
                  funcao: this.t.funcao,
                  token: this.$store.state.token
                };

                // Devido à validação na API, opcionais só devem ser enviados se não forem nulos 
                if (this.t.desc !== null && this.t.desc !== ""){
                  creditoParams.desc = this.t.desc;
                }

                if (this.t.data_inicio !== null && this.t.data_inicio !== ""){
                  creditoParams.data_inicio = this.t.data_inicio;
                }

                if (this.t.data_fim !== null && this.t.data_fim !== ""){
                  creditoParams.data_fim = this.t.data_fim;
                }
                
                let response = await this.$request(
                  "put",
                  "/colaboracoes/" + this.idCredito,
                  creditoParams
                );
                this.dialogCreditoCriado = true;
              } else {
                this.errosValidacao = true;
              }
              break;
            case "Criação":
              erros = await this.validarCredito();
              if (erros == 0) {
                let creditoParams = {
                  nome: this.t.nome,
                  filiacao: this.t.filiacao,
                  funcao: this.t.funcao,
                  token: this.$store.state.token
                };

                // Devido à validação na API, opcionais só devem ser enviados se não forem nulos 
                if (this.t.desc !== null && this.t.desc !== ""){
                  creditoParams.desc = this.t.desc;
                }

                if (this.t.data_inicio !== null && this.t.data_inicio !== ""){
                  creditoParams.data_inicio = this.t.data_inicio;
                }

                if (this.t.data_fim !== null && this.t.data_fim !== ""){
                  creditoParams.data_fim = this.t.data_fim;
                }
                let response = await this.$request(
                  "post",
                  "/colaboracoes/",
                  creditoParams
                );
                this.dialogCreditoCriado = true;
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

    criacaoCreditoTerminado: function() {
      this.$router.push("/");
    },

    // Cancela a criação do credito
    eliminarCredito: function() {
      this.pedidoEliminado = true;
    },

    cancelarCriacaoCredito: function() {
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
