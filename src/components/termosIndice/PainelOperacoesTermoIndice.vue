<template>
  <div>
    <v-row class="ma-2 text-center">
      <v-col cols="3">
        <v-btn
          rounded
          class="indigo darken-4 white--text"
          :disabled="!ti.termo"
          @click="guardarTrabalho"
          >Guardar Trabalho</v-btn
        >
      </v-col>

      <ValidarTIInfoBox :ti="ti" />

      <v-col>
        <v-btn rounded class="indigo accent-4 white--text" @click="criarTI"
          >Criar Termo de Índice</v-btn
        >
      </v-col>

      <v-col>
        <v-btn dark rounded class="red darken-4" @click="eliminarTI"
          >Cancelar Criação</v-btn
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
              Há erros de validação. Selecione
              <b>Validar</b> para ver extamente quais e proceder à sua correção.
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

      <!-- Pedido de criação de termo de índice submetido com sucesso -->
      <v-dialog v-model="dialogTICriado" width="70%">
        <v-card>
          <v-card-title
            >Pedido de Criação de Termo de Índice Submetido</v-card-title
          >
          <v-card-text>
            <v-row>
              <v-col cols="2">
                <div class="info-label">Designação:</div>
              </v-col>

              <v-col>
                <div class="info-content">{{ ti.termo }}</div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="2">
                <div class="info-label">Processo Associado:</div>
              </v-col>

              <v-col>
                <div class="info-content">{{ ti.idClasse }}</div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="indigo darken-1" dark @click="criacaoTITerminada"
              >Fechar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Cancelamento da criação de uma termo de índice: confirmação -->
      <v-dialog v-model="pedidoEliminado" width="55%">
        <v-card>
          <v-card-title
            >Cancelamento e eliminação do pedido de criação do termo de
            índice</v-card-title
          >
          <v-card-text>
            <p>Selecionou o cancelamento da criação do termo de índice.</p>
            <p>Toda a informação introduzida será eliminada.</p>
            <p>
              Confirme a decisão para ser reencaminhado para a página principal.
            </p>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="indigo darken-1" text @click="cancelarCriacaoTI"
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
import nanoid from "nanoid";
import ValidarTIInfoBox from "@/components/termosIndice/ValidarTermoIndiceInfoBox";

export default {
  props: ["ti"],
  components: {
    ValidarTIInfoBox
  },
  data() {
    return {
      pendenteGuardado: false,
      pendenteGuardadoInfo: "",
      loginErrorSnackbar: false,
      loginErrorMessage: "Precisa de fazer login para criar o Termo de Índice!",
      dialogTICriado: false,
      numeroErros: 0,
      errosValidacao: false,
      pedidoEliminado: false
    };
  },

  methods: {
    guardarTrabalho: async function() {
      try {
        if (this.$store.state.name === "") {
          this.loginErrorSnackbar = true;
        } else {
          var userBD = await this.$request(
            "get",
            "/api/users/" + this.$store.state.token + "/token"
          );
          var pendenteParams = {
            numInterv: 1,
            acao: "Criação",
            tipo: "Termo de Indice",
            objeto: this.ti,
            criadoPor: userBD.data.email,
            user: { email: userBD.data.email },
            token: this.$store.state.token
          };
          var response = await this.$request(
            "post",
            "/api/pendentes",
            pendenteParams
          );
          this.pendenteGuardado = true;
        }
      } catch (error) {
        return error;
      }
    },

    validarTI: async function() {
      // Termo
      if (this.ti.termo == "" || this.ti.termo == null) {
        this.numeroErros++;
      } else {
        try {
          let existeTI = await this.$request(
            "get",
            "/api/termosIndice?existe=" + encodeURIComponent(this.ti.termo)
          );
          if (existeTI.data) {
            this.numeroErros++;
          }
        } catch (err) {
          this.numeroErros++;
        }
      }

      if (this.ti.idClasse == "" || this.ti.idClasse == null) {
        this.numeroErros++;
      }

      return this.numeroErros;
    },

    // Lança o pedido de criação da termo de índice no worflow
    criarTI: async function() {
      try {
        if (this.$store.state.name === "") {
          this.loginErrorSnackbar = true;
        } else {
          let erros = await this.validarTI();
          if (erros == 0) {
            let userBD = await this.$request(
              "get",
              "/api/users/" + this.$store.state.token + "/token"
            );

            let dataObj = this.ti;
            dataObj.codigo = "ti_" + nanoid();

            let pedidoParams = {
              tipoPedido: "Criação",
              tipoObjeto: "Termo de Indice",
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
            this.mensagemPedidoCriadoOK += JSON.stringify(response.data);
            this.dialogTICriado = true;
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

    criacaoTITerminada: function() {
      this.$router.push("/");
    },

    // Cancela a criação da Termo de Índice
    eliminarTI: function() {
      this.pedidoEliminado = true;
    },

    cancelarCriacaoTI: function() {
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
