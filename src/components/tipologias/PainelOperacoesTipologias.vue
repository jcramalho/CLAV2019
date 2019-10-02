<template>
  <div>
    <v-row class="ma-2 text-center">
      <v-col cols="3">
        <v-btn
          rounded
          class="green darken-3 white--text"
          :disabled="!t.sigla"
          @click="guardarTrabalho"
        >Guardar Trabalho</v-btn>
      </v-col>

      <ValidarTipologiaInfoBox :t="t" />

      <v-col>
        <v-btn rounded class="green darken-4 white--text" @click="criarTipologia">Criar Tipologia</v-btn>
      </v-col>

      <v-col>
        <v-btn dark rounded class="red darken-4" @click="eliminarTipologia">Cancelar Criação</v-btn>
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
            <v-btn color="green darken-1" dark @click="criacaoPendenteTerminada">Fechar</v-btn>
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
            <v-btn color="red darken-4" dark @click="errosValidacao = false">Fechar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Pedido de criação de tipologia submetido com sucesso -->
      <v-dialog v-model="dialogTipologiaCriada" width="40%">
        <v-card>
          <v-card-title>Pedido de Criação de Tipologia Submetido</v-card-title>
          <v-card-text>{{ mensagemPedidoCriadoOK }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" dark @click="criacaoTipologiaTerminada">Fechar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Cancelamento da criação de uma tipologia: confirmação -->
      <v-dialog v-model="pedidoEliminado" width="50%">
        <v-card>
          <v-card-title>Cancelamento e eliminação do pedido de criação da tipologia</v-card-title>
          <v-card-text>
            <p>Selecionou o cancelamento da criação da tipologia.</p>
            <p>Toda a informação introduzida será eliminada.</p>
            <p>Confirme a decisão para ser reencaminhado para a página principal.</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="green darken-1" text @click="cancelarCriacaoTipologia">Confirmo</v-btn>
            <v-btn
              color="red darken-1"
              dark
              @click="pedidoEliminado = false"
            >Enganei-me, desejo continuar o trabalho</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-row>
      <v-snackbar v-model="loginErrorSnackbar" :timeout="8000" color="error" :top="true">
        {{ loginErrorMessage }}
        <v-btn text @click="loginErrorSnackbar = false">Fechar</v-btn>
      </v-snackbar>
    </v-row>
  </div>
</template>

<script>
import ValidarTipologiaInfoBox from "@/components/tipologias/ValidarTipologiaInfoBox";

export default {
  props: ["t"],
  components: {
    ValidarTipologiaInfoBox
  },
  data() {
    return {
      pendenteGuardado: false,
      pendenteGuardadoInfo: "",
      loginErrorSnackbar: false,
      loginErrorMessage: "Precisa de fazer login para criar a Tipologia!",
      dialogTipologiaCriada: false,
      numeroErros: 0,
      errosValidacao: false,
      mensagemPedidoCriadoOK: "",
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
            "/api/users/listarToken/" + this.$store.state.token
          );
          var pendenteParams = {
            numInterv: 1,
            acao: "Criação",
            tipo: "Tipologia",
            objeto: this.t,
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
          this.pendenteGuardadoInfo = JSON.stringify(response.data);
        }
      } catch (error) {
        return error;
      }
    },

    validarTipologia: async function() {
      let i = 0;

      // Designação
      if (this.t.designacao == "") {
        this.numeroErros++;
      } else {
        try {
          let existeDesignacao = await this.$request(
            "post",
            "/api/tipologias/verificarDesignacao",
            { designacao: this.t.designacao }
          );
          if (existeDesignacao.data) {
            this.numeroErros++;
          }
        } catch (err) {
          this.numeroErros++;
        }
      }

      // Sigla
      if (this.t.sigla == "") {
        this.numeroErros++;
      } else {
        try {
          let existeSigla = await this.$request(
            "post",
            "/api/tipologias/verificarSigla",
            { sigla: this.t.sigla }
          );
          if (existeSigla.data) {
            this.numeroErros++;
          }
        } catch (err) {
          this.numeroErros++;
        }
      }

      return this.numeroErros;
    },

    // Lança o pedido de criação da tipologia no worflow
    criarTipologia: async function() {
      try {
        if (this.$store.state.name === "") {
          this.loginErrorSnackbar = true;
        } else {
          let erros = await this.validarTipologia();
          if (erros == 0) {
            let userBD = await this.$request(
              "get",
              "/api/users/listarToken/" + this.$store.state.token
            );

            let dataObj = this.t;
            dataObj.codigo = "tip_" + this.t.sigla;

            let pedidoParams = {
              tipoPedido: "Criação",
              tipoObjeto: "Tipologia",
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
            this.dialogTipologiaCriada = true;
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

    criacaoTipologiaTerminada: function() {
      this.$router.push("/");
    },

    // Cancela a criação da Tipologia
    eliminarTipologia: function() {
      this.pedidoEliminado = true;
    },

    cancelarCriacaoTipologia: function() {
      this.$router.push("/");
    }
  }
};
</script>

<style scoped>
.info-label {
  color: #2e7d32; /* green darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8f5e9; /* green lighten-5 */
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}
</style>
