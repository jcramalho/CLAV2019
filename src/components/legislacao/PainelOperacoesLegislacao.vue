<template>
  <div>
    <v-row class="ma-2 text-center">
      <v-col cols="3">
        <v-btn
          rounded
          class="green darken-3 white--text"
          :disabled="!l.numero"
          @click="guardarTrabalho"
        >Guardar Trabalho</v-btn>
      </v-col>

      <ValidarLegislacaoInfoBox :l="l" />

      <v-col>
        <v-btn rounded class="green darken-4 white--text" @click="criarLegislacao">Criar Diploma</v-btn>
      </v-col>

      <v-col>
        <v-btn rounded class="red darken-4 white--text" @click="eliminarLegislacao">Cancelar Criação</v-btn>
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

      <!-- Pedido de criação de legislacao submetido com sucesso -->
      <v-dialog v-model="dialogLegislacaoCriada" width="40%">
        <v-card>
          <v-card-title>Pedido de Criação de Diploma Submetido</v-card-title>
          <v-card-text>{{ mensagemPedidoCriadoOK }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" dark @click="criacaoLegislacaoTerminada">Fechar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Cancelamento da criação de uma legislacao: confirmação -->
      <v-dialog v-model="pedidoEliminado" width="50%">
        <v-card>
          <v-card-title>Cancelamento e eliminação do pedido de criação do diploma</v-card-title>
          <v-card-text>
            <p>Selecionou o cancelamento da criação do diploma.</p>
            <p>Toda a informação introduzida será eliminada.</p>
            <p>Confirme a decisão para ser reencaminhado para a página principal.</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="green darken-1" text @click="cancelarCriacaoLegislacao">Confirmo</v-btn>
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
import ValidarLegislacaoInfoBox from "@/components/legislacao/ValidarLegislacaoInfoBox";

export default {
  props: ["l"],
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
          let userBD = await this.$request(
            "get",
            "/api/users/listarToken/" + this.$store.state.token
          );
          let pendenteParams = {
            numInterv: 1,
            acao: "Criação",
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

    validarLegislacao: async function() {
      let i = 0;
      let parseAno = this.l.numero.split("/");
      let anoDiploma = parseInt(parseAno[1]);

      //Tipo
      if (this.l.tipo == "") {
        this.numeroErros++;
      }

      // Número Diploma
      if (this.l.numero == "") {
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
      if (this.l.data == "") {
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
      if (this.l.sumario == "") {
        this.numeroErros++;
      }

      return this.numeroErros;
    },

    // Lança o pedido de criação da legislacao no worflow
    criarLegislacao: async function() {
      try {
        if (this.$store.state.name === "") {
          this.loginErrorSnackbar = true;
        } else {
          let erros = await this.validarLegislacao();
          if (erros == 0) {
            let userBD = await this.$request(
              "get",
              "/api/users/listarToken/" + this.$store.state.token
            );

            let randID = await this.$request("get", "/api/utils/id");

            let dataObj = this.l;
            dataObj.codigo = "leg_" + randID.data;

            let pedidoParams = {
              tipoPedido: "Criação",
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
            this.mensagemPedidoCriadoOK += JSON.stringify(response.data);
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
