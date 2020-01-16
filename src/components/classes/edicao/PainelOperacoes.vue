<template>
  <div>
    <v-row class="justify-start align-start">
      <v-col>
        <v-btn
          dark
          rounded
          class="ma-2 indigo darken-4"
          @click="guardarTrabalho"
          v-bind:disabled="c.codigo == ''"
        >
          Guardar trabalho
        </v-btn>
      </v-col>

      <valida-classe-info-box :c="c" :original="o"/>

      <v-col>
        <v-btn dark rounded class="ma-2 indigo darken-4" @click="alterarClasse">
          Alterar classe
        </v-btn>
      </v-col>
      <v-col>
        <v-btn dark rounded class="ma-2 red darken-4" @click="cancelarAlteracao">
          Cancelar alteração
        </v-btn>
      </v-col>
    </v-row>

    <!-- Erros de Validação .................................... -->
    <v-row justify-center>
      <v-dialog v-model="errosValidacao" width="60%">
        <v-card>
          <v-card-title class="headline">
            Erros detetados na validação
          </v-card-title>
          <v-card-text>
            <p>
              Há erros de validação. Selecione "Validar" para ver extamente
              quais e proceder à sua correção.
            </p>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="red darken-4"
              round
              dark
              @click="errosValidacao = false"
            >
              Fechar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <!-- Trabalho pendente guardado com sucesso ........... -->
    <v-row justify-center>
      <v-dialog v-model="pendenteGuardado" persistent max-width="60%">
        <v-card>
          <v-card-title class="headline">
            Trabalho pendente guardado
          </v-card-title>
          <v-card-text>
            <p>
              Os seus dados foram guardados para que possa retomar o trabalho
              mais tarde.
            </p>
            <p>{{ pendenteGuardadoInfo }}</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="green darken-1"
              text
              @click="criacaoPendenteTerminada"
            >
              Fechar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <!-- Pedido de alteração de classe submetido com sucesso ........... -->
    <v-row justify-center>
      <v-dialog v-model="dialogClasseCriada" persistent max-width="60%">
        <v-card>
          <v-card-title class="headline">
            Pedido de Criação de Classe Submetido
          </v-card-title>
          <v-card-text>{{ mensagemPedidoCriadoOK }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="criacaoClasseTerminada">
              Fechar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <!-- Cancelamento da criação duma classe: confirmação ........... -->
    <v-row justify-center>
      <v-dialog v-model="pedidoEliminado" persistent max-width="60%">
        <v-card>
          <v-card-title class="headline">
            Cancelamento e eliminação do pedido de criação de classe
          </v-card-title>
          <v-card-text>
            <p>Selecionou o cancelamento da criação da classe.</p>
            <p>Toda a informação introduzida será eliminada.</p>
            <p>
              Confirme a decisão para ser reencaminhado para a página principal.
            </p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="cancelarAlteracao">
              Confirmo
            </v-btn>
            <v-btn color="red darken-1" text @click="pedidoEliminado = false">
              Enganei-me, desejo continuar o trabalho
            </v-btn>
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
import ValidaClasseInfoBox from "@/components/classes/edicao/validaClasseInfoBox.vue";

export default {
  props: ["c", "o", "pendenteId"],
  components: {
    ValidaClasseInfoBox
  },
  data() {
    return {
      pendenteGuardado: false,
      pendenteGuardadoInfo: "",
      dialogClasseCriada: false,
      pedidoEliminado: false,
      pedidoCriado: false,
      mensagemPedidoCriadoOK: "",
      loginErrorSnackbar: false,
      loginErrorMessage: "Precisa de fazer login para criar a Classe!",
      numeroErros: 0,
      errosValidacao: false,

      classeOriginal: {},

      codeFormats: {
        1: /^[0-9]{3}$/,
        2: /^[0-9]{3}\.[0-9]{2}$/,
        3: /^[0-9]{3}\.[0-9]{2}\.[0-9]{3}$/,
        4: /^[0-9]{3}\.[0-9]{2}\.[0-9]{3}\.[0-9]{3}$/
      }
    };
  },

  watch: {
    dialog: function(val) {
      if (!val) this.limpaErros();
    }
  },

  methods: {
    // Permite guardar o trabalho para ser retomado depois
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
            acao: "Alteração",
            tipo: "Classe",
            objeto: this.c,
            criadoPor: userBD.data.email,
            user: { email: userBD.data.email },
            token: this.$store.state.token
          };
          var response = this.$request(
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

    criacaoPendenteTerminada: function() {
      this.$router.push("/");
    },

    // Valida a classe antes de a criar

    validaClasse: async function() {
      var i = 0,
        numeroErros = 0;

      // Descrição
      if (this.c.descricao == "") {
        numeroErros++;
      }

      // Notas de Aplicação
      if (this.notaDuplicada(this.c.notasAp)) {
        numeroErros++;
      }

      // Exemplos de notas de Aplicação
      if (this.exemploDuplicado(this.c.exemplosNotasAp)) {
        numeroErros++;
      }

      // Notas de Exclusão
      if (this.notaDuplicada(this.c.notasEx)) {
        numeroErros++;
      }

      // Termos de Índice
      if (this.tiDuplicado(this.c.termosInd)) {
        numeroErros++;
      }

      // Decisões
      // Sem subdivisão
      if (this.c.nivel == 3 && !this.c.temSubclasses4Nivel) {
        // PCA: prazo
        if (
          this.c.pca.valor < 0 ||
          this.c.pca.valor > 200 ||
          (!this.c.pca.valor && this.c.pca.notas == "")
        ) {
          numeroErros++;
        }
        // PCA: forma e subforma de contagem
        if (this.c.pca.formaContagem == "") {
          numeroErros++;
        } else if (
          this.c.pca.formaContagem == "vc_pcaFormaContagem_disposicaoLegal" &&
          this.c.pca.subFormaContagem == ""
        ) {
          numeroErros++;
        }
      }
      // Com subdivisão
      else if (this.c.nivel == 3 && this.c.temSubclasses4Nivel) {
        var subclasse = {};
        // PCA: prazo
        for (i = 0; i < this.c.subclasses.length; i++) {
          subclasse = this.c.subclasses[i];
          if (
            subclasse.pca.valor < 0 ||
            subclasse.pca.valor > 200 ||
            (!subclasse.pca.valor && subclasse.pca.notas == "")
          ) {
            numeroErros++;
          }
          // PCA: forma e subforma de contagem
          if (subclasse.pca.formaContagem == "") {
            numeroErros++;
          } else if (
            subclasse.pca.formaContagem ==
              "vc_pcaFormaContagem_disposicaoLegal" &&
            subclasse.pca.subFormaContagem == ""
          ) {
            numeroErros++;
          }
        }
      }
      return numeroErros;
    },

    // Valida a informação introduzida e verifica se a classe pode ser criada

    validarClasse2: async function() {
      var i = 0;
      this.numeroErros = 0;

      // Título
      if (this.c.titulo == "") {
        this.numeroErros++;
      } else if(this.c.titulo != this.o.titulo){
        try {
          var existeTitulo = await this.$request(
            "post",
            "/api/classes/verificarTitulo",
            { titulo: this.c.titulo }
          );
          if (existeTitulo.data) {
            this.numeroErros++;
          }
        } catch (e) {
          this.numeroErros++;
        }
      }

      // Descrição
      if (this.c.descricao == "") {
        this.numeroErros++;
      }

      // Notas de Aplicação
      if (this.notaDuplicada(this.c.notasAp)) {
        this.numeroErros++;
      }

      // Exemplos de notas de Aplicação
      if (this.exemploDuplicado(this.c.exemplosNotasAp)) {
        this.numeroErros++;
      }

      // Notas de Exclusão
      if (this.notaDuplicada(this.c.notasEx)) {
        this.numeroErros++;
      }

      // Termos de Índice
      if (this.tiDuplicado(this.c.termosInd)) {
        this.numeroErros++;
      }

      // Decisões
      // Sem subdivisão
      if (this.c.nivel == 3 && !this.c.temSubclasses4Nivel) {
        // PCA: prazo
        if (!this.c.pca.valor && this.c.pca.notas == "") {
          this.numeroErros++;
        } else if (this.c.pca.valor < 0 || this.c.pca.valor > 200) {
          this.numeroErros++;
        }
        // PCA: forma e subforma de contagem
        if (this.c.pca.formaContagem == "") {
          this.numeroErros++;
        } else if (
          this.c.pca.formaContagem == "vc_pcaFormaContagem_disposicaoLegal" &&
          this.c.pca.subFormaContagem == ""
        ) {
          this.numeroErros++;
        }
        // DF
        if (
          (!this.c.df.valor || this.c.df.valor == "NE") &&
          this.c.df.notas == ""
        ) {
          this.numeroErros++;
        }
      }
      // Com subdivisão
      else if (this.c.nivel == 3 && this.c.temSubclasses4Nivel) {
        var subclasse = {};
        // PCA: prazo
        for (i = 0; i < this.c.subclasses.length; i++) {
          subclasse = this.c.subclasses[i];
          if (!subclasse.pca.valor && subclasse.pca.notas == "") {
            this.numeroErros++;
          } else if (subclasse.pca.valor < 0 || subclasse.pca.valor > 200) {
            this.numeroErros++;
          }
          // PCA: forma e subforma de contagem
          if (subclasse.pca.formaContagem == "") {
            this.numeroErros++;
          } else if (
            subclasse.pca.formaContagem ==
              "vc_pcaFormaContagem_disposicaoLegal" &&
            subclasse.pca.subFormaContagem == ""
          ) {
            this.numeroErros++;
          }
          // DF
          if (
            (!subclasse.df.valor || subclasse.df.valor == "NE") &&
            subclasse.df.notas == ""
          ) {
            this.numeroErros++;
          }
        }
      }
      return this.numeroErros;
    },

    // Lança o pedido de alteração da classe no worflow

    alterarClasse: async function() {
      try {
        if (this.$store.state.name === "") {
          this.loginErrorSnackbar = true;
        } else {
          var erros = await this.validarClasse2();
          if (erros == 0) {
            var userBD = await this.$request(
              "get",
              "/api/users/" + this.$store.state.token + "/token"
            );
            var pedidoParams = {
              tipoPedido: "Alteração",
              tipoObjeto: "Classe",
              novoObjeto: this.c,
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
            this.dialogClasseCriada = true;
          } else {
            this.errosValidacao = true;
          }
        }
      } catch (error) {
        return error;
      }
    },

    criacaoClasseTerminada: function() {
      this.$router.push("/");
    },

    // Cancela a criação da classe
    eliminarClasse: function() {
      this.pedidoEliminado = true;
    },

    cancelarAlteracao: function() {
      this.$router.push("/");
    }
  }
};
</script>
<style>
.info-label {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
}

.is-collapsed li:nth-child(n + 5) {
  display: none;
}
</style>
